'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [istatistik, setIstatistik] = useState({ mentor: 0, gorusme: 0 })

  useEffect(() => {
    async function getir() {
      const { count: mentorSayisi } = await supabase
        .from('mentorlar')
        .select('*', { count: 'exact', head: true })

      const { count: gorusmeSayisi } = await supabase
        .from('talepler')
        .select('*', { count: 'exact', head: true })
        .eq('durum', 'onaylandi')

      setIstatistik({
        mentor: mentorSayisi || 0,
        gorusme: gorusmeSayisi || 0
      })
    }
    getir()
  }, [])

  return (
    <main className="min-h-screen bg-white">

      <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <span className="font-semibold text-lg text-black">MentorMeet</span>
        <div className="flex gap-3 items-center">
          <a href="/giris" className="text-sm text-gray-600 hover:text-black">Giriş yap</a>
          <a href="/kayit" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Kayıt ol
          </a>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12 md:pb-16 text-center">
        <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-4 md:mb-6">
          Türkiye'nin ilk kariyer mentörlük platformu
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold text-black mb-4 md:mb-6 leading-tight">
          Üniversite seçmeden önce<br />
          <span className="text-gray-400">o meslekten biriyle konuş</span>
        </h1>
        <p className="text-gray-500 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Yazılımcılar, doktorlar, avukatlar — gerçek deneyimlerini seninle paylaşmak için burada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 md:mb-16">
          <a href="/kayit" className="bg-black text-white px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-800">
            Hemen başla
          </a>
          <a href="/meslekler" className="border border-gray-200 text-black px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-stone-50">
            Mentorları keşfet
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto pb-12 md:pb-16 border-b border-gray-100">
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-black mb-1">{istatistik.mentor}+</p>
            <p className="text-xs md:text-sm text-gray-400">Aktif mentor</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-black mb-1">20+</p>
            <p className="text-xs md:text-sm text-gray-400">Farklı meslek</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-black mb-1">{istatistik.gorusme}+</p>
            <p className="text-xs md:text-sm text-gray-400">Görüşme yapıldı</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-semibold text-black text-center mb-8 md:mb-12">Nasıl çalışır?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { sayi: "1", baslik: "Mesleği seç", aciklama: "İlgilendiğin meslek alanını ve mentoru bul" },
            { sayi: "2", baslik: "Görüşme talep et", aciklama: "Kısa bir mesaj yaz, mentor seni onaylasın" },
            { sayi: "3", baslik: "Konuş & öğren", aciklama: "Gerçek deneyimleri dinle, doğru kararı ver" },
          ].map((adim) => (
            <div key={adim.sayi} className="flex md:flex-col items-start md:items-center md:text-center gap-4 md:gap-0">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-semibold text-black shrink-0 md:mb-4">
                {adim.sayi}
              </div>
              <div>
                <h3 className="font-medium text-black mb-1">{adim.baslik}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{adim.aciklama}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-semibold text-black mb-6 md:mb-8">Popüler meslekler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { isim: "Yazılım mühendisi", alan: "Teknoloji", renk: "bg-blue-50 text-blue-700" },
            { isim: "Doktor", alan: "Sağlık", renk: "bg-green-50 text-green-700" },
            { isim: "Mimar", alan: "Tasarım", renk: "bg-purple-50 text-purple-700" },
            { isim: "Avukat", alan: "Hukuk", renk: "bg-orange-50 text-orange-700" },
            { isim: "Öğretmen", alan: "Eğitim", renk: "bg-yellow-50 text-yellow-700" },
            { isim: "Psikolog", alan: "Sağlık", renk: "bg-pink-50 text-pink-700" },
          ].map((meslek) => (
            <a key={meslek.isim} href={'/meslekler?meslek=' + encodeURIComponent(meslek.alan)} className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-sm block">
              <span className={'text-xs px-2 py-1 rounded-full font-medium ' + meslek.renk}>
                {meslek.alan}
              </span>
              <h3 className="font-medium text-black mt-3 mb-1 text-sm md:text-base">{meslek.isim}</h3>
              <p className="text-xs md:text-sm text-gray-400">Profilleri gör →</p>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8 mt-4">
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