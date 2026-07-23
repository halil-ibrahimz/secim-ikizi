// Global State
const state = {
    mode: null,
    currentQuestionIndex: 0,
    answers: [],
    questions: [] // Seçilen modun soruları buraya yüklenecek
};

// UI Elements
const screens = {
    home: document.getElementById('home-screen'),
    quiz: document.getElementById('quiz-screen')
};

// Testi Başlat
function startQuiz(mode) {
    state.mode = mode;
    state.currentQuestionIndex = 0;
    state.answers = [];
    // questionsData, questions.js dosyasından geliyor
    state.questions = questionsData[mode];
    
    // Geçiş Animasyonu
    screens.home.classList.remove('active');
    
    setTimeout(() => {
        screens.quiz.classList.add('active');
        renderQuestion();
    }, 400); 
}

// Soruyu Ekrana Çiz
function renderQuestion() {
    const isMate = state.mode === 'mate';
    const color = isMate ? 'var(--mate-color)' : 'var(--friend-color)';
    const title = isMate ? 'Ruh Eşi Yolculuğu' : 'Ruh Arkadaşı Yolculuğu';
    
    const currentQ = state.questions[state.currentQuestionIndex];
    const totalQ = state.questions.length;
    // İlerleme çubuğu yüzdesi
    const progressPercent = ((state.currentQuestionIndex) / totalQ) * 100;
    
    // Kullanıcının ilerlemesine göre hangi resmi göstereceğimizi hesapla (13 soru için 4 evre)
    let stage = 1;
    if (state.currentQuestionIndex >= 3) stage = 2;  // 4. sorudan itibaren 2. aşama
    if (state.currentQuestionIndex >= 7) stage = 3;  // 8. sorudan itibaren 3. aşama
    if (state.currentQuestionIndex >= 10) stage = 4; // 11. sorudan itibaren 4. aşama (son evre)
    
    // Yeni ürettiğin pink-1,2,3,4 ve blue-1,2,3,4 dosyalarını dinamik olarak bağla
    const imgSrc = state.mode === 'mate' ? `image/pink-${stage}.webp` : `image/blue-${stage}.webp`;

    // Şıkları oluştur (HTML)
    let optionsHtml = '';
    currentQ.options.forEach((opt, index) => {
        optionsHtml += `<button class="option-btn" onclick="selectOption(${index + 1})">${opt}</button>`;
    });

    screens.quiz.innerHTML = `
        <div class="sticky-top">
            <div class="quiz-header">
                <img src="${imgSrc}" class="mascot-img-header" alt="Ruh Durumu" style="width: 90px; height: auto; margin-bottom: 0.5rem; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.05)); transition: all 0.5s ease; animation: float 3s ease-in-out infinite;">
                <p class="question-counter">Soru ${state.currentQuestionIndex + 1} / ${totalQ}</p>
            </div>
            
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progressPercent}%; background-color: ${color};"></div>
            </div>
        </div>

        <div class="question-container">
            <h3 class="question-text">${currentQ.q}</h3>
            <div class="options-container">
                ${optionsHtml}
            </div>
        </div>

        <button class="back-btn" onclick="goBack()">İptal Et</button>
    `;
    
    // Sorunun ekrana kayarak girme animasyonu
    const qContainer = screens.quiz.querySelector('.question-container');
    qContainer.style.opacity = '0';
    qContainer.style.transform = 'translateY(15px)';
    
    setTimeout(() => {
        qContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        qContainer.style.opacity = '1';
        qContainer.style.transform = 'translateY(0)';
    }, 50);
}

// Bir şıkka tıklandığında
function selectOption(optionNumber) {
    // Cevabı kaydet
    state.answers.push(optionNumber);
    
    const qContainer = screens.quiz.querySelector('.question-container');
    
    // Sorunun ekrandan kayarak çıkma animasyonu (Sıfır Sürtünme Hissi)
    qContainer.style.opacity = '0';
    qContainer.style.transform = 'translateY(-15px)';
    
    setTimeout(() => {
        state.currentQuestionIndex++;
        
        // Soru bitmediyse yenisini getir, bittiyse sonuç ekranına geç
        if (state.currentQuestionIndex < state.questions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 350); // Çıkış animasyonu bittikten sonra çalışır
}

// Test Bitince (Geçici Sonuç Ekranı)
function finishQuiz() {
    const isMate = state.mode === 'mate';
    const color = isMate ? 'var(--mate-color)' : 'var(--friend-color)';
    const resultImg = isMate ? 'image/result-couple.webp' : 'image/result-friend.webp';
    
    // Örnek Kimlik Kodu Oluşturma: (Örn: M-1-4-2-1-3...)
    const prefix = isMate ? "E" : "A"; // Eş veya Arkadaş
    const resultCode = prefix + "-" + state.answers.join("-");
    
    screens.quiz.innerHTML = `
        <div style="text-align:center; padding: 1rem; width:100%;">
            <img src="${resultImg}" alt="Sonuç" style="width: 150px; height: auto; margin-bottom: 1.5rem; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.05));">
            <h2 style="color: ${color}; margin-bottom: 0.5rem; font-size: 2rem; font-weight:800; letter-spacing:-1px;">Test Tamamlandı!</h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem; font-size:0.95rem;">İşte eşsiz kimliğin (matematiksel izin):</p>
            
            <div style="background: white; border: 2px solid rgba(0,0,0,0.05); padding: 1.5rem; border-radius: 16px; font-family: monospace; font-size: 1.2rem; font-weight: bold; color: var(--text-main); letter-spacing: 2px; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                ${resultCode}
            </div>
            
            <div id="match-result-container">
                <p style="color: var(--text-muted); font-size: 0.95rem; animation: float 1s infinite;">Veritabanında eşleşme aranıyor... 🔍</p>
            </div>
        </div>
    `;

    // Firebase tarafındaki sorguyu başlat
    if (window.checkMatchAndShowUI) {
        window.checkMatchAndShowUI(resultCode, isMate);
    } else {
        alert("HATA: Firebase dosyası (firebase-manager.js) tarayıcın tarafından yüklenemedi. Lütfen sayfayı Ctrl + F5 yaparak yenile!");
        document.getElementById('match-result-container').innerHTML = `<p style="color: red;">Bağlantı hatası: Tarayıcı önbelleğini (cache) temizleyip sayfayı yenileyin.</p>`;
    }
}

// Ana Ekrana Dön
function goBack() {
    screens.quiz.classList.remove('active');
    setTimeout(() => {
        screens.home.classList.add('active');
        state.mode = null;
    }, 400);
}
