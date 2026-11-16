import { ShoppingBag } from 'lucide-react';
import { AgroCategory } from '../data/products';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onGoHome: () => void;
  onOpenQuotePage: () => void;
  onSelectCategory: (category: 'all' | AgroCategory) => void;
}

export function Header({
  cartCount,
  onOpenCart,
  onGoHome,
  onOpenQuotePage,
  onSelectCategory,
}: HeaderProps) {
  const handleNavFilter = (
    e: React.MouseEvent<HTMLAnchorElement>,
    category: 'all' | AgroCategory
  ) => {
    e.preventDefault();
    onSelectCategory(category);
    onGoHome();
    requestAnimationFrame(() => {
      const el = document.getElementById('catalogue');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-sm border-b border-[#E5E3DD]">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-16 flex items-center justify-between gap-8">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-xl font-bold tracking-tight text-[#161615] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F6E4A]"
        >
          Komersi
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#575652]"
        >
          <a
            href="#catalogue"
            onClick={(e) => handleNavFilter(e, 'all')}
            className="hover:text-[#161615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Filières
          </a>
          <a
            href="#catalogue"
            onClick={(e) => handleNavFilter(e, 'cereales')}
            className="hover:text-[#161615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Céréales
          </a>
          <a
            href="#catalogue"
            onClick={(e) => handleNavFilter(e, 'cafe-cacao')}
            className="hover:text-[#161615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Café &amp; Cacao
          </a>
          <a
            href="/devis"
            onClick={(e) => {
              e.preventDefault();
              onOpenQuotePage();
            }}
            className="hover:text-[#161615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Devis Gros
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E4A]"
            aria-label={`Ouvrir le panier (${cartCount} article${
              cartCount > 1 ? 's' : ''
            })`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">Panier ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
