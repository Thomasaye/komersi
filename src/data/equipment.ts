import equipMotopompe from '../assets/images/equip_motopompe_agri_1794810484584.jpg';
import equipMoulin from '../assets/images/equip_moulin_broyeur_1794810484033.jpg';
import equipPresse from '../assets/images/equip_presse_huile_1794810485025.jpg';
import equipTricycle from '../assets/images/equip_tricycle_3roues_1794810484280.jpg';

export type EquipmentCategory = 'transport' | 'production' | 'transformation';

export interface EquipmentSpec {
  label: string;
  value: string;
}

export interface EquipmentItem {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: EquipmentCategory;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  priceFcfa: number;
  paymentNote: string;
  warrantyLabel: string;
  availabilityLabel: string;
  image: string;
  specs: EquipmentSpec[];
  highlights: string[];
}

export const EQUIPMENT_CATEGORIES: Array<{
  id: 'all' | EquipmentCategory;
  label: string;
}> = [
  { id: 'all', label: 'Tous les matériels' },
  { id: 'transport', label: 'Tricycles & Transport' },
  { id: 'production', label: 'Production & Irrigation' },
  { id: 'transformation', label: 'Transformation agro' },
];

export const AGRO_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'tricycle-cargo-3-roues',
    slug: 'tricycle-cargo-3-roues',
    sku: 'KMR-EQ-TRI-250',
    name: 'Tricycle Utilitaire Cargo 3 Roues — Benne Renforcée',
    category: 'transport',
    categoryLabel: 'Tricycles & Transport',
    shortDescription:
      'Châssis double longeron conçu pour pistes rurales, sacs de 100 kg et bidons.',
    description:
      'Tricycle agricole à trois roues spécialement configuré pour évacuer les récoltes depuis les parcelles jusqu’aux dépôts. Équipé d’une benne renforcée basculante à ridelles hautes, d’amortisseurs à lames renforcées et d’un refroidissement adapté aux fortes charges.',
    priceFcfa: 980000,
    paymentNote: 'Tarif unitaire · Remise coopérative dès 3 unités',
    warrantyLabel: 'Garantie moteur 6 mois + pièces suivies',
    availabilityLabel: 'En stock · Prêt à la mise en route',
    image: equipTricycle,
    specs: [
      { label: 'Motorisation', value: '250 cc 4 temps · Démarrage électrique & kick' },
      { label: 'Charge utile', value: '800 à 1 000 kg (jusqu’à 10 sacs de 100 kg)' },
      { label: 'Benne', value: 'Acier renforcé basculante · Ridelles rabattables' },
      { label: 'Suspension', value: 'Lames de ressort agricoles + double amortisseur' },
    ],
    highlights: [
      'Boîte 5 vitesses avec réducteur spécial côtes et pistes latéritiques',
      'Roue de secours et trousse d’entretien incluses à la livraison',
      'Montage complet et essai mécanique effectués avant remise',
    ],
  },
  {
    id: 'moulin-broyeur-polyvalent',
    slug: 'moulin-broyeur-polyvalent',
    sku: 'KMR-EQ-MOU-500',
    name: 'Moulin Broyeur Polyvalent Maïs, Soja & Manioc',
    category: 'transformation',
    categoryLabel: 'Transformation agro',
    shortDescription:
      'Mouture fine ou concassage rapide pour provenderies, farines et gari.',
    description:
      'Broyeur agricole robuste à marteaux trempés capable de transformer maïs sec, soja torréfié, cossettes de manioc et sorgho. Livré avec un jeu de tamis interchangeables pour passer de la provende animale à la farine alimentaire.',
    priceFcfa: 420000,
    paymentNote: 'Version moteur thermique ou électrique triphasé',
    warrantyLabel: 'Garantie châssis & arbre 12 mois',
    availabilityLabel: 'Disponible sur commande rapide',
    image: equipMoulin,
    specs: [
      { label: 'Rendement horaire', value: '350 à 500 kg/h selon granulométrie' },
      { label: 'Énergie au choix', value: 'Moteur Diesel 10 CV ou Électrique 5.5 kW' },
      { label: 'Finesse de mouture', value: '3 tamis interchangeables (1,5 / 3 / 5 mm)' },
      { label: 'Chambre de broyage', value: 'Acier épais anti-usure à marteaux réversibles' },
    ],
    highlights: [
      'Trémie large en acier pour alimentation continue sans bourrage',
      'Châssis anti-vibrations prêt à boulonner en atelier ou sur remorque',
      'Adapté aux unités de transformation villageoises et coopératives',
    ],
  },
  {
    id: 'presse-huile-karite-vis',
    slug: 'presse-huile-karite-vis',
    sku: 'KMR-EQ-PRS-200',
    name: 'Presse à Huile & Karité Motorisée à Vis Continue',
    category: 'transformation',
    categoryLabel: 'Transformation agro',
    shortDescription:
      'Extraction mécanique à haut rendement pour palmiste, arachide, soja et karité.',
    description:
      'Presse à vis sans fin de qualité alimentaire conçue pour les groupements de femmes et unités agroalimentaires. Permet d’extraire proprement l’huile de palmiste, d’arachide, de soja ou le beurre de karité tout en récupérant le tourteau sec.',
    priceFcfa: 650000,
    paymentNote: 'Inclut formation de prise en main au retrait',
    warrantyLabel: 'Garantie vis & réducteur 12 mois',
    availabilityLabel: 'Disponible · Test matière possible',
    image: equipPresse,
    specs: [
      { label: 'Capacité de traitement', value: '150 à 250 kg/h en continu' },
      { label: 'Matières compatibles', value: 'Karité, palmiste, arachide, soja, sésame' },
      { label: 'Contact matière', value: 'Acier inoxydable alimentaire facile à nettoyer' },
      { label: 'Motorisation', value: 'Réducteur industriel à couple élevé' },
    ],
    highlights: [
      'Taux d’extraction optimisé avec réglage fin de pression en sortie',
      'Tourteaux secs immédiatement valorisables en alimentation animale',
      'Système de sécurité thermique et accès rapide à la vis de pressage',
    ],
  },
  {
    id: 'motopompe-irrigation-haute-pression',
    slug: 'motopompe-irrigation-haute-pression',
    sku: 'KMR-EQ-MTP-070',
    name: 'Motopompe d’Irrigation Agricole Haute Pression 3"',
    category: 'production',
    categoryLabel: 'Production & Irrigation',
    shortDescription:
      'Arrosage de maraîchage, riziculture et remplissage rapide de bassins.',
    description:
      'Groupe motopompe portable à fort débit étudié pour les périmètres maraîchers, vergers et exploitations agricoles. Son châssis tubulaire protège le moteur 4 temps lors des déplacements entre parcelles et bas-fonds.',
    priceFcfa: 185000,
    paymentNote: 'Kit raccords, crépine et colliers inclus',
    warrantyLabel: 'Garantie constructeur 6 mois',
    availabilityLabel: 'En stock · Expédition sous 24h',
    image: equipMotopompe,
    specs: [
      { label: 'Motorisation', value: '4 temps essence OHV 7 CV · Faible consommation' },
      { label: 'Débit maximal', value: '45 à 60 m³/h (raccordement 80 mm / 3 pouces)' },
      { label: 'Hauteur de refoulement', value: 'Jusqu’à 30 m · Aspiration max 7 m' },
      { label: 'Autonomie réservoir', value: '3,6 L · Sécurité manque d’huile intégrée' },
    ],
    highlights: [
      'Démarrage facile par lanceur renforcé même en saison sèche',
      'Corps de pompe en fonte d’aluminium résistant aux eaux chargées',
      'Livré avec crépine d’aspiration, raccords rapides et clé bougie',
    ],
  },
];
