'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

export default function MentorProfil() {
  const [mentor, setMentor] = useState(null)
  const [mesaj, setMesaj] = useState('')
  const [gonderildi, setGonderildi] = useState(false)
  const [hata, setHata] = useState('')
  const [modalAcik, setModalAcik] = useState(false)

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

  async function talepGonder() {
    if (!mesaj.trim()) {
      setHata('Lütfen bir mesaj yaz.')
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      window.location.href = '/giris'
      return
    }

    const { error } = await supabase.from('talepler').insert({
      ogrenci_id: userData.user.id,
      mentor_id: mentor.kullanici_id,
      mesaj: mesaj,
      durum: 'bekliyor'
    })

    if (error) {
      setHata('Hata: ' + error.message)
    } else {
      setGonderildi(true)
      setHata('')
    }
  }

  if (!mentor) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-400 text-sm">Profil yükleniyor...</p>
        </div>
      </main>
    )
  }

  const yorumlar = [
    { isim: "Selin T.", puan: 5, yorum: "Çok yardımcı oldu, teşekkürler!", tarih: "2 hafta önce" },
    { isim: "Burak D.", puan: 5, yorum: "Gerçekten bilgilendirici bir görüşmeydi.", tarih: "1 ay önce" },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <a href="javascript:history.back()" className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 mb-6">
          ← Geri dön
        </a>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-blue-700 shrink-0">
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
            <button
              onClick={() => setModalAcik(true)}
              className="bg-black text-white px-5 py-2.5 rounded-lg text-sm hover:bg-gray-800 shrink-0"
            >
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

      {modalAcik && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            {gonderildi ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-3">✓</div>
                <h3 className="text-lg font-semibold text-black mb-2">Talep gönderildi!</h3>
                <p className="text-sm text-gray-400 mb-4">{mentor.isim} talebini inceleyecek ve sana geri dönecek.</p>
                <button
                  onClick={() => { setModalAcik(false); setGonderildi(false); setMesaj('') }}
                  className="bg-black text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gray-800"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-black mb-1">{mentor.isim} ile görüşme talep et</h3>
                <p className="text-sm text-gray-400 mb-4">Kendini tanıt ve ne hakkında konuşmak istediğini yaz.</p>
                <textarea
                  placeholder="Merhaba, yazılım mühendisliği kariyerin hakkında konuşmak istiyorum..."
                  value={mesaj}
                  onChange={(e) => setMesaj(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black resize-none mb-3"
                />
                {hata && <p className="text-sm text-red-500 mb-3">{hata}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={() => setModalAcik(false)}
                    className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={talepGonder}
                    className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm hover:bg-gray-800"
                  >
                    Gönder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}