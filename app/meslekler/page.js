'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

const sektorler = ['Tümü', 'Teknoloji', 'Sağlık', 'Hukuk', 'Finans', 'Eğitim', 'Tasarım', 'Medya', 'İş dünyası']

function MesleklerIcerik() {
  const searchParams = useSearchParams()
  const baslangicMeslek = searchParams.get('meslek') || ''
  const [mentorlar, setMentorlar] = useState([])
  const [yorumSayilari, setYorumSayilari] = useState({})
  const [arama, setArama] = useState('')
  const [secilenSektor, setSecilenSektor] = useState(baslangicMeslek || 'Tümü')

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.from('mentorlar').select('*')
      setMentorlar(data || [])

      const { data: yorumlar } = await supabase
        .from('yorumlar')
        .select('mentor_id, puan')

      const sayilar = {}
      for (const y of yorumlar || []) {
        if (!sayilar[y.mentor_id]) sayilar[y.mentor_id] = { toplam: 0, sayi: 0 }
        sayilar[y.mentor_id].toplam += y.puan
        sayilar[y.mentor_id].sayi += 1
      }
      setYorumSayilari(sayilar)
    }
    getir()
  }, [])

  const filtrelenmis = mentorlar.filter(m => {
    const aramaUyuyor = arama.trim() === '' ||
      (m.isim + ' ' + m.soyisim).toLowerCase().includes(arama.toLowerCase()) ||
      m.unvan?.toLowerCase().includes(arama.toLowerCase())

    const sektorUyuyor = secilenSektor === 'Tümü' || m.sektor === secilenSektor

    return aramaUyuyor && sektorUyuyor
  })

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <h1 className="text-2xl font-semibold text-black mb-1">Mentorlar</h1>
      <p className="text-sm text-gray-400 mb-6">Deneyimli kişilerle tanış.</p>

      <input
        type="text"
        placeholder="İsim veya unvan ara..."
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black mb-4 bg-white"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {sektorler.map((s) => (
          <button key={s} onClick={() => setSecilenSektor(s)}
            className={'px-3 py-1.5 rounded-lg text-xs border transition-all ' + (secilenSektor === s ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
            {s}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-4">{filtrelenmis.length} mentor bulundu</p>

      {filtrelenmis.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400">Sonuç bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtrelenmis.map((m) => {
            const yorumBilgi = yorumSayilari[m.kullanici_id]
            const ortalama = yorumBilgi ? (yorumBilgi.toplam / yorumBilgi.sayi).toFixed(1) : null

            return (
              <a key={m.kullanici_id} href={'/mentor?id=' + m.kullanici_id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm block transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-lg font-semibold text-blue-700 overflow-hidden shrink-0">
                    {m.avatar_url ? (
                      <img src={m.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      m.isim?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black truncate">{m.isim} {m.soyisim}</p>
                    <p className="text-sm text-gray-400 truncate">{m.unvan} {m.firma ? '· ' + m.firma : ''}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {m.sektor && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{m.sektor}</span>}
                  {m.deneyim && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{m.deneyim}</span>}
                  {ortalama && (
                    <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                      ★ {ortalama} ({yorumBilgi.sayi})
                    </span>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Meslekler() {
  return (
    <main className="min-h-screen" style={{backgroundColor: '#f8f7f4'}}>
      <Navbar />
      <Suspense fallback={<div className="p-10 text-sm text-gray-400">Yükleniyor...</div>}>
        <MesleklerIcerik />
      </Suspense>
    </main>
  )
}