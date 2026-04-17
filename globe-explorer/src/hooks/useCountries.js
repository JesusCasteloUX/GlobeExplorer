import { useState, useEffect } from 'react'

export function useCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,flags,languages,currencies,region,latlng,cca2')
      .then(r => r.json())
      .then(data => {
        setCountries(data)
        setLoading(false)
      })
  }, [])

  return { countries, loading }
}