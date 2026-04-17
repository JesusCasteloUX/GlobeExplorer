import { useEffect, useState } from 'react'

export default function CountryPanel({ country }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    if (!country) return
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [country])

  if (!country) return (
  <div className="flex flex-col items-center justify-center h-full text-slate-600 text-sm gap-3">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <circle cx="11" cy="11" r="3" strokeWidth="0.8" strokeDasharray="2 1.5"/>
    </svg>
    <p className="text-center px-4 text-slate-500">Haz clic en el globo<br/>para explorar un país</p>
  </div>
)

  const lang = Object.values(country.languages || {})[0] || '—'
  const currency = Object.values(country.currencies || {})[0]?.name || '—'
  const pop = new Intl.NumberFormat('es').format(country.population)

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
      className="flex flex-col gap-4 p-4 h-full overflow-y-auto"
    >
      <div className="text-center pt-2">
        <img
          src={country.flags.svg}
          className="w-24 h-14 object-cover rounded-lg mx-auto mb-3 border border-white/10"
        />
        <h2 className="text-lg font-medium text-slate-100">{country.name.common}</h2>
        <p className="text-xs text-slate-500 mt-1">{country.region}</p>
      </div>

      <div className="border-t border-white/5" />

      <div className="flex flex-col gap-3">
        {[
          ['Capital', country.capital?.[0] || '—'],
          ['Population', pop],
          ['Language', lang],
          ['Currency', currency],
          ['Area', country.area ? `${new Intl.NumberFormat('es').format(Math.round(country.area))} km²` : '—'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between items-center text-sm gap-2">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className="text-slate-300 font-medium text-right">{value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5" />

      <div className="flex flex-wrap gap-2">
        {country.borders?.slice(0, 4).map(b => (
          <span key={b} className="text-xs bg-white/5 text-slate-400 px-2 py-1 rounded border border-white/10">
            {b}
          </span>
        ))}
        {(!country.borders || country.borders.length === 0) && (
          <span className="text-xs text-slate-600">Sin fronteras terrestres</span>
        )}
      </div>
    </div>
  )
}