'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function MentorOl() {
  const [isim, setIsim] = useState('')
  const [soyisim, setSoyisim] = useState('')
  const [email, setEmail] = useState('')
  const [unvan, setUnvan] = useState('')
  const [firma, setFirma] = useState('')
  const [sektor, setSektor] = useState('')
  const [deneyim, setDeneyim] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [motivasyon, setMotivasyon] = useState('')
  const [gonderildi, setGonderildi] = useState(false)
  const [mesaj, setMesaj] = useState('')

  const sektorler = ['Teknoloji', 'Sağlık', 'Hukuk', 'Finans', 'Eğitim', 'Tasarım', 'Medya', 'İş dünyası']
  const deneyimler = ['0-2 yıl', '2-5 yıl', '5-10 yıl', '10+ yıl']

  async function basvur() {
    if (!isim || !soyisim || !email || !unvan || !sektor || !deneyim || !motivasyon) {
      setMesaj('Lütfen tüm alanları doldurun.')
      return
    }

    const { error } = await supabase
      .from('mentor_basvurulari')
      .insert({ isim, soyisim, email, unvan, firma, sektor, deneyim, linkedin, motivasyon })

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setGonderildi(true)
    }
  }

  if (gonderildi) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-semibold text-black mb-2">Başvurun alındı!</h1>
          <p className="text-sm text-gray-400 mb-6">
            Başvurunu inceleyip en kısa sürede e-posta ile dönüş yapacağız. Teşekkürler!
          </p>
          <a href="/" className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800">
            Ana sayfaya dön
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 flex">

      {/* Sol panel */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 flex-col justify-between p-12">
        <a href="/" className="font-semibold text-white text-lg">MentorMeet</a>
        <div>
          <h2 className="text-3xl font-semibold text-white mb-4 leading-snug">
            Mentor ol, fark yarat
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Deneyimlerini paylaşarak binlerce öğrencinin doğru kararı vermesine yardımcı ol.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm">1</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Başvurunu gönder</p>
                <p className="text-gray-400 text-xs mt-0.5">Formu doldur, ekibimiz seni incelesin</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm">2</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Onay al</p>
                <p className="text-gray-400 text-xs mt-0.5">Başvurun onaylanınca hesabın aktif olur</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm">3</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Öğrencilerle buluş</p>
                <p className="text-gray-400 text-xs mt-0.5">Görüşme talepleri almaya başla</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600">© 2025 MentorMeet</p>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-black mb-2">Mentor başvurusu</h1>
            <p className="text-sm text-gray-400">Zaten hesabın var mı? <a href="/giris" className="text-black underline">Giriş yap</a></p>
          </div>

          <div className="flex flex-col gap-4">

            {/* Ad soyad */}
            <div className="flex gap-3">
              <input type="text" placeholder="Adın" value={isim} onChange={(e) => setIsim(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black" />
              <input type="text" placeholder="Soyadın" value={soyisim} onChange={(e) => setSoyisim(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black" />
            </div>

            {/* Email */}
            <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black" />

            {/* Unvan & Firma */}
            <div className="flex gap-3">
              <input type="text" placeholder="Unvan (ör: Yazılım Mühendisi)" value={unvan} onChange={(e) => setUnvan(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black" />
              <input type="text" placeholder="Şirket (opsiyonel)" value={firma} onChange={(e) => setFirma(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black" />
            </div>

            {/* Sektör */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Sektör</p>
              <div className="flex flex-wrap gap-2">
                {sektorler.map((s) => (
                  <button key={s} onClick={() => setSektor(s)}
                    className={'px-4 py-2 rounded-lg text-sm border transition-all ' + (sektor === s ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Deneyim */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Deneyim</p>
              <div className="flex gap-2">
                {deneyimler.map((d) => (
                  <button key={d} onClick={() => setDeneyim(d)}
                    className={'flex-1 py-2.5 rounded-xl text-sm border transition-all ' + (deneyim === d ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* LinkedIn */}
            <input type="text" placeholder="LinkedIn profil linki (opsiyonel)" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black" />

            {/* Motivasyon */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Neden mentor olmak istiyorsun?</p>
              <textarea placeholder="Deneyimlerini paylaşmak isteme sebebini anlat..." value={motivasyon} onChange={(e) => setMotivasyon(e.target.value)}
                rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black resize-none" />
            </div>

            <button onClick={basvur} className="bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 mt-1">
              Başvur
            </button>

            {mesaj && <p className="text-sm text-gray-500 text-center">{mesaj}</p>}

          </div>
        </div>
      </div>
    </main>
  )
}