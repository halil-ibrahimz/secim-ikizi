# Proje Özeti: ruh ? (Seçim İkizi)

**Son Güncelleme:** 16 Ağustos 2026

---

## 1. Projenin Kısa Tanımı

`ruh ?` (Seçim İkizi), kullanıcıların romantik ilişki veya arkadaşlık dinamiklerine yönelik 13 soruluk çoktan seçmeli bir testi yanıtlayarak, verdikleri cevapların matematiksel kombinasyonuna göre tekil bir kimlik kodu üreten ve bu kod üzerinden kendisiyle birebir aynı tercihleri yapmış diğer kullanıcılarla eşleşmesini sağlayan tek sayfalık (SPA) bir web uygulamasıdır. Test sonucunda kullanıcılar, aynı frekanstaki diğer kişilerin bıraktığı notları okuyabilmekte ve gelecekte kendileriyle aynı kombinasyonu bulacak kişiler için kendi mesajlarını ve iletişim bilgilerini sisteme kaydedebilmektedir.

---

## 2. Amaç ve Çözdüğü İhtiyaç

Uygulama, insanların benzer düşünce yapısına, yaşam tarzına ve ilişki beklentilerine sahip kafa dengi kişileri bulma arzusuna dijital, eğlenceli ve sıfır sürtünmeli bir yöntem sunar. Geleneksel tanışma uygulamalarının veya uzun anketlerin getirdiği hesap açma, profil doldurma ve algoritma karmaşası yerine; 13 temel soru üzerinden 90 milyona yaklaşan kombinasyon olasılığı içinden tamamen aynı seçimleri yapan bireyleri eşleştirerek yüksek uyumlu bir dijital "not havuzu" oluşturmayı amaçlar.

---

## 3. Hedef Kullanıcı ve Kullanıcı Akışı

Hedef kitle, internet ve sosyal medya üzerinden kafa dengi insanlarla eşleşmeyi merak eden, hızlı ve eğlenceli kişilik/tercih testlerini seven geniş kullanıcı kitlesidir.

Kullanıcı akışı şu adımlardan oluşur:
1. **Mod Seçimi:** Kullanıcı açılış ekranında iki moddan birini seçer: "Ruh Eşi" (romantik ve ilişkisel sorular) veya "Ruh Arkadaşı" (sosyal yaşam, alışkanlıklar ve arkadaşlık soruları).
2. **Test Deneyimi:** 13 soruluk test başlar. Kullanıcı her soruda tek bir şık seçer. Şık seçildiği anda soru yumuşak bir animasyonla yerini bir sonrakine bırakır. Ekranın üst kısmında sabit kalan başlıkta ilerleme çubuğu dolar ve maskot karakter 4 aşamada evrilir.
3. **Kod Üretimi:** 13. soru tamamlandığında verilen cevapların sıra numaralarından bir sonuç kodu üretilir (örneğin `E-1-3-2...` veya `A-2-1-4...`).
4. **Eşleşme ve Not Ekranı:**
   - Kod Firebase veritabanında taranır.
   - Eğer bu kod veritabanında henüz yoksa: Kullanıcıya bu şifreyi bulan ilk kişi olduğu belirtilir. Kullanıcı bir mesaj yazar, isteğe bağlı iletişim bilgisini girer, açık rıza kutucuğunu işaretler ve notunu kaydeder.
   - Eğer kod daha önce bulunmuşsa: 90 milyonda 1 ihtimalin gerçekleştiği belirtilir. Önceden bırakılan notlar ve iletişim bilgileri gösterilir. Birden fazla not varsa kullanıcı önceki/sonraki butonlarıyla notlar arasında gezinebilir. Ayrıca kendisi de aynı havuza yeni bir not ekleyebilir.
5. **Yeniden Başlama:** Kullanıcı sonuç ekranındaki "Ana Ekrana Dön" butonuyla seçim ekranına dönerek diğer modu da çözebilir.

---

## 4. Çalışan Özellikler

