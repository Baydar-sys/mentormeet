'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

const sektorler = ['Tümü', 'Teknoloji', 'Sağlık', 'Hukuk', 'Finans', 'Eğitim', 'Tasarım', 'Medya', 'İş dünyası']

function MesleklerIcerik() {
  const searchParams = useSearchParams()
  const meslek = searchParams.get('meslek') || ''
  const [mentorlar, setMentorlar] = useState([])
  const [filtrelenmis, setFiltrelenmis] = useState([])
  const [arama, setArama] = useState('')
  const [secilenSektor, setSecilenSektor] = useState(meslek || 'Tümü')

  useEffect(() => {
    async function getir() {
      const { data } = await supabase
        .from('mentorlar')
        .select('*')

      setMentorlar(data || [])
      setFiltrelenmis(data || [])
    }
    getir()
  }, [])

  useEffect(() => {
    let sonuc = mentorlar

    if (secilenSektor && secilenSektor !== 'Tümü') {
      sonuc = sonuc.filter(m => m.sektor === secilenSektor)
    }

    if (arama.trim()) {
      sonuc = sonuc.filter(m =>
        (m.isim + ' ' + m.soyisim).toLowerCase().includes(arama.toLowerCase()) ||
        m.unvan?.toLowerCase().includes(arama.toLowerCase())
      )
    }

    setFiltrelenmis(sonuc)
  }, [arama, secilenSektor, mentorlar])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-black mb-1">Mentorlar</h1>
      <p className="text-sm text-gray-400 mb-6">Deneyimli kişilerle tanış.</p>

      {/* Arama */}
      <input
        type="text"
        placeholder="İsim veya unvan ara..."
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black mb-4"
      />

      {/* Sektör filtresi */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sektorler.map((s) => (
          <button
            key={s}
            onClick={() => setSecilenSektor(s)}
            className={'px-4 py-2 rounded-lg text-sm border transition-all ' + (secilenSektor === s ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Sonuçlar */}
      {filtrelenmis.length === 0 ? (
        <p className="text-sm text-gray-400">Sonuç bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtrelenmis.map((m) => (
            <a key={m.kullanici_id} href={'/mentor?id=' + m.kullanici_id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm block">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-lg font-semibold text-blue-700 overflow-hidden shrink-0">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    m.isim?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-medium text-black">{m.isim} {m.soyisim}</p>
                  <p className="text-sm text-gray-400">{m.unvan}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{m.sektor}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{m.deneyim}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Meslekler() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<div className="p-10 text-sm text-gray-400">Yükleniyor...</div>}>
        <MesleklerIcerik />
      </Suspense>
    </main>
  )
}