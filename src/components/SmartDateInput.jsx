import { useRef } from 'react'

export default function SmartDateInput({ label, value, onChange }) {
  const now = new Date()
  const parts = (value || '').split('.')
  const yyyy = parts[0] || String(now.getFullYear())
  const mm = parts[1] || ''
  const dd = parts[2] || ''

  const mmRef = useRef()
  const ddRef = useRef()

  function handleYyyy(v) {
    const cleaned = v.replace(/\D/g, '').slice(0, 4)
    onChange(`${cleaned}.${mm}.${dd}`)
  }

  function handleMm(v) {
    const cleaned = v.replace(/\D/g, '').slice(0, 2)
    onChange(`${yyyy}.${cleaned}.${dd}`)
    if (cleaned.length === 2) ddRef.current?.focus()
  }

  function handleDd(v) {
    const cleaned = v.replace(/\D/g, '').slice(0, 2)
    onChange(`${yyyy}.${mm}.${cleaned}`)
  }

  const inputCls = 'border-0 border-b border-gray-400 text-sm text-center focus:outline-none focus:border-blue-500 bg-transparent'

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white gap-1">
        <input
          value={yyyy}
          onChange={e => handleYyyy(e.target.value)}
          placeholder="YYYY"
          inputMode="numeric"
          maxLength={4}
          className={`${inputCls} w-10`}
          onFocus={e => e.target.select()}
        />
        <span className="text-sm text-gray-400">.</span>
        <input
          ref={mmRef}
          value={mm}
          onChange={e => handleMm(e.target.value)}
          placeholder="MM"
          inputMode="numeric"
          maxLength={2}
          className={`${inputCls} w-8`}
        />
        <span className="text-sm text-gray-400">.</span>
        <input
          ref={ddRef}
          value={dd}
          onChange={e => handleDd(e.target.value)}
          placeholder="DD"
          inputMode="numeric"
          maxLength={2}
          className={`${inputCls} w-8`}
        />
      </div>
    </div>
  )
}