- **İki Farklı Test Modu:** Ruh Eşi (`mate`) ve Ruh Arkadaşı (`friend`) modları için ayrı ayrı hazırlanmış 13'er adet özgün soru seti.
- **Dinamik Maskot Evrimi:** Test ilerledikçe (1-3, 4-7, 8-10, 11-13. sorular) soru başlığındaki maskot görselinin dinamik olarak 4 farklı evreye geçmesi.
- **Karakter ve Sonuç Görselleri:** Modlara özel giriş kartı görselleri, ara evre maskotları ve sonuç ekranı tamamlama görselleri.
- **Sabit Başlık ve Mobil Kaydırma (Sticky Header & Scroll):** Sorular ve şıklar uzadığında ekranın doğal biçimde kaydırılabilmesi, bu sırada maskotun ve ilerleme göstergesinin ekranın üstünde sabit kalması.
- **Deterministik Kod Oluşturma:** Kullanıcının verdiği 13 cevabı matematiksel bir dizilim olarak birleştiren sonuç kodu algoritması.
- **Gerçek Zamanlı Veritabanı Entegrasyonu:** Firebase Realtime Database üzerinden anlık eşleşme sorgulama ve veri kaydetme.
- **Çoklu Eşleşme (1-N Havuz) Desteği:** Aynı koda birden fazla kişinin mesaj bırakabilmesi ve gelen kullanıcının tüm mesajları gezinebilmesi (carousel mantığı ile önceki/sonraki navigasyonu ve sayaç).
- **Spam Engelleme Mekanizması:** Tarayıcı yerel hafızası üzerinden çalışan 60 saniyelik gönderim bekleme süresi (cooldown).
- **Açık Rıza / KVKK Kontrolü:** Rıza kutucuğu işaretlenmeden not gönderme butonunun aktifleşmemesi.

---

## 5. Temel İş Kuralları ve Veri Akışı

- **Kombinasyon Hesabı:** Soruların şık sayıları 2 ile 6 arasında değişmektedir. Bu durum Ruh Eşi modunda 92.160.000, Ruh Arkadaşı modunda 88.473.600 teorik ihtimal üretir. Arayüz metinlerinde bu değer yuvarlanarak "90 Milyonda 1 İhtimal" olarak vurgulanır.
- **Kod Formatı:** Ruh Eşi testinde `E-`, Ruh Arkadaşı testinde `A-` öneki kullanılır; ardından 13 sorunun seçilen şık numaraları tire ile ayrılır (ör. `E-1-2-1-4-3-2-1-1-2-3-4-1-2`).
- **Veri Okuma Mantığı:** Sonuç kodu oluştuktan sonra `matches/<resultCode>` düğümü sorgulanır. Gelen veri geriye dönük uyumlulukla ayrıştırılır; hem tekil nesne formatındaki eski kayıtlar hem de liste olarak eklenen yeni kayıtlar diziye dönüştürülerek kullanıcıya sunulur.
- **Veri Yazma Mantığı:** Kullanıcı not gönderdiğinde Firebase `push()` metodu çalıştırılarak ilgili kodun altına yeni bir kayıt açılır. Kayıt nesnesi mod tipi (`type`), mesaj (`message`), iletişim (`contact`) ve zaman damgası (`timestamp`) alanlarını içerir.
- **Doğrulama Kuralları:** Mesaj alanı boş bırakılamaz. İletişim bilgisi opsiyoneldir. Açık rıza onay kutusu işaretlenmeden kayıt butonuna tıklanamaz.

---

## 6. Teknik Yapı

- **Önyüz (Frontend):** Saf HTML5, modern Vanilla CSS3 ve Vanilla JavaScript (ES6+). Herhangi bir derleyici, paket yöneticisi veya JavaScript kütüphanesi/çatısı bulunmamaktadır.
- **Tipografi:** Google Fonts CDN üzerinden çekilen 'Inter' yazı tipi ailesi.
- **Veri Tabanı ve Backend Servisi:** Google Firebase Realtime Database (CDN üzerinden yüklenen v10.12.3 Compat SDK). Belçika (`europe-west1`) bölgesinde konumlandırılmış veritabanı örneği kullanılmaktadır.
- **İstemci Tarafı Depolama:** Tarayıcı `localStorage` mekanizması (kullanıcının son mesaj gönderim zamanını saklamak için).
- **Görsel Varlıklar:** WebP formatında optimize edilmiş maskot ve sonuç illüstrasyonları (`image/` dizini altında yerel olarak barındırılır).
- **Yayınlama ve Dağıtım Altyapısı:** Statik dosya yapısı sayesinde Vercel, Netlify, GitHub Pages veya herhangi bir statik web sunucusunda sıfır yapılandırma ile barındırılabilir.

---

## 7. Tasarım ve Deneyim

- **Görsel Dil:** Yumuşak, modern ve aydınlık bir tasarım dili benimsenmiştir. Açık gri arka plan üzerinde cam efekti (glassmorphism), ince kenarlıklar ve hafif derinlik veren gölgeler kullanılmıştır.
- **Renk Paleti:**
  - Genel arka plan: `#FAFAFA`, ana metin: `#2D3748`, ikincil metin: `#718096`.
  - Ruh Eşi modu: Sıcak pembe/şeftali tonları (`#FF8DA1`) ve açık pembe zeminler (`#FFF0F2`).
  - Ruh Arkadaşı modu: Gök mavisi/lavanta tonları (`#8DA1FF`) ve açık mavi zeminler (`#F0F3FF`).
  - Logo: Pembe ve mavi tonların birleşiminden oluşan doğrusal gradyan.
