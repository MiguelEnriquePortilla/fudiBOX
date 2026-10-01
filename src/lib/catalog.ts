export type OptionGroup = { name: string; choices: string[] };
export type Product = { id: string; name: string; description: string; price_cents: number; image_path: string | null; category: string; sort_order: number; available: boolean; option_groups: OptionGroup[] };
export type Business = { id: string; name: string; address: string | null; map_url: string | null; accepting_orders: boolean };
export const money = (cents: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(cents / 100);
export const orderLabels: Record<string,string> = {requested:"Por confirmar",awaiting_quote:"Esperando cotización",quoted:"Cotización lista",preparing:"En preparación",ready:"Listo para recoger",delivered:"Entregado",expired:"Cotización vencida",cancelled:"Cancelado"};
