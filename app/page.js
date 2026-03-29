export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold text-lg text-black">MentorMeet</span>
        <div className="flex gap-4 items-center">
          <a href="/giris" className="text-sm text-gray-600 hover:text-black">Giriş yap</a>
          <a href="/kayit" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Kayıt ol
          </a>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto text-center px-6 py-24">
        <h1 className="text-4xl font-semibold text-black mb-4">
          Üniversite seçmeden önce<br />o meslekten biriyle konuş
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Tüm meslek sahipleri gerçek deneyimlerini seninle paylaşmak için burada.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/kayit" className="bg-black text-white px-6 py-3 rounded-lg text-sm hover:bg-gray-800">
            Meslekleri keşfet
          </a>
          <button className="border border-gray-300 text-black px-6 py-3 rounded-lg text-sm hover:bg-gray-100">
            Nasıl çalışır?
          </button>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-xl font-semibold text-black mb-6">Popüler meslekler</h2>
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
    </main>
  )
}