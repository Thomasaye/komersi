import { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { AGRO_PRODUCTS, Product } from '../data/products';
import { formatFcfa } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface AgroSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product, packId?: string) => void;
}

export function AgroSpecsModal({
  isOpen,
  onClose,
  onSelectProduct,
}: AgroSpecsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#161615]/55 backdrop-blur-[2px] p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mercuriale-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-t-2xl sm:rounded-2xl border border-[#E5E3DD] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 sm:px-6 py-4 border-b border-[#E5E3DD] flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#0F6E4A]">
              Mercuriale &amp; Fiches Techniques Agro
            </p>
            <h2
              id="mercuriale-title"
              className="font-display text-lg sm:text-xl font-bold text-[#161615]"
            >
              Tableau comparatif des matières premières du Bénin
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-[#575652] hover:text-[#161615] rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Fermer le tableau technique"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="hidden md:block border border-[#E5E3DD] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F7F4] border-b border-[#E5E3DD] text-xs font-semibold text-[#575652]">
                  <th className="py-3 px-4">Matière première</th>
                  <th className="py-3 px-4">Calibre / Pureté</th>
                  <th className="py-3 px-4">Humidité max</th>
                  <th className="py-3 px-4">Stock disponible</th>
                  <th className="py-3 px-4 text-right">Détail</th>
                  <th className="py-3 px-4 text-right">Tarif Gros</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEE8] text-sm">
                {AGRO_PRODUCTS.map((product) => {
                  const retailPack = product.packs[0];
                  const bulkPack = product.packs[product.packs.length - 1];

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#F8F7F4]/70 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#ECEAE4] shrink-0">
                            <ProductImage
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-[#161615] leading-snug">
                              {product.name}
                            </p>
                            <p className="font-mono text-xs text-[#575652]">
                              {product.sku} · {product.gradeLabel}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#161615]">
                        {product.technicalSpecs.purityOrCaliber}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#575652] tabular-nums">
                        {product.technicalSpecs.moistureMax}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#0F6E4A] font-medium tabular-nums">
                        {product.technicalSpecs.availableVolume}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums">
                        <span className="font-semibold text-[#161615] block">
                          {formatFcfa(retailPack.priceFcfa)}
                        </span>
                        <span className="text-[#575652]">{retailPack.label}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums">
                        <span className="font-semibold text-[#0F6E4A] block">
                          {formatFcfa(bulkPack.priceFcfa)}
                        </span>
                        <span className="text-[#575652]">{bulkPack.label}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectProduct(product, bulkPack.id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#161615] bg-[#F4F2ED] hover:bg-[#E7E4DC] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <span>Fiche</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-3 md:hidden">
            {AGRO_PRODUCTS.map((product) => {
              const retailPack = product.packs[0];
              const bulkPack = product.packs[product.packs.length - 1];

              return (
                <div
                  key={product.id}
                  className="border border-[#E5E3DD] rounded-xl p-4 space-y-3 bg-[#F8F7F4]/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#ECEAE4] shrink-0">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-[#161615] truncate">
                        {product.name}
                      </p>
                      <p className="font-mono text-xs text-[#575652]">
                        {product.sku} · {product.technicalSpecs.availableVolume}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E5E3DD]">
                    <div>
                      <span className="text-[#575652] block">Calibre / Pureté</span>
                      <span className="font-medium text-[#161615]">
                        {product.technicalSpecs.purityOrCaliber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#575652] block">Humidité / Seuil</span>
                      <span className="font-mono font-medium text-[#161615] tabular-nums">
                        {product.technicalSpecs.moistureMax}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#575652] block">
                        Détail ({retailPack.label})
                      </span>
                      <span className="font-mono font-semibold text-[#161615] tabular-nums">
                        {formatFcfa(retailPack.priceFcfa)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#575652] block">
                        Gros ({bulkPack.label})
                      </span>
                      <span className="font-mono font-semibold text-[#0F6E4A] tabular-nums">
                        {formatFcfa(bulkPack.priceFcfa)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product, bulkPack.id);
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors cursor-pointer min-h-[40px]"
                  >
                    Ouvrir la fiche &amp; commander
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
