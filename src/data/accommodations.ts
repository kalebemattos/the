export interface AccommodationData {
  id: string;
  name: {
    pt: string;
    en: string;
    es: string;
  };
  tagline: {
    pt: string;
    en: string;
    es: string;
  };
  description: {
    pt: string;
    en: string;
    es: string;
  };
  features: {
    pt: string;
    en: string;
    es: string;
  }[];
  idealFor: {
    pt: string;
    en: string;
    es: string;
  };
  highlight?: {
    pt: string;
    en: string;
    es: string;
  };
  coverImage?: string;
  images: string[];
}

export const accommodations: AccommodationData[] = [
  {
    id: 'casa-101',
    name: {
      pt: 'Casa 101',
      en: 'House 101',
      es: 'Casa 101',
    },
    tagline: {
      pt: 'O Canto do Relaxamento',
      en: 'The Relaxation Corner',
      es: 'El Rincón del Relax',
    },
    description: {
      pt: 'Perfeita para quem quer descansar e se presentear com momentos únicos de conforto e tranquilidade.',
      en: 'Perfect for those who want to rest and treat themselves to unique moments of comfort and tranquility.',
      es: 'Perfecta para quienes desean descansar y regalarse momentos únicos de confort y tranquilidad.',
    },
    features: [
      {
        pt: 'Sala integrada com cozinha americana',
        en: 'Integrated living room with American kitchen',
        es: 'Sala integrada con cocina americana',
      },
      {
        pt: '2 quartos (1 suíte)',
        en: '2 bedrooms (1 suite)',
        es: '2 habitaciones (1 suite)',
      },
      {
        pt: 'Varanda privativa com banheira de hidromassagem',
        en: 'Private balcony with hot tub',
        es: 'Balcón privado con jacuzzi',
      },
      {
        pt: 'Sofá-cama para acomodação extra',
        en: 'Sofa bed for extra accommodation',
        es: 'Sofá cama para alojamiento extra',
      },
      {
        pt: 'Ar-condicionado em todos os quartos',
        en: 'Air conditioning in all rooms',
        es: 'Aire acondicionado en todas las habitaciones',
      },
      {
        pt: 'TV e Alexa integrados',
        en: 'TV and Alexa integrated',
        es: 'TV y Alexa integrados',
      },
      {
        pt: 'Garagem privativa com acesso direto',
        en: 'Private garage with direct access',
        es: 'Garaje privado con acceso directo',
      },
    ],
    idealFor: {
      pt: 'Casais em lua-de-mel, pequenas famílias que buscam um toque de luxo.',
      en: 'Couples on honeymoon, small families seeking a touch of luxury.',
      es: 'Parejas en luna de miel, familias pequeñas que buscan un toque de lujo.',
    },
    highlight: {
      pt: 'Banheira de Hidromassagem',
      en: 'Hot Tub',
      es: 'Jacuzzi',
    },
    images: [],
  },
  {
    id: 'casa-102',
    name: {
      pt: 'Casa 102',
      en: 'House 102',
      es: 'Casa 102',
    },
    tagline: {
      pt: 'Piscina Privativa para Curtir o Dia Todo',
      en: 'Private Pool to Enjoy All Day',
      es: 'Piscina Privada para Disfrutar Todo el Día',
    },
    description: {
      pt: 'Mesma planta elegante da Casa 101, com um diferencial irresistível: sua própria piscina privativa.',
      en: 'Same elegant layout as House 101, with an irresistible feature: your own private pool.',
      es: 'Misma planta elegante que la Casa 101, con un diferencial irresistible: su propia piscina privada.',
    },
    features: [
      {
        pt: 'Piscina redonda privativa com pontos de hidromassagem',
        en: 'Private round pool with hydromassage jets',
        es: 'Piscina redonda privada con puntos de hidromasaje',
      },
      {
        pt: 'Sala + cozinha integradas',
        en: 'Integrated living room + kitchen',
        es: 'Sala + cocina integradas',
      },
      {
        pt: '2 quartos confortáveis',
        en: '2 comfortable bedrooms',
        es: '2 habitaciones confortables',
      },
      {
        pt: 'Sofá-cama para acomodação extra',
        en: 'Sofa bed for extra accommodation',
        es: 'Sofá cama para alojamiento extra',
      },
      {
        pt: 'Ar-condicionado, TV e Alexa',
        en: 'Air conditioning, TV and Alexa',
        es: 'Aire acondicionado, TV y Alexa',
      },
      {
        pt: 'Garagem privativa com acesso direto',
        en: 'Private garage with direct access',
        es: 'Garaje privado con acceso directo',
      },
    ],
    idealFor: {
      pt: 'Quem deseja privacidade e diversão sem sair da casa.',
      en: 'Those who want privacy and fun without leaving home.',
      es: 'Quienes desean privacidad y diversión sin salir de casa.',
    },
    highlight: {
      pt: 'Piscina Privativa',
      en: 'Private Pool',
      es: 'Piscina Privada',
    },
    images: [],
  },
  {
    id: 'casa-201',
    name: {
      pt: 'Casa 201',
      en: 'House 201',
      es: 'Casa 201',
    },
    tagline: {
      pt: 'Tranquilidade no Piso Superior',
      en: 'Tranquility on the Upper Floor',
      es: 'Tranquilidad en el Piso Superior',
    },
    description: {
      pt: 'Conforto e privacidade em um ambiente mais elevado, ideal para quem valoriza o sossego.',
      en: 'Comfort and privacy in a higher setting, ideal for those who value peace.',
      es: 'Confort y privacidad en un ambiente más elevado, ideal para quienes valoran la tranquilidad.',
    },
    features: [
      {
        pt: 'Sala-cozinha americana integrada',
        en: 'Integrated American kitchen-living room',
        es: 'Sala-cocina americana integrada',
      },
      {
        pt: '2 quartos espaçosos',
        en: '2 spacious bedrooms',
        es: '2 habitaciones espaciosas',
      },
      {
        pt: 'Sacada privativa com vista',
        en: 'Private balcony with view',
        es: 'Balcón privado con vista',
      },
      {
        pt: 'Ar-condicionado, TV e Alexa',
        en: 'Air conditioning, TV and Alexa',
        es: 'Aire acondicionado, TV y Alexa',
      },
      {
        pt: 'Garagem privativa com acesso direto',
        en: 'Private garage with direct access',
        es: 'Garaje privado con acceso directo',
      },
    ],
    idealFor: {
      pt: 'Quem busca sossego, trabalho remoto ou um ambiente mais tranquilo.',
      en: 'Those seeking peace, remote work or a quieter environment.',
      es: 'Quienes buscan tranquilidad, trabajo remoto o un ambiente más tranquilo.',
    },
    images: [],
  },
  {
    id: 'casa-202',
    name: {
      pt: 'Casa 202',
      en: 'House 202',
      es: 'Casa 202',
    },
    tagline: {
      pt: 'Conforto e Calmaria no Andar Superior',
      en: 'Comfort and Calm on the Upper Floor',
      es: 'Confort y Calma en el Piso Superior',
    },
    description: {
      pt: 'Mesma proposta elegante da Casa 201, oferecendo paz e privacidade para uma estadia inesquecível.',
      en: 'Same elegant concept as House 201, offering peace and privacy for an unforgettable stay.',
      es: 'Misma propuesta elegante que la Casa 201, ofreciendo paz y privacidad para una estadía inolvidable.',
    },
    features: [
      {
        pt: 'Sala integrada com cozinha',
        en: 'Integrated living room with kitchen',
        es: 'Sala integrada con cocina',
      },
      {
        pt: '2 quartos confortáveis',
        en: '2 comfortable bedrooms',
        es: '2 habitaciones confortables',
      },
      {
        pt: 'Sacada privativa',
        en: 'Private balcony',
        es: 'Balcón privado',
      },
      {
        pt: 'Ar-condicionado, TV e Alexa',
        en: 'Air conditioning, TV and Alexa',
        es: 'Aire acondicionado, TV y Alexa',
      },
      {
        pt: 'Garagem privativa com acesso direto',
        en: 'Private garage with direct access',
        es: 'Garaje privado con acceso directo',
      },
    ],
    idealFor: {
      pt: 'Hóspedes que valorizam silêncio e privacidade.',
      en: 'Guests who value silence and privacy.',
      es: 'Huéspedes que valoran el silencio y la privacidad.',
    },
    images: [],
  },
];