- **Mobil Odaklılık:** Ekran genişliği masaüstünde 480 piksel ile sınırlandırılarak ortalanmış mobil uygulama görünümü sunar. Mobil tarayıcılardaki dinamik adres çubuğu taşmalarını önlemek için `100dvh` yüksekliği kullanılmıştır.
- **Mikro Etkileşimler:** Giriş kartlarında fare üzerine geldiğinde maskotun yukarı süzülmesi, soru başlığındaki maskotta kesintisiz hafif dalgalanma (float animasyonu) ve sorular arasında kayarak giriş-çıkış geçişleri uygulanmıştır.

---

## 8. Gizlilik, Güvenlik, Maliyet ve Harici Bağımlılıklar

- **Kullanıcı Gizliliği:** Kullanıcıdan ad, soyad, e-posta, telefon veya parola istenmez. Kayıt veya üyelik sistemi yoktur. İletişim bilgisi paylaşımı tamamen kullanıcının isteğine ve açık rızasına bağlıdır.
- **İzleme ve Analitik:** Projede Google Analytics veya herhangi bir üçüncü taraf izleme/analitik aracı bulunmamaktadır.
- **Veritabanı Güvenlik Kuralları:** Firebase güvenlik kuralları, tüm veritabanının toplu olarak listelenmesini veya indirilmesini engelleyecek şekilde yapılandırılmıştır. Yalnızca spesifik bir sonuç kodu düğümüne (`matches/$resultCode`) doğrudan erişim izni verilmiştir.
- **Harici Bağımlılıklar:** Google Fonts CDN ve Firebase Compat JS CDN bağlantılarıdır.
- **Maliyet Durumu:** Uygulama tamamen istemci taraflı çalıştığı ve Firebase'in ücretsiz Spark planı sınırlarına (1 GB depolama, 100 eşzamanlı bağlantı) uygun hafif veri yapıları kullandığı için ek bir sunucu maliyeti gerektirmez.

---

## 9. Bilerek Eklenmeyenler ve Önemli Kararlar

- **Üyelik / Kimlik Doğrulama Yok:** Kullanıcı deneyimindeki sürtünmeyi tamamen ortadan kaldırmak ve viral yayılımı hızlandırmak için giriş yapma zorunluluğu bilinçli olarak eklenmemiştir.
- **Harici CSS Kütüphanesi Yok:** Tailwind CSS veya Bootstrap yerine dosya boyutunu küçük tutmak ve tam kontrol sağlamak adına saf CSS tercih edilmiştir.
- **Derleme / Paketleme Süreci Yok:** Webpack, Vite veya Babel gibi araçlar yerine doğrudan tarayıcıda çalışan saf betikler ve Firebase Compat sürümü tercih edilerek uygulamanın masaüstünden çift tıklamayla dahi çalıştırılabilmesi sağlanmıştır.
- **Özel Arka Uç Sunucusu Yok:** Node.js/Python tabanlı bir API sunucusu kurmak yerine doğrudan Firebase Realtime Database SDK entegrasyonu seçilmiştir.

---

## 10. Mevcut Durum ve Sınırlar

- **Mevcut Durum:** Uygulama, önyüz tasarımı, test mantığı, veritabanı eşleştirmesi, çoklu kayıt havuzu ve hata yönetim mekanizmalarıyla tamamlanmış, üretime hazır (production-ready) bir ilk sürümdür.
- **Bilinen Sınırlar:**
  - İletişim kutusuna girilen metinler için biçim doğrulaması (örneğin geçerli Instagram kullanıcı adı veya e-posta formatı regex kontrolü) yapılmamaktadır.
  - Kullanıcıların yazdığı mesajlar için otomatik küfür veya uygunsuz içerik filtreleme mekanizması bulunmamaktadır.
  - Spam koruması tarayıcının yerel hafızasına (`localStorage`) dayandığı için gizli sekme açılarak veya tarayıcı verisi temizlenerek atlatılabilir.

---

## Yapay Zekâ İçin Kullanım Notu

Bu belge, `ruh ?` (Seçim İkizi) projesinin amacı, kapsamı, veri akışı ve mimari yapısı hakkında genel bir başlangıç bağlamı sağlamak üzere hazırlanmıştır. Proje üzerinde yeni geliştirme, hata ayıklama veya refactoring yapılacaksa, kaynak kodlara erişim durumunda en güncel teknik yapının doğrudan dosyalardan doğrulanması önerilir.
