/* =====================================================================
   Wedding Album — logic giao diện. Nội dung cá nhân nằm trong data.js.
   ===================================================================== */
(() => {
  const W = window.WEDDING;
  const PHOTOS = window.PHOTOS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, "0");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const icons = () => window.lucide && lucide.createIcons({ attrs: { "stroke-width": 1.5 } });

  const src = {
    thumb: (id) => `images/thumb/${id}.jpg`,
    large: (id) => `images/large/${id}.jpg`,
    original: (id) => `${id}.JPG`,
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Gắn nội dung từ data.js ---------- */
  function bindContent() {
    const initial = (name) => name.trim().split(/\s+/).pop()[0].toUpperCase();
    const values = { ...W, monogram: `${initial(W.groom)} & ${initial(W.bride)}` };
    $$("[data-bind]").forEach((el) => {
      const v = values[el.dataset.bind];
      if (v != null) el.textContent = v;
    });
    document.title = `${W.groom} & ${W.bride} · Wedding Album`;
    $("#heroImg").src = $("#gateImg").src = src.large(W.heroImage);
    $("#year").textContent = new Date().getFullYear();

  }

  /* ---------- Thời gian & địa điểm + đếm ngược ----------
     Giờ tính theo giờ Việt Nam (+07:00) để khách ở múi giờ khác vẫn đếm đúng. */
  function setupEvents() {
    const events = W.events.map((e) => ({ ...e, at: new Date(`${e.dateISO}T${e.time || "00:00"}:00+07:00`) }));
    const units = `<div><b data-u="d">00</b><span>Ngày</span></div><i>:</i>
      <div><b data-u="h">00</b><span>Giờ</span></div><i>:</i>
      <div><b data-u="m">00</b><span>Phút</span></div><i>:</i>
      <div><b data-u="s">00</b><span>Giây</span></div>`;

    $("#events").innerHTML = events.map(
      (e, i) => `<li class="event-card reveal flex flex-col items-center px-6 py-8" style="--d:${i * 120}ms">
        <h3 class="font-serif text-3xl font-light">${e.label}</h3>
        <p class="mt-3 text-[13px] uppercase tracking-widest2 text-olive">${e.date}</p>
        ${e.time ? `<p class="mt-1 text-[15px] leading-7 text-muted">${e.time.replace(":", "h")}</p>` : ""}
        <p class="mt-3 text-[15px] leading-7 text-muted">
          <a ${e.map ? `href="${e.map}" target="_blank" rel="noopener"` : ""} class="venue-link">
          <i data-lucide="map-pin" class="mr-1 inline-block h-3.5 w-3.5 -translate-y-px align-middle text-olive"></i>${e.venue}${e.hall ? `<br />(${e.hall})` : ""}</a></p>
        <div class="countdown sm mt-auto pt-6" data-event="${i}">${units}</div>
      </li>`
    ).join("");

    const fill = (el, ms) => {
      const s = Math.max(0, Math.floor(ms / 1000));
      const v = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
      $$("[data-u]", el).forEach((b) => (b.textContent = pad(v[b.dataset.u])));
    };
    const done = (el, text) => (el.outerHTML = `<p class="countdown-done mt-6 font-serif text-xl italic text-olive">${text}</p>`);

    function tick() {
      const now = Date.now();
      $$("[data-event]").forEach((el) => {
        const e = events[el.dataset.event];
        const left = e.at - now;
        if (left > 0) fill(el, left);
        else done(el, left > -864e5 ? "Chính là hôm nay ♡" : "Đã diễn ra");
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Timeline ---------- */
  function renderTimeline() {
    $("#timeline").innerHTML = W.timeline
      .map(
        (m, i) => `
        <li class="tl-item reveal" style="--d:${i * 80}ms">
          <span class="tl-dot"></span>
          <p class="text-[11px] uppercase tracking-widest2 text-olive">${m.date}</p>
          <h3 class="mt-2 font-serif text-3xl font-light">${m.title}</h3>
          <p class="mt-3 text-[15px] leading-7 text-muted">${m.text}</p>
        </li>`
      )
      .join("");
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  const observeReveals = (root = document) => $$(".reveal:not(.in), .m-item:not(.in)", root).forEach((el) => io.observe(el));

  /* ---------- Gallery ---------- */
  const visible = PHOTOS; // danh sách ảnh đang hiển thị (dùng cho lightbox)

  function renderGrid() {
    const grid = $("#grid");
    $("#emptyState").classList.toggle("hidden", visible.length > 0);

    // Chèn quote sau ảnh thứ 4, 11, 19… để tạo nhịp thở kiểu editorial
    const quoteSlots = [4, 11, 19];
    const html = [];
    visible.forEach((p, i) => {
      html.push(`
        <div class="m-item">
          <button class="photo" data-index="${i}" data-shape="${p.shape || ""}" aria-label="Xem ảnh: ${p.alt}">
            <img src="${src.thumb(p.id)}" alt="${p.alt}" loading="lazy" decoding="async" width="800" height="1200" />
            <span class="cap">${p.alt}</span>
          </button>
        </div>`);
      const q = quoteSlots.indexOf(i + 1);
      if (q > -1 && W.quotes[q] && i < visible.length - 1) {
        html.push(`
          <div class="m-item quote-card">
            <i data-lucide="quote" class="mx-auto mb-4 h-5 w-5 text-sand"></i>
            <blockquote>“${W.quotes[q].text}”</blockquote>
            <cite>— ${W.quotes[q].by}</cite>
          </div>`);
      }
    });
    grid.innerHTML = html.join("");

    $$("img", grid).forEach((img) => {
      const done = () => img.classList.add("loaded");
      img.complete ? done() : img.addEventListener("load", done, { once: true });
    });
    icons();
    observeReveals(grid);
  }

  $("#grid").addEventListener("click", (e) => {
    const b = e.target.closest(".photo");
    if (b) openLightbox(+b.dataset.index, b);
  });

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  let current = 0;
  let lastFocus = null;

  function showPhoto(i, animate = true) {
    current = (i + visible.length) % visible.length;
    const p = visible[current];
    const apply = () => {
      lbImg.onload = () => lbImg.classList.remove("swap");
      lbImg.src = src.large(p.id);
      lbImg.alt = p.alt;
    };
    if (animate && !reduceMotion) {
      lbImg.classList.add("swap");
      setTimeout(apply, 180);
    } else apply();

    $("#lbCounter").textContent = `${pad(current + 1)} / ${pad(visible.length)}`;
    $("#lbCaption").textContent = p.alt;
    const dl = $("#lbDownload");
    dl.href = src.original(p.id);
    dl.setAttribute("download", `${W.groom}-${W.bride}-${p.id}.jpg`.replace(/\s+/g, ""));
    history.replaceState(null, "", `#photo-${p.id}`);

    // Tải trước ảnh kế bên để chuyển ảnh mượt
    [1, -1].forEach((d) => (new Image().src = src.large(visible[(current + d + visible.length) % visible.length].id)));
  }

  function openLightbox(i, trigger) {
    lastFocus = trigger || document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    showPhoto(i, false);
    requestAnimationFrame(() => lb.classList.add("open"));
    $("#lbClose").focus();
  }

  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname + location.search);
    setTimeout(() => (lb.hidden = true), reduceMotion ? 0 : 400);
    lastFocus && lastFocus.focus({ preventScroll: true });
  }

  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => showPhoto(current - 1));
  $("#lbNext").addEventListener("click", () => showPhoto(current + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.tagName === "FIGURE") closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showPhoto(current + 1);
    if (e.key === "ArrowLeft") showPhoto(current - 1);
  });

  // Vuốt trái/phải trên di động
  let touchX = null;
  lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showPhoto(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  $("#lbShare").addEventListener("click", async () => {
    const url = location.href;
    const data = { title: `${W.groom} & ${W.bride}`, text: visible[current].alt, url };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(url);
      toast("Đã sao chép liên kết ảnh");
    } catch (err) {
      if (err.name !== "AbortError") toast("Không thể chia sẻ — hãy sao chép link trên thanh địa chỉ");
    }
  });

  // Mở thẳng ảnh khi có link dạng #photo-DSC03500
  function openFromHash() {
    const m = location.hash.match(/^#photo-(.+)$/);
    if (!m) return;
    const i = visible.findIndex((p) => p.id === m[1]);
    if (i > -1) openLightbox(i);
  }

  /* ---------- Nhạc nền ---------- */
  function setupMusic() {
    const btn = $("#musicBtn");
    const audio = $("#bgMusic");
    if (!W.music) return btn.remove();
    audio.volume = 0.55;
    audio.src = W.music;

    const setPlaying = (on) => {
      btn.classList.toggle("playing", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Tắt nhạc nền" : "Bật nhạc nền");
    };
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("error", () => {
      const code = audio.error?.code;
      console.error("Nhạc nền lỗi", code, audio.error?.message, audio.currentSrc);
      toast(code === 2 ? "Lỗi mạng khi tải nhạc — hãy tải lại trang"
        : code === 3 ? "Không giải mã được file nhạc " + W.music
        : "Trình duyệt không mở được " + W.music + " (mã lỗi " + code + ")");
    });

    btn.addEventListener("click", () => {
      audio.paused ? audio.play().catch(() => {}) : audio.pause();
    });
  }

  /* ---------- Màn chào "Mở thiệp" ----------
     Trình duyệt chặn tự phát nhạc có tiếng cho tới khi khách bấm vào trang,
     nên nhạc được phát ngay trong cú bấm "Mở thiệp". */
  function setupGate() {
    const gate = $("#gate");
    const gateBtn = $("#gateBtn");

    // Luôn mở thiệp từ đầu trang: không khôi phục vị trí cuộn cũ khi tải lại,
    // và bỏ #story/#gallery… còn sót trên URL (giữ #photo-… để mở thẳng ảnh được chia sẻ)
    history.scrollRestoration = "manual";
    if (location.hash && !location.hash.startsWith("#photo-")) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    const toTop = () => scrollTo({ top: 0, behavior: "instant" });
    toTop();
    gateBtn.addEventListener("click", () => {
      if (W.music) $("#bgMusic").play().catch(() => {});
      toTop(); // Firefox vẫn có thể tự cuộn tới #… sau khi script chạy
      document.body.classList.remove("gate-locked");
      gate.classList.add("opened");
      setTimeout(() => gate.remove(), reduceMotion ? 0 : 900);
      sparkleRain();
    });
  }

  /* ---------- Hiệu ứng lấp lánh rơi khi mở thiệp ----------
     Vẽ trên một canvas phủ toàn màn hình (không chặn bấm), rơi liên tục
     cho tới khi khách đóng trang. Luôn chạy, kể cả khi máy khách bật "giảm chuyển động". */
  function sparkleRain() {
    const COLORS = ["#E8C77B", "#F3DFA8", "#D4AF6A", "#FFF6DC", "#EADBC8"];

    const canvas = document.createElement("canvas");
    canvas.className = "sparkles";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let w, h;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const rand = (a, b) => a + Math.random() * (b - a);
    const spawn = (y = rand(-h * 0.2, -10)) => ({
      x: rand(0, w), y,
      r: rand(2, 6),
      vy: rand(0.6, 1.8),
      sway: rand(0.4, 1.4), phase: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI), vr: rand(-0.03, 0.03),
      tw: rand(0.04, 0.1),
      star: Math.random() < 0.6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    });

    // Ngôi sao 4 cánh kiểu "bling"
    const drawStar = (r) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const len = i % 2 ? r * 0.28 : r;
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
      }
      ctx.closePath();
      ctx.fill();
    };

    const count = Math.round(Math.min(140, (w * h) / 9000));
    const parts = Array.from({ length: count }, () => spawn(rand(-h, 0)));

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.phase += 0.02;
        p.y += p.vy;
        p.x += Math.sin(p.phase) * p.sway * 0.5;
        p.rot += p.vr;
        if (p.y > h + 10) Object.assign(p, spawn()); // rơi hết thì quay lại từ trên
        const alpha = 0.55 + 0.45 * Math.sin(p.phase * p.tw * 40);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.r * 2;
        if (p.star) drawStar(p.r * 1.6);
        else { ctx.beginPath(); ctx.arc(0, 0, p.r * 0.45, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Guestbook ----------
     Lời chúc được gửi lên Google Sheet qua Apps Script (W.wishesApi) để mọi người
     cùng thấy. Bản sao trong localStorage giúp khách vẫn thấy lời chúc của mình
     khi mạng lỗi hoặc chưa cấu hình wishesApi. */
  const STORE = "wedding-wishes-v2";
  const loadWishes = () => {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch { return []; }
  };
  const saveWishes = (list) => {
    try { localStorage.setItem(STORE, JSON.stringify(list)); } catch {}
  };

  function timeAgo(ts) {
    const s = (Date.now() - ts) / 1000;
    if (s < 60) return "Vừa xong";
    if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
    if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
    return new Date(ts).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function wishCard(w, isNew) {
    const el = document.createElement("article");
    el.className = "wish" + (isNew ? " new" : "");
    el.innerHTML = `
      <i data-lucide="heart" class="h-4 w-4 text-sand"></i>
      <p class="mt-4 font-serif text-xl italic leading-snug"></p>
      <div class="mt-6 flex items-center justify-between gap-3 text-xs">
        <span class="font-medium uppercase tracking-[0.18em]"></span>
        <span class="text-muted">${timeAgo(w.ts)}</span>
      </div>`;
    // textContent để tránh chèn HTML từ người dùng
    el.querySelector("p").textContent = `“${w.message}”`;
    el.querySelector("span").textContent = w.name;
    return el;
  }

  // Gộp lời chúc từ Sheet với bản lưu cục bộ, bỏ trùng (cùng tên + nội dung)
  function renderWishes(remote = []) {
    const list = $("#wishList");
    list.innerHTML = "";
    const seen = new Set();
    [...remote, ...loadWishes(), ...window.SEED_WISHES]
      .filter((w) => {
        const key = `${w.name}\n${w.message}`;
        return !seen.has(key) && seen.add(key);
      })
      .sort((a, b) => b.ts - a.ts)
      .forEach((w) => list.appendChild(wishCard(w)));
    icons();
  }

  async function fetchWishes() {
    if (!W.wishesApi) return;
    try {
      const res = await fetch(W.wishesApi);
      const data = await res.json();
      if (data.ok) renderWishes(data.wishes);
    } catch (err) {
      console.error("Không tải được lời chúc", err);
    }
  }

  // text/plain để tránh preflight CORS mà Apps Script không hỗ trợ
  const postWish = (wish) =>
    fetch(W.wishesApi, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(wish) })
      .then((res) => res.json())
      .then((data) => { if (!data.ok) throw new Error(data.error); });

  $("#wishForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const name = f.name.value.trim();
    const message = f.message.value.trim();
    f.name.classList.toggle("invalid", !name);
    f.message.classList.toggle("invalid", !message);
    if (!name || !message) return;

    const btn = $("button", f);
    const msg = $("#formMsg");
    const wish = { name, message, ts: Date.now() };
    btn.disabled = true;
    let sent = true;
    if (W.wishesApi) {
      try {
        await postWish(wish);
      } catch (err) {
        console.error("Gửi lời chúc lỗi", err);
        sent = false;
      }
    }
    btn.disabled = false;

    saveWishes([wish, ...loadWishes()]);
    $("#wishList").prepend(wishCard(wish, true));
    icons();
    f.reset();

    msg.textContent = sent
      ? `Cảm ơn ${name}! Lời chúc của bạn đã được gửi ♡`
      : "Mạng đang chập chờn — lời chúc tạm lưu trên máy, bạn thử gửi lại sau nhé.";
    msg.style.opacity = 1;
    setTimeout(() => (msg.style.opacity = 0), 3500);
  });

  /* ---------- Nav + Parallax ---------- */
  const nav = $("#nav");
  const hero = $("#heroImg");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle("scrolled", y > 40);
      // Giới hạn dịch chuyển trong phần ảnh dư (8%) để không lộ khoảng trống
      if (!reduceMotion) hero.style.setProperty("--py", `${Math.min(y * 0.15, hero.offsetHeight * 0.07)}px`);
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Khởi động ---------- */
  bindContent();
  renderTimeline();
  renderGrid();
  renderWishes();
  fetchWishes();
  setupEvents();
  setupMusic();
  setupGate();
  icons();
  observeReveals();
  onScroll();
  openFromHash();
})();
