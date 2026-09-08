/**
 * RSVP webhook cho thiệp cưới.
 *
 * Cách dùng: dán toàn bộ file này vào Apps Script của Google Sheet
 * (Extensions → Apps Script), rồi Deploy → New deployment → Web app.
 * Xem hướng dẫn đầy đủ ở docs/GOOGLE_SHEET_SETUP.md
 */

/** Tên sheet (tab) sẽ ghi dữ liệu vào. Tự tạo nếu chưa có. */
const SHEET_NAME = "RSVP";

/** Các cột theo đúng thứ tự ghi xuống sheet. */
const HEADERS = [
  "Thời gian",
  "Tên",
  "Tham dự",
  "Số người",
  "Khách của",
  "Lời nhắn",
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      String(payload.name || "").slice(0, 80),
      payload.attendance === "yes" ? "Có" : "Không",
      String(payload.partySize || ""),
      String(payload.guestOf || ""),
      String(payload.message || "").slice(0, 500),
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Lấy sheet RSVP, tạo mới kèm hàng tiêu đề nếu chưa tồn tại. */
function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
