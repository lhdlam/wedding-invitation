import type { Metadata } from "next";

import { InvitationPage } from "@/components/InvitationPage";
import { BRIDE, GROOM, GROOM_SIDE } from "@/data/invitation";

export const metadata: Metadata = {
  title: `${GROOM.shortName} & ${BRIDE.shortName} · Thiệp cưới`,
  description: `Save our date.`,
};

/** Nhà trai — tiệc ngày 19.09.2026 tại Nhà hàng tiệc cưới Tín Nghĩa II. */
export default function GroomSidePage() {
  return <InvitationPage content={GROOM_SIDE} />;
}
