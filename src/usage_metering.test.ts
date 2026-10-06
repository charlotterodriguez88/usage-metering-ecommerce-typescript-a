import assert from "node:assert/strict";
import { addUsage, orderEvent } from "./usage_metering.js";

const totals = new Map<string, number>();
for (const raw of [
  { customerId: "cus_1", orderId: "o1", kind: "checkout", units: 1 },
  { customerId: "cus_1", orderId: "o1", kind: "fulfillment", units: 2 },
  { customerId: "cus_2", orderId: "o2", kind: "receipt", units: 1 }
]) addUsage(totals, orderEvent.parse(raw));
assert.equal(totals.get("cus_1"), 3);
assert.equal(totals.get("cus_2"), 1);
assert.throws(() => orderEvent.parse({ customerId: "", orderId: "o", kind: "checkout", units: 1 }));
console.log("usage decision test passed");
