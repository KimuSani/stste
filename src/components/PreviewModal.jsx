import { exportToPdf } from '../utils/exportPdf'
import { exportToExcel } from '../utils/exportExcel'
import { formatNumber, parseNumber } from '../utils/format'

const TOTAL_ROWS = 6

export default function PreviewModal({ formData, onClose, onSignatureChange, onHighlightChange }) {
  const total = formData.items.reduce((sum, item) => sum + parseNumber(item.qty) * parseNumber(item.price), 0)

  const td = (style = {}) => ({
    border: '1px solid #000',
    padding: '0 6px',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: 10,
    lineHeight: 1.4,
    overflow: 'visible',
    ...style,
  })

  const hd = (style = {}) => td({ background: '#f0f0f0', fontWeight: 500, ...style })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', background: '#1f2937' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#111827' }}>
        <button onClick={onClose} style={{ color: 'white', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>← 돌아가기</button>
        <span style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>미리보기</span>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#374151', padding: 12 }}>
        <div
          id="preview-document"
          style={{
            fontFamily: "'Malgun Gothic','맑은 고딕','Nanum Gothic',sans-serif",
            fontSize: 11,
            color: '#000',
            background: 'white',
            padding: 16,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: 8, paddingTop: 8, alignSelf: 'center' }}>발 주 서</div>
            <table style={{ borderCollapse: 'collapse', width: 300, tableLayout: 'fixed', flexShrink: 0 }}>
              <tbody>
                <tr style={{ height: 20 }}>
                  <td rowSpan={3} style={td({ width: 24, fontSize: 10, lineHeight: 1.6 })}>결<br/><br/>재</td>
                  <td style={hd({ width: 60 })}>작성</td>
                  <td style={hd({ width: 34 })}>열람</td>
                  <td style={hd({ width: 34 })}>열람</td>
                  <td style={hd({ width: 34 })}>열람</td>
                  <td style={hd({ width: 60 })}>승인</td>
                </tr>
                <tr style={{ height: 40 }}>
                  <td style={td({ padding: '2px 4px', position: 'relative' })}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, height: '100%' }}>
                      {formData.signature
                        ? <img src={formData.signature} style={{ maxWidth: '100%', maxHeight: 28, objectFit: 'contain' }} alt="서명" />
                        : <span style={{ fontSize: 12 }}>{formData.salesRep}</span>
                      }
                      {formData.signature ? (
                        <span className="no-pdf" onClick={() => onSignatureChange('')} style={{ cursor: 'pointer', fontSize: 9, color: 'white', background: '#ef4444', borderRadius: 3, padding: '1px 5px', lineHeight: 1.6, fontWeight: 600 }}>삭제</span>
                      ) : (
                        <label className="no-pdf" style={{ cursor: 'pointer', fontSize: 9, color: 'white', background: '#3b82f6', borderRadius: 3, padding: '1px 5px', lineHeight: 1.6, fontWeight: 600 }}>
                          서명 추가
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                            const file = e.target.files[0]
                            if (!file) return
                            const reader = new FileReader()
                            reader.onload = ev => onSignatureChange(ev.target.result)
                            reader.readAsDataURL(file)
                          }} />
                        </label>
                      )}
                    </div>
                  </td>
                  <td style={td()}></td>
                  <td style={td()}></td>
                  <td style={td()}></td>
                  <td style={td()}></td>
                </tr>
                <tr style={{ height: 14 }}>
                  <td style={td({ fontSize: 9 })}></td>
                  <td style={td()}></td>
                  <td style={td()}></td>
                  <td style={td()}></td>
                  <td style={td()}></td>
                </tr>
              </tbody>
            </table>
          </div>

          <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed', marginBottom: 8 }}>
            <colgroup>
              <col style={{ width: 72 }} /><col /><col style={{ width: 56 }} /><col />
            </colgroup>
            <tbody>
              <tr style={{ height: 46 }}>
                <td style={hd()}>발주번호</td>
                <td colSpan={3} style={td({ textAlign: 'left', lineHeight: 1.9 })}>
                  {formData.orderNumber}<br/>
                  <span style={{ fontSize: 10, color: '#555' }}>아래와 같이 발주 하오니 납품하여 주시기 바랍니다.</span>
                </td>
              </tr>
              <tr style={{ height: 26 }}>
                <td style={hd()}>주문일자</td>
                <td style={td({ textAlign: 'left' })}>{formData.orderDate}</td>
                <td style={hd()}>현장명</td>
                <td style={td({ textAlign: 'left' })}>{formData.siteName}</td>
              </tr>
              <tr style={{ height: 26 }}>
                <td style={hd()}>영업담당자</td>
                <td style={td({ textAlign: 'left' })}>{formData.salesRep}</td>
                <td style={hd()}>접수자</td>
                <td style={td({ textAlign: 'left' })}>{formData.receiver}</td>
              </tr>
            </tbody>
          </table>

          <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed', marginBottom: 8 }}>
            <colgroup>
              <col style={{ width: 24 }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <tbody>
              <tr style={{ height: 26 }}>
                <td style={hd()}>거리</td>
                <td style={td({ textAlign: 'left' })}>{formData.distance ? formData.distance + ' km' : ''}</td>
                <td style={hd()}>희망출하공장</td>
                <td colSpan={5} style={td({ textAlign: 'left' })}>
                  {['보령공장', '순천공장', '하동공장'].map(f => (
                    <span key={f} style={{ marginRight: 10 }}>
                      {f} [{formData.factory === f ? 'O' : ' '}]
                    </span>
                  ))}
                </td>
              </tr>
              <tr style={{ height: 24 }}>
                {['번호', '물품명', '규격', '단위', '수량', '단가', '금액', '비고'].map(h => (
                  <td key={h} style={hd()}>{h}</td>
                ))}
              </tr>
              {[...Array(TOTAL_ROWS)].map((_, i) => {
                const item = formData.items[i]
                const hasData = item && item.name
                const qty = hasData ? parseNumber(item.qty) : 0
                const price = hasData ? parseNumber(item.price) : 0
                const amount = qty * price
                const isFirstBlank = i === formData.items.length
                return (
                  <tr key={i} style={{ height: 26 }}>
                    <td style={td()}>{i + 1}</td>
                    <td style={td()}>
                      {hasData ? item.name : (isFirstBlank ? '"이하여백"' : '')}
                    </td>
                    <td style={td()}>{hasData ? item.spec : ''}</td>
                    <td style={td()}>{hasData ? item.unit : ''}</td>
                    <td style={td({ textAlign: 'right' })}>{hasData && qty > 0 ? formatNumber(qty) : ''}</td>
                    <td style={td({ textAlign: 'right' })}>{hasData && price > 0 ? formatNumber(price) : ''}</td>
                    <td style={td({ textAlign: 'right' })}>{amount > 0 ? formatNumber(amount) : ''}</td>
                    <td style={td()}>{hasData ? item.note : ''}</td>
                  </tr>
                )
              })}
              <tr style={{ height: 26 }}>
                <td colSpan={6} style={td({ fontWeight: 500 })}>합 &nbsp;&nbsp; 계</td>
                <td colSpan={2} style={td({ textAlign: 'right', fontWeight: 600 })}>{total > 0 ? formatNumber(total) : ''}</td>
              </tr>
            </tbody>
          </table>

          <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed', marginBottom: 8 }}>
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '16%' }} />
            </colgroup>
            <tbody>
              <tr style={{ height: 26 }}>
                <td style={hd()}>납품업체</td>
                <td style={td({ textAlign: 'left' })}>{formData.supplier}</td>
                <td style={hd()}>납품업체담당자</td>
                <td colSpan={3} style={td({ textAlign: 'left' })}>{formData.supplierContact}</td>
              </tr>
              <tr style={{ height: 26 }}>
                <td style={hd()}>현장주소</td>
                <td style={td({ textAlign: 'left' })}>{formData.siteAddress}</td>
                <td style={hd()}>납품일자</td>
                <td colSpan={3} style={td({ textAlign: 'left' })}>{formData.deliveryDate}</td>
              </tr>
              <tr style={{ height: 26 }}>
                <td style={hd()}>현장관리자</td>
                <td style={td({ textAlign: 'left' })}>{formData.siteManager}</td>
                <td style={hd()}>H.P</td>
                <td style={td({ textAlign: 'left' })}>{formData.hp}</td>
                <td style={hd()}>Tel</td>
                <td style={td({ textAlign: 'left' })}>{formData.tel}</td>
              </tr>
              <tr style={{ height: 26 }}>
                <td style={hd()}>시행사, 발주처</td>
                <td style={td({ textAlign: 'left' })}>{formData.developer}</td>
                <td style={hd()}>시공사</td>
                <td style={td({ textAlign: 'left' })}>{formData.constructor}</td>
                <td style={hd()}>협력사</td>
                <td style={td({ textAlign: 'left' })}>{formData.partner}</td>
              </tr>
            </tbody>
          </table>

          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              <tr style={{ height: 88 }}>
                <td style={td({ textAlign: 'left', padding: '8px 10px', lineHeight: 2.0, overflow: 'visible', verticalAlign: 'top', background: formData.highlight ? '#FEE500' : 'white' })}>
                  ● 특기사항(관급자재 납품)<br/>
                  {formData.specialNote && <span style={{ whiteSpace: 'pre-wrap' }}>&nbsp;&nbsp;· {formData.specialNote}</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 16, background: '#111827' }}>
        <button
          onClick={() => exportToExcel(formData, `발주서_${formData.orderNumber}.xlsx`)}
          style={{ background: '#22c55e', color: 'white', fontWeight: 600, padding: '12px 0', borderRadius: 12, fontSize: 14, border: 'none', cursor: 'pointer' }}
        >
          엑셀 저장
        </button>
        <button
          onClick={() => exportToPdf('preview-document', `발주서_${formData.orderNumber}.pdf`)}
          style={{ background: '#ef4444', color: 'white', fontWeight: 600, padding: '12px 0', borderRadius: 12, fontSize: 14, border: 'none', cursor: 'pointer' }}
        >
          PDF 저장
        </button>
      </div>
    </div>
  )
}