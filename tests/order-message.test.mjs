import test from "node:test";
import assert from "node:assert/strict";
import { restaurantMessage } from "../src/lib/order-message.ts";
const order={id:"test-order",customer_name:"Cliente",delivery_method:"pickup",notes:"Sin cebolla & salsa aparte",subtotal_cents:8500,total_cents:9500,customer_phone:"PRIVATE_PHONE",delivery_address:"PRIVATE_ADDRESS",order_items:[{product_name:"Pollo",quantity:2,selections:[{quantity:2,choices:{Salsa:"BBQ"}}]}]};
test("restaurant draft preserves choices and totals without sharing customer contact",()=>{
 const text=restaurantMessage(order,"Restaurante");
 for(const value of ["test-order","2 × Pollo","2 × Salsa: BBQ","$85.00","$95.00",order.notes,"Espera nuestra confirmación"]) assert.ok(text.includes(value),value);
 assert.ok(!text.includes("PRIVATE_"));
 const url=new URL("https://wa.me/?text="+encodeURIComponent(text)); assert.equal(url.searchParams.get("text"),text);
});
test("unquoted delivery draft never claims a final total",()=>{
 const text=restaurantMessage({...order,total_cents:null,delivery_method:"delivery"},"Restaurante");
 assert.match(text,/Total pendiente/); assert.ok(!text.includes("Total del cliente:"));
});
