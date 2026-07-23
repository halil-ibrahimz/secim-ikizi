// Firebase ayarları
const firebaseConfig = {
    apiKey: "AIzaSyDgoefOobgCM1zNpLOMoLA4NnqZc3SLk2g",
    authDomain: "ruh-app-6af0a.firebaseapp.com",
    projectId: "ruh-app-6af0a",
    storageBucket: "ruh-app-6af0a.firebasestorage.app",
    messagingSenderId: "480174474134",
    appId: "1:480174474134:web:f215ecfb78ff04f15d93b7",
    databaseURL: "https://ruh-app-6af0a-default-rtdb.europe-west1.firebasedatabase.app"
};

// Firebase'i başlat (Compat mod)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Arayüz kodlarını kısaltmak için Ortak Form HTML'i
function getFormHTML(color, btnColor) {
    return `
        <textarea id="userMessage" placeholder="Mesajını buraya yaz..." style="width: 100%; height: 80px; padding: 1rem; border-radius: 12px; border: 2px solid rgba(0,0,0,0.05); margin-bottom: 0.8rem; font-family: 'Outfit', sans-serif; resize: none; font-size: 1rem; outline: none; transition: border-color 0.3s;" onfocus="this.style.borderColor='${color}'" onblur="this.style.borderColor='rgba(0,0,0,0.05)'"></textarea>
        
        <input type="text" id="userContact" placeholder="İletişim (Opsiyonel)" style="width: 100%; padding: 1rem; border-radius: 12px; border: 2px solid rgba(0,0,0,0.05); margin-bottom: 1rem; font-family: 'Outfit', sans-serif; font-size: 1rem; outline: none; transition: border-color 0.3s;" onfocus="this.style.borderColor='${color}'" onblur="this.style.borderColor='rgba(0,0,0,0.05)'">
        
        <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 1.5rem; text-align: left;">
            <input type="checkbox" id="kvkkCheck" style="margin-top: 0.2rem; cursor: pointer; transform: scale(1.2); accent-color: ${color};">
            <label for="kvkkCheck" style="font-size: 0.8rem; color: var(--text-muted); cursor: pointer; line-height: 1.3;">
                İletişim bilgilerimi ve mesajımı kendi rızamla paylaşıyorum. Sadece aynı şifreyi bulanlarla paylaşılmasını kabul ediyorum.
            </label>
        </div>

        <button id="saveNoteBtn" class="primary-btn" style="background: ${btnColor}; opacity: 0.6; pointer-events: none; transition: opacity 0.3s; width: 100%; margin-bottom: 0.8rem;">Mesajını Geleceğe Bırak 💌</button>
        <p id="saveStatus" style="display:none; color: #4CAF50; font-weight: bold; margin-bottom: 1rem; text-align: center;">Mesajın başarıyla bırakıldı! ✨</p>

        <button style="width: 100%; padding: 1rem; border-radius: 12px; background: transparent; border: 2px solid rgba(0,0,0,0.1); color: var(--text-muted); font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='rgba(0,0,0,0.05)'; this.style.color='var(--text-main)';" onmouseout="this.style.background='transparent'; this.style.color='var(--text-muted)';" onclick="location.reload()">Ana Ekrana Dön 🏠</button>
    `;
}

// Olay dinleyicilerini (Event Listeners) ekleme fonksiyonu
function attachFormListeners(resultCode) {
    const kvkkCheck = document.getElementById('kvkkCheck');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const userMessage = document.getElementById('userMessage');
    const userContact = document.getElementById('userContact');

    if (!kvkkCheck) return; // Form yoksa (kaydedilmişse) iptal et

    kvkkCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            saveNoteBtn.style.opacity = "1";
            saveNoteBtn.style.pointerEvents = "auto";
        } else {
            saveNoteBtn.style.opacity = "0.6";
            saveNoteBtn.style.pointerEvents = "none";
        }
    });

    saveNoteBtn.addEventListener('click', async () => {
        const msg = userMessage.value.trim();
        const contact = userContact.value.trim();
        
        if (!msg) {
            alert("Lütfen ufak da olsa bir mesaj yaz!");
            return;
        }

        // SPAM KONTROLÜ (1 Dakika Cooldown)
        const lastNoteTime = localStorage.getItem('ruhEsiSonMesajZamani');
        if (lastNoteTime && (Date.now() - parseInt(lastNoteTime)) < 60000) {
            alert("Çok hızlı mesaj bırakıyorsun! Lütfen 1 dakika bekleyip tekrar dene. ⏳");
            return;
        }

        saveNoteBtn.innerText = "Bırakılıyor...";
        saveNoteBtn.style.pointerEvents = "none";

        try {
            // YENİ: set() yerine push() kullanıyoruz, böylece aynı şifreye sınırsız kayıt eklenebilir.
            await db.ref('matches/' + resultCode).push({
                type: state.mode,
                message: msg,
                contact: contact,
                timestamp: Date.now()
            });

            // Başarılı olursa son mesaj zamanını kaydet
            localStorage.setItem('ruhEsiSonMesajZamani', Date.now());
            
            document.getElementById('saveStatus').style.display = 'block';
            saveNoteBtn.style.display = 'none';
            userMessage.disabled = true;
            userContact.disabled = true;
            kvkkCheck.disabled = true;
        } catch (error) {
            console.error("Hata:", error);
            alert("Not kaydedilirken bir hata oluştu, lütfen tekrar dene.");
            saveNoteBtn.innerText = "Mesajını Geleceğe Bırak 💌";
            saveNoteBtn.style.pointerEvents = "auto";
        }
    });
}

