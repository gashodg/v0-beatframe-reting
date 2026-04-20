export type ProductCategory =
  | "camaras"
  | "lentes"
  | "mixers"
  | "grips"
  | "tripodes"
  | "luces"
  | "cableado"
  | "transmisores"
  | "capturadoras"
  | "conversores"
  | "splitters"

export type Product = {
  slug: string
  name: string
  brand: string
  category: ProductCategory
  categoryLabel: string
  pricePerDay: number
  shortDescription: string
  description: string
  specs: { label: string; value: string }[];
  includes: string[]
  image: string
  gallery: string[]
  featured?: boolean
  stock: number
}

export const categories: { slug: ProductCategory; label: string; description: string }[] = [
  {
    slug: "camaras",
    label: "Cámaras",
    description: "Cámaras de cine, mirrorless y PTZ preparadas para streaming en directo.",
  },
  { slug: "lentes", label: "Lentes", description: "Ópticas de cine y fotográficas para cualquier look." },
  { slug: "mixers", label: "Mixers de vídeo", description: "Realización multicámara en directo con latencia mínima." },
  { slug: "grips", label: "Grips", description: "Soportes, jirafas y accesorios de sujeción profesionales." },
  { slug: "tripodes", label: "Trípodes", description: "Cabezales fluidos y trípodes para cualquier peso." },
  { slug: "luces", label: "Luces profesionales", description: "LED, COB y fresnels para escenarios y plató." },
  { slug: "cableado", label: "Cableado HDMI / SDI", description: "Latiguillos certificados en todas las longitudes." },
  {
    slug: "transmisores",
    label: "Transmisores inalámbricos",
    description: "Video wireless HDMI/SDI para rodaje y directos.",
  },
  { slug: "capturadoras", label: "Capturadoras", description: "Captura USB y Thunderbolt para streaming." },
  { slug: "conversores", label: "Conversores SDI↔HDMI", description: "Conversión en tiempo real sin latencia." },
  { slug: "splitters", label: "Splitters", description: "Distribución de señal a múltiples destinos." },
]

