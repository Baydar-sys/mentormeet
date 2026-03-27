'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function MentorProfil() {
  const [mentor, setMentor] = useState(null)

  useEffect(() => {
    async function getir() {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('id')
      if (!id) return

      const { data } = await supabase
        .from('mentorlar')
        .select('*')
        .eq('kullanici_id', id)
        .single()

      setMentor(data)
    }
    getir()
  }, [])

  if (!mentor) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Profil yükleniyor...</p>
      </main>
    )
  }

  const yorumlar = [
    { isim: "Selin T.", puan: 5, yorum: "Çok yardımcı oldu, teşekkürler!", tarih: "2 hafta önce" },
    { isim: "Burak D.", puan: 5, yorum: "Gerçekten bilgilendirici bir görüşmeydi.", tarih: "1 ay önce" },
  ]

  return (
    <main className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <a href="/" className="font-semibold text-lg text-black">MentorMeet</a>
        <a href="/giris" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          Giriş yap
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-blue-700 flex-shrink-0">
              {mentor.isim?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-black mb-1">{mentor.isim} {mentor.soyisim}</h1>
              <p className="text-sm text-gray-500 mb-3">{mentor.unvan} · {mentor.firma}</p>
              <div className="flex gap-3 flex-wrap">
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {mentor.sektor}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {mentor.deneyim} deneyim
                </span>
              </div>
            </div>
            <button className="bg-black text-white px-5 py-2.5 rounded-lg text-sm hover:bg-gray-800 flex-shrink-0">
              Görüşme talep et
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-black mb-3">Hakkımda</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{mentor.hakkinda}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-black mb-4">
            Değerlendirmeler
            <span className="text-sm font-normal text-gray-400 ml-2">({yorumlar.length} yorum)</span>
          </h2>
          <div className="flex flex-col gap-4">
            {yorumlar.map((y, i) => (
              <div key={i} className={i < yorumlar.length - 1 ? "pb-4 border-b border-gray-100" : ""}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-sm font-medium text-black">{y.isim}</span>
                    <span className="text-xs text-yellow-500 ml-2">{"★".repeat(y.puan)}</span>
                  </div>
                  <span className="text-xs text-gray-400">{y.tarih}</span>
                </div>
                <p className="text-sm text-gray-500">{y.yorum}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}