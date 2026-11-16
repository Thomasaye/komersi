import { useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { PackOption, Product } from '../data/products';
import { formatFcfa } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  preferredTier?: 'Détail' | 'Demi-gros' | 'Gros' | null;
  justAdded: boolean;
  onSelectProduct: (product: Product, initialPackId?: string) => void;
  onQuickAdd: (product: Product, pack: PackOption) => void;
}

export function ProductCard({
  product,
  preferredTier,
  justAdded,
  onSelectProduct,
  onQuickAdd,
}: ProductCardProps) {
  const [selectedPackId, setSelectedPackId] = useState(
    product.defaultPackId || product.packs[0].id
  );

  useEffect(() => {
    if (!preferredTier) return;
    const match = product.packs.find((p) => p.tierLabel === preferredTier);
    if (match) {
      setSelectedPackId(match.id);
    }
  }, [preferredTier, product.packs]);

  const activePack =
    product.packs.find((p) => p.id === selectedPackId) ?? product.packs[0];

  const productHref = `/produit/${product.slug}`;

  return (
    <article className="group bg-white rounded-xl border border-[#E5E3DD] overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md min-w-0">
      <a
        href={productHref}
        onClick={(e) => {
          e.preventDefault();
          onSelectProduct(product, activePack.id);
        }}
        className="block w-full aspect-[4/3] bg-[#ECEAE4] overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0F6E4A]"
        aria-label={`Voir la fiche technique de ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </a>

      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between gap-2.5 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs text-[#575652] truncate mb-1">
            {product.categoryLabel}
          </p>

          <h3 className="text-xs sm:text-base font-semibold text-[#161615] leading-snug line-clamp-2 mb-1">
            <a
              href={productHref}
              onClick={(e) => {
                e.preventDefault();
                onSelectProduct(product, activePack.id);
              }}
              className="text-left hover:text-[#0F6E4A] transition-colors cursor-pointer"
            >
              {product.name}
            </a>
          </h3>

          <p className="hidden sm:block text-sm text-[#575652] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3 min-w-0">
          <div
            className="grid grid-cols-3 gap-1 p-0.5 bg-[#F4F2ED] rounded-lg"
            role="group"
            aria-label={`Choisir le conditionnement pour ${product.name}`}
          >
            {product.packs.map((pack) => {
              const isSelected = pack.id === activePack.id;
              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`py-1 px-1 text-[10px] sm:text-xs font-medium rounded-md transition-colors cursor-pointer truncate ${
                    isSelected
                      ? 'bg-white text-[#161615] shadow-xs'
                      : 'text-[#575652] hover:text-[#161615]'
                  }`}
                >
                  {pack.tierLabel}
                </button>
              );
            })}
          </div>

          <div className="pt-2.5 border-t border-[#F0EEE8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <p className="font-mono text-sm sm:text-base font-semibold text-[#161615] tabular-nums truncate">
                {formatFcfa(activePack.priceFcfa)}
              </p>
              <p className="text-[11px] sm:text-xs text-[#575652] truncate">
                {activePack.label}
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSelectProduct(product, activePack.id)}
                className="flex-1 sm:flex-initial px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold text-[#161615] bg-[#F4F2ED] hover:bg-[#E7E4DC] rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[40px] flex items-center justify-center"
              >
                Fiche
              </button>

              <button
                type="button"
                onClick={() => onQuickAdd(product, activePack)}
                className={`inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[40px] min-w-[40px] ${
                  justAdded
                    ? 'bg-[#161615] text-white'
                    : 'bg-[#0F6E4A] hover:bg-[#0C5A3C] text-white'
                }`}
                aria-label={`Ajouter ${product.name} (${activePack.label}) au panier`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">Ajouté</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">Ajouter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
