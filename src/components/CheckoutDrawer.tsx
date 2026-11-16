import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  DELIVERY_ZONES,
  FREE_DELIVERY_THRESHOLD_FCFA,
  WHATSAPP_DISPLAY_NUMBER,
} from '../data/products';
import {
  buildGoogleSheetsPayload,
  buildNotionDatabasePayload,
  buildWhatsAppOrderMessage,
  calculateOrderTotals,
  CartItem,
  CustomerOrderInput,
  formatFcfa,
  generateOrderId,
  generateWhatsAppCheckoutUrl,
  getSavedOrders,
  KomersiOrderRecord,
  PaymentMethod,
  recordAndDispatchOrder,
  sanitizePhoneDigits,
} from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface CheckoutDrawerProps {
  isOpen: boolean;
  initialTab?: 'checkout' | 'tracking';
  items: CartItem[];
  onClose: () => void;
  onOpenQuotePage: () => void;
  onUpdateQuantity: (packId: string, quantity: number) => void;
  onRemoveItem: (packId: string) => void;
  onClearCart: () => void;
}

const PAYMENT_OPTIONS: PaymentMethod[] = [
  'Paiement à la livraison',
  'Mobile Money (MTN / Moov / Celtiis)',
  'Virement / Chèque Entreprise',
];

const BUYER_TYPES: NonNullable<CustomerOrderInput['buyerType']>[] = [
  'Particulier / Ménage',
  'Transformateur / Commerçant',
  'Export / Grossiste',
];

