import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { availabilityRouter } from "@calcom/trpc/server/routers/viewer/availability/_router";

console.log("--------------in trpc/availability");
export default createNextApiHandler(availabilityRouter);
