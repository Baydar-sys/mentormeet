'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'

export default function ProfilDuzenle() {
  const [isim, setIsim] = useState('')
  const [soyisim, setSoyisim] = useState('')
  const [unvan, setUnvan] = useState('')
  const [firma, setFirma] = useState('')
  const [sektor, setSektor] = useState('')
  const [deneyim, setDeneyim] = useState('')
  const [hakkinda, setHakkinda] = useState('')
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.auth.getUser()
      const meta = data.user?.user_metadata
      setIsim(meta?.isim || '')
      setSoyisim(meta?.soyisim || '')
      setUnvan(meta?.unvan || '')
      setFirma(meta?.firma || '')
      setSektor(meta?.sektor || '')
      setDeneyim(meta?.deneyim || '')
      setHakkinda(meta?.hakkinda || '')
    }
    getir()
  }, [])

  async function kaydet() {
    const { data: userData } = await supabase.auth.getUser()
    const kullanici_id = userData.user.id

    const { error } = await supabase.from('mentorlar').upsert({
      kullanici_id,
      isim,
      soyisim,
      unvan,
      firma,
      sektor,
      deneyim,
      hakkinda
    }, { onConflict: 'kullanici_id' })

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('Profil kaydedildi!')
    }
  }

  const sektorler = ['Teknoloji', 'Sağlık', 'Hukuk', 'Finans', 'Eğitim', 'Tasarım', 'Medya', 'İş dünyası']
  const deneyimler = ['0-2 yıl', '2-5 yıl', '5-10 yıl', '10+ yıl']

  return (
    <main className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <a href="/dashboard/mentor" className="font-semibold text-lg text-black">MentorMeet</a>
        <a href="/dashboard/mentor" className="text-sm text-gray-500 hover:text-black">
          ← Dashboard'a dön
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold text-black mb-1">Profilini düzenle</h1>
        <p className="text-sm text-gray-400 mb-8">Öğrenciler bu bilgileri görecek — eksiksiz doldur.</p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5">

          {/* İsim soyisim */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Ad & Soyad</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Adın"
                value={isim}
                onChange={(e) => setIsim(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Soyadın"
                value={soyisim}
                onChange={(e) => setSoyisim(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Unvan & Firma */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Unvan & Şirket</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ör: Yazılım Mühendisi"
                value={unvan}
                onChange={(e) => setUnvan(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Ör: Google"
                value={firma}
                onChange={(e) => setFirma(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Sektör */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Sektör</label>
            <div className="flex flex-wrap gap-2">
              {sektorler.map((s) => (
                <button
                  key={s}
                  onClick={() => setSektor(s)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                    sektor === s
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Deneyim */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Deneyim</label>
            <div className="flex gap-2">
              {deneyimler.map((d) => (
                <button
                  key={d}
                  onClick={() => setDeneyim(d)}
                  className={`flex-1 py-2.5 rounded-lg text-sm border transition-all ${
                    deneyim === d
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Hakkımda */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Hakkımda</label>
            <textarea
              placeholder="Kendini tanıt, öğrencilere ne gibi konularda yardımcı olabileceğini anlat..."
              value={hakkinda}
              onChange={(e) => setHakkinda(e.target.value)}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black resize-none"
            />
          </div>

          <button
            onClick={kaydet}
            className="bg-black text-white py-3 rounded-lg text-sm hover:bg-gray-800"
          >
            Kaydet
          </button>

          {mesaj && (
            <p className="text-sm text-center text-gray-500">{mesaj}</p>
          )}

        </div>
      </div>
    </main>
  )
}