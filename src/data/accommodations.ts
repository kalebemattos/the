export interface AccommodationData {
  id: string;
  name: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  tagline: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  description: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  features: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  }[];
  idealFor: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  highlight?: {
    pt: string;
    en: string;
    es: string;
    fr: string;
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
      fr: 'Maison 101',
    },
    tagline: {
      pt: 'O Canto do Relaxamento',
      en: 'The Relaxation Corner',
      es: 'El Rincón del Relax',
      fr: 'Le Coin de la Détente',
    },
    description: {
      pt: 'Perfeita para quem quer descansar e se presentear com momentos únicos de conforto e tranquilidade.',
      en: 'Perfect for those who want to rest and treat themselves to unique moments of comfort and tranquility.',
      es: 'Perfecta para quienes desean descansar y regalarse momentos únicos de confort y tranquilidad.',
      fr: 'Parfaite pour ceux qui veulent se reposer et s\'offrir des moments uniques de confort et de tranquillité.',
    },
    features: [
      {
        pt: 'Sala integrada com cozinha americana',
        en: 'Integrated living room with American kitchen',
        es: 'Sala integrada con cocina americana',
        fr: 'Salon intégré avec cuisine américaine',
      },
      {
        pt: '2 quartos (1 suíte)',
        en: '2 bedrooms (1 suite)',
        es: '2 habitaciones (1 suite)',
        fr: '2 chambres (1 suite)',
      },
      {
        pt: 'Varanda privativa com banheira de hidromassagem',
        en: 'Private balcony with hot tub',
        es: 'Balcón privado con jacuzzi',
        fr: 'Balcon privé avec jacuzzi',
      },
      {
        pt: 'Sofá-cama para acomodação extra',
        en: 'Sofa bed for extra accommodation',
        es: 'Sofá cama para alojamiento extra',
        fr: 'Canapé-lit pour hébergement supplémentaire',
      },
      {
        pt: 'Ar-condicionado em todos os quartos',
        en: 'Air conditioning in all rooms',
        es: 'Aire acondicionado en todas las habitaciones',
        fr: 'Climatisation dans toutes les chambres',
      },
      {
        pt: 'TV e Alexa integrados',
        en: 'TV and Alexa integrated',
        es: 'TV y Alexa integrados',
        fr: 'TV et Alexa intégrés',
      },
      {
        pt: 'Garagem privativa com acesso direto',
        en: 'Private garage with direct access',
        es: 'Garaje privado con acceso directo',
        fr: 'Garage privé avec accès direct',
      },
    ],
    idealFor: {
      pt: 'Casais em lua-de-mel, pequenas famílias que buscam um toque de luxo.',
      en: 'Couples on honeymoon, small families seeking a touch of luxury.',
      es: 'Parejas en luna de miel, familias pequeñas que buscan un toque de lujo.',
      fr: 'Couples en lune de miel, petites familles recherchant une touche de luxe.',
    },
    highlight: {
      pt: 'Banheira de Hidromassagem',
      en: 'Hot Tub',
      es: 'Jacuzzi',
      fr: 'Jacuzzi',
    },
    images: [],
  },
  {
    id: 'casa-102',
    name: {
      pt: 'Casa 102',
      en: 'House 102',
      es: 'Casa 102',
      fr: 'Maison 102',
    },
    tagline: {
      pt: 'Piscina Privativa para Curtir o Dia Todo',
      en: 'Private Pool to Enjoy All Day',
      es: 'Piscina Privada para Disfrutar Todo el Día',
      fr: 'Piscine Privée pour Profiter Toute la Journée',
    },
    description: {
      pt: 'Mesma planta elegante da Casa 101, com um diferencial irresistível: sua própria piscina privativa.',
      en: 'Same elegant layout as House 101, with an irresistible feature: your own private pool.',
      es: 'Misma planta elegante que la Casa 101, con un diferencial irresistible: su propia piscina privada.',
      fr: 'Même plan élégant que la Maison 101, avec un atout irrésistible : votre propre piscine privée.',
    },
    features: [
      {
        pt: 'Piscina redonda privativa com pontos de hidromassagem',
        en: 'Private round pool with hydromassage jets',
        es: 'Piscina redonda privada con puntos de hidromasaje',
        fr: 'Piscine ronde privée avec jets d\'hydromassage',
      },
      {
        pt: 'Sala + cozinha integradas',
        en: 'Integrated living room + kitchen',
        es: 'Sala + cocina integradas',
        fr: 'Salon + cuisine intégrés',
      },
      {
        pt: '2 quartos confortáveis',
        en: '2 comfortable bedrooms',
        es: '2 habitaciones confortables',
        fr: '2 chambres confortables',
      },
      {
        pt: 'Sofá-cama para acomodação extra',
        en: 'Sofa bed for extra accommodation',
        es: 'Sofá cama para alojamiento extra',
        fr: 'Canapé-lit pour hébergement supplémentaire',
      },
      {
        pt: 'Ar-condicionado, TV e Alexa',
        en: 'Air conditioning, TV and Alexa',
        es: 'Aire acondicionado, TV y Alexa',
        fr: 'Climatisation, TV et Alexa',
      },
      {
        pt: 'Garagem privativa com acesso direto',
        en: 'Private garage with direct access',
        es: 'Garaje privado con acceso directo',
        fr: 'Garage privé avec accès direct',
      },
    ],
    idealFor: {
      pt: 'Quem deseja privacidade e diversão sem sair da casa.',
      en: 'Those who want privacy and fun without leaving home.',
      es: 'Quienes desean privacidad y diversión sin salir de casa.',
      fr: 'Ceux qui veulent intimité et divertissement sans quitter la maison.',
    },
    highlight: {
      pt: 'Piscina Privativa',
      en: 'Private Pool',
      es: 'Piscina Privada',
      fr: 'Piscine Privée',
    },
    images: [],
  },
  {
    id: 'casa-201',
    name: {
      pt: 'Casa 201',
      en: 'House 201',
      es: 'Casa 201',
      fr: 'Maison 201',
    },
    tagline: {
      pt: 'Tranquilidade no Piso Superior',
      en: 'Tranquility on the Upper Floor',
      es: 'Tranquilidad en el Piso Superior',
      fr: 'Tranquillité à l\'Étage Supérieur',
    },
    description: {
      pt: 'Conforto e privacidade em um ambiente mais elevado, ideal para quem valoriza o sossego.',
      en: 'Comfort and privacy in a higher setting, ideal for those who value peace.',
      es: 'Confort y privacidad en un ambiente más elevado, ideal para quienes valoran la tranquilidad.',
      fr: 'Confort et intimité dans un cadre en hauteur, idéal pour ceux qui apprécient le calme.',
    },
    features: [
      {
        pt: 'Sala-cozinha americana integrada',
        en: 'Integrated American kitchen-living room',
        es: 'Sala-cocina americana integrada',
        fr: 'Salon-cuisine américaine intégré',
      },
      {
        pt: '2 quartos espaçosos',
        en: '2 spacious bedrooms',
        es: '2 habitaciones espaciosas',
        fr: '2 chambres spacieuses',
      },
      {
        pt: 'Sacada privativa com vista',
        en: 'Private balcony with view',
        es: 'Balcón privado con vista',
        fr: 'Balcon privé avec vue',
      },
      {
        pt: 'Ar-condicionado, TV e Alexa',
        en: 'Air conditioning, TV and Alexa',
        es: 'Aire acondicionado, TV y Alexa',
        fr: 'Climatisation, TV et Alexa',
      },
      {
        pt: 'Garagem privativa com acesso direto',
        en: 'Private garage with direct access',
        es: 'Garaje privado con acceso directo',
        fr: 'Garage privé avec accès direct',
      },
    ],
    idealFor: {
      pt: 'Quem busca sossego, trabalho remoto ou um ambiente mais tranquilo.',
      en: 'Those seeking peace, remote work or a quieter environment.',
      es: 'Quienes buscan tranquilidad, trabajo remoto o un ambiente más tranquilo.',
      fr: 'Ceux qui recherchent le calme, le télétravail ou un environnement plus paisible.',
    },
    images: [],
  },
  {
    id: 'casa-202',
    name: {
      pt: 'Casa 202',
      en: 'House 202',
      es: 'Casa 202',
      fr: 'Maison 202',
    },
    tagline: {
      pt: 'Conforto e Calmaria no Andar Superior',
      en: 'Comfort and Calm on the Upper Floor',
      es: 'Confort y Calma en el Piso Superior',
      fr: 'Confort et Sérénité à l\'Étage Supérieur',
    },
    description: {
      pt: 'Mesma proposta elegante da Casa 201, oferecendo paz e privacidade para uma estadia inesquecível.',
      en: 'Same elegant concept as House 201, offering peace and privacy for an unforgettable stay.',
      es: 'Misma propuesta elegante que la Casa 201, ofreciendo paz y privacidad para una estadía inolvidable.',
      fr: 'Même concept élégant que la Maison 201, offrant paix et intimité pour un séjour inoubliable.',
    },
    features: [
      {
        pt: 'Sala integrada com cozinha',
        en: 'Integrated living room with kitchen',
        es: 'Sala integrada con cocina',
        fr: 'Salon intégré avec cuisine',
      },
      {
        pt: '2 quartos confortáveis',
        en: '2 comfortable bedrooms',
        es: '2 habitaciones confortables',
        fr: '2 chambres confortables',
      },
      {
        pt: 'Sacada privativa',
        en: 'Private balcony',
        es: 'Balcón privado',
        fr: 'Balcon privé',
      },
      {
        pt: 'Ar-condicionado, TV e Alexa',
        en: 'Air conditioning, TV and Alexa',
        es: 'Aire acondicionado, TV y Alexa',
        fr: 'Climatisation, TV et Alexa',
      },
      {
        pt: 'Garagem privativa com acesso direto',
        en: 'Private garage with direct access',
        es: 'Garaje privado con acceso directo',
        fr: 'Garage privé avec accès direct',
      },
    ],
    idealFor: {
      pt: 'Hóspedes que valorizam silêncio e privacidade.',
      en: 'Guests who value silence and privacy.',
      es: 'Huéspedes que valoran el silencio y la privacidad.',
      fr: 'Clients qui apprécient le silence et l\'intimité.',
    },
    images: [],
  },
];
