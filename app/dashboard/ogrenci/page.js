'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function OgrenciDashboard() {
  const [isim, setIsim] = useState('')
  const [egitim, setEgitim] = useState('')
  const [arama, setArama] = useState('')
  const [talepler, setTalepler] = useState([])
  const [mentorBilgileri, setMentorBilgileri] = useState({})
  const [yorumModal, setYorumModal] = useState(null)
  const [yeniPuan, setYeniPuan] = useState(5)
  const [yeniYorum, setYeniYorum] = useState('')
  const [yorumMesaj, setYorumMesaj] = useState('')

  const meslekler = [
    { isim: "Yazılım mühendisi", alan: "Teknoloji", renk: "bg-blue-50 text-blue-700", mentor: "12" },
    { isim: "Doktor", alan: "Sağlık", renk: "bg-green-50 text-green-700", mentor: "8" },
    { isim: "Mimar", alan: "Tasarım", renk: "bg-purple-50 text-purple-700", mentor: "5" },
    { isim: "Avukat", alan: "Hukuk", renk: "bg-orange-50 text-orange-700", mentor: "6" },
    { isim: "Öğretmen", alan: "Eğitim", renk: "bg-yellow-50 text-yellow-700", mentor: "9" },
    { isim: "Psikolog", alan: "Sağlık", renk: "bg-pink-50 text-pink-700", mentor: "4" },
    { isim: "Finans uzmanı", alan: "Finans", renk: "bg-emerald-50 text-emerald-700", mentor: "7" },
    { isim: "Gazeteci", alan: "Medya", renk: "bg-red-50 text-red-700", mentor: "3" },
    { isim: "Girişimci", alan: "İş dünyası", renk: "bg-indigo-50 text-indigo-700", mentor: "11" },
  ]

  const filtrelenmis = meslekler.filter(m =>
    m.isim.toLowerCase().includes(arama.toLowerCase()) ||
    m.alan.toLowerCase().includes(arama.toLowerCase())
  )

  useEffect(() => {
    async function getir() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) { window.location.href = '/giris'; return }
      if (userData.user.user_metadata?.rol !== 'ogrenci') { window.location.href = '/'; return }
      setIsim(userData.user?.user_metadata?.isim || '')
      setEgitim(userData.user?.user_metadata?.egitim || '')

      const { data: talepData } = await supabase
        .from('talepler')
        .select('*')
        .eq('ogrenci_id', userData.user.id)
        .order('id', { ascending: false })

      setTalepler(talepData || [])

      const mentorler = {}
      for (const t of talepData || []) {
        const { data: mentor } = await supabase
          .from('mentorlar')
          .select('isim, soyisim, unvan, avatar_url, kullanici_id')
          .eq('kullanici_id', t.mentor_id)
          .single()
        if (mentor) mentorler[t.mentor_id] = mentor
      }
      setMentorBilgileri(mentorler)
    }
    getir()
  }, [])

  async function gorusmeSonlandir(talepId) {
    const { error } = await supabase
      .from('talepler')
      .update({ sonlandirildi: true })
      .eq('id', talepId)

    if (!error) {
      setTalepler(talepler.map(t => t.id === talepId ? { ...t, sonlandirildi: true } : t))
    }
  }

  async function yorumGonder() {
    

    const { data: userData } = await supabase.auth.getUser()
    const { error } = await supabase.from('yorumlar').insert({
      ogrenci_id: userData.user.id,
      mentor_id: yorumModal.mentor_id,
      puan: yeniPuan,
      yorum: yeniYorum,
      ogrenci_isim: userData.user?.user_metadata?.isim || '',
      ogrenci_soyisim: userData.user?.user_metadata?.soyisim || '',
    })

    if (error) {
      setYorumMesaj('Hata: ' + error.message)
    } else {
      setYorumModal(null)
      setYeniYorum('')
      setYeniPuan(5)
      setYorumMesaj('')
    }
  }

  function durumRenk(t) {
    if (t.sonlandirildi) return 'bg-blue-50 text-blue-700'
    if (t.durum === 'onaylandi') return 'bg-green-50 text-green-700'
    if (t.durum === 'reddedildi') return 'bg-red-50 text-red-700'
    return 'bg-yellow-50 text-yellow-700'
  }

  function durumYazi(t) {
    if (t.sonlandirildi) return 'Tamamlandı'
    if (t.durum === 'onaylandi') return 'Onaylandı'
    if (t.durum === 'reddedildi') return 'Reddedildi'
    return 'Bekliyor'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm mb-1">Hoş geldin</p>
            <h1 className="text-2xl font-semibold text-white mb-2">{isim}</h1>
            {egitim && (
              <span className="text-xs text-gray-300 px-3 py-1 rounded-full border border-gray-700">{egitim}</span>
            )}
          </div>
        </div>

        {talepler.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-black mb-4">Taleplerim</h2>
            <div className="flex flex-col gap-3">
              {talepler.map((t) => {
                const mentor = mentorBilgileri[t.mentor_id]
                return (
                  <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700 overflow-hidden shrink-0">
                        {mentor?.avatar_url ? (
                          <img src={mentor.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          mentor?.isim?.charAt(0).toUpperCase() || '?'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {mentor ? mentor.isim + ' ' + mentor.soyisim : 'Mentor'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{mentor?.unvan}</p>
                      </div>
                      <span className={'text-xs px-3 py-1 rounded-full font-medium shrink-0 ' + durumRenk(t)}>
                        {durumYazi(t)}
                      </span>
                    </div>

                    {t.durum === 'onaylandi' && !t.sonlandirildi && (
                      <div className="flex gap-2 mt-3">
                        <a href="/mesajlar" className="flex-1 text-xs border border-gray-200 py-2 rounded-lg text-center text-black hover:bg-gray-50">
                          Mesaj gönder
                        </a>
                        <button
                          onClick={() => gorusmeSonlandir(t.id)}
                          className="flex-1 text-xs border border-red-200 py-2 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          Görüşmeyi sonlandır
                        </button>
                      </div>
                    )}

                    {t.sonlandirildi && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setYorumModal(t)}
                          className="flex-1 text-xs border border-gray-200 py-2 rounded-lg text-black hover:bg-gray-50"
                        >
                          Değerlendir
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Meslek veya alan ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black bg-white"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-black">Meslekleri keşfet</h2>
          <a href="/meslekler" className="text-sm text-gray-400 hover:text-black">Tüm mentorlar →</a>
        </div>

        {filtrelenmis.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">Sonuç bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtrelenmis.map((m) => (
              <a key={m.isim} href={'/meslekler?meslek=' + encodeURIComponent(m.alan)} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm block">
                <span className={'text-xs px-2 py-1 rounded-full font-medium ' + m.renk}>{m.alan}</span>
                <h3 className="font-medium text-black mt-3 mb-1">{m.isim}</h3>
                <p className="text-sm text-gray-400">{m.mentor} mentor</p>
              </a>
            ))}
          </div>
        )}
      </div>

      {yorumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-black mb-1">
              {mentorBilgileri[yorumModal.mentor_id]?.isim} için değerlendirme
            </h3>
            <p className="text-sm text-gray-400 mb-4">Deneyimini diğer öğrencilerle paylaş.</p>
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Puan</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map((p) => (
                  <button key={p} onClick={() => setYeniPuan(p)}
                    className={'w-10 h-10 rounded-lg text-sm font-medium border transition-all ' + (yeniPuan >= p ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200')}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Görüşme nasıldı? Deneyimini anlat..."
              value={yeniYorum}
              onChange={(e) => setYeniYorum(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black resize-none mb-3"
            />
            {yorumMesaj && <p className="text-sm text-red-500 mb-3">{yorumMesaj}</p>}
            <div className="flex gap-3">
              <button onClick={() => setYorumModal(null)} className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-black hover:bg-gray-50">İptal</button>
              <button onClick={yorumGonder} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm hover:bg-gray-800">Gönder</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}