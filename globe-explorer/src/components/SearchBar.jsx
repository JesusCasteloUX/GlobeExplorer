import { useState } from 'react'

export default function SearchBar({ countries, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (val.length < 2) return setResults([])
    const filtered = countries
      .filter(c => c.name.common.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 6)
    setResults(filtered)
  }

  return (
    <div className="relative flex-1">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:border-blue-500/50">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Buscar país ej: Mexico"
          className="bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none w-full"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]) }}
            className="text-slate-600 hover:text-slate-400 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-[#0d1424] border border-white/10 rounded-lg overflow-hidden z-50">
          {results.map(c => (
            <li
              key={c.cca2}
              onClick={() => { onSelect(c); setQuery(''); setResults([]) }}
              className="px-4 py-2 text-sm text-slate-300 hover:bg-white/5 cursor-pointer flex items-center gap-2"
            >
              <img src={c.flags.svg} className="w-5 h-3 object-cover rounded-sm" />
              {c.name.common}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}