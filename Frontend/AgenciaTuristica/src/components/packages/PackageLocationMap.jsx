import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './PackageLocationMap.module.css'

function PackageLocationMap({ coordinates, destination, title }) {
  const mapElementRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return undefined

    const center = [coordinates.lat, coordinates.lng]
    const map = L.map(mapElementRef.current, {
      maxZoom: 19,
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView(center, 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    L.marker(center, {
      icon: L.divIcon({
        className: styles.locationMarker,
        html: '<span></span>',
        iconAnchor: [18, 18],
      }),
    })
      .bindPopup(`<strong>${title}</strong><br />${destination}`)
      .addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [coordinates.lat, coordinates.lng, destination, title])

  return <div className={styles.map} ref={mapElementRef} />
}

PackageLocationMap.propTypes = {
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  destination: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default PackageLocationMap
