import { useState } from 'react'
import Globe from './components/Globe'
import CountryPanel from './components/CountryPanel'
import SearchBar from './components/SearchBar'
import { useCountries } from './hooks/useCountries'

function toRad(deg) { return deg * Math.PI / 180 }

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function findClosestCountry(countries, lat, lng) {
  let closest = null
  let minDist = Infinity
  for (const country of countries) {
    if (!country.latlng?.length) continue
    const dist = haversineDistance(lat, lng, country.latlng[0], country.latlng[1])
    if (dist < minDist) { minDist = dist; closest = country }
  }
  return closest
}

export default function App() {
  const [selected, setSelected] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const { countries, loading } = useCountries()

  const handleCoordClick = (lat, lng) => {
    if (!countries.length) return
    const country = findClosestCountry(countries, lat, lng)
    if (country) {
      setSelected(country)
      setPanelOpen(true)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0f1e]">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0d1424]">
        <h1 className="text-white font-medium text-sm whitespace-nowrap">Globe Explorer</h1>
        {!loading && (
          <SearchBar
            countries={countries}
            onSelect={(c) => { setSelected(c); setPanelOpen(true) }}
          />
        )}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 relative" style={{minHeight: 0}}>
          <div className='absolute inset-0'>
            <Globe onCoordClick={handleCoordClick} selectedCountry={selected} />
          </div>
        </div>

        {/* Panel desktop */}
        <aside className="hidden md:block w-64 border-l border-white/5 bg-[#0d1424]">
          <CountryPanel country={selected} />
        </aside>

        {/* Panel móvil — sube desde abajo */}
        {panelOpen && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 bg-[#0d1424] border-t border-white/10 rounded-t-2xl"
            style={{ maxHeight: '55vh' }}>
            <div className="flex justify-between items-center px-4 pt-3 pb-1">
              <span className="text-xs text-slate-500">País seleccionado</span>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-slate-400 leading-none p-1"
                style={{ fontSize: '28px', lineHeight: 1 }}
              >
                x
              </button>
            </div>
            <CountryPanel country={selected} />
          </div>
        )}
      </div>
    </div>
  )
}