export const products: Product[] = [
  // Cámaras
  {
    slug: "blackmagic-ursa-mini-pro-4-6k",
    name: "Blackmagic URSA Mini Pro 4.6K G2",
    brand: "Blackmagic Design",
    category: "camaras",
    categoryLabel: "Cámaras",
    pricePerDay: 180,
    shortDescription: "Cámara de cine digital 4.6K Super 35 con salida 12G-SDI.",
    description:
      "La URSA Mini Pro 4.6K G2 combina rango dinámico de cine con la robustez necesaria para directos. Salida 12G-SDI, grabación en BRAW y ProRes, y perfecta integración con mixers ATEM.",
    specs: [
      { label: "Sensor", value: "Super 35 — 4.6K" },
      { label: "Salida", value: "12G-SDI, HDMI 2.0" },
      { label: "Frame rate", value: "Hasta 120 fps" },
      { label: "Rango dinámico", value: "15 stops" },
    ],
    includes: ["Cuerpo de cámara", "2 baterías V-Mount", "Cargador dual", "Tarjeta CFast 256GB", "Maleta Pelican"],
    image: "/cinema-camera-on-black-background-studio.jpg",
    gallery: ["/cinema-camera-on-black-background-studio.jpg", "/cinema-camera-side-view.jpg"],
    featured: true,
    stock: 4,
  },
  {
    slug: "sony-fx6",
    name: "Sony FX6 Full Frame",
    brand: "Sony",
    category: "camaras",
    categoryLabel: "Cámaras",
    pricePerDay: 220,
    shortDescription: "Cámara de cine full-frame con ND variable y autofocus de IA.",
    description:
      "La FX6 es la cámara de referencia para conciertos y directos. Full-frame, filtros ND variables internos y enfoque automático con tracking.",
    specs: [
      { label: "Sensor", value: "Full Frame 10.2 MP" },
      { label: "ISO dual", value: "800 / 12800" },
      { label: "Salidas", value: "12G-SDI, HDMI 2.0" },
      { label: "Codec", value: "XAVC-I, ProRes RAW" },
    ],
    includes: ["Cuerpo FX6", "Empuñadura XLR", "Visor LCD", "2 baterías BP-U70", "Maleta"],
    image: "/professional-mirrorless-cinema-camera.jpg",
    gallery: ["/professional-mirrorless-cinema-camera.jpg"],
    featured: true,
    stock: 3,
  },
  {
    slug: "panasonic-ptz-aw-ue150",
    name: "Panasonic AW-UE150 PTZ 4K",
    brand: "Panasonic",
    category: "camaras",
    categoryLabel: "Cámaras",
    pricePerDay: 150,
    shortDescription: "Cámara robótica PTZ 4K con control IP para directos multicámara.",
    description: "PTZ de referencia para streaming de conciertos. Salida 12G-SDI, control NDI y IP, zoom 20x.",
    specs: [
      { label: "Resolución", value: "4K 60p" },
      { label: "Zoom", value: "Óptico 20x" },
      { label: "Salidas", value: "12G-SDI, HDMI, NDI|HX" },
      { label: "Control", value: "IP, RS-422" },
    ],
    includes: ["Cámara PTZ", "Mando RC RP150", "Fuente de alimentación", "Soporte techo"],
    image: "/ptz-broadcast-camera-robotic.jpg",
    gallery: ["/ptz-broadcast-camera-robotic.jpg"],
    stock: 6,
  },

  // Lentes
  {
    slug: "sigma-18-35-art",
    name: "Sigma 18-35mm f/1.8 Art",
    brand: "Sigma",
    category: "lentes",
    categoryLabel: "Lentes",
    pricePerDay: 45,
    shortDescription: "Zoom APS-C con apertura constante f/1.8.",
    description: "El zoom de referencia para música en directo con poca luz. Nitidez excepcional en toda la apertura.",
    specs: [
      { label: "Rango focal", value: "18-35mm" },
      { label: "Apertura", value: "f/1.8 constante" },
      { label: "Montura", value: "EF / E / MFT" },
      { label: "Peso", value: "810 g" },
    ],
    includes: ["Lente", "Parasol", "Tapas", "Estuche"],
    image: "/cinema-lens-black-metal-professional.jpg",
    gallery: ["/cinema-lens-black-metal-professional.jpg"],
    stock: 5,
  },
  {
    slug: "canon-cn-e-primes-set",
    name: "Canon CN-E Cine Primes (4 lentes)",
    brand: "Canon",
    category: "lentes",
    categoryLabel: "Lentes",
    pricePerDay: 260,
    shortDescription: "Set de 4 ópticas de cine 24, 35, 50 y 85mm T1.5.",
    description: "Set completo de primos cinematográficos Canon CN-E. Engranajes de focus y apertura idénticos.",
    specs: [
      { label: "Focales", value: "24 / 35 / 50 / 85 mm" },
      { label: "Apertura", value: "T1.5" },
      { label: "Montura", value: "EF" },
      { label: "Cobertura", value: "Super 35" },
    ],
    includes: ["4 ópticas CN-E", "Maleta rígida", "Tapas frontales y traseras"],
    image: "/cinema-prime-lens-set-professional.jpg",
    gallery: ["/cinema-prime-lens-set-professional.jpg"],
    featured: true,
    stock: 2,
  },

  // Mixers
  {
    slug: "atem-mini-extreme-iso",
    name: "Blackmagic ATEM Mini Extreme ISO",
    brand: "Blackmagic Design",
    category: "mixers",
    categoryLabel: "Mixers de vídeo",
    pricePerDay: 90,
    shortDescription: "Mixer 8 entradas HDMI con grabación ISO de todas las fuentes.",
    description:
      "El mixer de directo más versátil del mercado: 8 entradas HDMI, chromakey, streaming directo a YouTube y grabación ISO.",
    specs: [
      { label: "Entradas", value: "8x HDMI" },
      { label: "Salidas", value: "2x HDMI, USB-C webcam" },
      { label: "Streaming", value: "Ethernet directo" },
      { label: "Grabación", value: "ISO de 8 canales" },
    ],
    includes: ["ATEM Mini Extreme ISO", "Fuente de alimentación", "Manual"],
    image: "/video-switcher-mixer-broadcast-buttons.jpg",
    gallery: ["/video-switcher-mixer-broadcast-buttons.jpg"],
    featured: true,
    stock: 3,
  },
  {
    slug: "roland-v-8hd",
    name: "Roland V-8HD",
    brand: "Roland",
    category: "mixers",
    categoryLabel: "Mixers de vídeo",
    pricePerDay: 120,
    shortDescription: "Mixer 8 canales HDMI con panel táctil y efectos.",
    description: "Switcher HDMI 8 canales con operación rápida, perfecto para realización multicámara en conciertos.",
    specs: [
      { label: "Entradas", value: "8x HDMI" },
      { label: "Salidas", value: "3x HDMI (PGM/PVW/AUX)" },
      { label: "Formato", value: "1080p hasta 60Hz" },
      { label: "Efectos", value: "Chromakey, PiP, DSK" },
    ],
    includes: ["V-8HD", "Fuente de alimentación", "Flightcase opcional"],
    image: "/roland-video-mixer-professional.jpg",
    gallery: ["/roland-video-mixer-professional.jpg"],
    stock: 2,
  },

  // Grips
  {
    slug: "easyrig-vario-5",
    name: "Easyrig Vario 5",
    brand: "Easyrig",
    category: "grips",
    categoryLabel: "Grips",
    pricePerDay: 60,
    shortDescription: "Sistema de soporte corporal para cámara en mano.",
    description: "Reduce la fatiga en rodajes largos sosteniendo cámaras de hasta 18kg con movimiento natural.",
    specs: [
      { label: "Carga", value: "5-18 kg" },
      { label: "Peso", value: "4.5 kg" },
      { label: "Ajuste", value: "Tensión variable" },
    ],
    includes: ["Arnés Vario 5", "Gimbal rig opcional", "Bolsa de transporte"],
    image: "/camera-body-rig-support-system.jpg",
    gallery: ["/camera-body-rig-support-system.jpg"],
    stock: 2,
  },

  // Trípodes
  {
    slug: "sachtler-flowtech-75",
    name: "Sachtler FlowTech 75 + Aktiv 8",
    brand: "Sachtler",
    category: "tripodes",
    categoryLabel: "Trípodes",
    pricePerDay: 55,
    shortDescription: "Trípode de despliegue rápido con cabezal fluido Aktiv 8.",
    description: "El trípode más rápido del mercado. Despliegue en segundos y cabezal fluido para cargas hasta 10kg.",
    specs: [
      { label: "Carga", value: "Hasta 10 kg" },
      { label: "Altura", value: "26-153 cm" },
      { label: "Peso", value: "6.2 kg" },
    ],
    includes: ["Trípode FlowTech 75", "Cabezal Aktiv 8", "Pan bar", "Bolsa"],
    image: "/professional-video-tripod-fluid-head.jpg",
    gallery: ["/professional-video-tripod-fluid-head.jpg"],
    stock: 4,
  },

  // Luces profesionales
  {
    slug: "aputure-600d-pro",
    name: "Aputure LS 600d Pro",
    brand: "Aputure",
    category: "luces",
    categoryLabel: "Luces profesionales",
    pricePerDay: 85,
    shortDescription: "LED daylight 600W con soporte Bowens.",
    description: "La luz de referencia para plató y escenario. Potencia de HMI con control inalámbrico.",
    specs: [
      { label: "Potencia", value: "600W COB" },
      { label: "Temperatura", value: "5600K" },
      { label: "CRI/TLCI", value: "96+ / 96+" },
      { label: "Montura", value: "Bowens" },
    ],
    includes: ["Cuerpo 600d Pro", "Control Box", "Reflector", "Cableado", "Maleta rígida"],
    image: "/professional-led-studio-light-cob.jpg",
    gallery: ["/professional-led-studio-light-cob.jpg"],
    featured: true,
    stock: 6,
  },
  {
    slug: "arri-skypanel-s60-c",
    name: "ARRI SkyPanel S60-C",
    brand: "ARRI",
    category: "luces",
    categoryLabel: "Luces profesionales",
    pricePerDay: 180,
    shortDescription: "Panel LED RGBW de alta gama para cine y escenarios.",
    description: "Calidad de luz ARRI con espectro completo RGBW, efectos y control DMX/CRMX.",
    specs: [
      { label: "Tipo", value: "LED RGBW" },
      { label: "Potencia", value: "450W" },
      { label: "Temperatura", value: "2800K-10000K" },
      { label: "Control", value: "DMX, CRMX, Art-Net" },
    ],
    includes: ["Panel S60-C", "Yoke", "Fuente de alimentación", "Vuelo rígido"],
    image: "/arri-skypanel-rgbw-light-professional.jpg",
    gallery: ["/arri-skypanel-rgbw-light-professional.jpg"],
    stock: 2,
  },

  // Cableado
  {
    slug: "cable-sdi-12g-10m",
    name: "Cable SDI 12G — 10m (Canare)",
    brand: "Canare",
    category: "cableado",
    categoryLabel: "Cableado HDMI / SDI",
    pricePerDay: 8,
    shortDescription: "Latiguillo SDI 12G certificado para 4K60.",
    description: "Cable Canare L-5.5CUHD con conectores BNC de precisión. Certificado para señales 12G-SDI.",
    specs: [
      { label: "Longitud", value: "10 metros" },
      { label: "Ancho de banda", value: "12 Gbps" },
      { label: "Conectores", value: "BNC Canare" },
    ],
    includes: ["Cable SDI 10m", "Funda de transporte"],
    image: "/coiled-bnc-sdi-cable-professional.jpg",
    gallery: ["/coiled-bnc-sdi-cable-professional.jpg"],
    stock: 20,
  },
  {
    slug: "cable-hdmi-optico-30m",
    name: "Cable HDMI óptico 2.1 — 30m",
    brand: "Lindy",
    category: "cableado",
    categoryLabel: "Cableado HDMI / SDI",
    pricePerDay: 15,
    shortDescription: "HDMI activo óptico para tiradas largas sin pérdida.",
    description: "Cable HDMI 2.1 con fibra óptica activa. 4K120 y 8K60 sin pérdida a 30 metros.",
    specs: [
      { label: "Longitud", value: "30 metros" },
      { label: "Estándar", value: "HDMI 2.1" },
      { label: "Resolución", value: "8K60 / 4K120" },
    ],
    includes: ["Cable HDMI óptico 30m", "Carrete"],
    image: "/hdmi-cable-coiled-black-professional.jpg",
    gallery: ["/hdmi-cable-coiled-black-professional.jpg"],
    stock: 10,
  },

  // Transmisores
  {
    slug: "teradek-bolt-6-lt-750",
    name: "Teradek Bolt 6 LT 750",
    brand: "Teradek",
    category: "transmisores",
    categoryLabel: "Transmisores inalámbricos",
    pricePerDay: 130,
    shortDescription: "Transmisión HDMI/SDI inalámbrica con latencia cero.",
    description: "El estándar de la industria en video wireless. Hasta 230 metros de alcance sin latencia percibida.",
    specs: [
      { label: "Alcance", value: "230 m LOS" },
      { label: "Latencia", value: "< 1 ms" },
      { label: "Entradas", value: "HDMI + SDI" },
      { label: "Formato", value: "1080p60" },
    ],
    includes: ["TX + RX", "Antenas", "Baterías", "Cableado", "Maleta"],
    image: "/teradek-wireless-video-transmitter.jpg",
    gallery: ["/teradek-wireless-video-transmitter.jpg"],
    featured: true,
    stock: 3,
  },
  {
    slug: "hollyland-mars-400s-pro",
    name: "Hollyland Mars 400S Pro",
    brand: "Hollyland",
    category: "transmisores",
    categoryLabel: "Transmisores inalámbricos",
    pricePerDay: 55,
    shortDescription: "Wireless HDMI/SDI hasta 150m con monitorización móvil.",
    description: "Transmisor inalámbrico asequible y fiable con app para monitorización en smartphone.",
    specs: [
      { label: "Alcance", value: "150 m" },
      { label: "Latencia", value: "0.07 s" },
      { label: "Entradas", value: "HDMI + SDI" },
      { label: "Apps", value: "iOS / Android" },
    ],
    includes: ["TX + RX", "Antenas", "Cables", "Maleta"],
    image: "/hollyland-wireless-video-transmitter-compact.jpg",
    gallery: ["/hollyland-wireless-video-transmitter-compact.jpg"],
    stock: 5,
  },

  // Capturadoras
  {
    slug: "blackmagic-ultrastudio-monitor-3g",
    name: "Blackmagic UltraStudio Monitor 3G",
    brand: "Blackmagic Design",
    category: "capturadoras",
    categoryLabel: "Capturadoras",
    pricePerDay: 35,
    shortDescription: "Capturadora Thunderbolt 3 para streaming profesional.",
    description: "Captura SDI y HDMI por Thunderbolt 3 con cero latencia. Compatible con todos los softwares de stream.",
    specs: [
      { label: "Conexión", value: "Thunderbolt 3" },
      { label: "Entradas", value: "SDI + HDMI" },
      { label: "Formato", value: "Hasta 1080p60" },
    ],
    includes: ["UltraStudio Monitor 3G", "Fuente", "Cable TB3"],
    image: "/video-capture-card-device-black.jpg",
    gallery: ["/video-capture-card-device-black.jpg"],
    stock: 6,
  },
  {
    slug: "elgato-4k60-pro",
    name: "Elgato 4K60 Pro MK.2",
    brand: "Elgato",
    category: "capturadoras",
    categoryLabel: "Capturadoras",
    pricePerDay: 20,
    shortDescription: "Capturadora interna PCIe 4K60 HDR10.",
    description: "Capturadora interna PCIe para capturas 4K60 HDR con latencia ultra baja.",
    specs: [
      { label: "Conexión", value: "PCIe x4" },
      { label: "Formato", value: "4K60 HDR10" },
      { label: "Passthrough", value: "4K60 HDR" },
    ],
    includes: ["Tarjeta 4K60 Pro MK.2", "Cableado"],
    image: "/elgato-capture-card-internal-pcie.jpg",
    gallery: ["/elgato-capture-card-internal-pcie.jpg"],
    stock: 4,
  },

  // Conversores
  {
    slug: "blackmagic-micro-converter-hdmi-sdi",
    name: "Micro Converter HDMI→SDI 3G",
    brand: "Blackmagic Design",
    category: "conversores",
    categoryLabel: "Conversores SDI↔HDMI",
    pricePerDay: 10,
    shortDescription: "Conversor HDMI a SDI compacto con alimentación USB-C.",
    description: "Convierte señal HDMI a SDI en cualquier situación. Alimentación USB-C y formato ultracompacto.",
    specs: [
      { label: "Entrada", value: "HDMI" },
      { label: "Salida", value: "3G-SDI" },
      { label: "Alimentación", value: "USB-C" },
    ],
    includes: ["Micro Converter", "Cable USB-C"],
    image: "/blackmagic-micro-converter-small-device.jpg",
    gallery: ["/blackmagic-micro-converter-small-device.jpg"],
    stock: 15,
  },
  {
    slug: "decimator-md-hx",
    name: "Decimator MD-HX",
    brand: "Decimator",
    category: "conversores",
    categoryLabel: "Conversores SDI↔HDMI",
    pricePerDay: 25,
    shortDescription: "Conversor bidireccional SDI↔HDMI con scaler y cross-conversión.",
    description: "Conversor todo en uno con escalado y cross-conversión entre SDI y HDMI a cualquier formato.",
    specs: [
      { label: "Entradas", value: "SDI + HDMI" },
      { label: "Salidas", value: "SDI + HDMI" },
      { label: "Funciones", value: "Scaler, Cross-conversion" },
    ],
    includes: ["MD-HX", "Fuente de alimentación"],
    image: "/decimator-video-converter-professional.jpg",
    gallery: ["/decimator-video-converter-professional.jpg"],
    stock: 4,
  },

  // Splitters
  {
    slug: "blackmagic-smartview-duo",
    name: "Splitter SDI 1x4 Kramer",
    brand: "Kramer",
    category: "splitters",
    categoryLabel: "Splitters",
    pricePerDay: 18,
    shortDescription: "Distribuidor SDI 1 entrada a 4 salidas reclocked.",
    description: "Splitter SDI profesional con reclocking para mantener la integridad de señal en largas distancias.",
    specs: [
      { label: "Entradas", value: "1x SDI" },
      { label: "Salidas", value: "4x SDI reclocked" },
      { label: "Formatos", value: "SD/HD/3G-SDI" },
    ],
    includes: ["Splitter SDI 1x4", "Fuente de alimentación", "Rack ears"],
    image: "/sdi-splitter-distributor-rack-professional.jpg",
    gallery: ["/sdi-splitter-distributor-rack-professional.jpg"],
    stock: 3,
  },
  {
    slug: "splitter-hdmi-1x8",
    name: "Splitter HDMI 1x8 4K60",
    brand: "Lindy",
    category: "splitters",
    categoryLabel: "Splitters",
    pricePerDay: 22,
    shortDescription: "Distribuidor HDMI 1 entrada a 8 salidas 4K60 HDR.",
    description: "Splitter HDMI 2.0 para distribuir señal 4K60 HDR a 8 pantallas simultáneamente.",
    specs: [
      { label: "Entradas", value: "1x HDMI 2.0" },
      { label: "Salidas", value: "8x HDMI 2.0" },
      { label: "Formato", value: "4K60 4:4:4 HDR" },
    ],
    includes: ["Splitter 1x8", "Fuente", "Cableado"],
    image: "/hdmi-splitter-8-port-professional-rack.jpg",
    gallery: ["/hdmi-splitter-8-port-professional-rack.jpg"],
    stock: 2,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}
