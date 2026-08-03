import type { Metadata } from "next";

import { InvitationPage } from "@/components/InvitationPage";
import { BRIDE, GROOM, GROOM_SIDE } from "@/data/invitation";

export const metadata: Metadata = {
  title: `${GROOM.fullName} & ${BRIDE.fullName} · Thiệp cưới`,
  description: `Trân trọng báo tin Lễ Thành Hôn của chúng tôi — ${GROOM.shortName} & ${BRIDE.shortName}. Tiệc cưới ${GROOM_SIDE.receptionTime} ngày ${GROOM_SIDE.dateLabel} tại ${GROOM_SIDE.venue.name}.`,
};

/** Nhà trai — tiệc ngày 19.09.2026 tại Nhà hàng tiệc cưới Tín Nghĩa II. */
export default function GroomSidePage() {
  return <InvitationPage content={GROOM_SIDE} />;
}
