import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPdf(elementId, filename = '발주서.pdf') {
  const el = document.getElementById(elementId)
  if (!el) return

  const canvas = await html2canvas(el, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      clonedDoc.querySelectorAll('.no-pdf').forEach(el => el.remove())
      const tds = clonedDoc.querySelectorAll('#preview-document td')
      tds.forEach(td => {
        const h = td.offsetHeight || parseInt(td.parentElement?.style?.height) || 26
        const rowSpan = td.rowSpan || 1
        const isLeft = td.style.textAlign === 'left'
        const isTop = td.style.verticalAlign === 'top'
        const hasBr = td.querySelector('br') !== null
        td.style.padding = '0'
        td.style.verticalAlign = 'top'
        const wrap = clonedDoc.createElement('div')
        if (rowSpan > 1 && hasBr) {
          // 결재 세로 텍스트 셀 - 상하 균등 배치
          wrap.style.cssText = `display:flex;flex-direction:column;align-items:center;justify-content:space-around;height:${h}px;box-sizing:border-box;`
          const parts = (td.innerText || '').split('\n').map(s => s.trim()).filter(s => s)
          parts.forEach(part => {
            const s = clonedDoc.createElement('span')
            s.textContent = part
            wrap.appendChild(s)
          })
          while (td.firstChild) td.removeChild(td.firstChild)
        } else if (hasBr) {
          wrap.style.cssText = `display:flex;flex-direction:column;align-items:${isLeft ? 'flex-start' : 'center'};justify-content:center;height:${h}px;padding:0 6px;box-sizing:border-box;overflow:hidden;`
          while (td.firstChild) wrap.appendChild(td.firstChild)
        } else {
          wrap.style.cssText = `display:flex;align-items:${isTop ? 'flex-start' : 'center'};justify-content:${isLeft ? 'flex-start' : 'center'};height:${h}px;padding:0 6px;box-sizing:border-box;overflow:hidden;`
          while (td.firstChild) wrap.appendChild(td.firstChild)
        }
        td.appendChild(wrap)
      })
    },
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * pageWidth) / canvas.width

  let position = 0
  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  } else {
    while (position < imgHeight) {
      pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight)
      position += pageHeight
      if (position < imgHeight) pdf.addPage()
    }
  }

  pdf.save(filename)
}