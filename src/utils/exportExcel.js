import ExcelJS from 'exceljs'
import { parseNumber, formatNumber } from './format'

const thin = { style: 'thin', color: { argb: 'FF000000' } }
const border = { top: thin, left: thin, bottom: thin, right: thin }
const fillGray = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf0f0f0' } }

export async function exportToExcel(formData, filename = '발주서.xlsx') {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('발주서')

  // PDF(미리보기) 비율 기반 11열
  // cols 1-5: 문서 왼쪽 영역 (≈55%), cols 6-11: 결재란 (≈45%)
  // 품목행: 1=번호, 2-3=물품명, 4=규격, 5=단위, 6=수량, 7=단가, 8-9=금액, 10-11=비고
  ws.columns = [
    { width: 7.5 }, // 1  번호 / A열
    { width: 11 },  // 2  물품명
    { width: 11 },  // 3  물품명(2)
    { width: 12 },  // 4  규격
    { width: 8 },   // 5  단위
    { width: 8 },   // 6  수량 / 결재
    { width: 10 },  // 7  단가 / 작성
    { width: 9 },   // 8  금액 / 열람
    { width: 8 },   // 9  금액(2) / 열람
    { width: 8 },   // 10 비고 / 열람
    { width: 8 },   // 11 비고(2) / 승인
  ]

  ws.pageSetup.paperSize = 9
  ws.pageSetup.orientation = 'portrait'
  ws.pageSetup.fitToPage = true
  ws.pageSetup.fitToWidth = 1
  ws.pageSetup.fitToHeight = 0

  function cell(r, c, value, opts = {}) {
    const cl = ws.getCell(r, c)
    if (opts.numFmt) cl.numFmt = opts.numFmt
    cl.value = value ?? ''
    cl.border = border
    cl.alignment = {
      vertical: 'middle',
      horizontal: opts.align || 'center',
      wrapText: !!opts.wrap,
      indent: opts.align === 'left' ? 1 : 0,
    }
    cl.font = { name: 'Malgun Gothic', bold: !!opts.bold, size: opts.size || 10 }
    if (opts.fill) cl.fill = fillGray
    return cl
  }

  function m(r1, c1, r2, c2) { ws.mergeCells(r1, c1, r2, c2) }

  // ── R1~R2: 발주서 제목 + 결재란 헤더
  ws.getRow(1).height = 26
  ws.getRow(2).height = 22

  cell(1, 1, '발     주     서', { bold: true, size: 16 })
  m(1, 1, 3, 5)

  // 결재 셀 (R1~R3, col6)
  const kCell = ws.getCell(1, 6)
  kCell.value = '결\n\n재'
  kCell.border = border
  kCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  kCell.font = { name: 'Malgun Gothic', size: 10 }

  // 결재란 헤더: 작성|열람|열람|열람|승인
  cell(1, 7, '작성', { fill: true })
  cell(1, 8, '열람', { fill: true })
  cell(1, 9, '열람', { fill: true })
  cell(1, 10, '열람', { fill: true })
  cell(1, 11, '승인', { fill: true })

  // 결재란 R2: 작성란에 서명 이미지 또는 이름
  cell(2, 7, formData.signature ? '' : (formData.salesRep || ''), { size: 11 })
  cell(2, 8, ''); cell(2, 9, ''); cell(2, 10, ''); cell(2, 11, '')

  if (formData.signature) {
    const match = formData.signature.match(/^data:image\/(png|jpe?g|gif|webp);base64,/)
    const ext = match ? match[1].replace('jpg', 'jpeg') : 'png'
    const base64 = formData.signature.replace(/^data:image\/[^;]+;base64,/, '')
    const imgId = wb.addImage({ base64, extension: ext })
    ws.addImage(imgId, { tl: { col: 6, row: 1 }, br: { col: 7, row: 2 }, editAs: 'oneCell' })
  }

  // ── R3: 결재란 하단 빈 행
  ws.getRow(3).height = 14
  m(1, 6, 3, 6) // 결재 병합 R1~R3
  cell(3, 7, ''); cell(3, 8, ''); cell(3, 9, ''); cell(3, 10, ''); cell(3, 11, '')

  // ── R4: 빈 행
  ws.getRow(4).height = 8

  // ── R5: 발주번호 + 아래와같이
  ws.getRow(5).height = 34
  cell(5, 1, '발주번호', { fill: true })
  const orderCell = ws.getCell(5, 2)
  orderCell.value = {
    richText: [
      { text: (formData.orderNumber || '') + '\n', font: { name: 'Malgun Gothic', size: 10 } },
      { text: '아래와 같이 발주 하오니 납품하여 주시기 바랍니다.', font: { name: 'Malgun Gothic', size: 9, color: { argb: 'FF555555' } } },
    ],
  }
  orderCell.border = border
  orderCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
  m(5, 2, 5, 11)

  // ── R6: 주문일자 / 현장명
  ws.getRow(6).height = 18
  cell(6, 1, '주 문 일 자', { fill: true })
  m(6, 1, 6, 2)
  cell(6, 3, formData.orderDate || '', { align: 'left' })
  m(6, 3, 6, 5)
  cell(6, 6, '현 장 명', { fill: true })
  m(6, 6, 6, 7)
  cell(6, 8, formData.siteName || '', { align: 'left' })
  m(6, 8, 6, 11)

  // ── R7: 영업담당자 / 접수자
  ws.getRow(7).height = 18
  cell(7, 1, '영업담당자', { fill: true })
  m(7, 1, 7, 2)
  cell(7, 3, formData.salesRep || '', { align: 'left' })
  m(7, 3, 7, 5)
  cell(7, 6, '접 수 자', { fill: true })
  m(7, 6, 7, 7)
  cell(7, 8, formData.receiver || '', { align: 'left' })
  m(7, 8, 7, 11)

  // ── R8: 빈 행
  ws.getRow(8).height = 8

  // ── R9: 거리 / 희망출하공장
  ws.getRow(9).height = 18
  cell(9, 1, '거리', { fill: true })
  cell(9, 2, formData.distance ? formData.distance + ' km' : '', { align: 'left' })
  m(9, 2, 9, 3)
  cell(9, 4, '희망출하공장', { fill: true })
  m(9, 4, 9, 5)
  const factoryStr = ['보령공장', '순천공장', '하동공장']
    .map(f => `${f} [${formData.factory === f ? 'O' : ' '}]`).join('   ')
  cell(9, 6, factoryStr, { align: 'left' })
  m(9, 6, 9, 11)

  // ── R10: 품목 헤더
  ws.getRow(10).height = 16
  cell(10, 1, '번호', { fill: true, bold: true })
  cell(10, 2, '물 품 명', { fill: true, bold: true })
  m(10, 2, 10, 3)
  cell(10, 4, '규격', { fill: true, bold: true })
  cell(10, 5, '단위', { fill: true, bold: true })
  cell(10, 6, '수량', { fill: true, bold: true })
  cell(10, 7, '단가', { fill: true, bold: true })
  cell(10, 8, '금  액', { fill: true, bold: true })
  m(10, 8, 10, 9)
  cell(10, 10, '비  고', { fill: true, bold: true })
  m(10, 10, 10, 11)

  // ── R11~R16: 품목 데이터
  for (let i = 0; i < 6; i++) {
    const row = 11 + i
    ws.getRow(row).height = 18
    const item = formData.items[i]
    const hasData = item && item.name
    const qty = hasData ? parseNumber(item.qty) : 0
    const price = hasData ? parseNumber(item.price) : 0
    const amount = qty * price
    const isFirstBlank = i === formData.items.length

    cell(row, 1, i + 1)
    cell(row, 2, hasData ? item.name : (isFirstBlank ? '"이하여백"' : ''), { align: 'left' })
    m(row, 2, row, 3)
    cell(row, 4, hasData ? item.spec : '')
    cell(row, 5, hasData ? item.unit : '')
    cell(row, 6, hasData && qty ? formatNumber(qty) : '')
    cell(row, 7, hasData && price ? formatNumber(price) : '')
    cell(row, 8, amount > 0 ? formatNumber(amount) : '')
    m(row, 8, row, 9)
    cell(row, 10, hasData ? item.note : '')
    m(row, 10, row, 11)
  }

  // ── R17: 합계
  ws.getRow(17).height = 18
  const total = formData.items.reduce((s, it) => s + parseNumber(it.qty) * parseNumber(it.price), 0)
  cell(17, 1, '합       계', { bold: true })
  m(17, 1, 17, 7)
  cell(17, 8, total > 0 ? formatNumber(total) : '', { bold: true })
  m(17, 8, 17, 9)
  cell(17, 10, '')
  m(17, 10, 17, 11)

  // ── R18: 빈 행
  ws.getRow(18).height = 8

  // ── R19: 납품업체 / 담당자
  ws.getRow(19).height = 18
  cell(19, 1, '납 품 업 체', { fill: true })
  m(19, 1, 19, 2)
  cell(19, 3, formData.supplier || '', { align: 'left' })
  m(19, 3, 19, 6)
  cell(19, 7, '납품업체담당자', { fill: true })
  m(19, 7, 19, 8)
  cell(19, 9, formData.supplierContact || '', { align: 'left' })
  m(19, 9, 19, 11)

  // ── R20: 현장주소 / 납품일자
  ws.getRow(20).height = 18
  cell(20, 1, '현 장 주 소', { fill: true })
  m(20, 1, 20, 2)
  cell(20, 3, formData.siteAddress || '', { align: 'left' })
  m(20, 3, 20, 6)
  cell(20, 7, '납품일자', { fill: true })
  m(20, 7, 20, 8)
  cell(20, 9, formData.deliveryDate || '', { align: 'left' })
  m(20, 9, 20, 11)

  // ── R21: 현장관리자 / H.P / Tel
  ws.getRow(21).height = 18
  cell(21, 1, '현장관리자', { fill: true })
  m(21, 1, 21, 2)
  cell(21, 3, formData.siteManager || '', { align: 'left' })
  m(21, 3, 21, 4)
  cell(21, 5, 'H.P', { fill: true })
  cell(21, 6, formData.hp || '', { align: 'left' })
  m(21, 6, 21, 7)
  cell(21, 8, 'Tel', { fill: true })
  cell(21, 9, formData.tel || '', { align: 'left' })
  m(21, 9, 21, 11)

  // ── R22: 시행사 / 시공사 / 협력사
  ws.getRow(22).height = 18
  cell(22, 1, '시행사, 발주처', { fill: true })
  m(22, 1, 22, 2)
  cell(22, 3, formData.developer || '', { align: 'left' })
  m(22, 3, 22, 4)
  cell(22, 5, '시공사', { fill: true })
  cell(22, 6, formData.constructor || '', { align: 'left' })
  m(22, 6, 22, 7)
  cell(22, 8, '협력사', { fill: true })
  cell(22, 9, formData.partner || '', { align: 'left' })
  m(22, 9, 22, 11)

  // ── R23: 빈 행
  ws.getRow(23).height = 8

  // ── R24: 특기사항
  ws.getRow(24).height = formData.specialNote ? 36 : 18
  cell(24, 1,
    formData.specialNote
      ? `◑ 특기사항(관급자재 납품)\n  · ${formData.specialNote}`
      : '◑ 특기사항(관급자재 납품)',
    { align: 'left', wrap: true }
  )
  m(24, 1, 24, 11)

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
