import {
  DELIVERY_ZONES,
  FREE_DELIVERY_THRESHOLD_FCFA,
  PackOption,
  Product,
} from '../data/products';

export interface CartItem {
  product: Product;
  pack: PackOption;
  quantity: number;
}

export type PaymentMethod =
  | 'Paiement à la livraison'
  | 'Mobile Money (MTN / Moov / Celtiis)'
  | 'Virement / Chèque Entreprise';

export interface CustomerOrderInput {
  fullName: string;
  phone: string;
  address: string;
  zoneId: string;
  paymentMethod: PaymentMethod;
  buyerType?: 'Particulier / Ménage' | 'Transformateur / Commerçant' | 'Export / Grossiste';
  note?: string;
}

export interface KomersiOrderRecord {
  orderId: string;
  createdAtIso: string;
  customer: CustomerOrderInput;
  items: Array<{
    sku: string;
    name: string;
    packLabel: string;
    unitPriceFcfa: number;
    quantity: number;
    lineTotalFcfa: number;
  }>;
  subtotalFcfa: number;
  deliveryFeeFcfa: number;
  totalFcfa: number;
  whatsappUrl: string;
  whatsappMessage: string;
  status: 'Envoyée sur WhatsApp' | 'Synchronisée Webhook';
}

const DEFAULT_WHATSAPP_NUMBER = '2290196985129';
const ORDERS_STORAGE_KEY = 'komersi_agro_orders_v1';

/**
 * Formate un montant en FCFA avec séparateur de milliers français.
 */
export function formatFcfa(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(amount))} FCFA`;
}

/**
 * Nettoie un numéro de téléphone (chiffres uniquement).
 */
export function sanitizePhoneDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

/**
 * Génère un identifiant court de commande agro.
 */
export function generateOrderId(): string {
  const now = new Date();
  const datePart = `${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `KMR-AG-${datePart}-${randomPart}`;
}

/**
 * Calcule les totaux panier + acheminement selon la zone et le seuil de gratuité.
 */
export function calculateOrderTotals(items: CartItem[], zoneId: string) {
  const subtotalFcfa = items.reduce(
    (sum, item) => sum + item.pack.priceFcfa * item.quantity,
    0
  );
  const zone =
    DELIVERY_ZONES.find((z) => z.id === zoneId) ?? DELIVERY_ZONES[0];

  const isFreeDelivery = subtotalFcfa >= FREE_DELIVERY_THRESHOLD_FCFA;
  const deliveryFeeFcfa =
    items.length === 0 || zone.feeFcfa === 0 || isFreeDelivery
      ? 0
      : zone.feeFcfa;
  const totalFcfa = subtotalFcfa + deliveryFeeFcfa;

  return {
    subtotalFcfa,
    deliveryFeeFcfa,
    totalFcfa,
    zone,
    isFreeDelivery,
  };
}

/**
 * Construit le message structuré envoyé au WhatsApp Business Komersi (229 01 96 98 51 29).
 */
