import { WHATSAPP_DIRECT_LINK, WHATSAPP_DISPLAY_NUMBER } from '../data/products';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5E3DD] bg-[#F8F7F4] py-10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg font-bold text-[#161615]">
            Komersi
          </p>
          <p className="text-xs text-[#575652] mt-1">
            Matières premières &amp; produits tropicaux du Bénin · komersi.store
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#575652]">
          <a
            href="#catalogue"
            className="hover:text-[#161615] transition-colors"
          >
            Offres agro
          </a>
          <a
            href="#espace-agro"
            className="hover:text-[#161615] transition-colors"
          >
            Négoce &amp; Qualité
          </a>
          <a
            href={WHATSAPP_DIRECT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-semibold text-[#0F6E4A] hover:underline tabular-nums"
          >
            WhatsApp {WHATSAPP_DISPLAY_NUMBER}
          </a>
          <span>© {year} Komersi</span>
        </div>
      </div>
    </footer>
  );
}