// Global Carousel Değişkenleri
window.matchDataArray = [];
window.currentMatchIndex = 0;
window.matchConfig = {}; // color, btnColor, resultCode

// Carousel'i ileri geri sarmak için fonksiyon
window.changeMatchSlide = function(direction) {
    window.currentMatchIndex += direction;
    renderCarouselUI();
}

function renderCarouselUI() {
    const container = document.getElementById('match-result-container');
    const { color, btnColor, resultCode } = window.matchConfig;
    const total = window.matchDataArray.length;
    const m = window.matchDataArray[window.currentMatchIndex];
    
    const isMulti = total > 1;
    
    // Pagination Butonları (1'den fazlaysa görünür)
    const paginationHTML = isMulti ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.5rem 1rem; background: rgba(0,0,0,0.03); border-radius: 12px;">
            <button onclick="changeMatchSlide(-1)" ${window.currentMatchIndex === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : 'style="cursor:pointer; color: var(--text-main); font-weight:bold; background:none; border:none;"'}>⬅️ Önceki</button>
            <span style="font-size: 0.9rem; font-weight: bold; color: var(--text-muted);">${window.currentMatchIndex + 1} / ${total}</span>
            <button onclick="changeMatchSlide(1)" ${window.currentMatchIndex === total - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : 'style="cursor:pointer; color: var(--text-main); font-weight:bold; background:none; border:none;"'}>Sonraki ➡️</button>
        </div>
    ` : '';

    container.innerHTML = `
        <div class="match-card" style="background: white; border: 2px solid ${color}; padding: 1.5rem; border-radius: 16px; margin-top: 1rem; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
            <h3 style="color: ${color}; font-size: 1.5rem; margin-bottom: 0.5rem;">🎉 90 Milyonda 1 İhtimal Gerçekleşti!</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Tam 13 soruda seninle <b>birebir aynı</b> cevapları veren ${isMulti ? 'kişiler' : 'o kişi'} sana şu notu bıraktı:</p>
            
            ${paginationHTML}
            
            <div style="background: #f9f9fa; padding: 1rem; border-radius: 12px; font-style: italic; color: var(--text-main); font-size: 1.1rem; margin-bottom: 1rem; border-left: 4px solid ${color}; text-align: left;">
                "${m.message}"
            </div>
            
            ${m.contact ? `
            <div style="background: rgba(0,0,0,0.03); padding: 0.8rem; border-radius: 8px; font-weight: bold; color: var(--text-main); text-align: left;">
                İletişim: <span style="color: ${color};">${m.contact}</span>
            </div>
            ` : '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: left;">(Sadece anonim bir not bırakmış.)</p>'}
            
            <hr style="border: none; border-top: 1px solid rgba(0,0,0,0.05); margin: 2rem 0;">
            
            <h4 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-main); text-align:left;">Sende bu havuza kendi notunu ekle! 👇</h4>
            ${getFormHTML(color, btnColor)}
        </div>
    `;

    attachFormListeners(resultCode);
}


// app.js içinden çağrılan ana fonksiyon
window.checkMatchAndShowUI = async function(resultCode, isMate) {
    const color = isMate ? 'var(--mate-color)' : 'var(--friend-color)';
    const btnColor = isMate ? 'linear-gradient(135deg, #FF8DA1, #FFB8C6)' : 'linear-gradient(135deg, #74A4FF, #A1C4FF)';

    try {
        // Veritabanını oku
        const snapshot = await db.ref('matches/' + resultCode).once('value');
        const resultContainer = document.getElementById('match-result-container');
        
        if (snapshot.exists()) {
            // EŞLEŞME VAR! (Artık 1'den fazla kişi olabilir)
            const matchesObj = snapshot.val();
            let matchesArray = [];
            
            // Eğer önceki sistemdeki (eski) kayıt varsa, onu ayrı bir obje olarak diziye ekle
            if (matchesObj.message && typeof matchesObj.message === 'string') {
                matchesArray.push({
                    message: matchesObj.message,
                    contact: matchesObj.contact || '',
                    timestamp: matchesObj.timestamp || Date.now()
                });
            }

            // Yeni sistemdeki (push ile eklenen objeler listesi) kayıtları bul ve diziye ekle
            for (let key in matchesObj) {
                if (typeof matchesObj[key] === 'object' && matchesObj[key] !== null) {
                    if (matchesObj[key].message) {
                        matchesArray.push(matchesObj[key]);
                    }
                }
            }

            // Global değişkenlere ata
            window.matchDataArray = matchesArray;
            window.currentMatchIndex = 0;
            window.matchConfig = { color, btnColor, resultCode };

            // Arayüzü çiz
            renderCarouselUI();
            
        } else {
            // EŞLEŞME YOK! (İlk gelen kişi, not bırakacak)
            resultContainer.innerHTML = `
                <div class="match-card" style="background: white; border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 16px; margin-top: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                    <h3 style="color: var(--text-main); font-size: 1.3rem; margin-bottom: 0.5rem;">Bu şifreyi bulan İLK kişisin! 👑</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Gelecekte (belki yarın, belki 1 yıl sonra) bu 13 soruyu birebir senin gibi cevaplayıp bu şifreye ulaşacak olan ruh eşine/arkadaşına ilk notu sen bırak:</p>
                    
                    ${getFormHTML(color, btnColor)}
                </div>
            `;
            
            attachFormListeners(resultCode);
        }
    } catch (error) {
        console.error("Veritabanı okunurken hata oluştu: ", error);
        document.getElementById('match-result-container').innerHTML = `<p style="color: red;">Veritabanına bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.</p>`;
    }
}
