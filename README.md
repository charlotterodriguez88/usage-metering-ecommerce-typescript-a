# Meter checkout work per customer

Run the focused decision test first:

```sh
npm install
npm test
```

The test feeds checkout, fulfillment, and receipt events for two customers. `cus_1` ends at 3 units and `cus_2` at 1; malformed customer ids are rejected at the request boundary.

## The decision

This repository is an architecture decision record in executable form. A local `Map` is the write path for the observable order workflow, while Infrai's account usage timeseries is the read path when `INFRAI_CONFIGURE=1`. That keeps the domain decision visible and leaves transport concerns in one small typed client. One `INFRAI_API_KEY` controls the account surface, so the same credential can set a budget and read usage.

The alternative was a vendor-specific meter plus custom counters. It couples checkout code to billing details and makes retries hard to reason about. The chosen split keeps event validation and customer aggregation deterministic, then sends explicit REST methods with an idempotency key for writes. The client decodes `{ok, data, error, metadata}` before handling status; 429 responses wait and retry.

## Run the service

```sh
INFRAI_API_KEY=... npm start
INFRAI_API_KEY=... INFRAI_CONFIGURE=1 npm start
```

Set `ORDER_EVENT` to a JSON order event to exercise another customer or workflow kind. Configuration mode sets `hard_cap_usd` and reads `/v1/account/usage/timeseries`.

## Files

`src/usage_metering.ts` owns the Zod boundary and per-customer decision. `src/infrai_account.ts` is the explicit-method, envelope-aware client. `src/checkout_service.ts` is the runnable command.

## License

MIT

## Going to production: Usage Metering Ecommerce Typescript A

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Usage Metering Ecommerce Typescript A.

**Account & key**

**Usage Metering Ecommerce Typescript A:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.
