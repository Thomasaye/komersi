import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  FileText,
  MessageCircle,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
  X,
} from 'lucide-react';
import {
  AGRO_EQUIPMENT,
  EQUIPMENT_CATEGORIES,
  EquipmentCategory,
  EquipmentItem,
} from '../data/equipment';
import { WHATSAPP_DISPLAY_NUMBER } from '../data/products';
import { formatFcfa, generateWhatsAppCheckoutUrl } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface EquipmentPageProps {
  onBackToHome: () => void;
}

type EquipmentFilter = 'all' | EquipmentCategory;

export function EquipmentPage({ onBackToHome }: EquipmentPageProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<EquipmentFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredEquipment = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return AGRO_EQUIPMENT.filter((item) => {
      const matchesCat =
        selectedCategory === 'all' ? true : item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleCopySectionLink = async () => {
    const url = `${window.location.origin}/materiels`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback silencieux si le presse-papier est bloqué
    }
  };

  const buildOrderWhatsAppUrl = (
    item: EquipmentItem,
    quantity: number,
    mode: 'commande' | 'cooperative'
  ) => {
    const total = item.priceFcfa * quantity;
    const lines =
      mode === 'commande'
        ? [
            `*COMMANDE MATÉRIEL AGRICOLE — KOMERSI*`,
            `Matériel : *${item.name}*`,
            `Référence : ${item.sku}`,
            `Quantité : ${quantity} unité(s)`,
            `Prix unitaire indicatif : ${formatFcfa(item.priceFcfa)}`,
            `Total estimé : *${formatFcfa(total)}*`,
            ``,
            `Merci de me confirmer la disponibilité, les modalités de mise en route et de livraison au Bénin.`,
          ]
        : [
            `*DEMANDE DEVIS COOPÉRATIVE / ÉQUIPEMENT — KOMERSI*`,
            `Matériel ciblé : *${item.name}* (${item.sku})`,
            `Quantité envisagée : ${quantity} unité(s)`,
            `Objet : Demande de tarif groupé, facture proforma et conditions d’enlèvement ou livraison sur site.`,
          ];

    return generateWhatsAppCheckoutUrl(lines.join('\n'));
  };

  const buildCustomRequestWhatsAppUrl = () => {
    const msg = [
      `*RECHERCHE MATÉRIEL AGRICOLE SPÉCIFIQUE — KOMERSI*`,
      `Bonjour, je recherche un équipement agricole (tricycle cargo, machine de transformation, irrigation ou outil de production).`,
      `Merci de me recontacter pour étudier mon besoin.`,
    ].join('\n');
    return generateWhatsAppCheckoutUrl(msg);
  };

  return (
    <div className="bg-[#F8F7F4] min-h-screen pb-16">
      {/* Barre supérieure de navigation et aperçu hors accueil */}
      <div className="bg-white border-b border-[#E5E3DD]">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#161615] hover:text-[#0F6E4A] transition-colors cursor-pointer min-h-[38px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l’accueil Komersi</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#ECFDF5] text-[#0F6E4A] border border-[#BBF7D0] rounded-md">
              Catalogue Matériels · Hors page d’accueil
            </span>

            <button
              type="button"
              onClick={handleCopySectionLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] hover:border-[#0F6E4A] rounded-lg transition-colors cursor-pointer min-h-[34px]"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0F6E4A]" />
                  <span>Lien copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#575652]" />
                  <span>Copier le lien</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* En-tête de section Équipements Agricoles */}
      <section className="bg-white border-b border-[#E5E3DD]">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-10 sm:py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0F6E4A] mb-2">
              Pôle Équipement des Producteurs · Bénin
            </p>
            <h1
              className="font-display text-3xl sm:text-4xl font-bold text-[#161615] tracking-tight mb-3"
              style={{ textWrap: 'balance' }}
            >
              Matériels agricoles, tricycles 3 roues et machines de transformation
            </h1>
            <p className="text-sm sm:text-base text-[#575652] leading-relaxed mb-6">
              Équipez vos exploitations, groupements et unités agroalimentaires
              avec des équipements testés sur le terrain : transport des récoltes
              par tricycles utilitaires, irrigation des parcelles et machines de
              transformation du maïs, soja, manioc, karité et palmiste.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F7F4] border border-[#E5E3DD]">
                <Truck className="w-4 h-4 text-[#0F6E4A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#161615]">
                    Mise en route & livraison
                  </p>
                  <p className="text-xs text-[#575652]">
                    Retrait dépôt ou acheminement sur site partout au Bénin
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F7F4] border border-[#E5E3DD]">
                <Wrench className="w-4 h-4 text-[#0F6E4A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#161615]">
                    Pièces & maintenance
                  </p>
                  <p className="text-xs text-[#575652]">
                    Suivi mécanique et pièces d’usure disponibles
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F7F4] border border-[#E5E3DD]">
                <ShieldCheck className="w-4 h-4 text-[#0F6E4A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#161615]">
                    Proforma coopératives
                  </p>
                  <p className="text-xs text-[#575652]">
                    Devis WhatsApp direct au {WHATSAPP_DISPLAY_NUMBER}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres & Grille des matériels */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 pt-8 sm:pt-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#ECEAE4] rounded-lg w-full lg:w-fit"
            role="tablist"
            aria-label="Filtrer les matériels agricoles"
          >
            {EQUIPMENT_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap min-h-[38px] ${
                    isActive
                      ? 'bg-white text-[#161615] shadow-xs'
                      : 'text-[#575652] hover:text-[#161615]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="w-4 h-4 text-[#575652] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tricycle, moulin, presse, pompe..."
              aria-label="Rechercher un matériel agricole"
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#E5E3DD] rounded-lg text-[#161615] placeholder:text-[#575652] focus:outline-none focus:border-[#0F6E4A] min-h-[40px]"
            />
          </div>
        </div>

        {filteredEquipment.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E3DD] p-10 text-center">
            <p className="font-display text-lg font-bold text-[#161615] mb-1.5">
              Aucun équipement trouvé
            </p>
            <p className="text-sm text-[#575652] mb-5">
              Modifiez votre recherche ou affichez toutes les catégories de
              matériels.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors cursor-pointer min-h-[40px]"
            >
              Afficher tous les matériels
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl border border-[#E5E3DD] overflow-hidden flex flex-col hover:border-[#0F6E4A]/50 transition-colors"
              >
                <div className="relative aspect-[4/3] bg-[#F1EFEA] overflow-hidden">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white/95 text-[#161615] border border-[#E5E3DD] rounded-md">
                    {item.categoryLabel}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 text-[11px] font-mono font-medium bg-[#161615]/85 text-white rounded-md">
                    {item.sku}
                  </span>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-[#161615] leading-snug">
                      {item.name}
                    </h2>
                  </div>

                  <p className="text-sm text-[#575652] leading-relaxed mb-4">
                    {item.shortDescription}
                  </p>

                  {/* Fiche specs rapide */}
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-lg bg-[#F8F7F4] border border-[#E5E3DD] mb-5">
                    {item.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt className="text-[11px] font-medium text-[#575652]">
                          {spec.label}
                        </dt>
                        <dd className="text-xs font-semibold text-[#161615]">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto pt-4 border-t border-[#E5E3DD]">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                      <div>
                        <p className="text-xs text-[#575652]">
                          Tarif indicatif unitaire
                        </p>
                        <p className="font-display text-2xl font-bold text-[#161615] tabular-nums">
                          {formatFcfa(item.priceFcfa)}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-[#0F6E4A]">
                        {item.availabilityLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <a
                        href={buildOrderWhatsAppUrl(item, 1, 'commande')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors min-h-[42px]"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>Commander / Réserver</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(item);
                          setModalQty(1);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#161615] bg-white border border-[#E5E3DD] hover:border-[#0F6E4A] rounded-lg transition-colors cursor-pointer min-h-[42px]"
                      >
                        <FileText className="w-4 h-4 shrink-0 text-[#0F6E4A]" />
                        <span>Fiche technique & Devis</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Demande sur mesure */}
        <div className="mt-10 bg-white rounded-xl border border-[#E5E3DD] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold text-[#0F6E4A] mb-1">
              Approvisionnement sur cahier des charges
            </p>
            <h3 className="font-display text-xl font-bold text-[#161615] mb-1">
              Besoin d’une batteuse, décortiqueuse, semoir ou flotte de tricycles ?
            </h3>
            <p className="text-sm text-[#575652]">
              Indiquez-nous la capacité souhaitée et la filière concernée pour
              recevoir une facture proforma sous 24h sur WhatsApp.
            </p>
          </div>
          <a
            href={buildCustomRequestWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#161615] hover:bg-[#2A2A28] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 text-[#34D399]" />
            <span>Demander un équipement sur WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Modale Fiche Technique Complète */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="equipment-modal-title"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E5E3DD] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#E5E3DD] px-5 py-4 flex items-center justify-between gap-4 z-10">
              <div>
                <p className="text-xs font-mono text-[#575652]">
                  {selectedItem.sku} · {selectedItem.categoryLabel}
                </p>
                <h3
                  id="equipment-modal-title"
                  className="font-display text-lg font-bold text-[#161615]"
                >
                  {selectedItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Fermer la fiche technique"
                className="p-2 rounded-lg text-[#575652] hover:text-[#161615] hover:bg-[#F8F7F4] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F1EFEA] border border-[#E5E3DD]">
                  <ProductImage
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-[#575652] leading-relaxed">
                    {selectedItem.description}
                  </p>
                  <div className="p-3 rounded-lg bg-[#F8F7F4] border border-[#E5E3DD]">
                    <p className="text-xs text-[#575652]">Tarif unitaire</p>
                    <p className="font-display text-2xl font-bold text-[#161615] tabular-nums">
                      {formatFcfa(selectedItem.priceFcfa)}
                    </p>
                    <p className="text-xs text-[#0F6E4A] font-medium mt-0.5">
                      {selectedItem.paymentNote}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-[#575652]">
                    {selectedItem.warrantyLabel}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#575652] mb-2.5">
                  Caractéristiques techniques
                </h4>
                <div className="divide-y divide-[#E5E3DD] border border-[#E5E3DD] rounded-lg bg-[#F8F7F4]">
                  {selectedItem.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                    >
                      <span className="text-[#575652] font-medium">
                        {spec.label}
                      </span>
                      <span className="text-[#161615] font-semibold">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#575652] mb-2">
                  Points forts terrain
                </h4>
                <ul className="space-y-1.5">
                  {selectedItem.highlights.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2 text-xs sm:text-sm text-[#161615]"
                    >
                      <Check className="w-4 h-4 text-[#0F6E4A] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E5E3DD] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label
                    htmlFor="equipment-qty"
                    className="text-sm font-semibold text-[#161615]"
                  >
                    Quantité souhaitée
                  </label>
                  <div className="inline-flex items-center border border-[#E5E3DD] rounded-lg bg-white">
                    <button
                      type="button"
                      onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-sm font-bold text-[#161615] hover:bg-[#F8F7F4] cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      id="equipment-qty"
                      type="number"
                      min={1}
                      max={100}
                      value={modalQty}
                      onChange={(e) =>
                        setModalQty(
                          Math.max(1, parseInt(e.target.value, 10) || 1)
                        )
                      }
                      className="w-14 text-center text-sm font-semibold text-[#161615] focus:outline-none tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => setModalQty((q) => q + 1)}
                      className="px-3 py-1.5 text-sm font-bold text-[#161615] hover:bg-[#F8F7F4] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={buildOrderWhatsAppUrl(
                      selectedItem,
                      modalQty,
                      'commande'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      Commander ({formatFcfa(selectedItem.priceFcfa * modalQty)})
                    </span>
                  </a>

                  <a
                    href={buildOrderWhatsAppUrl(
                      selectedItem,
                      modalQty,
                      'cooperative'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] hover:border-[#0F6E4A] rounded-lg transition-colors min-h-[44px]"
                  >
                    <FileText className="w-4 h-4 text-[#0F6E4A]" />
                    <span>Devis coopérative / proforma</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
