import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileSpreadsheet, Search } from 'lucide-react';
import { AgroSpecsModal } from './components/AgroSpecsModal';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { EquipmentPage } from './components/EquipmentPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { QuotePage } from './components/QuotePage';
import { SourcingSection } from './components/SourcingSection';
import {
  AGRO_PRODUCTS,
  AgroCategory,
  PackOption,
  Product,
} from './data/products';
import { CartItem } from './utils/whatsapp';

type FilterTab = 'all' | AgroCategory;

type ActiveRoute =
  | { type: 'home' }
  | { type: 'product'; product: Product; packId?: string }
  | { type: 'quote'; initialProduct?: Product | null }
  | { type: 'equipment' };

const CART_STORAGE_KEY = 'komersi_agro_cart_v1';
const DEFAULT_PAGE_TITLE = 'Komersi — Négoce & Produits Tropicaux du Bénin';

const CATEGORY_TABS: Array<{ id: FilterTab; label: string }> = [
  { id: 'all', label: 'Toutes les filières' },
  { id: 'cereales', label: 'Céréales & Graines' },
  { id: 'cafe-cacao', label: 'Café & Cacao' },
  { id: 'oleagineux', label: 'Oléagineux & Karité' },
  { id: 'cajou', label: 'Cajou & Amandes' },
  { id: 'fruits', label: 'Fruits, Miel & Épices' },
];

