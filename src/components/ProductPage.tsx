import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import {
  AGRO_PRODUCTS,
  PackOption,
  Product,
  WHATSAPP_DISPLAY_NUMBER,
} from '../data/products';
import { formatFcfa } from '../utils/whatsapp';
import { ProductCard } from './ProductCard';
import { ProductImage } from './ProductImage';

interface ProductPageProps {
  product: Product;
  initialPackId?: string;
  recentlyAddedId: string | null;
  onBackToCatalog: () => void;
  onSelectProduct: (product: Product, packId?: string) => void;
  onAddToCart: (product: Product, pack: PackOption, quantity: number) => void;
  onDirectWhatsAppCheckout: (
    product: Product,
    pack: PackOption,
    quantity: number
  ) => void;
  onOpenQuotePage: (product: Product) => void;
}

export function ProductPage({
  product,
  initialPackId,
  recentlyAddedId,
  onBackToCatalog,
  onSelectProduct,
  onAddToCart,
  onDirectWhatsAppCheckout,
  onOpenQuotePage,
}: ProductPageProps) {
  const [selectedPackId, setSelectedPackId] = useState(
    initialPackId || product.defaultPackId || product.packs[0].id
  );
  const [quantity, setQuantity] = useState(1);
  const [linkCopied, setLinkCopied] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setSelectedPackId(
      initialPackId || product.defaultPackId || product.packs[0].id
    );
    setQuantity(1);
    setAddedFeedback(false);
    setLinkCopied(false);
  }, [product.id, initialPackId, product.defaultPackId, product.packs]);

  const activePack =
    product.packs.find((p) => p.id === selectedPackId) ?? product.packs[0];

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/produit/${product.slug}`
      : `https://komersi.store/produit/${product.slug}`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${product.name} (${activePack.label} — ${formatFcfa(
      activePack.priceFcfa
    )}) sur Komersi : ${shareUrl}`
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2200);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `${product.name} — Komersi`,
          text: `${product.shortDescription} (${formatFcfa(
            activePack.priceFcfa
          )})`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to copy if user cancels share sheet
      }
    }
    handleCopyLink();
  };

  const specRows = [
    { label: 'Calibre / Pureté', value: product.technicalSpecs.purityOrCaliber },
    { label: 'Humidité / Seuil', value: product.technicalSpecs.moistureMax },
    { label: 'Procédé / Récolte', value: product.technicalSpecs.harvestType },
    { label: 'Volume disponible', value: product.technicalSpecs.availableVolume },
    { label: 'Conditionnement gros', value: product.technicalSpecs.minBulkOrder },
  ];

  const relatedProducts = AGRO_PRODUCTS.filter(
    (p) => p.id !== product.id
  ).slice(0, 4);

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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#161615] bg-white border border-[#E5E3DD] hover:border-[#0F6E4A] rounded-lg transition-colors cursor-pointer min-h-[40px]"
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0F6E4A]" />
                  <span>Lien copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le lien</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#161615] bg-white border border-[#E5E3DD] hover:border-[#0F6E4A] rounded-lg transition-colors cursor-pointer min-h-[40px]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#ECEAE4] border border-[#E5E3DD]">
              <ProductImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="bg-white rounded-xl border border-[#E5E3DD] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#575652]">
                  Lien direct partageable de cette offre
                </p>
                <p className="font-mono text-xs text-[#161615] truncate mt-0.5">
                  {shareUrl}
                </p>
              </div>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F6E4A] bg-[#0F6E4A]/10 hover:bg-[#0F6E4A]/15 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Partager sur WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5E3DD] p-5 sm:p-8 space-y-6">
            <div>
              <p className="text-xs font-medium text-[#575652] mb-2">
                {product.categoryLabel} <span aria-hidden="true">·</span>{' '}
                {product.originLabel} <span aria-hidden="true">·</span>{' '}
                <span className="font-mono">{product.sku}</span>
              </p>

              <p className="text-xs font-semibold text-[#0F6E4A] mb-2">
                {product.gradeLabel}
              </p>

              <h1
                className="font-display text-2xl sm:text-3xl font-bold text-[#161615] leading-tight mb-3"
                style={{ textWrap: 'balance' }}
              >
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#161615] tabular-nums">
                  {formatFcfa(activePack.priceFcfa)}
                </span>
                <span className="text-xs sm:text-sm text-[#575652]">
                  {activePack.unitMeasure}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0EEE8]">
              <p className="text-xs font-semibold text-[#161615] mb-2.5">
                Conditionnement disponible (Détail, Demi-gros &amp; Gros)
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {product.packs.map((pack) => {
                  const isSelected = pack.id === activePack.id;
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => setSelectedPackId(pack.id)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#0F6E4A] bg-[#0F6E4A]/5 text-[#161615]'
                          : 'border-[#E5E3DD] bg-[#F8F7F4] text-[#575652] hover:border-[#161615]/30'
                      }`}
                    >
                      <span className="block text-[11px] font-semibold text-[#0F6E4A]">
                        {pack.tierLabel}
                      </span>
                      <span className="block text-xs sm:text-sm font-semibold text-[#161615] truncate mt-0.5">
                        {pack.label}
                      </span>
                      <span className="block font-mono text-xs text-[#575652] tabular-nums mt-0.5">
                        {formatFcfa(pack.priceFcfa)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-medium text-[#161615] block">
                    Quantité ({activePack.label})
                  </span>
                  <span className="font-mono text-xs text-[#575652] tabular-nums">
                    Sous-total : {formatFcfa(activePack.priceFcfa * quantity)}
                  </span>
                </div>

                <div className="inline-flex items-center border border-[#E5E3DD] rounded-lg bg-[#F8F7F4]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-[#161615] hover:bg-[#ECEAE4] rounded-l-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-mono text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-[#161615] hover:bg-[#ECEAE4] rounded-r-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, activePack, quantity);
                    setAddedFeedback(true);
                    setTimeout(() => setAddedFeedback(false), 1800);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#161615] bg-[#F4F2ED] hover:bg-[#E7E4DC] rounded-lg transition-colors cursor-pointer min-h-[48px] whitespace-nowrap"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-[#0F6E4A] shrink-0" />
                      <span>Ajouté au panier</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Ajouter au panier</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDirectWhatsAppCheckout(product, activePack, quantity)
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors cursor-pointer min-h-[48px] whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Commander ({WHATSAPP_DISPLAY_NUMBER})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => onOpenQuotePage(product)}
                className="w-full py-2.5 text-xs font-semibold text-[#0F6E4A] hover:underline cursor-pointer text-center"
              >
                Besoin de gros tonnage ? Ouvrir la page Devis Proforma →
              </button>
            </div>

            <div className="pt-4 border-t border-[#F0EEE8] space-y-4">
              <p className="text-sm text-[#575652] leading-relaxed">
                {product.description}
              </p>

              <ul className="space-y-2">
                {product.highlights.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-[#161615] flex items-start gap-2.5"
                  >
                    <span
                      className="text-[#0F6E4A] font-semibold select-none"
                      aria-hidden="true"
                    >
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-[#E5E3DD] rounded-xl overflow-hidden">
              <div className="bg-[#F8F7F4] px-4 py-2.5 border-b border-[#E5E3DD]">
                <h2 className="text-xs font-semibold text-[#161615]">
                  Fiche technique &amp; caractéristiques du lot
                </h2>
              </div>
              <dl className="divide-y divide-[#F0EEE8] text-xs sm:text-sm">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="px-4 py-2.5 flex items-center justify-between gap-4"
                  >
                    <dt className="text-[#575652]">{row.label}</dt>
                    <dd className="font-medium text-[#161615] text-right tabular-nums">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <section className="mt-12 sm:mt-16 pt-10 border-t border-[#E5E3DD]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#161615]">
              Autres offres tropicales disponibles
            </h2>
            <button
              type="button"
              onClick={onBackToCatalog}
              className="text-xs sm:text-sm font-semibold text-[#0F6E4A] hover:underline cursor-pointer whitespace-nowrap"
            >
              Tout voir
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                justAdded={recentlyAddedId === rel.id}
                onSelectProduct={onSelectProduct}
                onQuickAdd={(p, pack) => onAddToCart(p, pack, 1)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
