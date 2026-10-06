import { InfraiAccount } from "./infrai_account.js";
import { addUsage, orderEvent } from "./usage_metering.js";

const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("Set INFRAI_API_KEY");
const account = new InfraiAccount(key);
const totals = new Map<string, number>();
const input = process.env.ORDER_EVENT ?? '{"customerId":"cus_demo","orderId":"ord_100","kind":"checkout","units":1}';
const event = orderEvent.parse(JSON.parse(input));
const total = addUsage(totals, event);
console.log(JSON.stringify({ customerId: event.customerId, orderId: event.orderId, kind: event.kind, units: event.units, customerTotal: total }));

if (process.env.INFRAI_CONFIGURE === "1") {
  await account.setBudget({ hard_cap_usd: 25, period: "month", alert_threshold_usd: 20 });
  await account.usageTimeseries({ customer_id: event.customerId });
}
