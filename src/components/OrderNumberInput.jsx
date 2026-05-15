import { useRef } from 'react'

export default function OrderNumberInput({ value, onChange }) {
  const now = new Date()
  const defaultYymm = String(now.getFullYear()).slice(2) + String(now.getMonth() + 1).padStart(2, '0')
  const defaultDd = String(now.getDate()).padStart(2, '0')

  const parts = (value || '').split('-')
  const yymm = parts[0] || defaultYymm
  const dd = parts[1] || defaultDd
  const seq = parts[2] || '00'

  const ddRef = useRef()
  const seqRef = useRef()

  function handleYymm(v) {
    const cleaned = v.replace(/\D/g, '').slice(0, 4)
    onChange(`${cleaned}-${dd}-${seq}`)
    if (cleaned.length === 4) ddRef.current?.focus()
  }

  function handleDd(v) {
    const cleaned = v.replace(/\D/g, '').slice(0, 2)
    onChange(`${yymm}-${cleaned}-${seq}`)
    if (cleaned.length === 2) seqRef.current?.focus()
  }

  function handleSeq(v) {
    const cleaned = v.replace(/\D/g, '').slice(0, 3)
    onChange(`${yymm}-${dd}-${cleaned}`)
  }

  const inputCls = 'border-0 border-b border-gray-400 text-sm text-center focus:outline-none focus:border-blue-500 bg-transparent font-mono'

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500">발주번호</label>
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white gap-1">
        <input value={yymm} onChange={e => handleYymm(e.target.value)}
          placeholder="YYMM" inputMode="numeric" maxLength={4}
          className={`${inputCls} w-10`} onFocus={e => e.target.select()} />
        <span className="text-sm text-gray-400">-</span>
        <input ref={ddRef} value={dd} onChange={e => handleDd(e.target.value)}
          placeholder="DD" inputMode="numeric" maxLength={2}
          className={`${inputCls} w-7`} />
        <span className="text-sm text-gray-400">-</span>
        <input ref={seqRef} value={seq} onChange={e => handleSeq(e.target.value)}
          placeholder="00" inputMode="numeric" maxLength={3}
          className={`${inputCls} w-8`} />
      </div>
    </div>
  )
}