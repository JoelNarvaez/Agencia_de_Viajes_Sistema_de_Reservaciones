import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { packagePropType } from '../../utils/homePropTypes'
import styles from './PackageMap.module.css'

const mexicoCenter = [23.6345, -102.5528]

const getPackageCoordinates = (travelPackage) =>
  travelPackage.accommodation?.coordinates ?? travelPackage.coordinates

function PackageMap({ packages }) {
  const mapElementRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersLayerRef = useRef(null)

  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return

    const map = L.map(mapElementRef.current, {
      maxZoom: 19,
      scrollWheelZoom: true,
      wheelPxPerZoomLevel: 80,
      zoomSnap: 0.25,
      zoomControl: true,
    }).setView(mexicoCenter, 5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    markersLayerRef.current = L.layerGroup().addTo(map)
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markersLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    const markersLayer = markersLayerRef.current

    if (!map || !markersLayer) return

    markersLayer.clearLayers()

    const markerCoordinates = packages.map((travelPackage) => {
      const coordinates = getPackageCoordinates(travelPackage)

      return [coordinates.lat, coordinates.lng]
    })

    packages.forEach((travelPackage) => {
      const coordinates = getPackageCoordinates(travelPackage)
      const marker = L.marker([coordinates.lat, coordinates.lng], {
        icon: L.divIcon({
          className: styles.priceMarker,
          html: `<span>${travelPackage.price}</span>`,
          iconAnchor: [42, 18],
        }),
      })

      marker.bindPopup(`
        <strong>${travelPackage.title}</strong><br />
        ${travelPackage.accommodation?.name ?? travelPackage.destination}<br />
        ${travelPackage.price}
      `)

      marker.addTo(markersLayer)
    })

    if (markerCoordinates.length > 1) {
      map.fitBounds(markerCoordinates, { padding: [42, 42], maxZoom: 14 })
    } else if (markerCoordinates.length === 1) {
      map.setView(markerCoordinates[0], 17)
    } else {
      map.setView(mexicoCenter, 5)
    }
  }, [packages])

  return <div className={styles.map} ref={mapElementRef} />
}

PackageMap.propTypes = {
  packages: PropTypes.arrayOf(packagePropType).isRequired,
}

export default PackageMap
