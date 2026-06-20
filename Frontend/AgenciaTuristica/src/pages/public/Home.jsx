import { useMemo } from 'react'
import {
  HomeFAQ,
  FeaturedPackages,
  HomeHero,
  HomeTestimonials,
  PopularDestinations,
} from '../../components/home'
import usePublicPackages from '../../hooks/usePublicPackages'
import styles from './Home.module.css'

const frequentlyAskedQuestions = [
  {
    question: '¿Cómo puedo reservar un paquete?',
    answer:
      'Elige el paquete o destino que te interese, revisa los detalles y continúa al formulario de reserva. Desde ahí podrás confirmar fechas, viajeros y datos de contacto.',
  },
  {
    question: '¿Los paquetes incluyen transporte y hospedaje?',
    answer:
      'Depende del paquete. En cada card mostramos los servicios incluidos, como hotel, traslados, tours guiados o experiencias locales.',
  },
  {
    question: '¿Puedo cambiar la fecha de mi viaje?',
    answer:
      'Sí, puedes solicitar un cambio de fecha sujeto a disponibilidad del destino, hotel y actividades incluidas en tu paquete.',
  },
  {
    question: '¿Cómo se realizan los pagos?',
    answer:
      'La reserva puede avanzar desde el flujo de pago del sitio. El detalle final del monto y estado de pago se consulta desde tu reservación.',
  },
  {
    question: '¿Puedo viajar en grupo o personalizar un paquete?',
    answer:
      'Sí. Para grupos o experiencias personalizadas se pueden ajustar fechas, número de viajeros y actividades según disponibilidad.',
  },
]

const testimonials = [
  {
    name: 'Mariana Lopez',
    trip: 'Escapada Huasteca',
    quote:
      'Todo estuvo muy bien organizado. Llegamos, teniamos los traslados listos y los tours fueron justo lo que buscabamos.',
    rating: '5.0',
  },
  {
    name: 'Carlos Medina',
    trip: 'Ruta Baja Desert',
    quote:
      'El paquete nos ayudo a aprovechar el viaje sin estar resolviendo detalles a ultima hora. Los paisajes fueron increibles.',
    rating: '4.9',
  },
  {
    name: 'Andrea Ruiz',
    trip: 'Colonial y Cultura',
    quote:
      'Me gusto que la experiencia se sintio tranquila y bien pensada. El hotel, la guia y las recomendaciones estuvieron excelentes.',
    rating: '5.0',
  },
]

function Home() {
  const { packages } = usePublicPackages()
  const homeDestinations = useMemo(
    () =>
      packages.map((travelPackage) => ({
        description: travelPackage.description,
        duration: travelPackage.duration,
        heroImage: travelPackage.heroImage,
        href: travelPackage.href,
        id: travelPackage.id,
        image: travelPackage.image,
        location: travelPackage.destination,
        priceFrom: travelPackage.price,
        title: travelPackage.title,
      })),
    [packages],
  )
  const featuredPackages = packages.slice(0, 3)

  return (
    <main className={styles.page}>
      <HomeHero destinations={homeDestinations} />
      <PopularDestinations destinations={homeDestinations.slice(0, 7)} />
      <FeaturedPackages packages={featuredPackages} />
      <HomeTestimonials testimonials={testimonials} />
      <HomeFAQ items={frequentlyAskedQuestions} />
    </main>
  )
}

export default Home
