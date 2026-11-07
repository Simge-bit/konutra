// İletişim bilgileri. WhatsApp numarası ülke koduyla ve boşluksuz yazılır (örneğin 905320000000).
const KONUTRA = { whatsapp: "905436190346", eposta: "" };

document.documentElement.classList.add("js");
const $ = (id) => document.getElementById(id);
const wa = (text) => `https://wa.me/${KONUTRA.whatsapp}?text=${encodeURIComponent(text)}`;
const bilgi = wa("Merhaba, Konutra hakkında bilgi almak istiyorum.");

if ($("yil")) $("yil").textContent = new Date().getFullYear();
if ($("wa")) $("wa").href = bilgi;
if ($("iletisim")) $("iletisim").innerHTML = [
  `<a href="${bilgi}" target="_blank" rel="noopener">WhatsApp</a>`,
  KONUTRA.eposta && `<a href="mailto:${KONUTRA.eposta}">${KONUTRA.eposta}</a>`
].filter(Boolean).join("");

// Ziyaret ölçümü (GoatCounter, çerezsiz). Olaylar panelde "tik-..." ve "form-..." olarak görünür.
const olay = (ad) => { try { window.goatcounter && window.goatcounter.count({ path: ad, title: ad, event: true }); } catch (_) {} };
// Ziyaretçinin hangi bölüme kadar indiği bir kez kaydedilir
const bolumIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { olay("bolum-" + e.target.id); bolumIO.unobserve(e.target); } }), { rootMargin: "-45% 0px -45% 0px" });
document.querySelectorAll("main section[id]").forEach((el) => bolumIO.observe(el));

// Kaydırınca belirme
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

// Menü
const nav = $("nav"), mnav = $("mnav"), menuBtn = $("menuBtn");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });
const setMenu = (open) => { mnav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); menuBtn.textContent = open ? "Kapat" : "Menü"; };
menuBtn.addEventListener("click", () => setMenu(!mnav.classList.contains("open")));
mnav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

// Örnek proje: sayfanın o kısmına gelince yüklenir
const live = $("live");
if (live) new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { live.src = live.dataset.src; o.disconnect(); } }, { rootMargin: "300px" }).observe(live);
document.querySelectorAll(".live .tab").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll(".live .tab").forEach((x) => x.setAttribute("aria-selected", x === b));
  live.src = b.dataset.src; $("openNew").href = b.dataset.src;
}));

// Panel videosu: ekrana yaklaşınca ekran boyuna uygun dosya yüklenir, görününce oynar.
// Tarayıcı otomatik oynatmayı engellerse (örneğin iPhone düşük güç modu) oynat düğmesi gösterilir.
const pv = $("pvideo"), pvBtn = $("pvOynat");
if (pv) {
  const oynat = () => pv.play().then(() => { pvBtn.hidden = true; }).catch(() => { pvBtn.hidden = false; });
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { pv.src = innerWidth < 700 ? pv.dataset.kucuk : pv.dataset.buyuk; pv.preload = "auto"; pv.load(); o.disconnect(); } }, { rootMargin: "800px 0px" }).observe(pv);
  let izlendi = false;
  new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { oynat(); if (!izlendi) { izlendi = true; olay("video-izlendi"); } } else pv.pause();
  }), { threshold: 0.35 }).observe(pv);
  pvBtn.addEventListener("click", oynat);
}

// Önizleme talebi formları WhatsApp mesajına dönüşür (sayfa başı ve alt bölüm)
const onizlemeGonder = (e) => {
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  let ok = true;
  f.querySelectorAll("[required]").forEach((el) => { const bad = !el.value.trim(); el.closest(".f, .hf").classList.toggle("err", bad); if (bad) ok = false; });
  if (!ok) { olay("form-eksik-" + f.id); f.querySelector(".err input")?.focus(); return; }
  olay("form-gonderildi-" + f.id);
  const msg = ["Merhaba, ofisimiz için ücretsiz site önizlemesi talep ediyoruz.", `Ofis: ${d.ofis}`, d.ilce && `Konum: ${d.ilce}`, d.link && `Sahibinden: ${d.link}`, d.ad && `Ad soyad: ${d.ad}`].filter(Boolean).join("\n");
  window.open(wa(msg), "_blank", "noopener");
};
document.querySelectorAll("#form, #hform").forEach((f) => f.addEventListener("submit", onizlemeGonder));

// Ana görsel: site ve telefon belirir, panel bildirimi birkaç saniyede bir değişir
(() => {
  const sahne = document.querySelector(".sahne"), b = document.getElementById("bildirim");
  if (!sahne || !b) return;
  const azalt = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const liste = [
    ["Yeni gezme randevusu talebi", "Bostanlı'da Deniz Manzaralı 3+1 Daire", "Yeni", ""],
    ["Yeni değerleme başvurusu", "Mavişehir, 4+1 daire", "Yeni", ""],
    ["İlan yayına alındı", "Alaybey'de Yatırımlık Satılık 1+1 Daire", "Yayında", "yesil"],
    ["Yeni iletişim talebi", "Kiralık 2+1 daire arıyor", "Yeni", ""]
  ];
  let i = 0;
  const yaz = ([t, s, d, c]) => {
    b.querySelector(".t").textContent = t; b.querySelector(".s").textContent = s;
    const e = b.querySelector(".dur"); e.textContent = d; e.className = "dur" + (c ? " " + c : "");
  };
  requestAnimationFrame(() => sahne.classList.add("on"));
  if (azalt) { b.classList.add("on"); return; }
  setTimeout(() => b.classList.add("on"), 1100);
  setInterval(() => {
    b.classList.remove("on");
    setTimeout(() => { i = (i + 1) % liste.length; yaz(liste[i]); b.classList.add("on"); }, 500);
  }, 4200);
})();
