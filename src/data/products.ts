import heroAgroBeninImg from '../assets/images/hero_agro_benin_1794808639672.jpg';
import kariteBrutImg from '../assets/images/prod_karite_bohicon_1794773118295.jpg';
import cajouBeninImg from '../assets/images/prod_cajou_bohicon_1794773118979.jpg';
import mielBaobabImg from '../assets/images/prod_miel_dantokpa_1794773120249.jpg';
import huilePalmeImg from '../assets/images/prod_huile_palme_benin_1794808639271.jpg';
import sojaNonOgmImg from '../assets/images/prod_soja_mais_benin_1794808640310.jpg';
import ananasGingembreImg from '../assets/images/prod_ananas_gingembre_benin_1794808640650.jpg';
import mais100kgImg from '../assets/images/prod_mais_100kg_benin_1794809786846.jpg';
import cafeBeninImg from '../assets/images/prod_cafe_benin_1794809787951.jpg';
import cacaoBeninImg from '../assets/images/prod_cacao_benin_1794809787218.jpg';
import rizEtuveImg from '../assets/images/prod_riz_etuve_benin_1794811066587.jpg';
import arachideBeninImg from '../assets/images/prod_arachide_benin_1794811067121.jpg';
import niebeBeninImg from '../assets/images/prod_niebe_benin_1794811067265.jpg';

/**
 * GUIDE RAPIDE POUR UTILISER VOS PROPRES PHOTOS RÉELLES :
 * 1. Placez vos photos dans `public/images/produits/` (format .jpg ou .webp).
 * 2. Remplacez la valeur `image:` ci-dessous par `'/images/produits/nom-photo.jpg'`.
 */

export type AgroCategory =
  | 'oleagineux'
  | 'cajou'
  | 'cereales'
  | 'cafe-cacao'
  | 'fruits';

export interface PackOption {
  id: string;
  label: string;
  tierLabel: 'Détail' | 'Demi-gros' | 'Gros';
  priceFcfa: number;
  unitMeasure: string;
  weightKg: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  category: AgroCategory;
  categoryLabel: string;
  originLabel: string;
  gradeLabel: string;
  technicalSpecs: {
    purityOrCaliber: string;
    moistureMax: string;
    harvestType: string;
    availableVolume: string;
    minBulkOrder: string;
  };
  image: string;
  defaultPackId?: string;
  packs: PackOption[];
  highlights: string[];
}

export const HERO_AGRO_IMAGE = heroAgroBeninImg;

