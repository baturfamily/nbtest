const API_URL = "https://script.google.com/macros/s/AKfycbyVML9s78ajHrNf_xCDGh4gGV5KrA7bvWMN_j49Hy1vEzOLioUqvtMDnSGPfIjLYndZ-g/exec"; 
let sonBasariZamani = 0;
let fetchDevamEdiyor = false;
let apiData = {}; 

const svgCheck = `<svg viewBox="0 0 14 10"><polyline points="1.5 5 5 8.5 12.5 1"></polyline></svg>`;
const svgSync = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`;
const svgWait = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

const ilacAciklamalari = {
  "INH": ["Bağışıklık sistemin dinlenirken akciğerlerini mikroplara karşı korur.", "Vücudunun direnci zayıfladığında bile seni enfeksiyonlardan sakınır.", "Akciğerlerine kalkan olur ve uykudaki bakterilerin uyanmasına izin vermez."],
  "Balık Yağı": ["Eklemlerini hücresel boyutta yağlayarak daha esnek uyanmanı sağlar.", "Doğal yapısıyla vücudundaki iltihabın sönmesine yardımcı olur.", "Gün boyu hareketli kalman için hücrelerine enerji taşır."],
  "Göz Damlası": ["Gözlerindeki kuruluk hissini alarak pırıl pırıl bir görüş sağlar.", "Batma ve kumlanma hissini anında ferahlatır.", "Göz yüzeyini bir kalkan gibi sararak ince çizilmeleri engeller."],
  "Benexol": ["Sinir uçlarını besleyerek ellerindeki batmaları önler.", "Zihnini berraklaştırır ve odaklanmanı kolaylaştırır.", "Zayıflayan sinir kılıflarını tamir ederek vücuduna sağlamlık katar."],
  "Plaquenil": ["Eklemlerindeki iltihabı yavaşça ve derinden temizleyen temel ilacındır.", "Romatizmanın hızını keserek eklemlerini güvence altına alır.", "Şişlik ve ağrıların geri gelmemesi için yorulmadan çalışır."],
  "Quantavir": ["Vücudun tedavilerle meşgulken karaciğerini yorulmaktan korur.", "Geçmişte uyuyan virüslerin uyanmasına izin vermez.", "Karaciğerinin sarsılmaz nöbetçisidir."],
  "Deltacortril": ["Eklemlerindeki şişliği söndüren en hızlı itfaiyecidir (3 Mayıs'tan beri 1/4 doz).", "Tutukluk hissini ortadan kaldırıp hareketlerini özgürleştirir.", "Ağrı döngüsünü hızla kırıp seni ferahlatır."],
  "Coledan-D3": ["Kortizonun kemiklerini zayıflatmasına izin vermeyen bir kalkandır.", "Kaslarındaki güçsüzlüğü alarak vücut direncini artırır.", "Güneşin şifasını vücuduna taşıyarak iskelet sistemini ayakta tutar."],
  "Metoartcon": ["Romatizmanın kalıcı hasar bırakmasını önleyen en güçlü tedavidir.", "Hastalığı derin bir uykuya yatırarak eklemlerini korur.", "Bağışıklık sistemine şefkatli bir 'dur' diyerek vücudunu sakınır."],
  "Folbiol": ["İğnenin yaratabileceği bitkinlik ve bulantıyı silip atar.", "Ağızda yara (aft) oluşmasını hücresel boyutta önler.", "Hücre bölünmesini destekleyerek cildini ve iç dokularını korur."],
  "Cimzia İğnesi": ["İnatçı iltihabı kaynağında akıllıca bulur ve yok eder.", "Yaşam kaliteni en üst seviyeye güvenle taşır.", "Hastalığı dondurarak sabahları ağrısız kalkmanı sağlar."]
};

function rastgeleAciklama(ilacAdi) {
  const liste = ilacAciklamalari[ilacAdi];
  return liste ? liste[Math.floor(Math.random() * liste.length)] : "";
}

async function fetchWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.07&longitude=28.64&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto');
        const data = await res.json();
        const t = Math.round(data.current.temperature_2m); 
        const h = data.current.relative_humidity_2m;
        const uv = data.daily.uv_index_max[0]; 
        const currentHour = new Date().getHours();
        const isDaytime = (currentHour >= 7 && currentHour < 19);

        let icon = isDaytime ? "🌥️" : "🌙", advIcon = "🩺", adviceList = ["Hava bugün senin için gayet güzel."];
        if (isDaytime && uv > 5) { advIcon = "🕶️"; adviceList = ["Güneş dik geliyor, lütfen koruyucu sür ve gölgede kal."]; } 
        else if (h > 70 && t < 15) { icon = "🌧️"; adviceList = ["Hava nemli, eklem ağrısı yapabilir. Dizlerini sıcak tut."]; } 
        else if (t < 12) { icon = "🥶"; adviceList = ["Dışarısı soğuk, eklemler sertleşebilir. Kat kat giyinmeyi ihmal etme."]; }

        document.getElementById('wMainIcon').innerText = icon;
        document.getElementById('wTempText').innerText = t + "°";
        document.getElementById('wHumText').innerText = "%" + h + " Nem";
        document.getElementById('wAdvice').innerText = adviceList[0];
    } catch(e) { console.error("Hava durumu çekilemedi:", e); }
}

function getDailyProgram(dateObj) {
    let day = dateObj.getDay(); 
    let mid = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    let p = [
      { id: 'sabah-ac', title: 'SABAH AÇ', time: '06:00', icon: '☀️', meds: [{ key: 'SABAH_AC_INH', name: 'INH', purpose: rastgeleAciklama('INH') }] },
      { id: 'sabah-tok', title: 'SABAH TOK', time: '10:00', icon: '☕', meds: [{ key: 'SABAH_TOK_BALIK', name: 'Balık Yağı', purpose: rastgeleAciklama('Balık Yağı') }, { key: 'SABAH_TOK_GOZ', name: 'Göz Damlası', purpose: rastgeleAciklama('Göz Damlası') }] },
      { id: 'ogle', title: 'ÖĞLE', time: '13:00', icon: '⛅', meds: [{ key: 'OGLE_BENEXOL', name: 'Benexol', purpose: rastgeleAciklama('Benexol') }] },
      { id: 'aksam', title: 'AKŞAM', time: '18:00', icon: '🌙', meds: [{ key: 'AKSAM_PLAQUENIL', name: 'Plaquenil', purpose: rastgeleAciklama('Plaquenil') }] },
      { id: 'gece', title: 'GECE', time: '21:00', icon: '🛌', meds: [{ key: 'GECE_QUANTAVIR', name: 'Quantavir', purpose: rastgeleAciklama('Quantavir') }, { key: 'GECE_GOZ', name: 'Göz Damlası', purpose: rastgeleAciklama('Göz Damlası') }] }
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

async function veriCek() {
    if (fetchDevamEdiyor) return;
    fetchDevamEdiyor = true;
    const syncIconTop = document.getElementById('sync-icon');
    if(syncIconTop) syncIconTop.classList.add("spin");

    const today = new Date();
    const todayStr = String(today.getDate()).padStart(2, '0') + '.' + String(today.getMonth() + 1).padStart(2, '0') + '.' + today.getFullYear();
    
    try {
        const res = await fetch(`${API_URL}?tarih=${todayStr}`);
        apiData = await res.json();
        sonBasariZamani = Date.now();
        ekraniCiz(); 
        istatistikleriCiz(); 
        renderHealthDiary(); 
    } catch(e) { console.error(e); } finally { 
        fetchDevamEdiyor = false; 
        if(syncIconTop) syncIconTop.classList.remove("spin");
        document.getElementById('update-text').innerHTML = "Güncellemek İçin Aşağı Kaydırın";
    }
}

function ekraniCiz() {
    const dNow = new Date(); 
    const todayProg = getDailyProgram(dNow);
    const todayStr = String(dNow.getDate()).padStart(2, '0') + '.' + String(dNow.getMonth() + 1).padStart(2, '0') + '.' + dNow.getFullYear();
    
    let alertsHTML = "";
    todayProg.forEach(s => {
        s.meds.forEach(m => {
            if(m.key === 'SABAH_TOK_DELTA') alertsHTML += `<div class="safety-shield shield-red" style="display:block;">🚨 Bugün Deltacortril Günü</div>`;
            if(m.key === 'GECE_CIMZIA') alertsHTML += `<div class="safety-shield shield-purple" style="display:block;">💉 Bugün Cimzia İğne Günü!</div>`;
        });
    });
    document.getElementById('alertsArea').innerHTML = alertsHTML;

    let timelineHTML = "";
    todayProg.forEach((s) => {
        let sTC = 0; let medsHTML = "";
        s.meds.forEach(m => { 
            const isDone = (apiData.tumVeriler && apiData.tumVeriler[todayStr] && apiData.tumVeriler[todayStr][m.key] === "İçildi");
            if(isDone) sTC++; 
            medsHTML += `<div class="history-item ${isDone ? 'is-done' : ''}"><div class="check-icon ${isDone ? 'done' : ''}">${isDone ? svgCheck : ''}</div><div class="med-info"><span class="drug-title">${m.name}</span><span class="drug-purpose">${m.purpose}</span></div></div>`; 
        });
        const isAllDone = (sTC === s.meds.length);
        timelineHTML += `<div class="premium-card card ${isAllDone ? 'done-card collapsed' : ''}" onclick="this.classList.toggle('collapsed')"><div class="card-header"><div class="drug-name">${s.icon} ${s.title}</div><div class="badge ${isAllDone ? 'badge-safe' : 'badge-wait'}">${isAllDone ? 'TAMAMLANDI' : 'BEKLİYOR'}</div></div><div class="meds-container">${medsHTML}</div></div>`;
    });
    document.getElementById('timelineArea').innerHTML = timelineHTML;
}

function renderHealthDiary() {
    if (!apiData.ai) return;
    const aiMsg = apiData.ai.gunluk || "Veriler değerlendiriliyor...";
    document.getElementById('healthDiaryArea').innerHTML = `
        <div class="diary-card collapsed" onclick="this.classList.toggle('collapsed')">
            <div class="diary-header"><h3 class="diary-title">✨ Asistan Analizi</h3><div class="diary-toggle-icon">▲</div></div>
            <div class="diary-ai-box">${aiMsg}</div>
        </div>`;
}

function istatistikleriCiz() {
    if (!apiData.ai) return;
    document.getElementById('thisMonthDetails').innerHTML = `<div class="stat-ai-summary"><strong>✨ Dönem Özeti</strong>${apiData.ai.buAy}</div>`;
    document.getElementById('lastMonthDetails').innerHTML = `<div class="stat-ai-summary"><strong>✨ Dönem Özeti</strong>${apiData.ai.gecenAy}</div>`;
    document.getElementById('yearlyDetails').innerHTML = `<div class="stat-ai-summary"><strong>🏆 Yıl Özeti</strong>${apiData.ai.yillik}</div>`;
}

function markStatAsRead(type, id) {
    // Stat okundu işaretleme mantığı buraya gelecek
}

function doktorRaporuOlustur() {
    if (!apiData.ai) return;
    const area = document.getElementById("print-report-area");
    area.innerHTML = `<div class="rap-baslik">Nurten BATUR - Romatoloji Raporu</div><div class="ai-rapor-kutu">${apiData.ai.rapor}</div>`;
    setTimeout(() => { window.print(); }, 200);
}

function saniyeTiktak() {
    const d = new Date();
    document.getElementById('clock').textContent = d.getDate() + " " + aylar[d.getMonth()].substring(0,3) + " • " + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

setInterval(saniyeTiktak, 1000);
veriCek();
fetchWeather();