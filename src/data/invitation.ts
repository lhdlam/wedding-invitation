/**
 * Single source of truth for every piece of invitation copy.
 *
 * The wedding runs over two days, so the site ships two variants: `/` carries
 * the groom's family's reception (19.09.2026) and `/nha-gai` the bride's
 * family's (18.09.2026). Everything except the ceremony, the reception and the
 * venue is shared between them.
 */

import type {
  CouplePerson,
  FamilySide,
  InvitationContent,
  SideKey,
} from "@/types/invitation";

export const GROOM: CouplePerson = {
  role: "Chú rể",
  fullName: "Lê Hải Đăng Lâm",
  shortName: "Đăng Lâm",
  rank: "Quý Nam",
  photo: "/images/couple-2/DSC09992.webp",
  photoObjectClass: "object-[center_calc(50%+15px)]",
};

export const BRIDE: CouplePerson = {
  role: "Cô dâu",
  fullName: "Nguyễn Thị Hoài Thương",
  shortName: "Hoài Thương",
  rank: "Út Nữ",
  photo: "/images/couple-2/DSC00179.webp",
  photoObjectClass: "object-center",
};

export const FAMILIES: readonly FamilySide[] = [
  {
    label: "Nhà trai",
    father: "Ông. Lê Hải Bình",
    mother: "Bà. Hoàng Thị Huệ",
    address: ["Thôn Hoàn Cát, Xã Cam Lộ,", "Tỉnh Quảng Trị"],
  },
  {
    label: "Nhà gái",
    father: "Ông. Nguyễn Văn Quảng",
    address: ["Thôn An Trung, Xã Cam Lộ,", "Tỉnh Quảng Trị"],
  },
];

/**
 * Announcement order per side — the hosting family's child is named first:
 * nhà trai reads "Đăng Lâm & Hoài Thương", nhà gái reads the reverse.
 */
export function coupleFor(side: SideKey): readonly [CouplePerson, CouplePerson] {
  return side === "gai" ? [BRIDE, GROOM] : [GROOM, BRIDE];
}

/** Family columns per side — the hosting family stands first. */
export function familiesFor(side: SideKey): readonly FamilySide[] {
  return side === "gai" ? [...FAMILIES].reverse() : FAMILIES;
}

/** Reception-day running order. Only the two pre-ceremony rows shift per side. */
const timeline = (ceremony: string, photos: string) =>
  [
    { time: ceremony, title: "Tổ chức hôn lễ" },
    { time: photos, title: "Chụp ảnh cùng gia đình" },
    { time: "10:30", title: "Đón tiếp khách mời & chụp ảnh" },
    { time: "11:00", title: "Nghi thức lễ cưới" },
    { time: "11:15", title: "Khai tiệc" },
    { time: "11:20", title: "Chương trình âm nhạc & dùng tiệc" },
  ] as const;

/** Nhà trai — Lễ Thành Hôn 9h00 ngày 19.09.2026 (09/08 Bính Ngọ). */
export const GROOM_SIDE: InvitationContent = {
  side: "trai",
  ceremonyTime: "9:00, Thứ Bảy",
  receptionTime: "11:00, Thứ Bảy",
  dateLabel: "19.09.2026",
  date: {
    monthLabel: "tháng 09",
    day: "19",
    yearLabel: "năm 2026",
    lunarNote: "(Tức ngày 09 tháng 08 năm Bính Ngọ)",
  },
  venue: {
    name: "Nhà hàng tiệc cưới Tín Nghĩa 2",
    address: "Thôn An Trung, Xã Cam Lộ, Tỉnh Quảng Trị",
    /* Exact pin of "Nhà Hàng Tiệc Cưới Tín Nghĩa II Cùa"
       (maps.app.goo.gl/qqJybmaQ6XTz4FG37). */
    mapQuery: "16.739874,106.95726",
    mapLink: "https://maps.app.goo.gl/qqJybmaQ6XTz4FG37",
  },
  countdownIso: "2026-09-19T09:00:00+07:00",
  timeline: timeline("09:00", "09:30"),
};

/** Nhà gái — Hôn lễ 8h00 ngày 18.09.2026 (08/08 Bính Ngọ). */
export const BRIDE_SIDE: InvitationContent = {
  side: "gai",
  ceremonyTime: "8:00, Thứ Sáu",
  receptionTime: "11:00, Thứ Sáu",
  dateLabel: "18.09.2026",
  date: {
    monthLabel: "tháng 09",
    day: "18",
    yearLabel: "năm 2026",
    lunarNote: "(Tức ngày 08 tháng 08 năm Bính Ngọ)",
  },
  venue: {
    name: "Nhà hàng tiệc cưới Quốc Trang",
    address: "Thôn Mai Lộc 2, Xã Cam Lộ, Tỉnh Quảng Trị",
    /* Exact pin of "Trung tâm Tổ chức Sự kiện, tiệc cưới Quốc Trang"
       (maps.app.goo.gl/3CCfzBypfUpGdyH77). */
    mapQuery: "16.7459166,106.970498",
    mapLink: "https://maps.app.goo.gl/3CCfzBypfUpGdyH77",
  },
  countdownIso: "2026-09-18T08:00:00+07:00",
  timeline: timeline("08:00", "08:30"),
};
