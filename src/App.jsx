import { useState } from 'react'
import FormInput from './components/FormInput'
import ItemRow from './components/ItemRow'
import PreviewModal from './components/PreviewModal'
import { defaultOrderNumber, todayDisplay } from './utils/format'
import './App.css'

const FACTORIES = ['보령공장', '순천공장', '하동공장']
const MAX_ITEMS = 6

function emptyItem() {
  return { name: '', spec: '', unit: '', qty: '', price: '', note: '' }
}

function initialState() {
  return {
    orderNumber: defaultOrderNumber(),
    orderDate: todayDisplay(),
    salesRep: '', siteName: '', receiver: '',
    distance: '', factory: '보령공장',
    items: [emptyItem()],
    supplier: '', supplierContact: '', deliveryDate: '',
    tel: '', siteAddress: '', hp: '', partner: '',
    siteManager: '', constructor: '', developer: '', specialNote: '',
  }
}

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <h2 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  const [form, setForm] = useState(initialState)
  const [showPreview, setShowPreview] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function updateItem(index, updated) {
    setForm(f => { const items = [...f.items]; items[index] = updated; return { ...f, items } })
  }
  function addItem() {
    if (form.items.length >= MAX_ITEMS) return
    setForm(f => ({ ...f, items: [...f.items, emptyItem()] }))
  }
  function removeItem(index) {
    if (form.items.length <= 1) return
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== index) }))
  }

  const total = form.items.reduce((sum, item) => sum + Number(item.qty||0) * Number(item.price||0), 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white px-4 py-4 shadow-md sticky top-0 z-40">
        <h1 className="text-lg font-bold tracking-widest text-center">발 주 서</h1>
      </header>

      <main className="px-4 py-5 space-y-5 pb-32">
        <Section title="기본 정보">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">발주번호</label>
            <input type="text" value={form.orderNumber} onChange={e => set('orderNumber', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="YYMM-DD-00" />
            <p className="text-xs text-gray-400 mt-1">형식: YYMM-DD-순번 (예: 2605-14-01)</p>
          </div>
          <FormInput label="주문일자" value={form.orderDate} onChange={v => set('orderDate', v)} placeholder="yyyy.mm.dd" />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="영업담당자" value={form.salesRep} onChange={v => set('salesRep', v)} placeholder="이름" />
            <FormInput label="접수자" value={form.receiver} onChange={v => set('receiver', v)} placeholder="이름" />
          </div>
          <FormInput label="현장명" value={form.siteName} onChange={v => set('siteName', v)} placeholder="현장명 입력" />
        </Section>

        <Section title="출하 정보">
          <FormInput label="거리" value={form.distance} onChange={v => set('distance', v)} type="number" placeholder="0" suffix="km" />
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">희망출하공장</label>
            <div className="flex gap-2">
              {FACTORIES.map(f => (
                <button key={f} onClick={() => set('factory', f)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${form.factory===f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="품목 목록">
          {form.items.map((item, i) => (
            <ItemRow key={i} index={i} item={item} onChange={updateItem} onRemove={removeItem} totalItems={form.items.length} />
          ))}
          {form.items.length < MAX_ITEMS && (
            <button onClick={addItem} className="w-full border-2 border-dashed border-blue-300 text-blue-500 rounded-xl py-3 text-sm font-medium hover:bg-blue-50 transition-colors">
              + 품목 추가 ({form.items.length}/{MAX_ITEMS})
            </button>
          )}
          {form.items.length < MAX_ITEMS && (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
              나머지 {MAX_ITEMS - form.items.length}행은 "이하여백"으로 자동 표시
            </p>
          )}
          {total > 0 && (
            <div className="flex justify-between items-center bg-blue-50 rounded-xl px-4 py-3">
              <span className="text-sm font-semibold text-blue-700">합계</span>
              <span className="text-base font-bold text-blue-700">{total.toLocaleString('ko-KR')} 원</span>
            </div>
          )}
        </Section>

        <Section title="납품업체 정보">
          <FormInput label="납품업체" value={form.supplier} onChange={v => set('supplier', v)} placeholder="업체명" />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="납품업체 담당자" value={form.supplierContact} onChange={v => set('supplierContact', v)} placeholder="이름" />
            <FormInput label="납품일자" value={form.deliveryDate} onChange={v => set('deliveryDate', v)} placeholder="yyyy.mm.dd" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Tel" value={form.tel} onChange={v => set('tel', v)} type="tel" placeholder="전화번호" />
            <FormInput label="H.P" value={form.hp} onChange={v => set('hp', v)} type="tel" placeholder="휴대폰" />
          </div>
          <FormInput label="협력사" value={form.partner} onChange={v => set('partner', v)} placeholder="협력사명" />
        </Section>

        <Section title="현장 정보">
          <FormInput label="현장주소" value={form.siteAddress} onChange={v => set('siteAddress', v)} placeholder="현장 주소" />
          <FormInput label="현장관리자" value={form.siteManager} onChange={v => set('siteManager', v)} placeholder="이름" />
          <FormInput label="시공사" value={form.constructor} onChange={v => set('constructor', v)} placeholder="시공사명" />
          <FormInput label="시행사 / 발주처" value={form.developer} onChange={v => set('developer', v)} placeholder="시행사 또는 발주처명" />
        </Section>

        <Section title="특기사항">
          <label className="text-xs font-semibold text-gray-500 block mb-1">추가 특기사항 (선택)</label>
          <textarea value={form.specialNote} onChange={e => set('specialNote', e.target.value)} rows={3}
            placeholder="예: 고화재 사용용도(부위)를 명확히 기록"
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </Section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl z-40">
        <div style={{maxWidth:640,margin:'0 auto'}}>
          <button onClick={() => setShowPreview(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg transition-colors">
            미리보기 · 저장
          </button>
        </div>
      </div>

      {showPreview && <PreviewModal formData={form} onClose={() => setShowPreview(false)} />}
    </div>
  )
}
