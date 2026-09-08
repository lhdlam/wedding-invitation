import type { Metadata } from "next";

import { InvitationPage } from "@/components/InvitationPage";
import { BRIDE, BRIDE_SIDE, GROOM } from "@/data/invitation";

export const metadata: Metadata = {
  title: `${BRIDE.shortName} & ${GROOM.shortName} · Thiệp cưới`,
  description: `Save our date.`,
};

/** Nhà gái — tiệc ngày 18.09.2026 tại Nhà hàng tiệc cưới Quốc Trang. */
export default function BrideSidePage() {
  return <InvitationPage content={BRIDE_SIDE} />;
}
