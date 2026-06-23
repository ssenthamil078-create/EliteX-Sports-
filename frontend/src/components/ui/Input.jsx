export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-gray-300">{label}</span>}
      <input className={`input-field ${className}`} {...props} />
      {error && <span className="mt-2 block text-sm text-danger">{error}</span>}
    </label>
  )
}
