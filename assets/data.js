/* =====================================================================
   DỮ LIỆU CÁ NHÂN — CHỈ CẦN SỬA FILE NÀY
   Mọi tên, ngày, địa điểm, câu chuyện, ảnh và lời chúc mẫu đều nằm ở đây.
   ===================================================================== */

window.WEDDING = {
  // ✏️ THAY ĐỔI: Tên cô dâu & chú rể
  groom: "Hữu Hạnh",
  bride: "Kim Khánh",

  // ✏️ THAY ĐỔI: Các buổi tiệc
  //   date: chữ hiển thị · dateISO: ngày (để đếm ngược) · time: giờ đón khách "HH:MM" (để "" nếu chưa có)
  //   hall: tên sảnh (không bắt buộc) — hiển thị ở dòng riêng dưới địa điểm
  //   map: link Google Maps — bấm vào tên nhà hàng sẽ mở bản đồ
  //   Giờ được tính theo giờ Việt Nam, khách ở nước ngoài vẫn thấy đếm ngược đúng.
  events: [
    { label: "Nhà Gái", date: "Thứ 7 · 07.11.2026", dateISO: "2026-11-07", time: "", venue: "Nhà hàng Đại Hỷ", map: "https://maps.app.goo.gl/4ah2UCXXFVAftNb68?g_st=ic" },
    { label: "Nhà Trai", date: "Thứ 3 · 17.11.2026", dateISO: "2026-11-17", time: "", venue: "Nhà hàng Ba Thành", map: "https://maps.app.goo.gl/6VTgv4K5DEFEXyrHA?g_st=ic" },
    { label: "Báo Hỷ", date: "Thứ 7 · 21.11.2026", dateISO: "2026-11-21", time: "", venue: "Nhà hàng Claris Palace", hall: "Sảnh Sapphie", map: "https://maps.app.goo.gl/QgtWdCihSo2ULMrC8?g_st=ic" },
  ],

  // ✏️ THAY ĐỔI: Hashtag đám cưới
  hashtag: "#HanhKhanhForever",

  // ✏️ THAY ĐỔI: Nhạc nền (mp4) — đặt file vào thư mục /music với đúng tên này.
  // Phát khi khách bấm "Mở thiệp". Để "" nếu không muốn có nhạc.
  music: "music/vay-cuoi.mp4",

  // ✏️ THAY ĐỔI: Đoạn giới thiệu "Chuyện chúng mình"
  storyIntro:
    "Có những người bước vào đời ta thật khẽ, như một buổi chiều nắng nhạt — rồi ở lại mãi. Chúng mình đã đi qua những mùa mưa, những chuyến đi xa và cả những ngày bình thường nhất, để nhận ra rằng nhà là nơi có nhau.",

  // ✏️ THAY ĐỔI: Các cột mốc (3–4 mục là đẹp nhất)
  timeline: [
    { date: "Tháng 04 · 2023", title: "Ngày đầu gặp gỡ", text: "Một buổi tối tại một thành phố tấp nập nhộn nhịp, một lời hứa gặp gỡ, một lời chào còn chút ngại ngùng, những câu chuyện phím, rồi đến cả những lúc cùng nhau nói xấu thiên hạ,....Mọi thứ bất đầu từ đó." },
    { date: "Tháng 12 · 2025", title: "Lời cầu hôn", text: "Anh chọn cầu hôn vào ngày sinh nhật của anh vì anh nói em là món quà lớn và đặc biệt nhất của đời anh. Em đã nói: Em đồng ý. " },
    { date: "Tháng 11 · 2026", title: "Ngày chung đôi", text: "Chúng mình về chung một nhà — và mong được chia sẻ niềm vui ấy cùng tất cả mọi người." },
  ],

  // ✏️ THAY ĐỔI: Các câu trích dẫn chèn giữa thư viện ảnh để tạo "nhịp thở"
  quotes: [
    { text: "Whatever our souls are made of, his and mine are the same.", by: "Emily Brontë" },
    { text: "Yêu là cùng nhau nhìn về một hướng.", by: "Antoine de Saint-Exupéry" },
    { text: "In all the world, there is no heart for me like yours.", by: "Maya Angelou" },
  ],

  // ✏️ THAY ĐỔI: Lời cảm ơn ở footer
  thankYou:
    "Cảm ơn gia đình, bạn bè và tất cả những người thân yêu đã đồng hành cùng chúng mình trên chặng đường này. Sự hiện diện và lời chúc của mọi người là món quà quý giá nhất.",

  // Ảnh dùng cho Hero (file trong images/large)
  heroImage: "DSC02306",
};

/* ---------------------------------------------------------------------
   ALBUM — Tabs bộ lọc. Đổi tên hiển thị ở "label".
   Tab không có ảnh sẽ hiện thông báo "Sắp cập nhật".
   --------------------------------------------------------------------- */
