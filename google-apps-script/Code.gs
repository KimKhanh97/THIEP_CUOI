/* =====================================================================
   Guestbook — lưu lời chúc vào Google Sheet.
   Cách cài: xem hướng dẫn trong README.md (mục "Lưu lời chúc vào Google Sheet").
   ===================================================================== */
const SHEET_NAME = "LoiChuc";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["Thời gian", "Tên", "Lời chúc", "ts"]);
    sh.setFrozenRows(1);
  }
  return sh;
}

const json_ = (data) =>
  ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);

// Chặn công thức (=, +, -, @) để lời chúc không bị Sheet hiểu là công thức
const clean_ = (s, max) => {
  s = String(s || "").trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
};

// Trang thiệp gọi GET để lấy toàn bộ lời chúc
function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const wishes = rows
    .filter((r) => r[1] && r[2])
    .map((r) => ({ name: String(r[1]), message: String(r[2]), ts: Number(r[3]) || new Date(r[0]).getTime() }));
  return json_({ ok: true, wishes });
}

// Trang thiệp gọi POST khi khách gửi lời chúc
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const name = clean_(body.name, 40);
    const message = clean_(body.message, 300);
    if (!name || !message) return json_({ ok: false, error: "missing" });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ts = Date.now();
      sheet_().appendRow([new Date(ts), name, message, ts]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
