import {
  ArrowRight,
  ArrowUpRight,
  FileSpreadsheet,
  MessageCircle,
  PackageCheck,
} from 'lucide-react';
import {
  HERO_AGRO_IMAGE,
  WHATSAPP_DIRECT_LINK,
  WHATSAPP_DISPLAY_NUMBER,
} from '../data/products';
import { ProductImage } from './ProductImage';

interface HeroProps {
  onBrowseCatalog: (preferredTier?: 'Détail' | 'Gros') => void;
  onOpenBulkQuote: () => void;
  onOpenSpecsTable: () => void;
}

export function Hero({
  onBrowseCatalog,
  onOpenBulkQuote,
  onOpenSpecsTable,
}: HeroProps) {
  return (
    <section id="top" className="border-b border-[#E5E3DD] bg-[#F8F7F4]">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-1">
            <p className="text-xs sm:text-sm font-medium text-[#0F6E4A] tracking-wide mb-3">
              Filières tropicales du Bénin · Détail, demi-gros &amp; gros
            </p>

            <h1
              className="font-display font-bold tracking-tight text-[#161615] leading-[1.08] mb-5 max-w-xl"
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3.25rem)',
                textWrap: 'balance',
              }}
            >
              Matières premières et récoltes tropicales du Bénin, en direct.
            </h1>

            <p className="text-base sm:text-lg text-[#575652] leading-relaxed max-w-lg mb-8">
              Approvisionnement agropastoral pour particuliers, artisans et
              transformateurs : karité brut, amandes de cajou, soja trié,
              huile de palme rouge et fruits séchés avec fiches techniques
              vérifiées.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onBrowseCatalog()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E4A]"
              >
                <span>Parcourir les offres agro</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenBulkQuote}
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-[#161615] hover:text-[#0F6E4A] underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                Devis gros &amp; négoce
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[240px] sm:min-h-[340px] rounded-xl overflow-hidden bg-[#ECEAE4] border border-[#E5E3DD]">
              <ProductImage
                src={HERO_AGRO_IMAGE}
                alt="Matières premières agricoles et produits tropicaux du Bénin : beurre de karité brut, amandes de cajou, soja non-OGM, bissap et huile de palme rouge"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#E5E3DD] grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
          <button
            type="button"
            onClick={() => onBrowseCatalog('Gros')}
            className="group text-left bg-white hover:bg-[#FCFCFA] rounded-xl border border-[#E5E3DD] hover:border-[#0F6E4A]/45 p-4 sm:p-5 transition-colors cursor-pointer flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#0F6E4A] mb-1">
                  Tarification par volume
                </p>
                <h2 className="font-display text-base sm:text-lg font-bold text-[#161615]">
                  Détail, Demi-gros &amp; Gros
                </h2>
              </div>
              <PackageCheck
                className="w-5 h-5 text-[#0F6E4A] shrink-0"
                aria-hidden="true"
              />
            </div>
            <p className="text-xs sm:text-sm text-[#575652] leading-relaxed">
              Conditionnements adaptés du sachet 500 g au sac de 100 kg avec
              prix dégressifs immédiats.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#161615] group-hover:text-[#0F6E4A] transition-colors">
              <span>Afficher les tarifs gros</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenSpecsTable}
            className="group text-left bg-white hover:bg-[#FCFCFA] rounded-xl border border-[#E5E3DD] hover:border-[#0F6E4A]/45 p-4 sm:p-5 transition-colors cursor-pointer flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#0F6E4A] mb-1">
                  Mercuriale &amp; Qualité
                </p>
                <h2 className="font-display text-base sm:text-lg font-bold text-[#161615]">
                  Fiches Techniques Agro
                </h2>
              </div>
              <FileSpreadsheet
                className="w-5 h-5 text-[#0F6E4A] shrink-0"
                aria-hidden="true"
              />
            </div>
            <p className="text-xs sm:text-sm text-[#575652] leading-relaxed">
              Calibre, humidité maximale, pureté et volumes disponibles vérifiés
              pour chaque lot.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#161615] group-hover:text-[#0F6E4A] transition-colors">
              <span>Consulter le tableau comparatif</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </button>

          <a
            href={`${WHATSAPP_DIRECT_LINK}?text=${encodeURIComponent(
              'Bonjour Komersi, je souhaite commander ou obtenir un tarif pour vos produits agro du Bénin.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-left bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-xl border border-[#0F6E4A] p-4 sm:p-5 transition-colors flex flex-col justify-between gap-3 text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-white/80 mb-1">
                  Commande directe WhatsApp
                </p>
                <h2 className="font-mono text-lg sm:text-xl font-semibold tracking-tight tabular-nums">
                  {WHATSAPP_DISPLAY_NUMBER}
                </h2>
              </div>
              <MessageCircle
                className="w-5 h-5 text-white shrink-0"
                aria-hidden="true"
              />
            </div>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Validation rapide de commande, réservation de lot ou demande de
              cotation en un message.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
              <span>Démarrer sur WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