export function buildWhatsAppOrderMessage(
  orderId: string,
  items: CartItem[],
  customer: CustomerOrderInput,
  totals: ReturnType<typeof calculateOrderTotals>
): string {
  const lines: string[] = [
    `*COMMANDE AGRO KOMERSI*`,
    `Référence : *${orderId}*`,
    customer.buyerType ? `Profil acheteur : ${customer.buyerType}` : '',
    ``,
    `*Produits & Conditionnements :*`,
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.product.name} [${item.pack.label} · ${
          item.pack.tierLabel
        }] (${item.product.sku}) × ${item.quantity} = ${formatFcfa(
          item.pack.priceFcfa * item.quantity
        )}`
    ),
    ``,
    `Sous-total marchandises : ${formatFcfa(totals.subtotalFcfa)}`,
    `Logistique (${totals.zone.label}) : ${
      totals.deliveryFeeFcfa === 0
        ? 'Offerte / Retrait dépôt'
        : formatFcfa(totals.deliveryFeeFcfa)
    }`,
    `*TOTAL À RÉGLER : ${formatFcfa(totals.totalFcfa)}*`,
    ``,
    `*Coordonnées acheteur :*`,
    `Nom / Structure : ${customer.fullName.trim()}`,
    `Téléphone : ${customer.phone.trim()}`,
    `Point de livraison : ${customer.address.trim()}`,
    `Règlement : ${customer.paymentMethod}`,
  ].filter(Boolean);

  if (customer.note && customer.note.trim().length > 0) {
    lines.push(`Précision lot / horaire : ${customer.note.trim()}`);
  }

  lines.push(``, `Plateforme : komersi.store`);
  return lines.join('\n');
}

/**
 * Génère l'URL directe https://wa.me/2290196985129?text=...
 */
export function generateWhatsAppCheckoutUrl(message: string): string {
  const configuredNumber =
    import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  const cleanBusinessNumber = sanitizePhoneDigits(configuredNumber);
  return `https://wa.me/${cleanBusinessNumber}?text=${encodeURIComponent(
    message
  )}`;
}

export interface QuoteLineItem {
  productId: string;
  productName: string;
  packLabel: string;
  unitPriceFcfa: number;
  quantity: number;
}

export interface StructuredQuoteInput {
  quoteId: string;
  lines: QuoteLineItem[];
  companyOrName: string;
  sector: string;
  phone: string;
  logisticsLabel: string;
  frequency: string;
  destination: string;
  specifications?: string;
}

/**
 * Construit un message de demande de devis professionnel structuré pour WhatsApp.
 */
export function buildStructuredQuoteMessage(input: StructuredQuoteInput): string {
  const estimatedTotal = input.lines.reduce(
    (sum, line) => sum + line.unitPriceFcfa * line.quantity,
    0
  );

  const lines: string[] = [
    `*DEMANDE DE DEVIS AGRO — KOMERSI*`,
    `Référence devis : *${input.quoteId}*`,
    ``,
    `*Lots demandés :*`,
    ...input.lines.map(
      (line, index) =>
        `${index + 1}. ${line.productName} [${line.packLabel}] × ${
          line.quantity
        } (Est. ${formatFcfa(line.unitPriceFcfa * line.quantity)})`
    ),
    ``,
    `*Estimation indicative (hors transport) :* ${formatFcfa(estimatedTotal)}`,
    ``,
    `*Profil & Logistique :*`,
    `Acheteur / Structure : ${input.companyOrName.trim() || 'À préciser'}`,
    `Activité : ${input.sector}`,
    `Téléphone : ${input.phone.trim() || 'À préciser'}`,
    `Fréquence : ${input.frequency}`,
    `Acheminement : ${input.logisticsLabel}`,
    `Destination / Point : ${input.destination.trim() || 'À préciser'}`,
  ];

  if (input.specifications && input.specifications.trim().length > 0) {
    lines.push(`Cahier des charges : ${input.specifications.trim()}`);
  }

  lines.push(
    ``,
    `Merci de confirmer la disponibilité du stock et le tarif net franco / départ dépôt.`,
    `Source : komersi.store/devis`
  );

  return lines.join('\n');
}

/**
 * Génère un lien WhatsApp direct pour une demande de devis structurée.
 */
export function generateStructuredQuoteWhatsAppUrl(
  input: StructuredQuoteInput
): string {
  return generateWhatsAppCheckoutUrl(buildStructuredQuoteMessage(input));
}

/**
 * Génère un lien WhatsApp direct simple (compatibilité).
 */
export function generateBulkQuoteWhatsAppUrl(
  commodityName: string,
  volumeText: string,
  companyOrName: string,
  phone: string
): string {
  const msg = [
    `*DEMANDE DE DEVIS GROS — KOMERSI AGRO*`,
    `Matière première : ${commodityName}`,
    `Quantité / Tonnage souhaité : ${volumeText}`,
    `Acheteur : ${companyOrName}`,
    `Téléphone : ${phone}`,
    ``,
    `Merci de me transmettre votre tarif franco / départ dépôt et la disponibilité du lot.`,
  ].join('\n');

  return generateWhatsAppCheckoutUrl(msg);
}

/**
 * Structure JSON prête pour Google Sheets (Apps Script / Make / Zapier).
 */
export function buildGoogleSheetsPayload(order: KomersiOrderRecord) {
  return {
    spreadsheetRow: {
      OrderID: order.orderId,
      DateISO: order.createdAtIso,
      Client: order.customer.fullName,
      Profil: order.customer.buyerType ?? 'Particulier / Ménage',
      Telephone: order.customer.phone,
      Logistique:
        DELIVERY_ZONES.find((z) => z.id === order.customer.zoneId)?.label ??
        order.customer.zoneId,
      Destination: order.customer.address,
      Articles: order.items
        .map((i) => `${i.name} [${i.packLabel}] (x${i.quantity})`)
        .join(' | '),
      SousTotal_FCFA: order.subtotalFcfa,
      Transport_FCFA: order.deliveryFeeFcfa,
      Total_FCFA: order.totalFcfa,
      Paiement: order.customer.paymentMethod,
      Statut: 'Nouvelle commande Agro WhatsApp',
    },
  };
}

/**
 * Structure JSON compatible avec l'API Notion (/v1/pages).
 */
export function buildNotionDatabasePayload(order: KomersiOrderRecord) {
  return {
    properties: {
      Référence: {
        title: [{ text: { content: order.orderId } }],
      },
      Client: {
        rich_text: [{ text: { content: order.customer.fullName } }],
      },
      Téléphone: {
        phone_number: order.customer.phone,
      },
      Destination: {
        rich_text: [{ text: { content: order.customer.address } }],
      },
      Lots_Commandés: {
        rich_text: [
          {
            text: {
              content: order.items
                .map((i) => `${i.quantity}x ${i.name} (${i.packLabel})`)
                .join(', '),
            },
          },
        ],
      },
      Total_FCFA: {
        number: order.totalFcfa,
      },
      Paiement: {
        select: { name: order.customer.paymentMethod },
      },
      Statut: {
        status: { name: 'À confirmer' },
      },
    },
  };
}

/**
 * Sauvegarde la commande localement et déclenche le webhook back-office (si configuré).
 */
export async function recordAndDispatchOrder(
  items: CartItem[],
  customer: CustomerOrderInput
): Promise<KomersiOrderRecord> {
  const orderId = generateOrderId();
  const totals = calculateOrderTotals(items, customer.zoneId);
  const whatsappMessage = buildWhatsAppOrderMessage(
    orderId,
    items,
    customer,
    totals
  );
  const whatsappUrl = generateWhatsAppCheckoutUrl(whatsappMessage);

  const record: KomersiOrderRecord = {
    orderId,
    createdAtIso: new Date().toISOString(),
    customer,
    items: items.map((item) => ({
      sku: item.product.sku,
      name: item.product.name,
      packLabel: item.pack.label,
      unitPriceFcfa: item.pack.priceFcfa,
      quantity: item.quantity,
      lineTotalFcfa: item.pack.priceFcfa * item.quantity,
    })),
    subtotalFcfa: totals.subtotalFcfa,
    deliveryFeeFcfa: totals.deliveryFeeFcfa,
    totalFcfa: totals.totalFcfa,
    whatsappUrl,
    whatsappMessage,
    status: 'Envoyée sur WhatsApp',
  };

  const webhookUrl = import.meta.env.VITE_WEBHOOK_ORDER_URL;
  if (
    webhookUrl &&
    typeof webhookUrl === 'string' &&
    webhookUrl.startsWith('http')
  ) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'komersi.store',
          order: record,
          googleSheets: buildGoogleSheetsPayload(record),
          notion: buildNotionDatabasePayload(record),
        }),
        keepalive: true,
      });
      record.status = 'Synchronisée Webhook';
    } catch {
      // Le lien WhatsApp reste toujours accessible en priorité.
    }
  }

  saveOrderLocally(record);
  return record;
}

export function getSavedOrders(): KomersiOrderRecord[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrderLocally(order: KomersiOrderRecord): void {
  try {
    const existing = getSavedOrders();
    const updated = [order, ...existing].slice(0, 20);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
}
