import * as XLSX from 'xlsx'
import { parseNumber } from './format'

export function exportToExcel(formData, filename = '발주서.xlsx') {
  const { items } = formData
  const TOTAL_ROWS = 6
  const rows = [
    ['발     주     서'], [],
    ['발주번호 :', formData.orderNumber],
    ['아래와 같이 발주 하오니 납품하여 주시기 바랍니다.'], [],
    ['주문일자', formData.orderDate, '', '현장명', formData.siteName],
    ['영업담당자', formData.salesRep, '', '접수자', formData.receiver], [],
    ['거리', formData.distance ? formData.distance + ' km' : '', '', '희망출하공장', formData.factory], [],
    ['번호', '물품명', '규격', '단위', '수량', '단가', '금액', '비고'],
  ]
  for (let i = 0; i < TOTAL_ROWS; i++) {
    const item = items[i]
    if (item && item.name) {
      const qty = parseNumber(item.qty), price = parseNumber(item.price)
      rows.push([i+1, item.name, item.spec, item.unit, qty||'', price||'', qty&&price?qty*price:'', item.note])
    } else {
      rows.push([i+1, i >= items.length ? '"이하여백"' : '', '', '', '', '', '', ''])
    }
  }
  const total = items.reduce((s, it) => s + parseNumber(it.qty)*parseNumber(it.price), 0)
  rows.push(['','','','','','합계', total||'',''])
  rows.push([])
  rows.push(['납품업체', formData.supplier, '', '납품업체 담당자', formData.supplierContact])
  rows.push(['현장주소', formData.siteAddress, '', '납품일자', formData.deliveryDate])
  rows.push(['현장관리자', formData.siteManager, '', 'H.P', formData.hp, 'Tel', formData.tel])
  rows.push(['시행사/발주처', formData.developer, '', '시공사', formData.constructor, '협력사', formData.partner])
  rows.push([])
  rows.push(['특기사항', formData.specialNote])
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [{wch:14},{wch:22},{wch:12},{wch:12},{wch:12},{wch:14},{wch:16},{wch:16}]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '발주서')
  XLSX.writeFile(wb, filename)
}
