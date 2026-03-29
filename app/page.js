export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <span className="font-semibold text-lg text-black">MentorMeet</span>
        <div className="flex gap-4 items-center">
          <a href="/giris" className="text-sm text-gray-600 hover:text-black">Giriş yap</a>
          <a href="/kayit" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Kayıt ol
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-6">
          Türkiye'nin ilk kariyer mentörlük platformu
        </div>
        <h1 className="text-5xl font-semibold text-black mb-6 leading-tight">
          Üniversite seçmeden önce<br />
          <span className="text-gray-400">o meslekten biriyle konuş</span>
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Yazılımcılar, doktorlar, avukatlar — gerçek deneyimlerini seninle paylaşmak için burada. Yanlış bölüm seçiminin önüne geç.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <a href="/kayit" className="bg-black text-white px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-800">
            Hemen başla
          </a>
          <a href="/meslekler" className="border border-gray-200 text-black px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            Mentorları keşfet
          </a>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pb-16 border-b border-gray-100">
          <div>
            <p className="text-3xl font-semibold text-black mb-1">50+</p>
            <p className="text-sm text-gray-400">Aktif mentor</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-black mb-1">20+</p>
            <p className="text-sm text-gray-400">Farklı meslek</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-black mb-1">500+</p>
            <p className="text-sm text-gray-400">Görüşme yapıldı</p>
          </div>
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-black text-center mb-12">Nasıl çalışır?</h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-semibold text-black mx-auto mb-4">1</div>
            <h3 className="font-medium text-black mb-2">Mesleği seç</h3>
            <p className="text-sm text-gray-400 leading-relaxed">İlgilendiğin meslek alanını ve mentoru bul</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-semibold text-black mx-auto mb-4">2</div>
            <h3 className="font-medium text-black mb-2">Görüşme talep et</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Kısa bir mesaj yaz, mentor seni onaylasın</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-semibold text-black mx-auto mb-4">3</div>
            <h3 className="font-medium text-black mb-2">Konuş & öğren</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Gerçek deneyimleri dinle, doğru kararı ver</p>
          </div>
        </div>
      </section>

      {/* Popüler meslekler */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-black mb-8">Popüler meslekler</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { isim: "Yazılım mühendisi", alan: "Teknoloji", renk: "bg-blue-50 text-blue-700" },
            { isim: "Doktor", alan: "Sağlık", renk: "bg-green-50 text-green-700" },
            { isim: "Mimar", alan: "Tasarım", renk: "bg-purple-50 text-purple-700" },
            { isim: "Avukat", alan: "Hukuk", renk: "bg-orange-50 text-orange-700" },
            { isim: "Öğretmen", alan: "Eğitim", renk: "bg-yellow-50 text-yellow-700" },
            { isim: "Psikolog", alan: "Sağlık", renk: "bg-pink-50 text-pink-700" },
          ].map((meslek) => (
            <a key={meslek.isim} href={'/meslekler?meslek=' + encodeURIComponent(meslek.alan)} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm block">
              <span className={'text-xs px-2 py-1 rounded-full font-medium ' + meslek.renk}>
                {meslek.alan}
              </span>
              <h3 className="font-medium text-black mt-3 mb-1">{meslek.isim}</h3>
              <p className="text-sm text-gray-400">Profilleri gör →</p>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 mt-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="font-semibold text-black">MentorMeet</span>
          <p className="text-sm text-gray-400">© 2025 MentorMeet. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-black">Hakkımızda</a>
            <a href="#" className="text-sm text-gray-400 hover:text-black">Gizlilik</a>
            <a href="#" className="text-sm text-gray-400 hover:text-black">İletişim</a>
          </div>
        </div>
      </footer>

    </main>
  )
}