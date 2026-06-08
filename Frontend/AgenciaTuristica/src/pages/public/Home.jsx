import {
  HomeFAQ,
  FeaturedPackages,
  HomeHero,
  HomeTestimonials,
  PopularDestinations,
} from '../../components/home'
import styles from './Home.module.css'

const featuredDestinations = [
  {
    title: 'Selva Maya',
    location: 'Chiapas',
    description:
      'Camina entre cascadas, pueblos llenos de color y senderos rodeados por vegetacion tropical.',
    duration: '4 dias',
    href: '/destinations/selva-maya',
    image:
      'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=500&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1800&q=85',
    priceFrom: '$8,400 MXN',
  },
  {
    title: 'Dunas Doradas',
    location: 'Baja California',
    description:
      'Recorre paisajes deserticos, miradores naturales y atardeceres que cambian todo el horizonte.',
    duration: '3 dias',
    href: '/destinations/dunas-doradas',
    image:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=500&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1800&q=85',
    priceFrom: '$7,900 MXN',
  },
  {
    title: 'Cascada Azul',
    location: 'Huasteca Potosina',
    description:
      'Descubre rios turquesa, saltos de agua y rutas perfectas para una escapada de aventura.',
    duration: '5 dias',
    href: '/destinations/cascada-azul',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=500&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85',
    priceFrom: '$9,200 MXN',
  },
  {
    title: 'Cumbres Andinas',
    location: 'Sudamerica',
    description:
      'Vive caminos de altura, pueblos remotos y panoramas de montana pensados para viajeros curiosos.',
    duration: '6 dias',
    href: '/destinations/cumbres-andinas',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85',
    priceFrom: '$13,500 MXN',
  },
  {
    title: 'Costa Esmeralda',
    location: 'Veracruz',
    description:
      'Playas tranquilas, gastronomia costera y recorridos relajados frente al Golfo de Mexico.',
    duration: '3 dias',
    href: '/destinations/costa-esmeralda',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
    priceFrom: '$6,800 MXN',
  },
  {
    title: 'Pueblo Magico',
    location: 'San Miguel de Allende',
    description:
      'Calles coloniales, terrazas con vista y experiencias culturales para viajar con calma.',
    duration: '2 dias',
    href: '/destinations/pueblo-magico',
    image:
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=500&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=1800&q=85',
    priceFrom: '$5,900 MXN',
  },
  {
    title: 'Laguna Rosa',
    location: 'Yucatan',
    description:
      'Un paisaje salino de tonos rosados, aves migratorias y rutas cercanas a la costa yucateca.',
    duration: '4 dias',
    href: '/destinations/laguna-rosa',
    image:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=500&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1800&q=85',
    priceFrom: '$8,700 MXN',
  },
  {
    title: 'Bosque Nublado',
    location: 'Oaxaca',
    description:
      'Senderos frescos, miradores verdes y comunidades serranas con sabores tradicionales.',
    duration: '4 dias',
    href: '/destinations/bosque-nublado',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85',
    priceFrom: '$7,500 MXN',
  },
]

const featuredPackages = [
  {
    title: 'Escapada Huasteca',
    destination: 'Huasteca Potosina',
    duration: '5 dias / 4 noches',
    description:
      'Rios turquesa, cascadas y traslados organizados para vivir una aventura completa sin complicarte.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
    includes: ['Hotel', 'Tours guiados', 'Traslados'],
    price: '$12,900 MXN',
    href: '/packages/escapada-huasteca',
  },
  {
    title: 'Ruta Baja Desert',
    destination: 'Baja California',
    duration: '4 dias / 3 noches',
    description:
      'Atardeceres en dunas, miradores naturales y experiencias locales para viajeros que buscan paisajes amplios.',
    image:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=85',
    includes: ['Hospedaje', 'Transporte', 'Experiencias'],
    price: '$10,800 MXN',
    href: '/packages/ruta-baja-desert',
  },
  {
    title: 'Colonial y Cultura',
    destination: 'San Miguel de Allende',
    duration: '3 dias / 2 noches',
    description:
      'Calles historicas, terrazas, gastronomia y recorridos culturales para una salida tranquila y bien planeada.',
    image:
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=900&q=85',
    includes: ['Hotel boutique', 'Guia local', 'Cena'],
    price: '$8,600 MXN',
    href: '/packages/colonial-y-cultura',
  },
]

const frequentlyAskedQuestions = [
  {
    question: 'Como puedo reservar un paquete?',
    answer:
      'Elige el paquete o destino que te interese, revisa los detalles y continua al formulario de reserva. Desde ahi podras confirmar fechas, viajeros y datos de contacto.',
  },
  {
    question: 'Los paquetes incluyen transporte y hospedaje?',
    answer:
      'Depende del paquete. En cada card mostramos los servicios incluidos, como hotel, traslados, tours guiados o experiencias locales.',
  },
  {
    question: 'Puedo cambiar la fecha de mi viaje?',
    answer:
      'Si, puedes solicitar un cambio de fecha sujeto a disponibilidad del destino, hotel y actividades incluidas en tu paquete.',
  },
  {
    question: 'Como se realizan los pagos?',
    answer:
      'La reserva puede avanzar desde el flujo de pago del sitio. El detalle final del monto y estado de pago se consulta desde tu reservacion.',
  },
  {
    question: 'Puedo viajar en grupo o personalizar un paquete?',
    answer:
      'Si. Para grupos o experiencias personalizadas se pueden ajustar fechas, numero de viajeros y actividades segun disponibilidad.',
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
  return (
    <main className={styles.page}>
      <HomeHero destinations={featuredDestinations} />
      <PopularDestinations destinations={featuredDestinations.slice(0, 6)} />
      <FeaturedPackages packages={featuredPackages} />
      <HomeTestimonials testimonials={testimonials} />
      <HomeFAQ items={frequentlyAskedQuestions} />
    </main>
  )
}

export default Home
