import type { Metadata } from "next";

import { InvitationPage } from "@/components/InvitationPage";
import { BRIDE, BRIDE_SIDE, GROOM } from "@/data/invitation";

export const metadata: Metadata = {
  title: `${GROOM.fullName} & ${BRIDE.fullName} · Thiệp cưới`,
  description: `Trân trọng báo tin Lễ Thành Hôn của chúng tôi — ${GROOM.shortName} & ${BRIDE.shortName}. Tiệc cưới ${BRIDE_SIDE.receptionTime} ngày ${BRIDE_SIDE.dateLabel} tại ${BRIDE_SIDE.venue.name}.`,
};

/** Nhà gái — tiệc ngày 18.09.2026 tại Nhà hàng tiệc cưới Quốc Trang. */
export default function BrideSidePage() {
  return <InvitationPage content={BRIDE_SIDE} />;
}
