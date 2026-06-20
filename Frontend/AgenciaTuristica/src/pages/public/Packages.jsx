import { useMemo, useState } from 'react'
import { PackageCard, PackageMap } from '../../components/packages'
import usePublicPackages from '../../hooks/usePublicPackages'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './Packages.module.css'

const defaultMaxPackagePrice = 25000
const priceStep = 500

const initialFilters = {
  destination: '',
  duration: 'all',
  experienceTypes: [],
  includes: [],
  maxPrice: defaultMaxPackagePrice,
  sortBy: 'recommended',
  travelDate: '',
  travelers: 2,
}

const getDurationBasis = (travelPackage) =>
  travelPackage.bookingMode === 'nightly'
    ? travelPackage.minimumNights ?? 1
    : travelPackage.days ?? 1

const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return true

  return date >= startDate && date <= endDate
}

function Packages() {
  const { error, isLoading, packages } = usePublicPackages()
  const [filters, setFilters] = useState(initialFilters)
  const maxPackagePrice = useMemo(() => {
    const highestPackagePrice = Math.max(
      defaultMaxPackagePrice,
      ...packages.map((travelPackage) => travelPackage.priceAmount ?? 0),
    )

    return Math.ceil(highestPackagePrice / priceStep) * priceStep
  }, [packages])

  const destinations = useMemo(
    () => [...new Set(packages.map((travelPackage) => travelPackage.destination))],
    [packages],
  )
  const experienceTypes = useMemo(
    () => [...new Set(packages.map((travelPackage) => travelPackage.experienceType))],
    [packages],
  )
  const includeOptions = useMemo(
    () => [...new Set(packages.flatMap((travelPackage) => travelPackage.includeTags ?? []))],
    [packages],
  )

  const updateFilter = (event) => {
    const { name, value } = event.target
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: ['maxPrice', 'travelers'].includes(name) ? Number(value) : value,
    }))
  }

  const toggleArrayFilter = (filterName, value) => {
    setFilters((currentFilters) => {
      const currentValues = currentFilters[filterName]
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return {
        ...currentFilters,
        [filterName]: nextValues,
      }
    })
  }

  const resetFilters = () => {
    setFilters({
      ...initialFilters,
      maxPrice: maxPackagePrice,
    })
  }

  const filteredPackages = useMemo(() => {
    const matchesDuration = (travelPackage) => {
      const durationBasis = getDurationBasis(travelPackage)

      if (filters.duration === 'weekend') return durationBasis <= 3
      if (filters.duration === 'medium') return durationBasis >= 3 && durationBasis <= 4
      if (filters.duration === 'long') return durationBasis >= 5

      return true
    }

    return packages
      .filter((travelPackage) => {
        const normalizedDestinationSearch = filters.destination.trim().toLowerCase()
        const matchesDestination =
          normalizedDestinationSearch === '' ||
          travelPackage.destination.toLowerCase().includes(normalizedDestinationSearch) ||
          travelPackage.title.toLowerCase().includes(normalizedDestinationSearch) ||
          travelPackage.experienceType.toLowerCase().includes(normalizedDestinationSearch)
        const matchesExperience =
          filters.experienceTypes.length === 0 ||
          filters.experienceTypes.includes(travelPackage.experienceType)
        const matchesIncludes =
          filters.includes.length === 0 ||
          filters.includes.every((includeItem) => travelPackage.includeTags.includes(includeItem))
        const matchesPrice = travelPackage.priceAmount <= filters.maxPrice
        const matchesTravelers = (travelPackage.maxGuests ?? 1) >= filters.travelers
        const matchesDate =
          !filters.travelDate ||
          travelPackage.bookingMode === 'nightly' ||
          (travelPackage.departures ?? []).some((departure) =>
            isDateInRange(filters.travelDate, departure.startDate, departure.endDate),
          )

        return (
          matchesDestination &&
          matchesExperience &&
          matchesIncludes &&
          matchesPrice &&
          matchesTravelers &&
          matchesDate &&
          matchesDuration(travelPackage)
        )
      })
      .sort((firstPackage, secondPackage) => {
        if (filters.sortBy === 'price-asc') return firstPackage.priceAmount - secondPackage.priceAmount
        if (filters.sortBy === 'price-desc') return secondPackage.priceAmount - firstPackage.priceAmount
        if (filters.sortBy === 'duration-asc') {
          return getDurationBasis(firstPackage) - getDurationBasis(secondPackage)
        }
        if (filters.sortBy === 'duration-desc') {
          return getDurationBasis(secondPackage) - getDurationBasis(firstPackage)
        }

        return 0
      })
  }, [filters, packages])

  const hasActiveFilters =
    filters.destination.trim() !== '' ||
    filters.duration !== 'all' ||
    filters.experienceTypes.length > 0 ||
    filters.includes.length > 0 ||
    filters.maxPrice !== maxPackagePrice ||
    filters.travelDate !== '' ||
    filters.travelers !== initialFilters.travelers

  return (
    <main className={styles.page}>
      <section className={styles.searchSection} aria-label="Busqueda de paquetes">
        <form className={styles.searchBar} onSubmit={(event) => event.preventDefault()}>
          <label>
            <span>Destino</span>
            <input
              autoComplete="off"
              list="package-destinations"
              name="destination"
              onChange={updateFilter}
              placeholder="Mexico"
              type="search"
              value={filters.destination}
            />
            <datalist id="package-destinations">
              {destinations.map((destination) => (
                <option key={destination} value={destination} />
              ))}
            </datalist>
          </label>
          <label>
            <span>Fechas</span>
            <input
              aria-label="Fecha de viaje"
              name="travelDate"
              onChange={updateFilter}
              type="date"
              value={filters.travelDate}
            />
          </label>
          <label>
            <span>Viajeros</span>
            <select
              aria-label="Numero de viajeros"
              name="travelers"
              onChange={updateFilter}
              value={filters.travelers}
            >
              <option value="1">1 persona</option>
              <option value="2">2 personas</option>
              <option value="4">4 personas</option>
              <option value="6">6 personas</option>
              <option value="8">8 personas</option>
            </select>
          </label>
          <button className={styles.searchButton} type="submit" aria-label="Buscar paquetes">
            Buscar
          </button>
        </form>
      </section>

      <section className={styles.layout} aria-labelledby="packages-title">
        <aside className={styles.filterPanel} aria-label="Filtros de paquetes">
          <div className={styles.filterHeader}>
            <div>
              <span>Filtros</span>
              <strong>{filteredPackages.length} resultados</strong>
            </div>

            {hasActiveFilters && (
              <button type="button" onClick={resetFilters}>
                Limpiar
              </button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <h2>Rango de precios</h2>
            <p>Precio base del paquete o alojamiento.</p>

            <div className={styles.histogram} aria-hidden="true">
              {Array.from({ length: 32 }).map((_, index) => (
                <span
                  key={index}
                  style={{
                    '--bar-height': `${18 + Math.sin(index / 5) * 18 + Math.min(index, 18) * 2}px`,
                  }}
                />
              ))}
            </div>

            <input
              aria-label="Precio maximo"
              className={styles.priceSlider}
              max={maxPackagePrice}
              min="6000"
              name="maxPrice"
              onChange={updateFilter}
              step="500"
              type="range"
              value={filters.maxPrice}
            />

            <div className={styles.priceRange}>
              <span>$6,000</span>
              <strong>{formatCurrency(filters.maxPrice, { showCurrency: false })}</strong>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h2>Duracion / estancia</h2>
            {[
              ['all', 'Cualquier duracion'],
              ['weekend', 'Fin de semana o estancia corta'],
              ['medium', '3 a 4 dias/noches'],
              ['long', '5 dias/noches o mas'],
            ].map(([value, label]) => (
              <label className={styles.radioRow} key={value}>
                <input
                  checked={filters.duration === value}
                  name="duration"
                  onChange={updateFilter}
                  type="radio"
                  value={value}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h2>Tipo de experiencia</h2>
            <div className={styles.chipGrid}>
              {experienceTypes.map((experienceType) => (
                <button
                  className={
                    filters.experienceTypes.includes(experienceType) ? styles.activeChip : ''
                  }
                  key={experienceType}
                  type="button"
                  onClick={() => toggleArrayFilter('experienceTypes', experienceType)}
                >
                  {experienceType}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h2>Incluye</h2>
            <div className={styles.checkboxList}>
              {includeOptions.map((includeOption) => (
                <label key={includeOption}>
                  <input
                    checked={filters.includes.includes(includeOption)}
                    onChange={() => toggleArrayFilter('includes', includeOption)}
                    type="checkbox"
                  />
                  <span>{includeOption}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <span>
              {isLoading
                ? 'Cargando paquetes desde el servidor...'
                : `Encontramos ${filteredPackages.length} de ${packages.length} paquetes disponibles`}
            </span>
            {error && <span>{error}</span>}
            <div>
              <div>
                <h1 id="packages-title">Paquetes turisticos</h1>
              </div>

              <label className={styles.sortControl}>
                Ordenar
                <select name="sortBy" onChange={updateFilter} value={filters.sortBy}>
                  <option value="recommended">Recomendados</option>
                  <option value="price-asc">Precio menor</option>
                  <option value="price-desc">Precio mayor</option>
                  <option value="duration-asc">Menor duracion</option>
                  <option value="duration-desc">Mayor duracion</option>
                </select>
              </label>
            </div>
          </div>

          <div className={styles.list} aria-label="Lista de paquetes">
            {filteredPackages.map((travelPackage) => (
              <PackageCard key={travelPackage.id} travelPackage={travelPackage} />
            ))}

            {filteredPackages.length === 0 && (
              <div className={styles.emptyState}>
                <h2>No encontramos paquetes con esos filtros</h2>
                <p>Prueba quitando algun filtro o cambia el rango de precio.</p>
                <button type="button" onClick={resetFilters}>
                  Ver todos los paquetes
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className={styles.mapPanel} aria-label="Mapa de paquetes">
          <PackageMap packages={filteredPackages} />
        </aside>
      </section>
    </main>
  )
}

export default Packages
