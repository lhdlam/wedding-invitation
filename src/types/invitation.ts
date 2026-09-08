/** Content structures for the wedding invitation. */

export interface FamilySide {
  /** e.g. "Nhà trai" / "Nhà gái" */
  label: string;
  father: string;
  /** Omitted when the family lists only one parent. */
  mother?: string;
  /** Address lines, rendered one per line. */
  address: readonly [string, string];
}

export interface TimelineEntry {
  time: string;
  title: string;
}

export interface AlbumPhoto {
  src: string;
  alt: string;
  /** Tailwind height utility used by the mosaic grid, e.g. "h-[165px]". */
  heightClass: string;
  /** Optional object-position utility for art-directed cropping. */
  objectClass?: string;
  /** Tailwind column span within the 12-column mosaic. */
  spanClass?: string;
}

export interface WeddingDate {
  monthLabel: string;
  day: string;
  yearLabel: string;
  lunarNote: string;
}

/** One of the two receptions: the groom's family's or the bride's family's. */
export type SideKey = "trai" | "gai";

export interface Venue {
  /** Restaurant name, e.g. "Nhà hàng tiệc cưới Tín Nghĩa II". */
  name: string;
  address: string;
  /** Query handed to the Google Maps embed. */
  mapQuery: string;
  /** Share link to the venue's Google Maps listing — where clicks lead. */
  mapLink: string;
}

export interface CouplePerson {
  /** Eyebrow above the name, e.g. "Chú rể". */
  role: string;
  fullName: string;
  /** Short form used by the large display lockups, e.g. "Đăng Lâm". */
  shortName: string;
  /** Line under the name in the love-story card, e.g. "Quý Nam". */
  rank: string;
  photo: string;
  /** Optional object-position utility for the 3:4 portrait crop. */
  photoObjectClass?: string;
}

/**
 * Everything that differs between the two invitation variants. Both variants
 * share the same couple, families and photos; only the ceremony, the reception
 * and the venue change.
 */
export interface InvitationContent {
  side: SideKey;
  /** Ceremony wording, e.g. "9:00, Thứ Bảy". */
  ceremonyTime: string;
  /** Reception wording, e.g. "11:00, Thứ Bảy". */
  receptionTime: string;
  /** Compact date shown over the hero and in the save-the-date block. */
  dateLabel: string;
  date: WeddingDate;
  venue: Venue;
  /** Ceremony start as an ISO string with the Vietnam offset — drives the countdown. */
  countdownIso: string;
  timeline: readonly TimelineEntry[];
}

export type RsvpAttendance = "yes" | "no";

export interface RsvpFormState {
  name: string;
  attendance: RsvpAttendance | null;
  partySize: string;
  guestOf: string;
  message: string;
}
