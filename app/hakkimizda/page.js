import Navbar from '../components/Navbar'

export default function Hakkimizda() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 pt-12 md:pt-20 pb-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-black mb-4">
          Neden MentorMeet?
        </h1>
        <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-12">
          Her yıl yüz binlerce öğrenci, yeterince bilgi sahibi olmadan üniversite bölümü seçiyor. Biz bunu değiştirmek için buradayız.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">Hikayemiz</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            MentorMeet, üniversite seçimi sürecinde doğru bilgiye ulaşmanın ne kadar zor olduğunu bizzat yaşayan bir ekip tarafından kuruldu. Çoğu öğrenci internetteki genel bilgilerle ya da çevresindeki birkaç kişinin tavsiyesiyle hayatlarının en önemli kararlarından birini veriyor.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Amacımız basit: her öğrencinin, seçmeyi düşündüğü meslekte gerçekten çalışan biriyle konuşabilmesini sağlamak.
          </p>
        </div>

        <h2 className="text-xl font-semibold text-black mb-6">Değerlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { baslik: "Şeffaflık", aciklama: "Gerçek deneyimler, gerçek insanlardan. Filtrelenmemiş bilgi." },
            { baslik: "Erişilebilirlik", aciklama: "Her öğrencinin mentora ulaşabilmesi için engelleri kaldırıyoruz." },
            { baslik: "Topluluk", aciklama: "Mentor ve öğrenciler birlikte büyüyen bir ekosistem." },
          ].map((deger) => (
            <div key={deger.baslik} className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-medium text-black mb-2">{deger.baslik}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{deger.aciklama}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-black mb-6">Ekibimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { isim: "Mehmet B.", rol: "Kurucu & CEO" },
            { isim: "Ayşe K.", rol: "Ürün Müdürü" },
            { isim: "Can T.", rol: "Teknoloji Lideri" },
          ].map((kisi) => (
            <div key={kisi.isim} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600 mx-auto mb-3">
                {kisi.isim.charAt(0)}
              </div>
              <p className="font-medium text-black text-sm">{kisi.isim}</p>
              <p className="text-xs text-gray-400 mt-1">{kisi.rol}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Sen de katıl</h2>
          <p className="text-gray-400 text-sm mb-6">Öğrenci ya da mentor olarak topluluğumuza katıl.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/kayit" className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100">
              Öğrenci ol
            </a>
            <a href="/mentor-ol" className="border border-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:border-gray-400">
              Mentor ol
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-semibold text-black">MentorMeet</span>
          <p className="text-sm text-gray-400">© 2025 MentorMeet. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="/hakkimizda" className="text-sm text-gray-400 hover:text-black">Hakkımızda</a>
            <a href="/gizlilik" className="text-sm text-gray-400 hover:text-black">Gizlilik</a>
            <a href="/mentor-ol" className="text-sm text-gray-400 hover:text-black">Mentor ol</a>
          </div>
        </div>
      </footer>
    </main>
  )
}