window.ALBUMS = [
  { id: "all", label: "Tất cả" },
  { id: "prewedding", label: "Pre-wedding" },
  { id: "giatien", label: "Lễ gia tiên" },
  { id: "tieccuoi", label: "Tiệc cưới" },
  { id: "moments", label: "Khoảnh khắc bắt trọn" },
];

/* ---------------------------------------------------------------------
   ẢNH — Mỗi ảnh cần 3 phiên bản:
     images/thumb/<id>.jpg   ~800px   (lưới ảnh, tải nhanh)
     images/large/<id>.jpg   ~1800px  (lightbox)
     <id>.JPG                bản gốc  (nút "Tải ảnh chất lượng cao")
   ✏️ THÊM ẢNH: thêm một dòng { id, albums, alt }.
   "albums" có thể chứa nhiều tab, ví dụ ["prewedding", "moments"].
   "shape" (tuỳ chọn) đổi khung cắt trên lưới: "tall" | "portrait" | "square".
   --------------------------------------------------------------------- */
window.PHOTOS = [
  // — Studio · Rèm trắng —
  { id: "DSC02238", albums: ["prewedding"], alt: "Cô dâu chú rể", shape: "tall" },
  { id: "DSC02257", albums: ["prewedding"], alt: "Cô dâu khoác tay chú rể" },
  { id: "DSC02338", albums: ["prewedding", "moments"], alt: "Khoe nhẫn cưới", shape: "square" },
  { id: "DSC02306", albums: ["prewedding"], alt: "Cô dâu chú rể nắm tay" },
  { id: "DSC02349", albums: ["prewedding", "moments"], alt: "Hai bàn tay đeo nhẫn", shape: "portrait" },
  { id: "DSC02362", albums: ["prewedding", "moments"], alt: "Khoảnh khắc nhí nhảnh", shape: "tall" },
  { id: "DSC02561", albums: ["prewedding", "moments"], alt: "Vẫy tay chào", shape: "portrait" },
  { id: "DSC02572", albums: ["prewedding"], alt: "Cô dâu chú rể đứng cạnh nhau" },
  { id: "DSC02689", albums: ["prewedding"], alt: "Cô dâu với bó hoa", shape: "tall" },
  { id: "DSC02745", albums: ["prewedding"], alt: "Chú rể cầm bó hoa" },

  // — Studio · Hoa cẩm tú cầu đỏ —
  { id: "DSC02783", albums: ["prewedding"], alt: "Hoa cẩm tú cầu", shape: "tall" },
  { id: "DSC02889", albums: ["prewedding", "moments"], alt: "Nụ hôn lên trán", shape: "portrait" },
  { id: "DSC02789", albums: ["prewedding"], alt: "Cô dâu chú rể" },
  { id: "DSC02895", albums: ["prewedding", "moments"], alt: "Vòng tay ôm", shape: "tall" },
  { id: "DSC02806", albums: ["prewedding"], alt: "Nắm tay giữa những khóm hoa", shape: "square" },
  { id: "DSC03046", albums: ["prewedding", "moments"], alt: "Tung voan cười rạng rỡ" },
  { id: "DSC02836", albums: ["prewedding"], alt: "Tựa vai nhau" },
  { id: "DSC02994", albums: ["prewedding"], alt: "Dắt tay nhau", shape: "portrait" },

  // — Ngoài trời · Lễ thề nguyện trong vườn —
  { id: "DSC03091", albums: ["tieccuoi"], alt: "Đọc lời thề trong khu vườn", shape: "tall" },
  { id: "DSC03099", albums: ["tieccuoi", "moments"], alt: "Cô dâu mỉm cười" },
  { id: "DSC03520", albums: ["tieccuoi", "moments"], alt: "Chú rể đọc lời thề", shape: "portrait" },
  { id: "DSC03128", albums: ["tieccuoi"], alt: "Trao lời hứa", shape: "tall" },
  { id: "DSC03171", albums: ["tieccuoi"], alt: "Khoe lời thề vừa đọc" },
  { id: "DSC03222", albums: ["tieccuoi", "moments"], alt: "Giơ tay ăn mừng", shape: "square" },
  { id: "DSC03305", albums: ["tieccuoi"], alt: "Cô dâu với tà voan dài", shape: "tall" },
  { id: "DSC03345", albums: ["tieccuoi"], alt: "Dạo bước trên thảm cỏ" },
  { id: "DSC03393", albums: ["tieccuoi"], alt: "Nắm tay nhìn về nhau", shape: "portrait" },
  { id: "DSC03456", albums: ["tieccuoi", "moments"], alt: "Dưới tà voan", shape: "tall" },
  { id: "DSC03474", albums: ["tieccuoi", "moments"], alt: "Nụ hôn dưới voan cưới" },
  { id: "DSC03500", albums: ["tieccuoi", "moments"], alt: "Nụ hôn trong hoàng hôn", shape: "portrait" },
];

/* ✏️ THAY ĐỔI: Lời chúc mẫu hiển thị sẵn trong Guestbook */
window.SEED_WISHES = [];
