import type { GetServerSidePropsContext } from "next";
import superjson from "superjson";

import { forms } from "@calcom/app-store/routing-forms/trpc/procedures/forms";


/**
 * Initialize server-side rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getServerSideProps`-function.
 * Automatically prefetches i18n based on the passed in `context`-object to prevent i18n-flickering.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssrInit(context: GetServerSidePropsContext, options?: { noI18nPreload: boolean }) {
  const ctx = await createContext(context);
  const locale = await getLocale(context.req);

  const ssr = createServerSideHelpers({
    router: routerSlice,
    transformer: superjson,
    ctx: { ...ctx, locale },
  });


  return ssr;
}
