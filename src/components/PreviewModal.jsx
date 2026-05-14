import { exportToPdf } from '../utils/exportPdf'
import { exportToExcel } from '../utils/exportExcel'
import { formatNumber, parseNumber } from '../utils/format'

const TOTAL_ROWS = 6

export default function PreviewModal({ formData, onClose }) {
  const total = formData.items.reduce((sum, item) => sum + parseNumber(item.qty) * parseNumber(item.price), 0)
  const cell = (style = {}) => ({ border: '1px solid #333', padding: '3px 6px', ...style })

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <button onClick={onClose} className="text-white text-sm">← 돌아가기</button>
        <span className="text-white font-semibold text-sm">미리보기</span>
        <div className="w-16" />
      </div>
      <div className="flex-1 overflow-auto bg-gray-700 p-3">
        <div id="preview-document" style={{fontFamily:"'Malgun Gothic','맑은 고딕',sans-serif",background:'white',padding:16,maxWidth:680,margin:'0 auto',fontSize:10}}>
          <h1 style={{textAlign:'center',fontSize:20,fontWeight:'bold',letterSpacing:8,marginBottom:10}}>발 주 서</h1>
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:4}}>
            <tbody>
              <tr>
                <td colSpan={3} rowSpan={2} style={cell({verticalAlign:'top'})}>
                  <div><strong>발주번호 :</strong> {formData.orderNumber}</div>
                  <div style={{marginTop:6,fontSize:9,color:'#555'}}>아래와 같이 발주 하오니 납품하여 주시기 바랍니다.</div>
                </td>
                <td style={cell({textAlign:'center',fontWeight:'bold',width:48})}>작 성</td>
                <td style={cell({textAlign:'center',fontWeight:'bold',width:48})}>열 람</td>
                <td style={cell({textAlign:'center',fontWeight:'bold',width:48})}>승 인</td>
              </tr>
              <tr>
                <td style={cell({height:28})}></td>
                <td style={cell()}></td>
                <td style={cell()}></td>
              </tr>
              <tr>
                <td style={cell({fontWeight:'bold',whiteSpace:'nowrap',width:60})}>주문일자</td>
                <td colSpan={2} style={cell()}>{formData.orderDate}</td>
                <td colSpan={3} style={cell()}></td>
              </tr>
              <tr>
                <td style={cell({fontWeight:'bold'})}>영업담당자</td>
                <td style={cell()}>{formData.salesRep}</td>
                <td style={cell({fontWeight:'bold'})}>현장명</td>
                <td colSpan={3} style={cell()}>{formData.siteName}</td>
              </tr>
              <tr>
                <td style={cell()}></td>
                <td style={cell()}></td>
                <td style={cell({fontWeight:'bold'})}>접수자</td>
                <td colSpan={3} style={cell()}>{formData.receiver}</td>
              </tr>
            </tbody>
          </table>
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:4}}>
            <tbody>
              <tr>
                <td style={cell({fontWeight:'bold',textAlign:'center',width:40})}>거 리</td>
                <td style={cell({width:60})}>{formData.distance ? formData.distance+' km' : ''}</td>
                <td style={cell()}>
                  희망출하공장&nbsp;&nbsp;
                  {['보령공장','순천공장','하동공장'].map(f=>(
                    <span key={f} style={{marginRight:10}}>{f}&nbsp;[{formData.factory===f?'O':' '}]</span>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:4}}>
            <thead>
              <tr style={{backgroundColor:'#f5f5f5'}}>
                {['번호','물 품 명','규격','단위','수량','단가','금 액','비 고'].map((h,i)=>(
                  <th key={i} style={cell({textAlign:'center',fontWeight:'bold'})}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(TOTAL_ROWS)].map((_,i)=>{
                const item = formData.items[i]
                const hasData = item && item.name
                const qty = hasData ? parseNumber(item.qty) : 0
                const price = hasData ? parseNumber(item.price) : 0
                const amount = qty * price
                return (
                  <tr key={i} style={{height:24}}>
                    <td style={cell({textAlign:'center'})}>{i+1}</td>
                    <td style={cell()}>{hasData ? item.name : (i>=formData.items.length ? '"이하여백"' : '')}</td>
                    <td style={cell({textAlign:'center'})}>{hasData ? item.spec : ''}</td>
                    <td style={cell({textAlign:'center'})}>{hasData ? item.unit : ''}</td>
                    <td style={cell({textAlign:'right'})}>{hasData&&qty>0?formatNumber(qty):''}</td>
                    <td style={cell({textAlign:'right'})}>{hasData&&price>0?formatNumber(price):''}</td>
                    <td style={cell({textAlign:'right'})}>{amount>0?formatNumber(amount):''}</td>
                    <td style={cell({textAlign:'center'})}>{hasData?item.note:''}</td>
                  </tr>
                )
              })}
              <tr>
                <td colSpan={6} style={cell({textAlign:'center',fontWeight:'bold'})}>합 계</td>
                <td style={cell({textAlign:'right',fontWeight:'bold'})}>{total>0?formatNumber(total):''}</td>
                <td style={cell()}></td>
              </tr>
            </tbody>
          </table>
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:4}}>
            <tbody>
              <tr>
                <td rowSpan={3} style={cell({fontWeight:'bold',textAlign:'center',whiteSpace:'nowrap',width:48})}>납품<br/>업체</td>
                <td colSpan={2} style={cell()}>{formData.supplier}</td>
                <td style={cell({fontWeight:'bold',textAlign:'center',whiteSpace:'nowrap',width:52})}>납품업체<br/>담당자</td>
                <td colSpan={2} style={cell()}>{formData.supplierContact}</td>
              </tr>
              <tr>
                <td colSpan={2} style={cell()}></td>
                <td style={cell({fontWeight:'bold',textAlign:'center'})}>납품일자</td>
                <td colSpan={2} style={cell()}>{formData.deliveryDate}</td>
              </tr>
              <tr>
                <td colSpan={2} style={cell()}></td>
                <td style={cell({fontWeight:'bold',textAlign:'center'})}>Tel</td>
                <td colSpan={2} style={cell()}>{formData.tel}</td>
              </tr>
              <tr>
                <td style={cell({fontWeight:'bold',textAlign:'center',whiteSpace:'nowrap'})}>현장<br/>주소</td>
                <td colSpan={2} style={cell()}>{formData.siteAddress}</td>
                <td style={cell({fontWeight:'bold',textAlign:'center'})}>H.P</td>
                <td colSpan={2} style={cell()}>{formData.hp}</td>
              </tr>
              <tr>
                <td style={cell({fontWeight:'bold',textAlign:'center',whiteSpace:'nowrap'})}>현장<br/>관리자</td>
                <td style={cell()}>{formData.siteManager}</td>
                <td style={cell({fontWeight:'bold',textAlign:'center'})}>시공사</td>
                <td style={cell()}>{formData.constructor}</td>
                <td style={cell({fontWeight:'bold',textAlign:'center'})}>협력사</td>
                <td style={cell()}>{formData.partner}</td>
              </tr>
              <tr>
                <td style={cell({fontWeight:'bold',textAlign:'center',whiteSpace:'nowrap'})}>시행사,<br/>발주처</td>
                <td colSpan={5} style={cell()}>{formData.developer}</td>
              </tr>
            </tbody>
          </table>
          <div style={{border:'1px solid #333',padding:'4px 8px',fontSize:9}}>
            <div style={{fontWeight:'bold',marginBottom:4}}>◑ 특기사항(관급자재 납품)</div>
            <div>1. 상기 견적 금액은 부가가치세 별도, 현장 도착도 금액입니다.</div>
            {formData.specialNote && <div>2. {formData.specialNote}</div>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 bg-gray-900">
        <button onClick={() => exportToExcel(formData, `발주서_${formData.orderNumber}.xlsx`)} className="bg-green-500 text-white font-semibold py-3 rounded-xl text-sm">엑셀 저장</button>
        <button onClick={() => exportToPdf('preview-document', `발주서_${formData.orderNumber}.pdf`)} className="bg-red-500 text-white font-semibold py-3 rounded-xl text-sm">PDF 저장</button>
      </div>
    </div>
  )
}
