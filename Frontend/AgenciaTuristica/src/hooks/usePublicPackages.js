import { useEffect, useState } from 'react'
import { packageService } from '../services/packageService'

function usePublicPackages() {
  const [packages, setPackages] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadPackages = async () => {
      setIsLoading(true)
      setError('')

      try {
        const apiPackages = await packageService.getPublic()
        if (isMounted) setPackages(apiPackages)
      } catch (loadError) {
        if (isMounted) {
          setPackages([])
          setError(loadError.message ?? 'No se pudieron cargar los paquetes desde el servidor.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPackages()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    error,
    isLoading,
    packages,
  }
}

export default usePublicPackages
