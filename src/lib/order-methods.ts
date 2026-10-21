export type DeliveryMethod = "pickup" | "delivery";
type MethodSettings = {accepting_orders?: unknown; pickup_enabled?: unknown; delivery_enabled?: unknown};
export function orderMethods(business: MethodSettings, pickupPilot: boolean): DeliveryMethod[] {
 const methods: DeliveryMethod[] = [];
 if (business.pickup_enabled === true && (business.accepting_orders === true || pickupPilot)) methods.push("pickup");
 if (!pickupPilot && business.accepting_orders === true && business.delivery_enabled === true) methods.push("delivery");
 return methods;
}
