import { cookies, headers } from "next/headers";

import { getServerSideProps } from "@lib/apps/getServerSideProps";
import { buildLegacyCtx } from "@lib/buildLegacyCtx";

import AppsPage from "~/apps/apps-view";

import { withAppDirSsr } from "../../../WithAppDirSsr";
import type { PageProps } from "../../../_types";

export const generateMetadata = async () => {
  return {};
};

const getData = withAppDirSsr(getServerSideProps);

const ServerPage = async ({ params, searchParams }: PageProps) => {
  const context = buildLegacyCtx(headers(), cookies(), params, searchParams);

  const props = await getData(context);
  return <AppsPage {...props} />;
};

export default ServerPage;