export function CheckoutDrawer({
  isOpen,
  initialTab = 'checkout',
  items,
  onClose,
  onOpenQuotePage,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CheckoutDrawerProps) {
  const [activeTab, setActiveTab] = useState<'checkout' | 'tracking'>(
    initialTab
  );
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zoneId, setZoneId] = useState(DELIVERY_ZONES[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    'Paiement à la livraison'
  );
  const [buyerType, setBuyerType] = useState<
    NonNullable<CustomerOrderInput['buyerType']>
  >('Particulier / Ménage');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] =
    useState<KomersiOrderRecord | null>(null);
  const [savedOrders, setSavedOrders] = useState<KomersiOrderRecord[]>([]);
  const [copiedPayloadId, setCopiedPayloadId] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'sheets' | 'notion'>(
    'sheets'
  );

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSavedOrders(getSavedOrders());
      setFormError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const totals = useMemo(
    () => calculateOrderTotals(items, zoneId),
    [items, zoneId]
  );

  const liveCustomerInput: CustomerOrderInput = useMemo(
    () => ({
      fullName: fullName || 'Acheteur Komersi',
      phone: phone || '+229 ...',
      address: address || 'Destination à préciser',
      zoneId,
      paymentMethod,
      buyerType,
      note,
    }),
    [fullName, phone, address, zoneId, paymentMethod, buyerType, note]
  );

  const previewMessage = useMemo(() => {
    if (items.length === 0) return '';
    return buildWhatsAppOrderMessage(
      'KMR-APERÇU',
      items,
      liveCustomerInput,
      totals
    );
  }, [items, liveCustomerInput, totals]);

  const directPreviewUrl = useMemo(() => {
    if (items.length === 0) return '#';
    const orderRef = generateOrderId();
    const msg = buildWhatsAppOrderMessage(
      orderRef,
      items,
      {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        zoneId,
        paymentMethod,
        buyerType,
        note: note.trim(),
      },
      totals
    );
    return generateWhatsAppCheckoutUrl(msg);
  }, [
    items,
    fullName,
    phone,
    address,
    zoneId,
    paymentMethod,
    buyerType,
    note,
    totals,
  ]);

  if (!isOpen) return null;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (items.length === 0) {
      setFormError('Votre panier est vide. Ajoutez au moins un produit agro.');
      return;
    }

    if (fullName.trim().length < 2) {
      setFormError('Veuillez renseigner votre nom ou raison sociale.');
      return;
    }

    const digits = sanitizePhoneDigits(phone);
    if (digits.length < 8) {
      setFormError(
        'Veuillez saisir un numéro de téléphone valide (ex: 01 96 98 51 29).'
      );
      return;
    }

    if (address.trim().length < 4) {
      setFormError('Veuillez indiquer votre adresse ou point de livraison.');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await recordAndDispatchOrder(items, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        zoneId,
        paymentMethod,
        buyerType,
        note: note.trim(),
      });
      setConfirmedOrder(record);
      setSavedOrders(getSavedOrders());
      onClearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPayload = async (order: KomersiOrderRecord) => {
    const payload =
      exportFormat === 'sheets'
        ? buildGoogleSheetsPayload(order)
        : buildNotionDatabasePayload(order);
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopiedPayloadId(order.orderId);
      setTimeout(() => setCopiedPayloadId(null), 2000);
    } catch {
      // Clipboard fallback ignored if blocked by browser policy
    }
  };

  const remainingForFreeShipping = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD_FCFA - totals.subtotalFcfa
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#161615]/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Panier et suivi WhatsApp"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#F8F7F4] h-full flex flex-col border-l border-[#E5E3DD] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white px-4 sm:px-5 py-3.5 border-b border-[#E5E3DD] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#F4F2ED] rounded-lg">
            <button
              type="button"
              onClick={() => {
                setActiveTab('checkout');
                setConfirmedOrder(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'checkout'
                  ? 'bg-white text-[#161615] shadow-xs'
                  : 'text-[#575652] hover:text-[#161615]'
              }`}
            >
              Panier
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'tracking'
                  ? 'bg-white text-[#161615] shadow-xs'
                  : 'text-[#575652] hover:text-[#161615]'
              }`}
            >
              Suivi ({savedOrders.length})
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQuotePage();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-[#0F6E4A] hover:text-[#0C5A3C] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Page Devis
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#575652] hover:text-[#161615] rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
            aria-label="Fermer le panneau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeTab === 'checkout' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {confirmedOrder ? (
              <div className="bg-white rounded-xl border border-[#E5E3DD] p-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#0F6E4A] mb-1">
                    Commande prête · {confirmedOrder.status}
                  </p>
                  <h3 className="font-display text-xl font-bold text-[#161615]">
                    Référence {confirmedOrder.orderId}
                  </h3>
                  <p className="text-sm text-[#575652] mt-1">
                    Cliquez ci-dessous pour transmettre votre commande sur le
                    WhatsApp Komersi ({WHATSAPP_DISPLAY_NUMBER}).
                  </p>
                </div>

                <div className="bg-[#F8F7F4] rounded-lg border border-[#E5E3DD] p-4 space-y-2 text-sm">
                  {confirmedOrder.items.map((item) => (
                    <div
                      key={`${item.sku}-${item.packLabel}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-[#161615]">
                        {item.name} ({item.packLabel}) × {item.quantity}
                      </span>
                      <span className="font-mono font-medium tabular-nums text-[#161615] shrink-0">
                        {formatFcfa(item.lineTotalFcfa)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#E5E3DD] flex items-center justify-between font-semibold text-[#161615]">
                    <span>Total à régler</span>
                    <span className="font-mono tabular-nums">
                      {formatFcfa(confirmedOrder.totalFcfa)}
                    </span>
                  </div>
                </div>

                <a
                  href={confirmedOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors min-h-[48px]"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Envoyer sur WhatsApp ({WHATSAPP_DISPLAY_NUMBER})
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('tracking')}
                    className="text-xs font-semibold text-[#0F6E4A] hover:underline cursor-pointer"
                  >
                    Exporter JSON Sheets / Notion
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmedOrder(null)}
                    className="text-xs font-medium text-[#575652] hover:text-[#161615] cursor-pointer"
                  >
                    Nouvelle commande
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E5E3DD] p-8 text-center">
                <p className="font-display text-lg font-bold text-[#161615] mb-1.5">
                  Votre panier agro est vide
                </p>
                <p className="text-sm text-[#575652] mb-5">
                  Sélectionnez une matière première ou ouvrez la page devis pour
                  estimer vos lots en gros.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] rounded-lg transition-colors cursor-pointer min-h-[44px]"
                  >
                    Voir les offres agro
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenQuotePage();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-[#161615] bg-[#F4F2ED] hover:bg-[#E7E4DC] rounded-lg transition-colors cursor-pointer min-h-[44px]"
                  >
                    Ouvrir la page Devis
                  </button>
                </div>
              </div>
            ) : (
              <>
                <section aria-label="Lots sélectionnés" className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#161615]">
                      Votre sélection (
                      {items.reduce((s, i) => s + i.quantity, 0)})
                    </h3>
                    {remainingForFreeShipping > 0 ? (
                      <span className="text-xs text-[#575652] tabular-nums">
                        Port offert dès{' '}
                        {formatFcfa(FREE_DELIVERY_THRESHOLD_FCFA)}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[#0F6E4A]">
                        Port offert appliqué
                      </span>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border border-[#E5E3DD] divide-y divide-[#F0EEE8]">
                    {items.map(({ product, pack, quantity }) => (
                      <div
                        key={pack.id}
                        className="p-3.5 flex items-center gap-3.5"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#ECEAE4] shrink-0">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#161615] truncate">
                            {product.name}
                          </p>
                          <p className="font-mono text-xs text-[#575652] tabular-nums mt-0.5 truncate">
                            {pack.label} · {formatFcfa(pack.priceFcfa)}
                          </p>

                          <div className="flex items-center gap-3 mt-2">
                            <div className="inline-flex items-center border border-[#E5E3DD] rounded-md bg-[#F8F7F4]">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(pack.id, quantity - 1)
                                }
                                className="p-1.5 text-[#161615] hover:bg-[#ECEAE4] rounded-l-md cursor-pointer"
                                aria-label={`Diminuer la quantité de ${product.name}`}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 font-mono text-xs font-semibold tabular-nums">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(pack.id, quantity + 1)
                                }
                                className="p-1.5 text-[#161615] hover:bg-[#ECEAE4] rounded-r-md cursor-pointer"
                                aria-label={`Augmenter la quantité de ${product.name}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveItem(pack.id)}
                              className="p-1.5 text-[#575652] hover:text-red-700 transition-colors cursor-pointer"
                              aria-label={`Retirer ${product.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-mono text-sm font-semibold text-[#161615] tabular-nums">
                            {formatFcfa(pack.priceFcfa * quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <form onSubmit={handleConfirmOrder} className="space-y-4">
                  <div className="bg-white rounded-xl border border-[#E5E3DD] p-4 sm:p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-[#161615]">
                      Coordonnées &amp; Acheminement
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="kmr-name"
                          className="block text-xs font-medium text-[#575652] mb-1.5"
                        >
                          Nom complet ou Entreprise *
                        </label>
                        <input
                          id="kmr-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Ex: Codjo Adjovi"
                          className="w-full px-3.5 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="kmr-buyer-type"
                          className="block text-xs font-medium text-[#575652] mb-1.5"
                        >
                          Profil acheteur
                        </label>
                        <select
                          id="kmr-buyer-type"
                          value={buyerType}
                          onChange={(e) =>
                            setBuyerType(
                              e.target.value as NonNullable<
                                CustomerOrderInput['buyerType']
                              >
                            )
                          }
                          className="w-full px-3 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                        >
                          {BUYER_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="kmr-phone"
                          className="block text-xs font-medium text-[#575652] mb-1.5"
                        >
                          Téléphone (WhatsApp) *
                        </label>
                        <input
                          id="kmr-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="01 96 98 51 29"
                          className="w-full px-3.5 py-2.5 text-sm font-mono text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="kmr-zone"
                          className="block text-xs font-medium text-[#575652] mb-1.5"
                        >
                          Mode de livraison
                        </label>
                        <select
                          id="kmr-zone"
                          value={zoneId}
                          onChange={(e) => setZoneId(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                        >
                          {DELIVERY_ZONES.map((z) => (
                            <option key={z.id} value={z.id}>
                              {z.label} (
                              {z.feeFcfa === 0
                                ? 'Gratuit'
                                : formatFcfa(z.feeFcfa)}
                              )
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="kmr-address"
                        className="block text-xs font-medium text-[#575652] mb-1.5"
                      >
                        Adresse / Point de réception *
                      </label>
                      <input
                        id="kmr-address"
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ex: Rue, quartier, unité ou point de repère"
                        className="w-full px-3.5 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="kmr-payment"
                          className="block text-xs font-medium text-[#575652] mb-1.5"
                        >
                          Règlement
                        </label>
                        <select
                          id="kmr-payment"
                          value={paymentMethod}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value as PaymentMethod)
                          }
                          className="w-full px-3 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                        >
                          {PAYMENT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="kmr-note"
                          className="block text-xs font-medium text-[#575652] mb-1.5"
                        >
                          Précision lot (optionnel)
                        </label>
                        <input
                          id="kmr-note"
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Ex: Enlèvement matinée"
                          className="w-full px-3.5 py-2.5 text-sm text-[#161615] bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg focus:outline-none focus:border-[#0F6E4A]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#E5E3DD] p-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-[#575652]">
                      <span>Sous-total marchandises</span>
                      <span className="font-mono tabular-nums text-[#161615]">
                        {formatFcfa(totals.subtotalFcfa)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#575652]">
                      <span>Acheminement ({totals.zone.eta})</span>
                      <span className="font-mono tabular-nums text-[#161615]">
                        {totals.deliveryFeeFcfa === 0
                          ? 'Offert / Dépôt'
                          : formatFcfa(totals.deliveryFeeFcfa)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#F0EEE8] flex items-center justify-between text-base font-semibold text-[#161615]">
                      <span>Total à payer</span>
                      <span className="font-mono tabular-nums">
                        {formatFcfa(totals.totalFcfa)}
                      </span>
                    </div>
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5"
                    >
                      {formError}
                    </p>
                  )}

                  <details className="bg-white rounded-xl border border-[#E5E3DD] p-3.5">
                    <summary className="text-xs font-semibold text-[#575652] cursor-pointer select-none">
                      Aperçu du message WhatsApp généré
                    </summary>
                    <pre className="mt-3 text-xs font-mono text-[#161615] whitespace-pre-wrap leading-relaxed bg-[#F8F7F4] p-3 rounded-lg border border-[#E5E3DD]">
                      {previewMessage}
                    </pre>
                  </details>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-[#0F6E4A] hover:bg-[#0C5A3C] disabled:opacity-60 rounded-lg transition-colors cursor-pointer min-h-[48px]"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>
                        {isSubmitting
                          ? 'Génération du lien WhatsApp...'
                          : `Valider & Envoyer (${WHATSAPP_DISPLAY_NUMBER})`}
                      </span>
                    </button>

                    {fullName.trim().length >= 2 &&
                      sanitizePhoneDigits(phone).length >= 8 &&
                      address.trim().length >= 4 && (
                        <a
                          href={directPreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#0F6E4A] hover:underline"
                        >
                          <span>Ou ouvrir directement dans WhatsApp</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                  </div>
                </form>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="bg-white rounded-xl border border-[#E5E3DD] p-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#161615]">
                  Export structuré Back-Office
                </h3>
                <p className="text-xs text-[#575652]">
                  Format prêt pour Webhook Make, Google Sheets ou Notion.
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-[#F4F2ED] rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setExportFormat('sheets')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                    exportFormat === 'sheets'
                      ? 'bg-white text-[#161615] shadow-xs'
                      : 'text-[#575652]'
                  }`}
                >
                  Sheets
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('notion')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                    exportFormat === 'notion'
                      ? 'bg-white text-[#161615] shadow-xs'
                      : 'text-[#575652]'
                  }`}
                >
                  Notion
                </button>
              </div>
            </div>

            {savedOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E5E3DD] p-8 text-center">
                <p className="text-sm font-semibold text-[#161615] mb-1">
                  Aucune commande enregistrée sur cet appareil
                </p>
                <p className="text-xs text-[#575652]">
                  Validez un panier via le tunnel WhatsApp pour retrouver ici le
                  récapitulatif de vos commandes.
                </p>
              </div>
            ) : (
              savedOrders.map((order) => {
                const payload =
                  exportFormat === 'sheets'
                    ? buildGoogleSheetsPayload(order)
                    : buildNotionDatabasePayload(order);
                return (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-xl border border-[#E5E3DD] p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs font-semibold text-[#0F6E4A]">
                          {order.orderId}
                        </p>
                        <p className="text-sm font-semibold text-[#161615]">
                          {order.customer.fullName} · {order.customer.phone}
                        </p>
                        <p className="text-xs text-[#575652]">
                          {order.customer.address}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono text-sm font-semibold text-[#161615] tabular-nums">
                          {formatFcfa(order.totalFcfa)}
                        </p>
                        <p className="text-xs text-[#575652]">{order.status}</p>
                      </div>
                    </div>

                    <pre className="text-[11px] font-mono bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg p-3 overflow-x-auto text-[#161615]">
                      {JSON.stringify(payload, null, 2)}
                    </pre>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopyPayload(order)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#161615] hover:text-[#0F6E4A] cursor-pointer"
                      >
                        {copiedPayloadId === order.orderId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#0F6E4A]" />
                            <span>JSON copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>
                              Copier JSON{' '}
                              {exportFormat === 'sheets' ? 'Sheets' : 'Notion'}
                            </span>
                          </>
                        )}
                      </button>

                      <a
                        href={order.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F6E4A] hover:underline"
                      >
                        <span>Rouvrir WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