export const AGRO_PRODUCTS: Product[] = [
  {
    id: 'sac-mais-100kg-benin',
    slug: 'sac-mais-100kg-benin',
    sku: 'KMR-CER-007',
    name: 'Sac de Maïs Jaune & Blanc 100 kg',
    shortDescription:
      'Maïs grain sec bien trié et vanné, conditionné en sac de 100 kg à 15 000 FCFA.',
    description:
      'Maïs grain tropical cultivé au Bénin, séché au soleil puis vanné mécaniquement pour garantir des grains sains sans charançons ni débris. Disponible en sac standard de 100 kg pour les ménages, élevages, provenderies et transformateurs agroalimentaires.',
    category: 'cereales',
    categoryLabel: 'Céréales & Graines',
    originLabel: 'Origine Bénin · Grade A',
    gradeLabel: 'Grain sec trié · Sac 100 kg',
    technicalSpecs: {
      purityOrCaliber: 'Grains sains > 98 % · Zéro charançon',
      moistureMax: 'Humidité < 12,5 %',
      harvestType: 'Séchage naturel & vannage mécanique',
      availableVolume: '25 tonnes disponibles',
      minBulkOrder: 'Sac 100 kg à 15 000 FCFA · Tarifs par tonne',
    },
    image: mais100kgImg,
    defaultPackId: 'mais-100kg',
    packs: [
      {
        id: 'mais-25kg',
        label: 'Sac 25 kg',
        tierLabel: 'Détail',
        priceFcfa: 4250,
        unitMeasure: '25 kg (170 FCFA/kg)',
        weightKg: 25,
      },
      {
        id: 'mais-50kg',
        label: 'Sac 50 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 8000,
        unitMeasure: '50 kg (160 FCFA/kg)',
        weightKg: 50,
      },
      {
        id: 'mais-100kg',
        label: 'Sac 100 kg',
        tierLabel: 'Gros',
        priceFcfa: 15000,
        unitMeasure: '100 kg (150 FCFA/kg)',
        weightKg: 100,
      },
    ],
    highlights: [
      'Pesée exacte 100 kg net vérifiée au chargement',
      'Taux d’humidité maîtrisé pour stockage longue durée',
      'Adapté à la mouture, l’alimentation animale et la revente',
    ],
  },
  {
    id: 'cafe-benin',
    slug: 'cafe-benin',
    sku: 'KMR-CAC-008',
    name: 'Café du Bénin (Vert & Torréfié)',
    shortDescription:
      'Grains de café sélectionnés, disponibles en vert pour torréfaction ou en grains torréfiés.',
    description:
      'Café de caractère issu des terroirs tropicaux du Bénin, récolté à pleine maturité des cerises et séché sur claies. Notes boisées et cacaotées franches, proposé en sachets hermétiques pour consommation directe ou en sacs de 25 kg pour torréfacteurs et grossistes.',
    category: 'cafe-cacao',
    categoryLabel: 'Café & Cacao',
    originLabel: 'Origine Bénin · Grains entiers',
    gradeLabel: 'Récolte sélective · Arôme intense',
    technicalSpecs: {
      purityOrCaliber: 'Triage manuel · Défauts < 2 %',
      moistureMax: 'Humidité café vert < 11 %',
      harvestType: 'Cueillette mûre & séchage sur claies',
      availableVolume: '1 400 kg disponibles',
      minBulkOrder: 'Sac jute doublé 25 kg',
    },
    image: cafeBeninImg,
    packs: [
      {
        id: 'cafe-500g',
        label: 'Sachet 500 g',
        tierLabel: 'Détail',
        priceFcfa: 3800,
        unitMeasure: '500 g grains torréfiés',
        weightKg: 0.5,
      },
      {
        id: 'cafe-5kg',
        label: 'Lot 5 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 32500,
        unitMeasure: '5 kg (6 500 FCFA/kg)',
        weightKg: 5,
      },
      {
        id: 'cafe-25kg',
        label: 'Sac 25 kg',
        tierLabel: 'Gros',
        priceFcfa: 137500,
        unitMeasure: '25 kg café vert (5 500 FCFA/kg)',
        weightKg: 25,
      },
    ],
    highlights: [
      'Choix entre café torréfié prêt à moudre ou café vert brut',
      'Sachet zip avec valve fraîcheur sur les petits formats',
      'Traçabilité complète du lot jusqu’au champ',
    ],
  },
  {
    id: 'feves-cacao-benin',
    slug: 'feves-cacao-benin',
    sku: 'KMR-CAC-009',
    name: 'Fèves de Cacao Fermentées & Séchées',
    shortDescription:
      'Fèves brunes bien fermentées à forte teneur en beurre de cacao, prêtes pour transformation.',
    description:
      'Fèves de cacao issues des plantations tropicales du Bénin, fermentées 6 jours en caisses puis séchées lentement au soleil pour développer un bouquet aromatique rond sans acidité excessive. Idéal pour chocolaterie artisanale, poudre de cacao et négoce.',
    category: 'cafe-cacao',
    categoryLabel: 'Café & Cacao',
    originLabel: 'Origine Bénin · Grade I',
    gradeLabel: 'Fermentation 6 jours · Séchage soleil',
    technicalSpecs: {
      purityOrCaliber: 'Grainage ~95 fèves / 100 g',
      moistureMax: 'Humidité < 7,5 %',
      harvestType: 'Fermentation caisses & séchage naturel',
      availableVolume: '4 500 kg disponibles',
      minBulkOrder: 'Sac jute export 50 kg',
    },
    image: cacaoBeninImg,
    packs: [
      {
        id: 'cacao-1kg',
        label: 'Sachet 1 kg',
        tierLabel: 'Détail',
        priceFcfa: 4200,
        unitMeasure: '1 kg fèves entières',
        weightKg: 1,
      },
      {
        id: 'cacao-10kg',
        label: 'Sac 10 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 38000,
        unitMeasure: '10 kg (3 800 FCFA/kg)',
        weightKg: 10,
      },
      {
        id: 'cacao-50kg',
        label: 'Sac jute 50 kg',
        tierLabel: 'Gros',
        priceFcfa: 170000,
        unitMeasure: '50 kg (3 400 FCFA/kg)',
        weightKg: 50,
      },
    ],
    highlights: [
      'Test à la coupe > 85 % de fèves entièrement brunes',
      'Absence d’odeur de fumée ou de moisissure',
      'Ensachage en toile de jute respirante pour le gros',
    ],
  },
  {
    id: 'karite-brut-benin',
    slug: 'karite-brut-benin',
    sku: 'KMR-OLE-001',
    name: 'Beurre de Karité Brut Non Raffiné',
    shortDescription:
      'Amandes sauvages barattées à froid, qualité cosmétique et alimentaire.',
    description:
      'Beurre de karité 100 % pur extrait de noix récoltées dans les parcs arborés du Bénin. Texture souple couleur ivoire naturelle, riche en insaponifiables, prêt pour le conditionnement cosmétique ou l’usage artisanal.',
    category: 'oleagineux',
    categoryLabel: 'Oléagineux & Karité',
    originLabel: 'Origine Bénin · Grade A',
    gradeLabel: 'Brut · Pression à froid',
    technicalSpecs: {
      purityOrCaliber: 'Pureté 99,5 % sans solvant',
      moistureMax: 'Humidité < 0,5 %',
      harvestType: 'Cueillette sauvage naturelle',
      availableVolume: '1 800 kg disponibles',
      minBulkOrder: 'Carton 25 kg dès 1 650 FCFA/kg',
    },
    image: kariteBrutImg,
    packs: [
      {
        id: 'karite-1kg',
        label: 'Pot / Seau 1 kg',
        tierLabel: 'Détail',
        priceFcfa: 2500,
        unitMeasure: '1 kg net',
        weightKg: 1,
      },
      {
        id: 'karite-5kg',
        label: 'Seau 5 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 10500,
        unitMeasure: '5 kg (2 100 FCFA/kg)',
        weightKg: 5,
      },
      {
        id: 'karite-25kg',
        label: 'Carton 25 kg',
        tierLabel: 'Gros',
        priceFcfa: 41250,
        unitMeasure: '25 kg (1 650 FCFA/kg)',
        weightKg: 25,
      },
    ],
    highlights: [
      'Aucun blanchiment ni désodorisation chimique',
      'Indice d’acidité contrôlé par lot',
      'Conditionnement hermétique alimentaire ou cosmétique',
    ],
  },
  {
    id: 'cajou-w240-benin',
    slug: 'cajou-w240-benin',
    sku: 'KMR-CAJ-002',
    name: 'Amandes de Cajou Tropicales W240',
    shortDescription:
      'Amandes blanches entières décortiquées et torréfiées, croquant net.',
    description:
      'Anacardes issues des vergers béninois, décortiquées à la vapeur pour préserver l’intégrité de l’amande entière W240. Disponibles nature ou légèrement grillées, conditionnées sous protection contre l’humidité.',
    category: 'cajou',
    categoryLabel: 'Cajou & Amandes',
    originLabel: 'Origine Bénin · Calibre W240',
    gradeLabel: 'Amande entière premium',
    technicalSpecs: {
      purityOrCaliber: 'Calibre W240 (> 95 % entières)',
      moistureMax: 'Humidité < 4,5 %',
      harvestType: 'Récolte de saison sèche',
      availableVolume: '2 400 kg disponibles',
      minBulkOrder: 'Carton sous vide 10 kg',
    },
    image: cajouBeninImg,
    packs: [
      {
        id: 'cajou-500g',
        label: 'Sachet 500 g',
        tierLabel: 'Détail',
        priceFcfa: 3500,
        unitMeasure: '500 g net',
        weightKg: 0.5,
      },
      {
        id: 'cajou-2kg',
        label: 'Lot 2 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 12800,
        unitMeasure: '2 kg (6 400 FCFA/kg)',
        weightKg: 2,
      },
      {
        id: 'cajou-10kg',
        label: 'Carton 10 kg',
        tierLabel: 'Gros',
        priceFcfa: 58000,
        unitMeasure: '10 kg sous vide',
        weightKg: 10,
      },
    ],
    highlights: [
      'Tri optique et calibrage homogène W240',
      'Zéro conservateur ni huile ajoutée',
      'Conditionnement sous vide pour longue conservation',
    ],
  },
  {
    id: 'huile-palme-rouge-benin',
    slug: 'huile-palme-rouge-benin',
    sku: 'KMR-OLE-003',
    name: 'Huile de Palme Rouge Artisanale',
    shortDescription:
      'Huile rouge vierge extraite de noix mûres, riche en bêta-carotène.',
    description:
      'Huile végétale rouge obtenue par pressage traditionnel maîtrisé de pulpe fraîche de palmier à huile du Bénin. Couleur rouge rubis franche, décantée et filtrée sans additif ni mélange.',
    category: 'oleagineux',
    categoryLabel: 'Oléagineux & Karité',
    originLabel: 'Origine Bénin · Vierge',
    gradeLabel: 'Première pression décantée',
    technicalSpecs: {
      purityOrCaliber: '100 % pulpe de palme pure',
      moistureMax: 'Impuretés < 0,2 %',
      harvestType: 'Extraction artisanale filtrée',
      availableVolume: '3 200 L disponibles',
      minBulkOrder: 'Bidon 25 L prêt pour négoce',
    },
    image: huilePalmeImg,
    packs: [
      {
        id: 'palme-1l',
        label: 'Bouteille 1 L',
        tierLabel: 'Détail',
        priceFcfa: 1600,
        unitMeasure: '1 litre net',
        weightKg: 1,
      },
      {
        id: 'palme-5l',
        label: 'Bidon 5 L',
        tierLabel: 'Demi-gros',
        priceFcfa: 7500,
        unitMeasure: '5 litres (1 500 FCFA/L)',
        weightKg: 5,
      },
      {
        id: 'palme-25l',
        label: 'Bidon 25 L',
        tierLabel: 'Gros',
        priceFcfa: 33750,
        unitMeasure: '25 litres (1 350 FCFA/L)',
        weightKg: 25,
      },
    ],
    highlights: [
      'Filtrage fin limitant tout dépôt de fond',
      'Arôme franc et tenue thermique élevée en cuisson',
      'Bidons scellés adaptés au transport longue distance',
    ],
  },
  {
    id: 'soja-jaune-tri-benin',
    slug: 'soja-jaune-tri-benin',
    sku: 'KMR-CER-004',
    name: 'Soja Jaune Non-OGM Trié',
    shortDescription:
      'Graines propres à haute teneur protéique pour transformation et fromage.',
    description:
      'Soja grain jaune cultivé au Bénin sans organisme génétiquement modifié, nettoyé mécaniquement pour éliminer cailloux et brisures. Idéal pour la production de fromage de soja, lait végétal, farine enrichie ou provende.',
    category: 'cereales',
    categoryLabel: 'Céréales & Graines',
    originLabel: 'Origine Bénin · Non-OGM',
    gradeLabel: 'Trié propre · Taux protéine 38 %',
    technicalSpecs: {
      purityOrCaliber: 'Grains entiers propres > 98 %',
      moistureMax: 'Humidité < 10 %',
      harvestType: 'Culture conventionnelle tracée',
      availableVolume: '12 tonnes disponibles',
      minBulkOrder: 'Sac 50 kg / 100 kg',
    },
    image: sojaNonOgmImg,
    packs: [
      {
        id: 'soja-5kg',
        label: 'Sac 5 kg',
        tierLabel: 'Détail',
        priceFcfa: 2750,
        unitMeasure: '5 kg (550 FCFA/kg)',
        weightKg: 5,
      },
      {
        id: 'soja-25kg',
        label: 'Sac 25 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 12000,
        unitMeasure: '25 kg (480 FCFA/kg)',
        weightKg: 25,
      },
      {
        id: 'soja-100kg',
        label: 'Sac 100 kg',
        tierLabel: 'Gros',
        priceFcfa: 44000,
        unitMeasure: '100 kg (440 FCFA/kg)',
        weightKg: 100,
      },
    ],
    highlights: [
      'Taux de protéines élevé (37–39 % sur matière sèche)',
      'Nettoyage mécanique double tamis avant ensachage',
      'Tarifs dégressifs disponibles à la tonne sur devis',
    ],
  },
  {
    id: 'miel-baobab-benin',
    slug: 'miel-baobab-benin',
    sku: 'KMR-FRU-005',
    name: 'Miel Sauvage & Poudre de Baobab',
    shortDescription:
      'Miel polyfloral brut non chauffé et pulpe sèche de pain de singe.',
    description:
      'Association de deux trésors nutritionnels des savanes tropicales du Bénin : un miel brut récolté en ruche traditionnelle et une poudre fine de pulpe de baobab tamisée à froid, naturellement riche en vitamine C et fibres.',
    category: 'fruits',
    categoryLabel: 'Fruits, Miel & Épices',
    originLabel: 'Origine Bénin · Brut',
    gradeLabel: 'Non chauffé · Tamisé fin',
    technicalSpecs: {
      purityOrCaliber: '100 % naturel sans sucre ajouté',
      moistureMax: 'Miel < 18 % · Baobab < 6 %',
      harvestType: 'Apiculture & cueillette durable',
      availableVolume: '650 kg disponibles',
      minBulkOrder: 'Lots de 10 kg en seaux alimentaires',
    },
    image: mielBaobabImg,
    packs: [
      {
        id: 'miel-duo-430g',
        label: 'Duo Bocaux 430 g',
        tierLabel: 'Détail',
        priceFcfa: 6500,
        unitMeasure: 'Miel 250 g + Baobab 180 g',
        weightKg: 0.43,
      },
      {
        id: 'miel-2kg',
        label: 'Pack Pro 2 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 18500,
        unitMeasure: '1 kg Miel + 1 kg Baobab',
        weightKg: 2,
      },
      {
        id: 'miel-10kg',
        label: 'Lot Vrac 10 kg',
        tierLabel: 'Gros',
        priceFcfa: 79000,
        unitMeasure: '5 kg Miel + 5 kg Baobab',
        weightKg: 10,
      },
    ],
    highlights: [
      'Miel garanti pur, non chauffé et non dilué',
      'Pulpe de baobab 100 % issue du fruit sec décortiqué',
      'Adapté aux unités de transformation jus et nutrition',
    ],
  },
  {
    id: 'ananas-gingembre-seches-benin',
    slug: 'ananas-gingembre-seches-benin',
    sku: 'KMR-FRU-006',
    name: 'Ananas Pain de Sucre & Gingembre Séchés',
    shortDescription:
      'Tranches d’ananas doux et lamelles de gingembre piquant déshydratés.',
    description:
      'Fruits tropicaux récoltés à pleine maturité au Bénin puis déshydratés à basse température pour concentrer sucres naturels, arômes et principes actifs du gingembre. Idéal pour infusions, snacking sain et biscuiterie.',
    category: 'fruits',
    categoryLabel: 'Fruits, Miel & Épices',
    originLabel: 'Origine Bénin · Séchage doux',
    gradeLabel: 'Sans sucre ajouté · Sans sulfites',
    technicalSpecs: {
      purityOrCaliber: '100 % fruit et rhizome séchés',
      moistureMax: 'Humidité résiduelle < 8 %',
      harvestType: 'Séchage solaire / gaz contrôlé',
      availableVolume: '900 kg disponibles',
      minBulkOrder: 'Carton 5 kg ou 15 kg',
    },
    image: ananasGingembreImg,
    packs: [
      {
        id: 'ananas-340g',
        label: 'Duo Bocaux 340 g',
        tierLabel: 'Détail',
        priceFcfa: 4500,
        unitMeasure: '180 g Ananas + 160 g Gingembre',
        weightKg: 0.34,
      },
      {
        id: 'ananas-2kg',
        label: 'Sachets Pro 2 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 19000,
        unitMeasure: '1 kg Ananas + 1 kg Gingembre',
        weightKg: 2,
      },
      {
        id: 'ananas-10kg',
        label: 'Carton 10 kg',
        tierLabel: 'Gros',
        priceFcfa: 82000,
        unitMeasure: '5 kg Ananas + 5 kg Gingembre',
        weightKg: 10,
      },
    ],
    highlights: [
      'Variété Pain de Sucre reconnue pour son faible taux d’acidité',
      'Gingembre fort riche en gingérol naturel',
      'Conservation longue durée sans réfrigération',
    ],
  },
  {
    id: 'riz-etuve-benin',
    slug: 'riz-etuve-benin',
    sku: 'KMR-CER-010',
    name: 'Riz Local Étuvé Long Grain',
    shortDescription:
      'Riz béninois étuvé et décortiqué sans cailloux, grains longs fermes à la cuisson.',
    description:
      'Riz paddy cultivé dans les bas-fonds du Bénin, étuvé à la vapeur avant décorticage afin de fixer les vitamines et nutriments dans le grain. Trié mécaniquement pour obtenir un riz propre, non collant, idéal pour les ménages, restaurants et collectivités.',
    category: 'cereales',
    categoryLabel: 'Céréales & Graines',
    originLabel: 'Origine Bénin · Étuvé Grade A',
    gradeLabel: 'Long grain trié · Zéro pierre',
    technicalSpecs: {
      purityOrCaliber: 'Grains entiers > 92 % · Brisures < 8 %',
      moistureMax: 'Humidité < 13 %',
      harvestType: 'Étuvage vapeur & triage optique',
      availableVolume: '18 tonnes disponibles',
      minBulkOrder: 'Sac 50 kg à 26 000 FCFA · Tarifs par tonne',
    },
    image: rizEtuveImg,
    defaultPackId: 'riz-50kg',
    packs: [
      {
        id: 'riz-5kg',
        label: 'Sac 5 kg',
        tierLabel: 'Détail',
        priceFcfa: 3000,
        unitMeasure: '5 kg (600 FCFA/kg)',
        weightKg: 5,
      },
      {
        id: 'riz-25kg',
        label: 'Sac 25 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 13750,
        unitMeasure: '25 kg (550 FCFA/kg)',
        weightKg: 25,
      },
      {
        id: 'riz-50kg',
        label: 'Sac 50 kg',
        tierLabel: 'Gros',
        priceFcfa: 26000,
        unitMeasure: '50 kg (520 FCFA/kg)',
        weightKg: 50,
      },
    ],
    highlights: [
      'Ne colle pas après cuisson et gonfle généreusement',
      'Dépierreur et trieur optique pour zéro corps étranger',
      'Sacs cousus propres adaptés au stockage et à la revente',
    ],
  },
  {
    id: 'arachide-rouge-benin',
    slug: 'arachide-rouge-benin',
    sku: 'KMR-OLE-011',
    name: 'Arachide Rouge Décortiquée',
    shortDescription:
      'Graines d’arachide rouge riches en huile pour pâte d’arachide, galettes et huilerie.',
    description:
      'Arachides rouges décortiquées issues des terroirs sablo-argileux du Bénin, récoltées à maturité et triées pour éliminer graines moisies ou cassées. Très appréciées pour la fabrication de pâte d’arachide, galettes, grillage et extraction d’huile.',
    category: 'oleagineux',
    categoryLabel: 'Oléagineux & Karité',
    originLabel: 'Origine Bénin · Décortiquée',
    gradeLabel: 'Teneur huile élevée · Triée main',
    technicalSpecs: {
      purityOrCaliber: 'Graines saines > 97 % · Zéro aflatoxine',
      moistureMax: 'Humidité < 8 %',
      harvestType: 'Séchage soleil & décorticage doux',
      availableVolume: '7 500 kg disponibles',
      minBulkOrder: 'Sac 50 kg à 42 500 FCFA',
    },
    image: arachideBeninImg,
    defaultPackId: 'arachide-50kg',
    packs: [
      {
        id: 'arachide-2kg',
        label: 'Sachet 2 kg',
        tierLabel: 'Détail',
        priceFcfa: 2000,
        unitMeasure: '2 kg (1 000 FCFA/kg)',
        weightKg: 2,
      },
      {
        id: 'arachide-25kg',
        label: 'Sac 25 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 22500,
        unitMeasure: '25 kg (900 FCFA/kg)',
        weightKg: 25,
      },
      {
        id: 'arachide-50kg',
        label: 'Sac 50 kg',
        tierLabel: 'Gros',
        priceFcfa: 42500,
        unitMeasure: '50 kg (850 FCFA/kg)',
        weightKg: 50,
      },
    ],
    highlights: [
      'Rendement élevé en pressage d’huile et pâte onctueuse',
      'Tri rigoureux contre les graines abîmées avant ensachage',
      'Conditionnement en sacs doublés contre l’humidité',
    ],
  },
  {
    id: 'haricot-niebe-benin',
    slug: 'haricot-niebe-benin',
    sku: 'KMR-CER-012',
    name: 'Haricot Niébé Blanc Trié',
    shortDescription:
      'Niébé blanc gros grain à cuisson rapide, nettoyé et ensaché sans poussière.',
    description:
      'Haricot niébé blanc sélectionné au Bénin pour la régularité de ses grains et sa cuisson rapide sans éclatement excessif. Stocké sous protection hermétique sans résidu chimique, destiné aux ménages, cantines, transformateurs d’ata/abobo et grossistes.',
    category: 'cereales',
    categoryLabel: 'Céréales & Graines',
    originLabel: 'Origine Bénin · Gros grain',
    gradeLabel: 'Nettoyé triple tamis · Cuisson rapide',
    technicalSpecs: {
      purityOrCaliber: 'Grains entiers sains > 98 %',
      moistureMax: 'Humidité < 11,5 %',
      harvestType: 'Récolte sèche & stockage hermétique',
      availableVolume: '14 tonnes disponibles',
      minBulkOrder: 'Sac 100 kg à 58 000 FCFA',
    },
    image: niebeBeninImg,
    defaultPackId: 'niebe-100kg',
    packs: [
      {
        id: 'niebe-5kg',
        label: 'Sac 5 kg',
        tierLabel: 'Détail',
        priceFcfa: 3500,
        unitMeasure: '5 kg (700 FCFA/kg)',
        weightKg: 5,
      },
      {
        id: 'niebe-25kg',
        label: 'Sac 25 kg',
        tierLabel: 'Demi-gros',
        priceFcfa: 16000,
        unitMeasure: '25 kg (640 FCFA/kg)',
        weightKg: 25,
      },
      {
        id: 'niebe-100kg',
        label: 'Sac 100 kg',
        tierLabel: 'Gros',
        priceFcfa: 58000,
        unitMeasure: '100 kg (580 FCFA/kg)',
        weightKg: 100,
      },
    ],
    highlights: [
      'Conservation propre en sacs hermétiques triple couche',
      'Cuisson homogène idéale pour beignets, purées et plats',
      'Zéro impureté ni gravier grâce au double vannage',
    ],
  },
];

export interface DeliveryZone {
  id: string;
  label: string;
  eta: string;
  feeFcfa: number;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'retrait-depot',
    label: 'Retrait direct au dépôt agro',
    eta: 'Mise à disposition immédiate',
    feeFcfa: 0,
  },
  {
    id: 'livraison-urbaine',
    label: 'Livraison locale à domicile',
    eta: 'Expédition sous 24h',
    feeFcfa: 1000,
  },
  {
    id: 'expedition-nationale',
    label: 'Expédition nationale (Gare / Colis)',
    eta: 'Acheminement 24h – 48h',
    feeFcfa: 2500,
  },
  {
    id: 'fret-regional',
    label: 'Fret régional (Afrique de l’Ouest)',
    eta: 'Sur confirmation transporteur',
    feeFcfa: 5000,
  },
];

export const FREE_DELIVERY_THRESHOLD_FCFA = 50000;

export const WHATSAPP_DISPLAY_NUMBER = '01 96 98 51 29';
export const WHATSAPP_DIRECT_LINK = 'https://wa.me/2290196985129';
