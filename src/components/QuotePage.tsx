import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  AGRO_PRODUCTS,
  DELIVERY_ZONES,
  Product,
  WHATSAPP_DISPLAY_NUMBER,
} from '../data/products';
import {
  formatFcfa,
  generateWhatsAppCheckoutUrl,
  sanitizePhoneDigits,
} from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface QuoteLineItem {
  lineId: string;
  product: Product;
  packId: string;
  quantity: number;
}

interface QuotePageProps {
  initialProduct?: Product | null;
  onBackToCatalog: () => void;
}

const BUYER_PROFILES = [
  'Transformateur / Unité agroalimentaire',
  'Grossiste / Négociant',
  'Élevage / Provenderie',
  'Exportateur',
  'Commerçant / Revendeur',
];

const DELIVERY_TIMELINES = [
  'Enlèvement ou expédition immédiate',
  'Sous 3 à 7 jours',
  'Approvisionnement mensuel récurrent',
];

export function QuotePage({ initialProduct, onBackToCatalog }: QuotePageProps) {
  const defaultProduct = initialProduct ?? AGRO_PRODUCTS[0];
  const defaultPack =
    defaultProduct.packs.find((p) => p.id === defaultProduct.defaultPackId) ??
    defaultProduct.packs[defaultProduct.packs.length - 1];

  const [lines, setLines] = useState<QuoteLineItem[]>([
    {
      lineId: `line-${defaultProduct.id}-1`,
      product: defaultProduct,
      packId: defaultPack.id,
      quantity: 10,
    },
  ]);

  const [selectedAddProductId, setSelectedAddProductId] = useState(
    AGRO_PRODUCTS[1]?.id ?? AGRO_PRODUCTS[0].id
  );
  const [companyOrName, setCompanyOrName] = useState('');
  const [phone, setPhone] = useState('');
  const [buyerProfile, setBuyerProfile] = useState(BUYER_PROFILES[0]);
  const [zoneId, setZoneId] = useState(DELIVERY_ZONES[0].id);
  const [destination, setDestination] = useState('');
  const [timeline, setTimeline] = useState(DELIVERY_TIMELINES[0]);
  const [customSpecsNote, setCustomSpecsNote] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const quoteReference = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `KMR-DEV-${mm}${dd}`;
  }, []);

  const quoteCalculations = useMemo(() => {
    let totalWeightKg = 0;
    let estimatedSubtotalFcfa = 0;

    const detailedLines = lines.map((line) => {
      const pack =
        line.product.packs.find((p) => p.id === line.packId) ??
        line.product.packs[line.product.packs.length - 1];
      const lineWeightKg = pack.weightKg * line.quantity;
      const lineAmountFcfa = pack.priceFcfa * line.quantity;
      totalWeightKg += lineWeightKg;
      estimatedSubtotalFcfa += lineAmountFcfa;

      return {
        ...line,
        pack,
        lineWeightKg,
        lineAmountFcfa,
      };
    });

    const selectedZone =
      DELIVERY_ZONES.find((z) => z.id === zoneId) ?? DELIVERY_ZONES[0];

    return {
      detailedLines,
      totalWeightKg,
      estimatedSubtotalFcfa,
      selectedZone,
    };
  }, [lines, zoneId]);

  const formattedQuoteMessage = useMemo(() => {
    const itemsText = quoteCalculations.detailedLines.map(
      (item, index) =>
        `${index + 1}. ${item.product.name} [${item.pack.label}] × ${
          item.quantity
        } (${item.lineWeightKg.toLocaleString('fr-FR')} kg) ≈ ${formatFcfa(
          item.lineAmountFcfa
        )}`
    );

    const rows = [
      `*DEMANDE DE DEVIS PROFORMA — KOMERSI AGRO*`,
      `Référence : *${quoteReference}*`,
      `Profil : ${buyerProfile}`,
      ``,
      `*Lots demandés :*`,
      ...itemsText,
      ``,
      `Poids / Volume total estimé : *${quoteCalculations.totalWeightKg.toLocaleString(
        'fr-FR'
      )} kg*`,
      `Estimation indicative catalogue : *${formatFcfa(
        quoteCalculations.estimatedSubtotalFcfa
      )}*`,
      ``,
      `*Logistique & Coordonnées :*`,
      `Acheteur / Société : ${companyOrName.trim() || 'À préciser'}`,
      `Téléphone : ${phone.trim() || 'À préciser'}`,
      `Acheminement : ${quoteCalculations.selectedZone.label}`,
      `Point de livraison : ${destination.trim() || 'À confirmer'}`,
      `Délai souhaité : ${timeline}`,
    ];

    if (customSpecsNote.trim()) {
      rows.push(`Exigences qualité / sac : ${customSpecsNote.trim()}`);
    }

    rows.push(
      ``,
      `Merci de me confirmer la disponibilité du lot et le tarif net sur cette quantité.`
    );

    return rows.join('\n');
  }, [
    quoteCalculations,
    quoteReference,
    buyerProfile,
    companyOrName,
    phone,
    destination,
    timeline,
    customSpecsNote,
  ]);

  const quoteWhatsAppUrl = useMemo(
    () => generateWhatsAppCheckoutUrl(formattedQuoteMessage),
    [formattedQuoteMessage]
  );

  const handleAddProductLine = () => {
    const productToAdd = AGRO_PRODUCTS.find(
      (p) => p.id === selectedAddProductId
    );
    if (!productToAdd) return;

    const preferredPack =
      productToAdd.packs.find((p) => p.id === productToAdd.defaultPackId) ??
      productToAdd.packs[productToAdd.packs.length - 1];

    setLines((prev) => [
      ...prev,
      {
        lineId: `line-${productToAdd.id}-${Date.now()}`,
        product: productToAdd,
        packId: preferredPack.id,
        quantity: 5,
      },
    ]);
  };

  const handleUpdateLinePack = (lineId: string, newPackId: string) => {
    setLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, packId: newPackId } : l))
    );
  };

  const handleUpdateLineQty = (lineId: string, newQty: number) => {
    const safeQty = Math.max(1, newQty);
    setLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, quantity: safeQty } : l))
    );
  };

  const handleRemoveLine = (lineId: string) => {
    setLines((prev) =>
      prev.length <= 1 ? prev : prev.filter((l) => l.lineId !== lineId)
    );
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(formattedQuoteMessage);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    } catch {
      // Ignore clipboard errors
    }
  };

  const isContactReady =
    companyOrName.trim().length >= 2 && sanitizePhoneDigits(phone).length >= 8;

  return (
    <div className="bg-[#F8F7F4]">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#E5E3DD]">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#161615] hover:text-[#0F6E4A] transition-colors cursor-pointer min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Retour au catalogue agro</span>
          </button>

          <p className="font-mono text-xs font-medium text-[#575652]">
            {quoteReference} · Devis négoce &amp; gros
          </p>
        </div>

        <div className="max-w-2xl mb-8">
          <p className="text-xs font-medium text-[#0F6E4A] mb-1.5">
            Constructeur de devis multi-lots
          </p>
          <h1
            className="font-display text-2xl sm:text-4xl font-bold text-[#161615] tracking-tight mb-2.5"
            style={{ textWrap: 'balance' }}
          >
            Demande de devis &amp; cotation gros
          </h1>
          <p className="text-sm sm:text-base text-[#575652] leading-relaxed">
            Composez votre besoin multi-produits (sacs de maïs 100 kg, café,
            cacao, karité, soja, cajou), visualisez instantanément le tonnage et
            envoyez la demande structurée sur WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white rounded-2xl border border-[#E5E3DD] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold text-[#161615]">
                  1. Matières premières &amp; quantités
                </h2>
                <span className="font-mono text-xs text-[#0F6E4A] font-semibold tabular-nums">
                  {quoteCalculations.totalWeightKg.toLocaleString('fr-FR')} kg
                  au total
                </span>
              </div>

              <div className="divide-y divide-[#F0EEE8] border border-[#E5E3DD] rounded-xl">
                {quoteCalculations.detailedLines.map((line) => (
                  <div
                    key={line.lineId}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#ECEAE4] shrink-0">
                        <ProductImage
                          src={line.product.image}
                          alt={line.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#161615] truncate">
                          {line.product.name}
                        </p>
                        <p className="font-mono text-xs text-[#575652] mt-0.5">
                          {line.product.sku} ·{' '}
                          {line.lineWeightKg.toLocaleString('fr-FR')} kg
                        </p>

                        <div className="mt-2">
                          <select
                            aria-label={`Conditionnement pour ${line.product.name}`}
                            value={line.pack.id}
                            onChange={(e) =>
                              handleUpdateLinePack(line.lineId, e.target.value)
                            }
                            className="px-2.5 py-1.5 text-xs font-medium bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg text-[#161615] focus:outline-none focus:border-[#0F6E4A]"
                          >
                            {line.product.packs.map((pk) => (
                              <option key={pk.id} value={pk.id}>
                                {pk.label} — {formatFcfa(pk.priceFcfa)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="inline-flex items-center border border-[#E5E3DD] rounded-lg bg-[#F8F7F4]">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateLineQty(line.lineId, line.quantity - 1)
                          }
                          className="p-2 text-[#161615] hover:bg-[#ECEAE4] rounded-l-lg cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) =>
                            handleUpdateLineQty(
                              line.lineId,
                              parseInt(e.target.value, 10) || 1
                            )
                          }
                          aria-label={`Quantité pour ${line.product.name}`}
                          className="w-14 text-center font-mono text-xs font-semibold bg-transparent focus:outline-none tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateLineQty(line.lineId, line.quantity + 1)
                          }
                          className="p-2 text-[#161615] hover:bg-[#ECEAE4] rounded-r-lg cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[92px]">
                        <p className="font-mono text-sm font-semibold text-[#161615] tabular-nums">
                          {formatFcfa(line.lineAmountFcfa)}
                        </p>
                      </div>

                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(line.lineId)}
                          className="p-1.5 text-[#575652] hover:text-red-700 cursor-pointer"
                          aria-label={`Supprimer ${line.product.name} du devis`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <select
                  aria-label="Ajouter une matière première au devis"
                  value={selectedAddProductId}
                  onChange={(e) => setSelectedAddProductId(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg text-[#161615] focus:outline-none focus:border-[#0F6E4A]"
                >
                  {AGRO_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.categoryLabel})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddProductLine}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#161615] bg-[#F4F2ED] hover:bg-[#E7E4DC] rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[42px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter au devis</span>
                </button>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#E5E3DD] p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-[#161615]">
                2. Profil acheteur &amp; logistique souhaitée
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="devis-company"
                    className="block text-xs font-medium text-[#575652] mb-1.5"
                  >
                    Nom complet ou Entreprise *
                  </label>
                  <input
                    id="devis-company"
                    type="text"
                    value={companyOrName}
                    onChange={(e) => setCompanyOrName(e.target.value)}
                    placeholder="Ex: Société Agro / Nom"
                    className="w-full px-3.5 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="devis-phone"
                    className="block text-xs font-medium text-[#575652] mb-1.5"
                  >
                    Téléphone WhatsApp *
                  </label>
                  <input
                    id="devis-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01 96 98 51 29"
                    className="w-full px-3.5 py-2.5 text-sm font-mono text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="devis-profile"
                    className="block text-xs font-medium text-[#575652] mb-1.5"
                  >
                    Activité / Profil
                  </label>
                  <select
                    id="devis-profile"
                    value={buyerProfile}
                    onChange={(e) => setBuyerProfile(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                  >
                    {BUYER_PROFILES.map((profile) => (
                      <option key={profile} value={profile}>
                        {profile}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="devis-timeline"
                    className="block text-xs font-medium text-[#575652] mb-1.5"
                  >
                    Fréquence / Délai
                  </label>
                  <select
                    id="devis-timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                  >
                    {DELIVERY_TIMELINES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="devis-zone"
                    className="block text-xs font-medium text-[#575652] mb-1.5"
                  >
                    Mode d’acheminement
                  </label>
                  <select
                    id="devis-zone"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                  >
                    {DELIVERY_ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="devis-dest"
                    className="block text-xs font-medium text-[#575652] mb-1.5"
                  >
                    Lieu de livraison / enlèvement
                  </label>
                  <input
                    id="devis-dest"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ex: Zone industrielle, dépôt, entrepôt..."
                    className="w-full px-3.5 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="devis-note"
                  className="block text-xs font-medium text-[#575652] mb-1.5"
                >
                  Précisions techniques (sacherie, humidité, cahier des charges)
                </label>
                <textarea
                  id="devis-note"
                  rows={3}
                  value={customSpecsNote}
                  onChange={(e) => setCustomSpecsNote(e.target.value)}
                  placeholder="Ex: Besoin de sacs doublés polyéthylène, contrôle humidité avant chargement..."
                  className="w-full px-3.5 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white rounded-2xl border border-[#E5E3DD] p-5 sm:p-6 space-y-5">
            <div className="pb-4 border-b border-[#F0EEE8] flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#0F6E4A]">
                  Récapitulatif Proforma
                </p>
                <h2 className="font-display text-lg font-bold text-[#161615]">
                  {quoteReference}
                </h2>
              </div>
              <span className="font-mono text-xs text-[#575652] tabular-nums">
                {quoteCalculations.detailedLines.length} ligne
                {quoteCalculations.detailedLines.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-2.5 text-sm">
              {quoteCalculations.detailedLines.map((line) => (
                <div
                  key={line.lineId}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[#161615] truncate">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-[#575652]">
                      {line.pack.label} × {line.quantity} (
                      {line.lineWeightKg.toLocaleString('fr-FR')} kg)
                    </p>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#161615] tabular-nums shrink-0">
                    {formatFcfa(line.lineAmountFcfa)}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#F8F7F4] rounded-xl border border-[#E5E3DD] p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-[#575652]">
                <span>Poids total estimé</span>
                <span className="font-mono font-semibold text-[#161615] tabular-nums">
                  {quoteCalculations.totalWeightKg.toLocaleString('fr-FR')} kg
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-[#161615] pt-2 border-t border-[#E5E3DD]">
                <span>Estimation indicative</span>
                <span className="font-mono tabular-nums text-[#0F6E4A]">
                  {formatFcfa(quoteCalculations.estimatedSubtotalFcfa)}
                </span>
              </div>
              <p className="text-[11px] text-[#575652] leading-snug pt-1">
                Tarif ferme confirmé sur WhatsApp selon le tonnage final et
                l’acheminement ({quoteCalculations.selectedZone.label}).
              </p>
            </div>

            <details className="bg-[#F8F7F4] rounded-xl border border-[#E5E3DD] p-3.5">
              <summary className="text-xs font-semibold text-[#575652] cursor-pointer select-none">
                Aperçu du texte transmis
              </summary>
              <pre className="mt-3 text-[11px] font-mono text-[#161615] whitespace-pre-wrap leading-relaxed">
                {formattedQuoteMessage}
              </pre>
            </details>

            {!isContactReady && (
              <p className="text-xs text-[#575652]">
                Renseignez votre nom / entreprise et votre numéro pour un suivi
                prioritaire (vous pouvez déjà envoyer la demande).
              </p>
            )}

            <div className="space-y-2.5">
              <a
                href={quoteWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>
                  Envoyer le devis sur WhatsApp ({WHATSAPP_DISPLAY_NUMBER})
                </span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#161615] bg-[#F4F2ED] hover:bg-[#E7E4DC] rounded-lg transition-colors cursor-pointer min-h-[40px]"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0F6E4A]" />
                    <span>Récapitulatif copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le récapitulatif texte</span>
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
