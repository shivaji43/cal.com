import publicProcedure from "../../procedures/publicProcedure";
import { importHandler, router } from "../../trpc";
import { slotsRouter } from "../viewer/slots/_router";
import { ZUserEmailVerificationRequiredSchema } from "./checkIfUserEmailVerificationRequired.schema";
import { i18nInputSchema } from "./i18n.schema";
import { ZMarkHostAsNoShowInputSchema } from "./markHostAsNoShow.schema";
import { event } from "./procedures/event";
import { session } from "./procedures/session";
import { ZSamlTenantProductInputSchema } from "./samlTenantProduct.schema";
import { ZStripeCheckoutSessionInputSchema } from "./stripeCheckoutSession.schema";
import { ZSubmitRatingInputSchema } from "./submitRating.schema";

const NAMESPACE = "publicViewer";

const namespaced = (s: string) => `${NAMESPACE}.${s}`;

// Export session and event directly
export { session };
export { event };
export { slotsRouter };

export const i18n = publicProcedure.input(i18nInputSchema).query(async (opts) => {
  const handler = await importHandler(namespaced("i18n"), () => import("./i18n.handler"));
  return handler(opts);
});

export const countryCode = publicProcedure.query(async (opts) => {
  const handler = await importHandler(namespaced("countryCode"), () => import("./countryCode.handler"));
  return handler(opts);
});

export const submitRating = publicProcedure.input(ZSubmitRatingInputSchema).mutation(async (opts) => {
  const handler = await importHandler(namespaced("submitRating"), () => import("./submitRating.handler"));
  return handler(opts);
});

export const markHostAsNoShow = publicProcedure.input(ZMarkHostAsNoShowInputSchema).mutation(async (opts) => {
  const handler = await importHandler(
    namespaced("markHostAsNoShow"),
    () => import("./markHostAsNoShow.handler")
  );
  return handler(opts);
});

export const samlTenantProduct = publicProcedure
  .input(ZSamlTenantProductInputSchema)
  .mutation(async (opts) => {
    const handler = await importHandler(
      namespaced("samlTenantProduct"),
      () => import("./samlTenantProduct.handler")
    );
    return handler(opts);
  });

export const stripeCheckoutSession = publicProcedure
  .input(ZStripeCheckoutSessionInputSchema)
  .query(async (opts) => {
    const handler = await importHandler(
      namespaced("stripeCheckoutSession"),
      () => import("./stripeCheckoutSession.handler")
    );
    return handler(opts);
  });

export const ssoConnections = publicProcedure.query(async () => {
  const handler = await importHandler(namespaced("ssoConnections"), () => import("./ssoConnections.handler"));
  return handler();
});

export const checkIfUserEmailVerificationRequired = publicProcedure
  .input(ZUserEmailVerificationRequiredSchema)
  .query(async (opts) => {
    const handler = await importHandler(
      namespaced("checkIfUserEmailVerificationRequired"),
      () => import("./checkIfUserEmailVerificationRequired.handler")
    );
    return handler(opts);
  });

// Also export the full router for backward compatibility
export const publicViewerRouter = router({
  session,
  i18n,
  countryCode,
  submitRating,
  markHostAsNoShow,
  samlTenantProduct,
  stripeCheckoutSession,
  slots: slotsRouter,
  event,
  ssoConnections,
  checkIfUserEmailVerificationRequired,
});
