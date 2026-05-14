export default function FormInput({ label, value, onChange, type = 'text', placeholder = '', className = '', suffix = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm focus:outline-none rounded-lg bg-transparent"
        />
        {suffix && <span className="pr-3 text-sm text-gray-400">{suffix}</span>}
      </div>
    </div>
  )
}
