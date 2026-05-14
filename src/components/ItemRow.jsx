import { formatNumber, parseNumber } from '../utils/format'

export default function ItemRow({ index, item, onChange, onRemove, totalItems }) {
  const amount = parseNumber(item.qty) * parseNumber(item.price)
  function field(key, val) { onChange(index, { ...item, [key]: val }) }
  const inputCls = 'border border-gray-200 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white'
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">품목 {index + 1}</span>
        {totalItems > 1 && <button onClick={() => onRemove(index)} className="text-xs text-red-400 hover:text-red-600">삭제</button>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="text-xs text-gray-500 mb-0.5 block">물품명</label>
          <input className={inputCls} value={item.name} onChange={e => field('name', e.target.value)} placeholder="예: 지오멘트(표층)" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-0.5 block">규격</label>
          <input className={inputCls} value={item.spec} onChange={e => field('spec', e.target.value)} placeholder="규격" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-0.5 block">단위</label>
          <input className={inputCls} value={item.unit} onChange={e => field('unit', e.target.value)} placeholder="톤/m³" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-0.5 block">수량</label>
          <input className={inputCls} type="number" value={item.qty} onChange={e => field('qty', e.target.value)} placeholder="0" min="0" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-0.5 block">단가 (원)</label>
          <input className={inputCls} type="number" value={item.price} onChange={e => field('price', e.target.value)} placeholder="0" min="0" />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-500 mb-0.5 block">금액</label>
          <div className="border border-gray-200 rounded px-2 py-1.5 text-sm bg-white text-blue-700 font-semibold">
            {amount > 0 ? formatNumber(amount) + ' 원' : '-'}
          </div>
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-500 mb-0.5 block">비고</label>
          <input className={inputCls} value={item.note} onChange={e => field('note', e.target.value)} placeholder="예: 장비주행성" />
        </div>
      </div>
    </div>
  )
}
