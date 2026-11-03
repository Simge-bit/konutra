// İletişim bilgileri. WhatsApp numarası ülke koduyla ve boşluksuz yazılır (örneğin 905320000000).
const KONUTRA = { whatsapp: "905436190346", eposta: "" };

document.documentElement.classList.add("js");
const $ = (id) => document.getElementById(id);
const wa = (text) => `https://wa.me/${KONUTRA.whatsapp}?text=${encodeURIComponent(text)}`;

$("yil").textContent = new Date().getFullYear();
$("wa").href = wa("Merhaba, Konutra hakkında bilgi almak istiyorum.");
$("iletisim").innerHTML = [
  `<a href="${wa("Merhaba, Konutra hakkında bilgi almak istiyorum.")}" target="_blank" rel="noopener">WhatsApp</a>`,
  KONUTRA.eposta && `<a href="mailto:${KONUTRA.eposta}">${KONUTRA.eposta}</a>`
].filter(Boolean).join("");
requestAnimationFrame(() => document.body.classList.add("ready"));

// Kaydırınca belirme
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

// Menü
const nav = $("nav"), mnav = $("mnav"), menuBtn = $("menuBtn");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });
const setMenu = (open) => { mnav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); menuBtn.textContent = open ? "Kapat" : "Menü"; };
menuBtn.addEventListener("click", () => setMenu(!mnav.classList.contains("open")));
mnav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

// Ürün turu
const TUR = [
  { id: "site", ad: "Ana sayfa", img: "site-home.jpg", host: "ofisiniz.konutra.com", baslik: "Ofisinizin adıyla açılan bir ana sayfa",
    metin: "Açılışta seçtiğiniz ilanlar büyük fotoğraflarla döner. Altında tanıtımınız, öne çıkan ilanlarınız ve danışmanlarınız yer alır.",
    maddeler: ["Kendi renginiz ve adınız", "Ayın evi bölümü", "Ev sahipleri için değerleme çağrısı"] },
  { id: "liste", ad: "İlan listesi", img: "site-ilanlar.jpg", host: "ofisiniz.konutra.com/ilanlar", baslik: "Filtreli ilan listesi ve harita",
    metin: "Ziyaretçi ilanları tipe, konuma, fiyata, oda sayısına ve metrekareye göre süzer. Her ilan haritada fiyat etiketiyle görünür.",
    maddeler: ["Liste, harita ya da ikisi birden", "Favorilere ekleme", "Filtreli aramayı link olarak paylaşma"] },
  { id: "ilan", ad: "İlan sayfası", img: "site-ilan-ust.jpg", host: "ofisiniz.konutra.com/ilan/orman-kenarinda-mustakil-ev", baslik: "Her ilan için ayrıntılı bir sayfa",
    metin: "Büyük fotoğraflar, ilan bilgileri, konum haritası ve danışman kartı bir arada durur. Ziyaretçi tek dokunuşla WhatsApp'tan yazar.",
    maddeler: ["Kredi hesaplayıcı", "Gezme randevusu formu", "Paylaş ve yazdır düğmeleri"] },
  { id: "panel", ad: "Panel", img: "panel-ilanlar.jpg", host: "ofisiniz.konutra.com/panel", baslik: "İlanlarınızı tek listeden yönetirsiniz",
    metin: "İlan eklemek, fiyat değiştirmek ya da ilanı yayından kaldırmak birkaç saniye sürer. İlanları sürükleyerek sıralarsınız.",
    maddeler: ["Fotoğrafları sürükle bırak ile yükleme", "Ana sayfa slaytını seçme", "Danışman ve blog yönetimi"] },
  { id: "talep", ad: "Gelen talepler", img: "panel-talepler.jpg", host: "ofisiniz.konutra.com/panel", baslik: "Bütün talepler tek yerde toplanır",
    metin: "İletişim formu, gezme randevusu ve değerleme talepleri buraya düşer. Kimi aradığınızı işaretler, not alırsınız.",
    maddeler: ["Talebin hangi ilandan geldiği", "Yeni, arandı, tamamlandı durumları", "Menüde bekleyen talep sayısı"] },
  { id: "ayar", ad: "Ayarlar", img: "panel-ayarlar.jpg", host: "ofisiniz.konutra.com/panel", baslik: "Sitenizi kendiniz güncellersiniz",
    metin: "Ofis bilgilerinizi, WhatsApp numaranızı, marka renginizi ve tanıtım yazılarınızı istediğiniz zaman değiştirirsiniz.",
    maddeler: ["Marka rengi", "Tanıtım yazıları ve rakamlar", "Sık sorulan sorular"] }
];
const tabs = $("tabs"), pane = $("pane");
tabs.innerHTML = TUR.map((t, i) => `<button class="tab" type="button" role="tab" id="tab-${t.id}" aria-selected="${i === 0}" aria-controls="pane">${t.ad}</button>`).join("");
const showTab = (i) => {
  const t = TUR[i];
  tabs.querySelectorAll(".tab").forEach((b, k) => b.setAttribute("aria-selected", k === i));
  pane.innerHTML = `<div class="tour pane" role="tabpanel" aria-labelledby="tab-${t.id}">
    <div class="txt"><h3>${t.baslik}</h3><p>${t.metin}</p><ul>${t.maddeler.map((m) => `<li>${m}</li>`).join("")}</ul></div>
    <div class="browser"><div class="bar"><i></i><i></i><i></i><span>${t.host}</span></div><img src="img/${t.img}" alt="${t.baslik}"></div>
  </div>`;
};
tabs.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) showTab([...tabs.children].indexOf(b)); });
tabs.addEventListener("keydown", (e) => {
  const i = [...tabs.children].indexOf(document.activeElement);
  if (i < 0 || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  const n = (i + (e.key === "ArrowRight" ? 1 : -1) + TUR.length) % TUR.length;
  tabs.children[n].focus(); showTab(n);
});
showTab(0);
// Sekme görselleri önceden yüklenir, geçişte bekleme olmaz
addEventListener("load", () => TUR.forEach((t) => { new Image().src = "img/" + t.img; }));

// Canlı örnek: sayfanın o kısmına gelince yüklenir
const live = $("live");
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { live.src = live.dataset.src; o.disconnect(); } }, { rootMargin: "300px" }).observe(live);
document.querySelectorAll(".live .tab").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll(".live .tab").forEach((x) => x.setAttribute("aria-selected", x === b));
  live.src = b.dataset.src; $("liveHost").textContent = b.dataset.host; $("openNew").href = b.dataset.src;
}));

// Başvuru formu WhatsApp mesajına dönüşür
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  let ok = true;
  f.querySelectorAll("[required]").forEach((el) => { const bad = !el.value.trim(); el.closest(".f").classList.toggle("err", bad); if (bad) ok = false; });
  if (!ok) return;
  const msg = [`Merhaba, Konutra'yı denemek istiyorum.`, `Ad soyad: ${d.ad}`, `Ofis: ${d.ofis}`, `Telefon: ${d.tel}`, d.ilce && `İlçe: ${d.ilce}`, d.link && `Sahibinden: ${d.link}`].filter(Boolean).join("\n");
  window.open(wa(msg), "_blank", "noopener");
});
