const API_URL = "https://script.google.com/macros/s/AKfycbyVML9s78ajHrNf_xCDGh4gGV5KrA7bvWMN_j49Hy1vEzOLioUqvtMDnSGPfIjLYndZ-g/exec"; 
let sonBasariZamani = 0;
let fetchDevamEdiyor = false;
let apiData = {}; 
let healthChartInstance = null; 

const svgCheck = `<svg viewBox="0 0 14 10"><polyline points="1.5 5 5 8.5 12.5 1"></polyline></svg>`;
const svgSync = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`;
const svgWait = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

window.switchTab = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    const targetTab = document.getElementById(tabId);
    if(targetTab) targetTab.classList.add('active');
    btn.classList.add('active');
    
    if(tabId === 'tab-analysis' && typeof grafikCiz === 'function') {
        setTimeout(grafikCiz, 150);
    }
    // Her sekme geçişinde noktaları tekrar kontrol et
    setTimeout(updateTabGlows, 50); 
};

const now = new Date();
const hour = now.getHours();
let gMsg = "İyi Geceler"; 
/* Gece: Sakin ve derin bir gece mavisi */
let vipBg = "linear-gradient(135deg, #334155 0%, #0F172A 100%)";
let greetingIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 6px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

if (hour >= 5 && hour < 12) { 
    gMsg = "Günaydın"; 
    /* Sabah: Uçuk şeftali ve gün doğumu pembesi (Huzur verir) */
    vipBg = "linear-gradient(135deg, #FDBA74 0%, #F472B6 100%)"; 
    greetingIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 6px;"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="m20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>';
} 
else if (hour >= 12 && hour < 17) { 
    gMsg = "Tünaydın"; 
    /* Öğle: Açık gökyüzü ve ferah mavi */
    vipBg = "linear-gradient(135deg, #7DD3FC 0%, #3B82F6 100%)"; 
    greetingIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 6px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
} 
else if (hour >= 17 && hour < 22) { 
    gMsg = "İyi Akşamlar"; 
    /* Akşam: Sakin bir okyanus laciverti/mor */
    vipBg = "linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)"; 
    greetingIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 6px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
}

const headerElement = document.getElementById('greetingText');
if(headerElement) headerElement.innerHTML = `${greetingIcon}${gMsg},`;
const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
if(document.getElementById('currentYearText')) document.getElementById('currentYearText').innerText = now.getFullYear();

const dynamicHeaderBg = document.getElementById('dynamicHeaderBg');
if (dynamicHeaderBg) { dynamicHeaderBg.style.background = vipBg; dynamicHeaderBg.style.border = "none"; }

const puanla = {
    agri: (val) => {
        if (!val) return 0;
        const v = val.toLowerCase();
        if (v.includes("ağrım yok")) return 0;
        if (v.includes("hafif sızlıyor")) return 1;
        if (v.includes("sinir uçlarım")) return 2;
        if (v.includes("şiş ve ağrılı")) return 3;
        return 0;
    },
    uyku: (val) => {
        if (!val) return 0;
        const v = val.toLowerCase();
        if (v.includes("deliksiz")) return 3;
        if (v.includes("bölündü") || v.includes("ağrım vardı")) return 1.5;
        if (v.includes("fazla uyuyamadım")) return 0;
        return 1;
    },
    enerji: (val) => {
        if (!val) return 1;
        const v = val.toLowerCase();
        if (v.includes("dinamik")) return 3;
        if (v.includes("orta")) return 1.5;
        if (v.includes("çok bitkin")) return 0;
        return 1;
    },
    beslenme: (val) => {
        if (!val) return 0;
        const v = val.toLowerCase();
        if (v.includes("maalesef") || v.includes("fazla kaçırdım")) return 3;
        if (v.includes("ucundan")) return 1.5;
        if (v.includes("hiç yemedim")) return 0;
        return 0;
    }
};

const ilacAciklamalari = {
  "INH": [
    "Bağışıklık sistemin dinlenirken akciğerlerini mikroplara karşı özenle korur. Böylece sen fark etmeden vücudunun savunma hattını güçlü tutar.",
    "Vücudunun direnci zayıfladığında bile seni dışarıdaki enfeksiyonlardan sakınır. Göğüs sağlığını güvence altına alarak rahat bir nefes almanı sağlar.",
    "Akciğerlerine kalkan olur ve uykudaki bakterilerin uyanmasına asla izin vermez. Tedavini güvenle sürdürmen için arka planda sessizce çalışır.",
    "Ağır romatizma ilaçları kullanırken akciğerlerinin en büyük destekçisidir. Seni olası hastalıklara karşı görünmez bir zırh gibi sarar.",
    "Vücudunu dışarıdan gelebilecek tehditlere karşı her an hazırlıklı tutar. Senin hissetmediğin tehkelileri önceden sezerek hastalanmanı engeller.",
    "Romatizma tedavini sorunsuz bir şekilde atlatabilmen için göğsüne siper olur. Uykuda olabilecek mikropları tamamen etkisiz hale getirerek içini ferah tutar."
  ],
  "Balık Yağı": [
    "Eklemlerini hücresel boyutta yağlayarak sabahları daha esnek uyanmanı sağlar. Aynı zamanda kalbini koruyarak güne zinde başlamana destek olur.",
    "Doğal yapısıyla vücudundaki iltihabın ve şişkinliğin sönmesine yardımcı olur. Damarlarının sağlıklı çalışmasını sağlayarak ritmini korur.",
    "Gün boyu hareketli kalman için hücrelerine enerji ve canlılık taşır. Eklemlerindeki sürtünmeyi azaltarak adımlarını yumuşatır."
  ],
  "Göz Damlası": [
    "Gözlerindeki kuruluk hissini alarak sana net ve pırıl pırıl bir görüş sağlar. Sjögren'in yarattığı batma ve kumlanma hissini anında ferahlatır.",
    "Gözyaşı kanallarını nemlendirip göz kapaklarının acımadan kırpılmasını sağlar. Günlük hayatında göz yorgunluğunu silip atarak bakışlarını dinlendirir.",
    "Rüzgar ve güneşin gözlerinde yaratabileceği hassasiyeti ve kızarıklığı önler. Göz yüzeyini adeta bir kalkan gibi sararak ince çizilmeleri engeller."
  ],
  "Benexol": [
    "Sinir uçlarını besleyerek ellerindeki ve ayaklarındaki batmaları önler. Ağır ilaçların yarattığı yorgunluğu siler, gün ortasında enerjini yeniler.",
    "Unutkanlık ve beyin sisini dağıtarak zihnini berraklaştırır ve odaklanmanı kolaylaştırır. Vücudunun sinir ağını bir kazak gibi örerek onarır ve güçlendirir.",
    "İlaçların sinir sistemine verebileceği uyuşma ve karıncalanma hissini sıfırlar. Zayıflayan sinir kılıflarını tamir ederek vücuduna sağlamlık katar."
  ],
  "Plaquenil": [
    "Eklemlerindeki iltihabı yavaşça ve derinden temizleyen temel ilacındır. Vücudunun kendi kendine zarar vermesini engelleyen şefkatli bir dengeleyicidir.",
    "Romatizmanın hızını keserek eklemlerini geleceğe dönük güvence altına alır. Hastalığı alevlenmesini önleyerek yarın sabah çok daha rahat uyanmanı sağlar.",
    "Eklem kıkırdaklarını koruyan ve yıkımı sessizce durdurun en büyük dostundur. Şişlik ve ağrıların geri gelmemesi için arka planda yorulmadan çalışır."
  ],
  "Quantavir": [
    "Vücudun zorlu tedavilerle meşgulken karaciğerini yorulmaktan korur. İlaçların karaciğerine zarar vermemesi için sağlam ve güçlü bir zırh oluşturur.",
    "Geçmişte uyuyan virüslerin bir daha asla uyanmasına izin vermez. Karaciğer enzimlerini dengede tutarak midenin bulanmasını tamamen engeller.",
    "Ağır romatizma tedavilerinin karaciğerde yaratacağı yükü pamuk gibi hafifletir. Senin hissetmediğin tehlikeleri önceden sezerek karaciğerinin sarsılmaz nöbetçisidir."
  ],
  "Deltacortril": [
    "Eklemlerindeki alevi ve şişliği saniyeler içinde söndüren en hızlı itfaiyecidir (3 Mayıs'tan beri 1/4 doz). Sabah yataktan çok daha ağrısız ve enerjik bir şekilde kalkmanı sağlar.",
    "Vücudundaki dayanılmaz ağrı döngüsünü hızla kırıp seni anında ferahlatır. Bağışıklık sisteminin aşırı tepkisini hemen frenleyerek bedenine huzur verir.",
    "Tutukluk hissini ortadan kaldırıp hareketlerini ve adımlarını özgürleştirir. Şiddetli eklem iltihaplarına karşı vücudunun en acil durum müdahalesidir."
  ],
  "Coledan-D3": [
    "Kortizonun kemiklerini zayıflatmasına izin vermeyen sapasağlam bir kalkandır. Eklemlerine ve kemiklerine ihtiyaç duyduğu gücü ve kalsiyumu eksiksiz taşır.",
    "Kaslarındaki güçsüzlüğü ve yorgunluğu alarak vücut direncini hissedilir şekilde artırır. Kemiklerinin yapısını beton gibi sağlamlaştırıp erimeleri ve çatlamaları önler.",
    "Güneşin şifasını vücuduna taşıyarak iskelet sistemini yıllar boyu dimdik ayakta tutar. Bağışıklık sistemini dengede tutarak hastalıklara karşı direncini katlayarak artırır."
  ],
  "Metoartcon": [
    "Romatizmanın kalıcı hasar bırakmasını önleyen en güçlü ana tedavi yöntemindir. Hastalığı derin bir uykuya yatırarak eklemlerini şekil bozukluklarından kurtarır.",
    "İltihap hücrelerinin çoğalmasını durdurup hastalığın kökünü temelli kurutur. Zamanla oluşabilecek eklem eğriliklerini (deformasyonları) kesin olarak engeller.",
    "Bağışıklık sistemine şefkatli bir dur diyerek kendi vücuduna saldırmasının önüne geçer. Haftalık uygulanan bu ufak iğne, uzun yıllar boyunca rahatça yürüyebilmeni garantiler."
  ],
  "Folbiol": [
    "İğnenin sende yaratabileceği bitkinlik, bulantı ve yorgunluğu adeta silip atar. Ağzında yara çıkmasını (aft) ve saçlarının zayıflamasını hücresel boyutta kesinlikle önler.",
    "Metotreksatın tüm yan etkilerini sıfırlayarak karaciğerini ve mideni tamamen güvene alır. Vücudunda yepyeni ve sağlıklı kan hücrelerinin yapılmasına kesintisiz destek olur.",
    "Haftalık iğne tedavinden sonra vücudunu tazeleyip yenileyen çok değerli bir şifa vitaminidir. Hücre bölünmesini destekleyerek cildini ve iç dokularını her zaman koruma altına alır."
  ],
  "Cimzia İğnesi": [
    "Diğer ilaçların gücünün yetmediği inatçı iltihabı kaynağında akıllıca bulur ve yok eder. Doğrudan hedefleme ile sadece eklemlerdeki sorunlu bölgeyi tespit eder ve dondurur.",
    "Romatizmanın ilerlemesini tamamen durdurup yaşam kaliteni en üst seviyeye güvenle taşır. Seni yoran o şişlik ve ağrı döngüsünü bıçak gibi kesen en modern ve ileri tedavidir.",
    "Sadece hastalıklı hücrelere odaklanarak bedeninin geri kalanına gereksiz yük bindirmez. Hastalığı derin bir uykuda tutarak sabahları çok daha zinde, esnek ve ağrısız kalkmanı sağlar."
  ]
};

function rastgeleAciklama(ilacAdi) {
  const liste = ilacAciklamalari[ilacAdi];
  return (liste && liste.length > 0) ? liste[Math.floor(Math.random() * liste.length)] : "";
}

function manuelYenile() {
    if(fetchDevamEdiyor) return;
    const uText = document.getElementById('update-text');
    const syncI = document.getElementById('sync-icon');
    if(uText) { uText.innerHTML = `${svgWait} Veriler Tazeleniyor...`; uText.style.color = "#4ade80"; }
    if(syncI) syncI.classList.add("spin");
    const syncElement = document.getElementById('last-sync');
    if(syncElement) { syncElement.innerHTML = `${svgSync} Tazeleniyor...`; syncElement.style.color = "var(--vip-gold)"; }
    sonBasariZamani = 0;
    veriCek();
    fetchWeather();
}

async function fetchWeather() {
    const tEl = document.getElementById('wTempText');
    const mEl = document.getElementById('wMainIcon');
    const hEl = document.getElementById('wHumText');
    const aIEl = document.getElementById('wAdvIcon');
    const aTEl = document.getElementById('wAdvice');

    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.07&longitude=28.64&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto');
        if (!res.ok) throw new Error('Hata');
        const data = await res.json();
        
        const t = Math.round(data.current.temperature_2m); 
        const h = data.current.relative_humidity_2m;
        const w = data.current.wind_speed_10m;
        const uv = (data.daily && data.daily.uv_index_max) ? data.daily.uv_index_max[0] : 0; 
        const isDay = (new Date().getHours() >= 7 && new Date().getHours() < 19);

        let icon = "🌥️", advI = "🩺", advC = "var(--accent)", advice = "Hava bugün senin için gayet güzel. Keyfini çıkar!";

        if (isDay && uv > 5) { advI = "🕶️"; advC = "var(--warning)"; advice = "Güneş dik geliyor, koruyucu sür ve gölgede kal."; } 
        else if (w > 20) { icon = "🌬️"; advI = "💧"; advC = "var(--early)"; advice = "Dışarısı rüzgarlı, Sjögren için damlanı yanına al."; } 
        else if (h > 70 && t < 15) { icon = "🌧️"; advI = "⚠️"; advC = "var(--danger)"; advice = `Hava nemli (%${h}), eklemlerini sıcak tut.`; } 
        else if (t < 12) { icon = "🥶"; advI = "🧣"; advC = "var(--warning)"; advice = "Dışarısı soğuk, kat kat giyinmeyi unutma."; } 
        else if (!isDay) { icon = "🌙"; advice = `Hava ${t}°C. İlaçlarını alıp dinlenme vakti Nurten Hanım.`; }

        if(tEl) tEl.innerText = t + "°";
        if(mEl) mEl.innerText = icon;
        if(hEl) hEl.innerText = "%" + h + " Nem";
        if(aIEl) { aIEl.innerText = advI; aIEl.style.color = advC; }
        if(aTEl) aTEl.innerText = advice;
    } catch(e) { 
        if(aTEl) aTEl.innerText = "Hava durumu şu an alınamıyor, ancak ilaç takibiniz aktif.";
    }
}

function saniyeTiktak() {
    const syncElement = document.getElementById('last-sync');
    const clockElement = document.getElementById('clock');
    const simdi = Date.now();
    const dNow = new Date();
    if(clockElement) clockElement.textContent = dNow.getDate() + " " + dNow.toLocaleDateString('tr-TR', {month:'short'}) + " • " + String(dNow.getHours()).padStart(2,'0') + ':' + String(dNow.getMinutes()).padStart(2,'0');
    if(fetchDevamEdiyor || !syncElement) return;
    const farkSaniye = sonBasariZamani > 0 ? Math.floor((simdi - sonBasariZamani) / 1000) : 999;
    if (sonBasariZamani === 0) { syncElement.innerHTML = `${svgSync} Bağlanıyor...`; syncElement.style.color = "var(--vip-gold)"; } 
    else if (farkSaniye < 20) { const d = new Date(sonBasariZamani); syncElement.innerHTML = `🟢 Canlı (${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')})`; syncElement.style.color = "#4ADE80"; } 
    else if (farkSaniye < 60) { syncElement.innerHTML = `🟡 Gecikme: ${farkSaniye} sn`; syncElement.style.color = "var(--vip-gold)"; } 
    else { syncElement.innerHTML = `🔴 Bağlantı Yok`; syncElement.style.color = "#FF453A"; }
}

function getDailyProgram(dateObj) {
    let day = dateObj.getDay(); let mid = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    let p = [
      { id: 'sabah-ac', title: 'SABAH AÇ', time: '06:00', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="M12 22v-2"/><path d="m19.07 19.07-1.41-1.41"/><path d="M22 12h-2"/><path d="m19.07 4.93-1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>', meds: [{ key: 'SABAH_AC_INH', name: 'INH', purpose: rastgeleAciklama('INH') }] },
      { id: 'sabah-tok', title: 'SABAH TOK', time: '10:00', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>', meds: [{ key: 'SABAH_TOK_BALIK', name: 'Balık Yağı', purpose: rastgeleAciklama('Balık Yağı') }, { key: 'SABAH_TOK_GOZ', name: 'Göz Damlası', purpose: rastgeleAciklama('Göz Damlası') }] },
      { id: 'ogle', title: 'ÖĞLE', time: '13:00', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>', meds: [{ key: 'OGLE_BENEXOL', name: 'Benexol', purpose: rastgeleAciklama('Benexol') }] },
      { id: 'aksam', title: 'AKŞAM', time: '18:00', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>', meds: [{ key: 'AKSAM_PLAQUENIL', name: 'Plaquenil', purpose: rastgeleAciklama('Plaquenil') }] },
      { id: 'gece', title: 'GECE', time: '21:00', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>', meds: [{ key: 'GECE_QUANTAVIR', name: 'Quantavir', purpose: rastgeleAciklama('Quantavir') }, { key: 'GECE_GOZ', name: 'Göz Damlası', purpose: rastgeleAciklama('Göz Damlası') }] }
    ];
    const dS = new Date(2026, 1, 16); 
    if(Math.round((mid - dS)/(1000*60*60*24)) % 2 === 0) p[1].meds.push({ key: 'SABAH_TOK_DELTA', name: 'Deltacortril', purpose: rastgeleAciklama('Deltacortril') });
    if(day === 2) { p[1].meds.push({ key: 'SABAH_TOK_COLEDAN', name: 'Coledan-D3', purpose: rastgeleAciklama('Coledan-D3') }); p[4].meds.push({ key: 'GECE_FOLBIOL', name: 'Folbiol', purpose: rastgeleAciklama('Folbiol') }); }
    if(day === 5 && mid >= new Date(2026, 4, 1)) { p[4].meds.push({ key: 'GECE_FOLBIOL', name: 'Folbiol', purpose: rastgeleAciklama('Folbiol') }); }
    if(day === 1) p[4].meds.push({ key: 'GECE_METOARTCON', name: 'Metoartcon', purpose: rastgeleAciklama('Metoartcon') });
    const cS = new Date(2026, 1, 12);
    if(Math.round((mid - cS)/(1000*60*60*24)) % 14 === 0) p[4].meds.push({ key: 'GECE_CIMZIA', name: 'Cimzia İğnesi', purpose: rastgeleAciklama('Cimzia İğnesi') });
    return p;
}

function renderHealthDiary() {
    if (!apiData || !apiData.ai) return;
    let aiMsg = apiData.ai.gunluk || "Veriler değerlendiriliyor...";
    let lastReadReport = localStorage.getItem('lastRead_gunluk');
    let isNew = (aiMsg && !aiMsg.includes("değerlendiriliyor") && !aiMsg.includes("güncellenemiyor") && lastReadReport !== aiMsg);
    let pulseClass = isNew ? "unread-premium-card" : "";
    
    // Rozeti alt satıra almak için bir div içine koyduk
    let badgeHTML = isNew ? `<div style="margin-top:8px;"><span class="premium-new-badge">YENİ</span></div>` : "";
    
    let finalHTML = `
        <div class="diary-card ${pulseClass} collapsed" id="aiDiaryCard" data-new-text="${isNew ? aiMsg : ''}">
            <div class="diary-header" onclick="markStatAsRead('gunluk', 'aiDiaryCard'); this.parentElement.classList.toggle('collapsed')" style="cursor:pointer;">
                <h3 class="diary-title" id="title-gunluk">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    <div>
                        Günün Analizi
                        ${badgeHTML}
                    </div>
                </h3>
                <div class="diary-toggle-icon">▲</div>
            </div>
            <div class="diary-ai-box">
                ${aiMsg}
                <div style='font-size:13px; color:var(--muted); font-weight:600; display:flex; align-items:center; gap:6px; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 12px; margin-top: 14px;'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Her gün 10:00 ve 22:00'da Tıbbi Konsey günceller.
                </div>
            </div>
        </div>`;
    const diaryArea = document.getElementById('healthDiaryArea');
    if(diaryArea) diaryArea.innerHTML = finalHTML;
    setTimeout(updateTabGlows, 100);
}

window.markStatAsRead = function(statType, cardId) {
    let card = document.getElementById(cardId);
    if (card && card.hasAttribute('data-new-text')) {
        let textToSave = card.getAttribute('data-new-text');
        if (textToSave) {
            localStorage.setItem('lastRead_' + statType, textToSave);
            card.removeAttribute('data-new-text');
            card.classList.remove('unread-premium-card');
            let titleSpan = document.getElementById('title-' + statType);
            if(titleSpan) {
                titleSpan.innerHTML = titleSpan.innerHTML.replace(/\s*<span class="premium-new-badge[^>]*>.*?<\/span>/gi, '');
            }
        }
    }
    // Gecikme olmadan hemen kontrol et
    updateTabGlows(); 
};

function analyzeMonth(year, month) {
    let totalMeds = 0; let missedMedsCount = 0; let breakdown = [];
    const dNow = new Date();
    const isCurrentMonth = (year === dNow.getFullYear() && month === dNow.getMonth());
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const maxDay = isCurrentMonth ? dNow.getDate() : daysInMonth;
    const START_DATE = new Date(2026, 2, 7); // 7 Mart 2026
for (let d = maxDay; d >= 1; d--) { 
    let currentDay = new Date(year, month, d);
    // Milattan önceki günleri hesaba katma
    if (currentDay < START_DATE) continue; 
        let dateStr = String(d).padStart(2, '0') + '.' + String(month + 1).padStart(2, '0') + '.' + year;
        let prog = getDailyProgram(currentDay);
        let dayTotal = 0; let dayMissedCount = 0; let dayMissedNames = [];
        let dayData = (apiData.tumVeriler && apiData.tumVeriler[dateStr]) ? apiData.tumVeriler[dateStr] : null;
        prog.forEach(s => {
            let cardMins = s.time ? (parseInt(s.time.split(':')[0]) * 60) + parseInt(s.time.split(':')[1]) : 0;
            s.meds.forEach(m => {
                dayTotal++;
                let isDone = dayData ? (dayData[m.key] === "İçildi") : false;
                let isExplicitlyMissed = dayData ? (dayData[m.key] === "İçilmedi") : false;
                let isMissed = false;
                if (!isDone) {
                    if (isExplicitlyMissed) { isMissed = true; } 
                    else if (isCurrentMonth && d === dNow.getDate()) {
                        const nowMins = (dNow.getHours() * 60) + dNow.getMinutes();
                        if (nowMins > cardMins + 90) isMissed = true;
                    } else { isMissed = true; }
                }
                if (isMissed) { dayMissedCount++; dayMissedNames.push(m.name); }
            });
        });
        totalMeds += dayTotal; missedMedsCount += dayMissedCount;
        if (dayTotal > 0) breakdown.push({ dateStr: dateStr, dayNum: d, totalCount: dayTotal, missedCount: dayMissedCount, missedNames: dayMissedNames, isAllDone: (dayMissedCount === 0) });
    }
    let percentage = totalMeds > 0 ? Math.round(((totalMeds - missedMedsCount) / totalMeds) * 100) : 100;
    return { percentage, breakdown };
}

function getBadgeClass(percentage) { return percentage >= 90 ? "badge-safe" : percentage >= 70 ? "badge-warning" : "badge-danger"; }

function renderMonthStat(prefix, data, statType, cardId) {
    const badgeEl = document.getElementById(prefix + 'Badge');
    const detailsEl = document.getElementById(prefix + 'Details');
    const cardEl = document.getElementById(cardId);
    const titleSpan = document.getElementById('title-' + statType);
    if(!badgeEl || !detailsEl) return;
    badgeEl.innerHTML = `%${data.percentage} <span class="exp-arrow">▲</span>`;
    badgeEl.className = `badge ${getBadgeClass(data.percentage)}`;
    let aiText = "";
    if (statType === 'gecenAy') {
        const currentMonth = now.getMonth(); const currentYear = now.getFullYear();
        let lm = currentMonth - 1; let lmy = currentYear;
        if (lm < 0) { lm = 11; lmy--; }
        const lmKey = "saved_gecenAy_v9_" + lmy + "_" + lm;
        localStorage.removeItem("saved_gecenAy_" + lmy + "_" + lm); 
        localStorage.removeItem("saved_gecenAy_v2_" + lmy + "_" + lm);
        localStorage.removeItem("saved_gecenAy_v3_" + lmy + "_" + lm);
        localStorage.removeItem("saved_gecenAy_v4_" + lmy + "_" + lm);
        let savedLm = localStorage.getItem(lmKey);
        if (savedLm && (savedLm.includes("Koruma") || savedLm.includes("güncellenemiyor") || savedLm.includes("yoğunluk"))) {
            localStorage.removeItem(lmKey);
            savedLm = null;
        }
        let ikiAyOnce = currentMonth - 2; if (ikiAyOnce < 0) ikiAyOnce += 12;
        const ikiAyOnceIsim = aylar[ikiAyOnce]; const gecenAyIsim = aylar[lm];
        if (savedLm && (!savedLm.includes(gecenAyIsim) || savedLm.includes(ikiAyOnceIsim))) {
            localStorage.removeItem(lmKey);
            savedLm = null;
        }
        if (savedLm) { aiText = savedLm; } else {
            aiText = (apiData.ai && apiData.ai.gecenAy) ? apiData.ai.gecenAy : "";
            if (aiText && !aiText.includes("güncellenemiyor") && !aiText.includes("yoğunluk") && !aiText.includes("Koruma")) {
                localStorage.setItem(lmKey, aiText);
            }
        }
    } else if (statType === 'buAy') {
        aiText = (apiData.ai && apiData.ai.buAy) ? apiData.ai.buAy : "İstatistik bekleniyor...";
    }
    let html = `<div class="stat-ai-summary"><strong>✨ Dönem Özeti</strong>${aiText}</div>`;
    data.breakdown.forEach(day => {
        let ayIsmi = aylar[parseInt(day.dateStr.split('.')[1])-1].substring(0,3);
        if (day.isAllDone) {
            html += `<div class="stat-row"><span class="stat-date">${day.dayNum} ${ayIsmi}</span><div class="stat-info"><div class="stat-status" style="color: var(--accent);"><div class="check-icon done">${svgCheck}</div>Tüm ilaçlar alındı</div></div></div>`;
        } else {
            html += `<div class="stat-row"><span class="stat-date">${day.dayNum} ${ayIsmi}</span><div class="stat-info"><div class="stat-status" style="color: var(--text);">⚠️ ${day.totalCount - day.missedCount}/${day.totalCount} İlaç</div><div class="stat-missed-list" style="color: var(--danger);">Eksik: ${day.missedNames.join(', ')}</div></div></div>`;
        }
    });
    detailsEl.innerHTML = html;
    if (aiText && !aiText.includes("bekleniyor") && !aiText.includes("güncellenemiyor")) {
        let lastRead = localStorage.getItem('lastRead_' + statType);
                if (lastRead !== aiText) {
          cardEl.classList.add('unread-premium-card');
          if(titleSpan && !titleSpan.innerHTML.includes('YENİ')) { 
    // Rozeti başlığın hemen altına, temiz bir şekilde ekler
    titleSpan.innerHTML += `<div style="margin-top:5px;"><span class="premium-new-badge">YENİ</span></div>`; 
}
          cardEl.setAttribute('data-new-text', aiText); 
      } else {
          cardEl.classList.remove('unread-premium-card');
          if(titleSpan) {
              titleSpan.innerHTML = titleSpan.innerHTML.replace(/\s*<span class="premium-new-badge[^>]*>.*?<\/span>/gi, '');
          }
      }
      // KRİTİK DÜZELTME: setTimeout'u if/else bloğunun DIŞINA aldık. 
      // Böylece kart yeni olsa da olmasa da sekmelerdeki noktalar güncellenir.
      setTimeout(updateTabGlows, 250); 
    }
}

function istatistikleriCiz() {
    if (!apiData || !apiData.tumVeriler) return;
    const currentYear = now.getFullYear(); const currentMonth = now.getMonth();
    renderMonthStat('thisMonth', analyzeMonth(currentYear, currentMonth), 'buAy', 'card-stat-this-month');
    let lastMonth = currentMonth - 1; let lastMonthYear = currentYear;
    if (lastMonth < 0) { lastMonth = 11; lastMonthYear--; }
    renderMonthStat('lastMonth', analyzeMonth(lastMonthYear, lastMonth), 'gecenAy', 'card-stat-last-month');
    let yBadge = document.getElementById('yearlyBadge');
    if(yBadge) yBadge.innerHTML = `%100 <span class="exp-arrow">▲</span>`;
    let yDetails = document.getElementById('yearlyDetails');
    let cardYillik = document.getElementById('card-stat-yearly');
    let titleYillik = document.getElementById('title-yillik');
    let yillikText = (apiData.ai && apiData.ai.yillik) ? apiData.ai.yillik : "İstatistik bekleniyor...";
    if(yDetails) {
        yDetails.innerHTML = `<div class="stat-ai-summary"><strong><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 4px;"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> ${currentYear} Yılı Özeti</strong>${yillikText}</div>`;
        if (yillikText && !yillikText.includes("bekleniyor") && !yillikText.includes("güncellenemiyor")) {
            let lastRead = localStorage.getItem('lastRead_yillik');
                        if (lastRead !== yillikText) {
                cardYillik.classList.add('unread-premium-card');
                if(titleYillik && !titleYillik.innerHTML.includes('YENİ')) { 
    titleYillik.innerHTML += `<div style="margin-top:5px;"><span class="premium-new-badge">YENİ</span></div>`; 
}
                cardYillik.setAttribute('data-new-text', yillikText);
            } else {
                cardYillik.classList.remove('unread-premium-card');
                if(titleYillik) titleYillik.innerHTML = titleYillik.innerHTML.replace(/\s*<span class="premium-new-badge[^>]*>.*?<\/span>/gi, '');
            }
        }
    }
}

function doktorRaporuOlustur() {
    if (!apiData || !apiData.tumVeriler) { alert("Henüz veri yüklenmedi. Lütfen bekleyin."); return; }
    const dNow = new Date();
    const bugunStr = String(dNow.getDate()).padStart(2, '0') + '.' + String(dNow.getMonth() + 1).padStart(2, '0') + '.' + dNow.getFullYear();
    var tarihler = Object.keys(apiData.tumVeriler)
        .filter(t => new Date(t.split('.')[2], t.split('.')[1]-1, t.split('.')[0]) >= new Date(2026, 2, 7) && t !== bugunStr)
        .sort((a,b) => new Date(a.split('.')[2], a.split('.')[1]-1, a.split('.')[0]) - new Date(b.split('.')[2], b.split('.')[1]-1, b.split('.')[0]));
    const deltaMilat = new Date(2026, 1, 16); 
    let aylarVerisi = {}; let siraliAylar = [];
    tarihler.forEach(function(tarihStr) {
        let v = apiData.tumVeriler[tarihStr]; let p = tarihStr.split('.');
        let currentDayObj = new Date(p[2], p[1]-1, p[0]);
        let isDeltaDay = Math.round((currentDayObj - deltaMilat)/(1000*60*60*24)) % 2 === 0;
        let ayIsmi = aylar[parseInt(p[1])-1] + " " + p[2];
        if (!aylarVerisi[ayIsmi]) { aylarVerisi[ayIsmi] = ""; siraliAylar.push(ayIsmi); }
        let tarihSutunuHTML = `<strong>${tarihStr.substring(0,5)}</strong>`;
        if (isDeltaDay) { tarihSutunuHTML += `<br><span style="font-size:8px; color:#555;">Deltacortril</span>`; }
        let ates = "", terleme = "", uyku = "", enerji = "", agri = "", bolge = "", sjogren = "", akt = "", tut = "", mide = "", agiz = "", beslenme = "", su = "", zihin = "";
        for (let k in v) {
            let cl = k.toLowerCase(); if(v[k] === "İçildi" || v[k] === "İçilmedi" || v[k] === "-") continue;
            let valStr = String(v[k] || "").trim();
            if (cl === "ates" || cl === "ateş") ates = valStr;
            else if (cl === "gece_terlemesi" || cl.includes("terleme")) { if(valStr.includes("Hayır")) terleme = "Yok"; else if(valStr.includes("Hafif terledim")) terleme = "Hafif"; else if(valStr.includes("Sırılsıklam")) terleme = "Şiddetli"; else terleme = valStr; } 
            else if (cl === "sabah_tutuklugu" || cl.includes("tutuk")) { if(valStr.includes("Hemen Açıldım")) tut = "Yok"; else tut = valStr; } 
            else if (cl === "eklem_agrisi" || cl.includes("ağrı") || cl.includes("agri")) { if(valStr.includes("Ağrım Yok")) agri = "Yok"; else if(valStr.includes("Hafif Sızlıyor")) agri = "Hafif"; else if(valStr.includes("Şiş ve Ağrılı")) agri = "Alevlenme"; else if(valStr.includes("Sinir uçlarım")) agri = "Sinir Batması"; else agri = valStr; } 
            else if (cl === "rahatsizlik_bolgesi" || cl.includes("bolge") || cl.includes("bölge")) { if(valStr.includes("Rahatsızlığım yoktu")) bolge = ""; else bolge = valStr; } 
            else if (cl === "kuruluk" || cl.includes("kuru") || cl.includes("göz")) { if(valStr.includes("Nemli ve Rahat")) sjogren = "İyi"; else if(valStr.includes("Biraz kuruluk")) sjogren = "Hafif"; else if(valStr.includes("Çok kurudu")) sjogren = "Çok Kuru"; else if(valStr.includes("bulanık görüyorum")) sjogren = "Kuru+Bulanık"; else sjogren = valStr; } 
            else if (cl === "uyku" || cl.includes("uyku")) { if(valStr.includes("Fazla uyuyamadım")) uyku = "Kötü"; else uyku = valStr; } 
            else if (cl === "enerji_seviyesi" || cl.includes("enerji")) { if(valStr.includes("Dinamik")) enerji = "İyi"; else enerji = valStr; } 
            else if (cl === "aktivite" || cl.includes("aktivite")) { if(valStr.includes("Hayır")) akt = "Yok"; else if(valStr.includes("Yürüdüm")) akt = "Yürüyüş"; else if(valStr.includes("Pilates")) akt = "Pilates"; else akt = valStr; } 
            else if (cl === "mide_durumu" || cl.includes("mide")) { if(valStr.includes("Sorunsuz Tertemiz")) mide = "Sorunsuz"; else if(valStr.includes("Hafif Bulantım")) mide = "Hafif Bulantı"; else if(valStr.includes("Şiddetli bulantım")) mide = "Şiddetli bulantı"; else mide = valStr; } 
            else if (cl === "agiz_cilt" || cl.includes("ağız") || cl.includes("cilt")) { if(valStr.includes("Sorunsuz")) agiz = "Temiz"; else if(valStr.includes("yara (aft)")) agiz = "Aft Var"; else if(valStr.includes("döküntü")) agiz = "Döküntü"; else agiz = valStr; } 
            else if (cl === "beslenme_kacamak" || cl.includes("beslen") || cl.includes("kaçamak") || cl.includes("kacamak")) { if(valStr.includes("Hiç yemedim")) beslenme = "Kaçamak Yok"; else if(valStr.includes("Sadece ucundan")) beslenme = "Hafif Kaçamak"; else if(valStr.includes("Maalesef kortizon")) beslenme = "Fazla Kaçamak"; else beslenme = valStr; } 
            else if (cl === "su_tuketimi" || cl.includes("su")) { if(valStr.includes("yudum yudum")) su = "İyi"; else if(valStr.includes("Sadece hapları")) su = "Az (Haplarla)"; else if(valStr.includes("çok unuttum")) su = "Çok Az"; else su = valStr; } 
            else if (cl === "zihinsel_durum" || cl.includes("zihin")) { if(valStr.includes("Berraktı")) zihin = "Berrak"; else if(valStr.includes("Biraz Unutkan")) zihin = "Dağınık"; else if(valStr.includes("Beyin sisi")) zihin = "Beyin Sisi"; else zihin = valStr; }
        }
        let sysHTML = ""; if (ates) sysHTML += `${ates}°C<br>`; if (terleme) sysHTML += `<span style="font-size:8px; color:#444;">Ter: ${terleme}</span>`;
        let uykuZihinHTML = ""; if (uyku) uykuZihinHTML += `U: ${uyku}<br>`; let altZihin = []; if (enerji) altZihin.push(`E: ${enerji}`); if (zihin) altZihin.push(`Z: ${zihin}`); if (altZihin.length > 0) uykuZihinHTML += `<span style="font-size:8px; color:#444;">${altZihin.join(" | ")}</span>`;
        let eklemHTML = ""; if (agri) eklemHTML += `${agri}<br>`; if (bolge && bolge !== "Rahatsızlığım yoktu") eklemHTML += `<span style="font-size:8px; color:#444;">${bolge}</span>`;
        let mideCiltHTML = ""; if (mide) mideCiltHTML += `${mide}<br>`; if (agiz) mideCiltHTML += `<span style="font-size:8px; color:#444;">${agiz}</span>`;
        let beslenmeSuHTML = ""; if (beslenme) beslenmeSuHTML += `T: ${beslenme}<br>`; if (su) beslenmeSuHTML += `<span style="font-size:8px; color:#444;">Su: ${su}</span>`;
        let isAlevlenme = false; if (tut && tut.includes("Saat")) isAlevlenme = true; if (agri === "Alevlenme") isAlevlenme = true;
        let rowStyle = isAlevlenme ? 'style="background-color: #f0f0f0; color: #000;"' : "";
        if (isAlevlenme) sysHTML = `<strong style="font-size:8px; border-bottom:1px solid #000; display:inline-block; margin-bottom:1px;">ALEVLENME</strong><br>` + sysHTML;
        let satirHTML = `<tr ${rowStyle}><td>${tarihSutunuHTML}</td><td>${sysHTML || '-'}</td><td>${tut || '-'}</td><td>${eklemHTML || '-'}</td><td>${sjogren || '-'}</td><td>${mideCiltHTML || '-'}</td><td>${beslenmeSuHTML || '-'}</td><td>${uykuZihinHTML || '-'}</td><td>${akt || '-'}</td></tr>`;
        aylarVerisi[ayIsmi] += satirHTML;
    });
    let aiRaporu = apiData.ai && apiData.ai.rapor ? apiData.ai.rapor : "Yapay zeka analiz raporu oluşturulamadı.";
    let aylikTablolarHTML = "";
    siraliAylar.forEach(ayKey => {
        aylikTablolarHTML += `<div class="rap-bolum rap-bolum-tablo" style="page-break-before: always; break-before: page; margin-top: 0;"><h3 style="margin-bottom: 6px; display:flex; justify-content:space-between; align-items:flex-end;"><span>Günlük Detay Çizelgesi - <strong>${ayKey}</strong> <span style="font-weight: normal; font-size: 11px; color: #555;">(Veriler her akşam 21.00'da sisteme kaydedilmektedir.)</span></span></h3><div style="font-size: 9.5px; color: #333; background: #f0f0f0; padding: 6px 10px; border: 1px solid #ccc; margin-bottom: 6px; border-radius: 4px; text-align: center; font-weight: normal; line-height: 1.5;"><strong>SÖZLÜK:</strong> &nbsp;&nbsp; <b>U:</b> Uyku Kalitesi &nbsp;|&nbsp; <b>E:</b> Enerji Seviyesi &nbsp;|&nbsp; <b>Z:</b> Zihinsel Durum &nbsp;|&nbsp; <b>T:</b> Tatlı/Beslenme &nbsp;|&nbsp; <b>Su:</b> Su Tüketimi <br><b>Sorunsuz:</b> Mide şikayeti yok &nbsp;|&nbsp; <b>Temiz:</b> Ağız yarası veya cilt döküntüsü yok</div><table class="rap-tablo" style="width: 100%; table-layout: fixed;"><thead><tr><th style="width:8%;">Tarih</th><th style="width:10%;">Sistemik</th><th style="width:11%;">Sabah Tutuk.</th><th style="width:14%;">Eklem Durumu</th><th style="width:10%;">Kuruluk</th><th style="width:12%;">Mide & Cilt</th><th style="width:13%;">Beslenme/Su</th><th style="width:14%;">Uyku & Zihin</th><th style="width:8%;">Aktivite</th></tr></thead><tbody>${aylarVerisi[ayKey]}</tbody></table></div>`;
    });
    var raporHTML = `<style>@media print {.rap-tablo { font-size: 9px !important; } .rap-tablo th { padding: 5px 2px !important; } .rap-tablo td { padding: 3px 2px !important; line-height: 1.2 !important; } #ilac-tablosu { font-size: 11px !important; } #ilac-tablosu th, #ilac-tablosu td { padding: 6px 4px !important; line-height: 1.3 !important; } h3 { margin-bottom: 5px !important; font-size: 13px !important; } .rap-bolum { margin-bottom: 10px !important; } .ai-rapor-kutu { padding: 8px !important; font-size: 12px !important; line-height: 1.45 !important; margin-top: 3px !important; } .rap-baslik { margin-bottom: 10px !important; padding-bottom: 5px !important; font-size: 16px !important; }}</style><div class="rap-baslik">Nurten BATUR - Romatoloji Raporu</div><div class="rap-bolum" style="margin-bottom: 12px;"><h3 style="margin-bottom: 6px; text-align: center;">Veri Analizi</h3><div class="ai-rapor-kutu" style="padding: 10px; margin-top: 4px; text-align: left;">${aiRaporu}</div></div><div class="rap-bolum rap-bolum-ilac" style="page-break-before: always; break-before: page; margin-bottom: 8px;"><h3 style="margin-bottom: 6px;">Aktif Tedavi ve İlaç Şeması</h3><table class="rap-tablo" id="ilac-tablosu"><thead><tr><th style="width: 15%;">Zaman</th><th>Kullanılan İlaçlar ve Rutinleri</th></tr></thead><tbody><tr><td><strong>Sabah Aç</strong><br><span style="font-size:10px; color:#000;">(06:00-08:00)</span></td><td style="text-align: left;">INH <em>(Her gün)</em></td></tr><tr><td><strong>Sabah Tok</strong><br><span style="font-size:10px; color:#000;">(10:00-12:00)</span></td><td style="text-align: left;">Deltacortril <em>(Gün aşırı)</em>, Balık Yağı, Göz Damlası, Coledan-D3 <em>(Sadece Salı)</em></td></tr><tr><td><strong>Öğle</strong><br><span style="font-size:10px; color:#000;">(13:00-14:00)</span></td><td style="text-align: left;">Benexol B12 <em>(Her gün)</em></td></tr><tr><td><strong>Akşam</strong><br><span style="font-size:10px; color:#000;">(18:00-19:00)</span></td><td style="text-align: left;">Plaquenil <em>(Her gün)</em></td></tr><tr><td><strong>Gece</strong><br><span style="font-size:10px; color:#000;">(21:00-22:00)</span></td><td style="text-align: left;">Quantavir, Göz Damlası, <strong>Metoartcon</strong> <em>(İğne - Her Pzt)</em>, <strong>Cimzia</strong> <em>(İğne - 14 günde bir Prş)</em>, Folbiol <em>(Salı ve Cuma)</em></td></tr></tbody></table></div>${aylikTablolarHTML}`;
    document.getElementById("print-report-area").innerHTML = raporHTML;
    setTimeout(function() { window.print(); }, 250);
}

function grafikCiz() {
    if (!apiData || !apiData.tumVeriler) return;
    const tarihler = Object.keys(apiData.tumVeriler).sort((a,b) => {
        const pA = a.split('.'); const pB = b.split('.');
        return new Date(pA[2], pA[1]-1, pA[0]) - new Date(pB[2], pB[1]-1, pB[0]);
    });
    const sonYediGun = tarihler.slice(-7);
    const labels = sonYediGun.map(t => t.substring(0,5));

    // VERİ KONTROLÜ (Crash Koruması)
    const agriMetinleri = sonYediGun.map(t => (apiData.tumVeriler[t] ? (apiData.tumVeriler[t]["Eklem Ağrısı"] || apiData.tumVeriler[t]["EKLEM_AGRISI"] || "") : ""));
    const uykuMetinleri = sonYediGun.map(t => (apiData.tumVeriler[t] ? (apiData.tumVeriler[t]["Uyku Kalitesi"] || apiData.tumVeriler[t]["UYKU"] || "") : ""));
    const enerjiMetinleri = sonYediGun.map(t => (apiData.tumVeriler[t] ? (apiData.tumVeriler[t]["Bugün enerji seviyen nasıldı?"] || apiData.tumVeriler[t]["Enerji Seviyesi"] || "") : ""));
    const beslenmeMetinleri = sonYediGun.map(t => (apiData.tumVeriler[t] ? (apiData.tumVeriler[t]["Kortizonun oyununa gelip bugün tatlı veya hamur işi kaçamağı yaptın mı?"] || apiData.tumVeriler[t]["Beslenme Kaçamak"] || "") : ""));

    const ctx = document.getElementById('healthChart').getContext('2d');
    if (healthChartInstance) healthChartInstance.destroy();
    
    healthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Ağrı', data: agriMetinleri.map(m => puanla.agri(m)), metinler: agriMetinleri, borderColor: '#F43F5E', backgroundColor: 'rgba(244, 63, 94, 0.05)', borderWidth: 3, tension: 0.4, pointRadius: 4 },
                { label: 'Uyku', data: uykuMetinleri.map(m => puanla.uyku(m)), metinler: uykuMetinleri, borderColor: '#3B82F6', borderWidth: 3, tension: 0.4, pointRadius: 4 },
                { label: 'Enerji', data: enerjiMetinleri.map(m => puanla.enerji(m)), metinler: enerjiMetinleri, borderColor: '#F59E0B', borderWidth: 3, tension: 0.4, pointRadius: 4 },
                { label: 'Kaçamak', data: beslenmeMetinleri.map(m => puanla.beslenme(m)), metinler: beslenmeMetinleri, borderColor: '#8B5CF6', borderWidth: 3, borderDash: [5, 5], tension: 0.4, pointRadius: 4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const metin = context.dataset.metinler[context.dataIndex];
                            return context.dataset.label + ": " + (metin || "Veri Yok");
                        }
                    }
                }
            },
            scales: { 
                y: { beginAtZero: true, max: 3.5, ticks: { stepSize: 1, callback: (v) => v <= 3 ? ["Yok/Az", "Hafif", "Orta", "Yüksek"][v] : "", font: { size: 10, weight: '700' } } }
            }
        }
    });
}

async function veriCek() {
    if (fetchDevamEdiyor) return;
    fetchDevamEdiyor = true;
    const todayStr = String(now.getDate()).padStart(2, '0') + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + now.getFullYear();
    
    try {
        const res = await fetch(`${API_URL}?tarih=${todayStr}`);
        if (!res.ok) throw new Error("Ağ Hatası");
        apiData = await res.json();
        sonBasariZamani = Date.now();
        
                if(typeof ekraniCiz === 'function') ekraniCiz(); 
        if(typeof istatistikleriCiz === 'function') istatistikleriCiz(); 
        if(typeof renderHealthDiary === 'function') renderHealthDiary(); 
        
        setTimeout(updateTabGlows, 500); // Buraya eklendi
        
        setTimeout(() => {
            if(typeof grafikCiz === 'function') grafikCiz();
        }, 150);

    } catch(e) { 
        console.error("Veri çekme hatası:", e); 
    } finally {
        fetchDevamEdiyor = false; 
        const uText = document.getElementById('update-text');
        if(uText) uText.innerHTML = `Güncellemek İçin Aşağı Kaydırın`;
        const syncI = document.getElementById('sync-icon');
        if(syncI) syncI.classList.remove("spin");
    }
}

function ekraniCiz() {
    const dNow = new Date(); 
    const todayProg = getDailyProgram(dNow);
    const dateKey = String(dNow.getDate()).padStart(2, '0') + '.' + String(dNow.getMonth() + 1).padStart(2, '0') + '.' + dNow.getFullYear();
    let alertsHTML = "";
    todayProg.forEach(s => {
        if(!s.meds) return;
        s.meds.forEach(m => {
            if(m.key === 'SABAH_TOK_DELTA') alertsHTML += `<div class="safety-shield shield-red" style="display:block;">🚨 Bugün Deltacortril Günü</div>`;
            if(m.key === 'SABAH_TOK_COLEDAN' && !alertsHTML.includes('Vitamin')) alertsHTML += `<div class="safety-shield shield-yellow" style="display:block;">☀️ Bugün Vitamin ve Folbiol Günü</div>`;
            if(m.key === 'GECE_FOLBIOL' && dNow.getDay() === 5 && !alertsHTML.includes('Folbiol')) alertsHTML += `<div class="safety-shield shield-yellow" style="display:block;">💊 Bugün Folbiol Günü</div>`;
            if(m.key === 'GECE_METOARTCON') alertsHTML += `<div class="safety-shield shield-blue" style="display:block;">🧬 Bugün Metoartcon İğne Günü</div>`;
            if(m.key === 'GECE_CIMZIA') alertsHTML += `<div class="safety-shield shield-purple" style="display:block;">💉 Bugün Cimzia İğne Günü!</div>`;
        });
    });
    const alertsEl = document.getElementById('alertsArea'); if(alertsEl) alertsEl.innerHTML = alertsHTML;
    let pendingHTML = "";
    let completedHTML = "";

    todayProg.forEach((s) => {
        let sTC = 0; let medsHTML = "";
        s.meds.forEach(m => { 
            const isDone = (apiData && apiData.tumVeriler && apiData.tumVeriler[dateKey] && apiData.tumVeriler[dateKey][m.key] === "İçildi");
            if(isDone) sTC++; 
            const iconHTML = isDone ? `<div class="check-icon done">${svgCheck}</div>` : `<div class="check-icon"></div>`;
            medsHTML += `<div class="history-item ${isDone ? 'is-done' : ''}">${iconHTML}<div class="med-info"><span class="drug-title">${m.name}</span><span class="drug-purpose">${m.purpose}</span></div></div>`; 
        });
        const isAllDone = (sTC === s.meds.length);
        let isLate = false;
        if (!isAllDone && s.time) {
            const cardMins = (parseInt(s.time.split(':')[0], 10) * 60) + parseInt(s.time.split(':')[1], 10);
            const nowMins = (dNow.getHours() * 60) + dNow.getMinutes();
            if (nowMins > cardMins + 90) isLate = true;
        }
        let bClass = isAllDone ? "badge-safe" : isLate ? "badge-danger" : "badge-wait";
        let bText = isAllDone ? `TAMAMLANDI <span class="exp-arrow">▲</span>` : isLate ? "🚨 İÇİLMEYEN İLAÇ VAR" : "BEKLİYOR";
        let cClass = isAllDone ? "done-card" : isLate ? "late-card" : "";
        const colClass = isAllDone ? "collapsed" : "";
        
        // Kartın HTML yapısını bir değişkene alıyoruz
        let cardHTML = `
    <div class="premium-card card ${cClass} ${colClass}">
        <div class="card-header" onclick="this.parentElement.classList.toggle('collapsed')" style="cursor:pointer;">
            <div class="drug-name">${s.icon} ${s.title}</div>
            <div class="badge ${bClass}">${bText}</div>
        </div>
        <div class="meds-container">${medsHTML}</div>
    </div>`;

        // EĞER TAMAMLANDIYSA "completedHTML" kutusuna, DEĞİLSE "pendingHTML" kutusuna ekle
        if (isAllDone) {
            completedHTML += cardHTML;
        } else {
            pendingHTML += cardHTML;
        }
    });

    // Önce bekleyenleri, sonra tamamlananları ekrana basıyoruz
    const tArea = document.getElementById('timelineArea'); 
    if(tArea) tArea.innerHTML = pendingHTML + completedHTML;
}

veriCek();
fetchWeather(); // <-- EKSİK OLAN BUYDU, ŞİMDİ TETİKLENECEK
setInterval(veriCek, 600000); 
setInterval(fetchWeather, 3600000); // <-- Hava durumunu saatte bir yenile
setInterval(saniyeTiktak, 1000);

document.addEventListener("visibilitychange", () => { 
    if (document.visibilityState === 'visible') { 
        if (sonBasariZamani === 0 || (Date.now() - sonBasariZamani > 600000)) { veriCek(); fetchWeather(); }
    }
});

let pStartY = 0; let pCurrentY = 0; let pIsPulling = false;
document.addEventListener('touchstart', (e) => {
    // Aktif olan sekmenin içeriğini bul
    const activeTab = document.querySelector('.tab-content.active');
    // Sadece sekme en üstteyse (scrollTop <= 0) yenilemeye izin ver
    if (activeTab && activeTab.scrollTop <= 0) { 
        pStartY = e.touches[0].clientY; 
        pIsPulling = true; 
    }
}, {passive: true});
document.addEventListener('touchmove', (e) => {
    if (!pIsPulling || fetchDevamEdiyor) return;
    pCurrentY = e.touches[0].clientY;
    if (pCurrentY - pStartY > 60) { const uText = document.getElementById('update-text'); if(uText) uText.innerHTML = `Bırakın Güncellensin ${svgSync}`; }
}, {passive: true});
document.addEventListener('touchend', (e) => {
    if (!pIsPulling) return;
    pIsPulling = false;
    if (pCurrentY - pStartY > 60) manuelYenile();
});

function updateTabGlows() {
    // 1. GÜNÜM SEKMESİ
    const gununAnalizi = document.getElementById('aiDiaryCard');
    const tabGunum = document.querySelector('button[onclick*="tab-day"]');
    if(tabGunum) {
        const isDayNew = gununAnalizi && gununAnalizi.classList.contains('unread-premium-card');
        tabGunum.classList.toggle('unread-indicator', !!isDayNew);
    }

    // 2. ANALİZ (ARŞİV) SEKMESİ
    const arsivKartlari = ['card-stat-this-month', 'card-stat-last-month', 'card-stat-yearly'];
    const tabAnaliz = document.querySelector('button[onclick*="tab-analysis"]');
    if(tabAnaliz) {
        let hasUnreadArchive = arsivKartlari.some(id => {
            let el = document.getElementById(id);
            return el && el.classList.contains('unread-premium-card');
        });
        tabAnaliz.classList.toggle('unread-indicator', hasUnreadArchive);
    }
}
