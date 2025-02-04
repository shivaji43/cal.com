"use client";

// eslint-disable-next-line no-restricted-imports
import { BookerEmbed } from "@calcom/atoms";
// eslint-disable-next-line no-restricted-imports
import "@calcom/atoms/globals.min.css";
import type { PrefillAndIframeAttrsConfig } from "@calcom/embed-core";

type CalProps = {
  calOrigin?: string;
  calLink: string;
  initConfig?: {
    debug?: boolean;
    uiDebug?: boolean;
  };
  namespace?: string;
  config?: PrefillAndIframeAttrsConfig;
  embedJsUrl?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Cal = function Cal(props: CalProps) {
  const { calLink, calOrigin, namespace = "", config, initConfig = {}, embedJsUrl, ...restProps } = props;
  if (!calLink) {
    throw new Error("calLink is required");
  }
  return (
    <BookerEmbed
      username="pro"
      eventSlug="30min"
      // onCreateBookingSuccess={(data) => {
      //   router.push(`/${data.data.uid}`);
      // }}
    />
  );
};
export default Cal;