function resolveRouteFromLocation(): ActiveRoute {
  if (typeof window === 'undefined') return { type: 'home' };

  const path = window.location.pathname;
  if (/^\/devis\/?$/.test(path)) {
    return { type: 'quote' };
  }

  const pathMatch = path.match(/^\/produit\/([^/]+)\/?$/);
  if (pathMatch && pathMatch[1]) {
    const slug = decodeURIComponent(pathMatch[1]);
    const found = AGRO_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
    if (found) return { type: 'product', product: found };
  }

  if (/^\/materiels\/?$/.test(path)) {
    return { type: 'equipment' };
  }

  const params = new URLSearchParams(window.location.search);
  if (
    params.get('section') === 'materiels' ||
    params.get('page') === 'materiels'
  ) {
    return { type: 'equipment' };
  }

  const querySlug = params.get('produit');
  if (querySlug) {
    const found = AGRO_PRODUCTS.find(
      (p) => p.slug === querySlug || p.id === querySlug
    );
    if (found) return { type: 'product', product: found };
  }

  return { type: 'home' };
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<FilterTab>('all');
  const [preferredTier, setPreferredTier] = useState<
    'Détail' | 'Demi-gros' | 'Gros' | null
  >(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>(() =>
    resolveRouteFromLocation()
  );
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'checkout' | 'tracking'>(
    'checkout'
  );
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(
          (entry: { productId: string; packId: string; quantity: number }) => {
            const product = AGRO_PRODUCTS.find((p) => p.id === entry.productId);
            if (!product) return null;
            const pack =
              product.packs.find((pk) => pk.id === entry.packId) ??
              product.packs[0];
            return {
              product,
              pack,
              quantity: Math.max(1, entry.quantity || 1),
            };
          }
        )
        .filter((x): x is CartItem => x !== null);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const serializable = cartItems.map((item) => ({
        productId: item.product.id,
        packId: item.pack.id,
        quantity: item.quantity,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignore storage errors
    }
  }, [cartItems]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveRoute(resolveRouteFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (activeRoute.type === 'product') {
      document.title = `${activeRoute.product.name} — Komersi`;
    } else if (activeRoute.type === 'quote') {
      document.title = 'Devis Gros & Négoce Agro — Komersi';
    } else if (activeRoute.type === 'equipment') {
      document.title = 'Matériels & Équipements Agricoles — Komersi';
    } else {
      document.title = DEFAULT_PAGE_TITLE;
    }
  }, [activeRoute]);

  const openProductPage = useCallback((product: Product, packId?: string) => {
    setActiveRoute({ type: 'product', product, packId });
    const targetUrl = `/produit/${product.slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ productSlug: product.slug }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openQuotePage = useCallback((initialProduct?: Product | null) => {
    setActiveRoute({ type: 'quote', initialProduct });
    if (window.location.pathname !== '/devis') {
      window.history.pushState({ page: 'devis' }, '', '/devis');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback(() => {
    setActiveRoute({ type: 'home' });
    if (window.location.pathname !== '/' || window.location.search !== '') {
      window.history.pushState(null, '', '/');
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return AGRO_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all'
          ? true
          : product.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        product.name.toLowerCase().includes(query) ||
        product.categoryLabel.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query) ||
        product.gradeLabel.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = (
    product: Product,
    pack: PackOption,
    quantity = 1
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.pack.id === pack.id);
      if (existingIndex === -1) {
        return [...prev, { product, pack, quantity }];
      }
      return prev.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1400);
  };

  const handleDirectWhatsAppCheckout = (
    product: Product,
    pack: PackOption,
    quantity: number
  ) => {
    setCartItems((prev) => {
      const exists = prev.some((item) => item.pack.id === pack.id);
      if (exists) {
        return prev.map((item) =>
          item.pack.id === pack.id ? { ...item, quantity } : item
        );
      }
      return [...prev, { product, pack, quantity }];
    });
    setDrawerTab('checkout');
    setIsDrawerOpen(true);
  };

  const handleUpdateQuantity = (packId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(packId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.pack.id === packId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (packId: string) => {
    setCartItems((prev) => prev.filter((item) => item.pack.id !== packId));
  };

  const handleBrowseCatalog = (tier?: 'Détail' | 'Demi-gros' | 'Gros') => {
    if (tier) {
      setPreferredTier(tier);
    }
    goHome();
    requestAnimationFrame(() => {
      const el = document.getElementById('catalogue');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#161615]">
      <Header
        cartCount={cartCount}
        onOpenCart={() => {
          setDrawerTab('checkout');
          setIsDrawerOpen(true);
        }}
        onGoHome={goHome}
        onOpenQuotePage={() => openQuotePage(null)}
        onSelectCategory={setSelectedCategory}
      />

      <main className="flex-1">
        {activeRoute.type === 'product' ? (
          <ProductPage
            product={activeRoute.product}
            initialPackId={activeRoute.packId}
            recentlyAddedId={recentlyAddedId}
            onBackToCatalog={goHome}
            onSelectProduct={openProductPage}
            onAddToCart={handleAddToCart}
            onDirectWhatsAppCheckout={handleDirectWhatsAppCheckout}
            onOpenQuotePage={(prod) => openQuotePage(prod)}
          />
        ) : activeRoute.type === 'quote' ? (
          <QuotePage
            initialProduct={activeRoute.initialProduct}
            onBackToCatalog={goHome}
          />
        ) : activeRoute.type === 'equipment' ? (
          <EquipmentPage onBackToHome={goHome} />
        ) : (
          <>
            <Hero
              onBrowseCatalog={handleBrowseCatalog}
              onOpenBulkQuote={() => openQuotePage(null)}
              onOpenSpecsTable={() => setIsSpecsModalOpen(true)}
            />

            <section
              id="catalogue"
              className="w-full px-3 sm:px-6 lg:px-10 xl:px-14 py-10 sm:py-16"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 sm:mb-8">
                <div>
                  <p className="text-xs font-medium text-[#0F6E4A] mb-1.5">
                    Catalogue tropical · Récoltes du Bénin
                  </p>
                  <h2
                    className="font-display text-2xl sm:text-3xl font-bold text-[#161615] tracking-tight"
                    style={{ textWrap: 'balance' }}
                  >
                    Offres disponibles au détail et en gros
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search
                      className="w-4 h-4 text-[#575652] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Maïs 100 kg, café, cacao, karité..."
                      aria-label="Rechercher une matière première agro"
                      className="w-full sm:w-64 pl-9 pr-3.5 py-2 text-sm bg-white border border-[#E5E3DD] rounded-lg text-[#161615] placeholder:text-[#575652] focus:outline-none focus:border-[#0F6E4A] min-h-[40px]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSpecsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#161615] bg-white border border-[#E5E3DD] hover:border-[#0F6E4A] rounded-lg transition-colors cursor-pointer min-h-[40px] whitespace-nowrap"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#0F6E4A]" />
                    <span>Mercuriale agro</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6 sm:mb-8">
                <div
                  className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#ECEAE4] rounded-lg w-full lg:w-fit"
                  role="tablist"
                  aria-label="Filtrer par filière agricole"
                >
                  {CATEGORY_TABS.map((tab) => {
                    const isActive = selectedCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedCategory(tab.id)}
                        className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[38px] ${
                          isActive
                            ? 'bg-white text-[#161615] shadow-xs'
                            : 'text-[#575652] hover:text-[#161615]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div
                  className="flex items-center gap-1 p-1 bg-[#ECEAE4] rounded-lg w-fit shrink-0"
                  role="group"
                  aria-label="Affichage tarifaire global"
                >
                  {(['Détail', 'Demi-gros', 'Gros'] as const).map((tier) => {
                    const isActive = preferredTier === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() =>
                          setPreferredTier((curr) =>
                            curr === tier ? null : tier
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#0F6E4A] text-white'
                            : 'text-[#575652] hover:text-[#161615]'
                        }`}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#E5E3DD] p-10 text-center">
                  <p className="font-display text-lg font-bold text-[#161615] mb-1.5">
                    Aucune matière première trouvée
                  </p>
                  <p className="text-sm text-[#575652] mb-5">
                    Essayez un autre mot-clé ou réinitialisez la filière
                    sélectionnée.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors cursor-pointer min-h-[40px]"
                  >
                    Afficher toutes les filières
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      preferredTier={preferredTier}
                      justAdded={recentlyAddedId === product.id}
                      onSelectProduct={openProductPage}
                      onQuickAdd={(p, pack) => handleAddToCart(p, pack, 1)}
                    />
                  ))}
                </div>
              )}
            </section>

            <SourcingSection />
          </>
        )}
      </main>

      <Footer />

      <AgroSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        onSelectProduct={openProductPage}
      />

      <CheckoutDrawer
        isOpen={isDrawerOpen}
        initialTab={drawerTab}
        items={cartItems}
        onClose={() => setIsDrawerOpen(false)}
        onOpenQuotePage={() => openQuotePage(null)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
