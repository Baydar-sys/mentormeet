'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import Navbar from '../../../components/Navbar'

export default function ProfilDuzenle() {
  const [isim, setIsim] = useState('')
  const [soyisim, setSoyisim] = useState('')
  const [unvan, setUnvan] = useState('')
  const [firma, setFirma] = useState('')
  const [sektor, setSektor] = useState('')
  const [deneyim, setDeneyim] = useState('')
  const [hakkinda, setHakkinda] = useState('')
  const [uzmanlik, setUzmanlik] = useState([])
  const [musaitGunler, setMusaitGunler] = useState([])
  const [musaitSaat, setMusaitSaat] = useState('')
  const [yeniSifre, setYeniSifre] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  const sektorler = ['Teknoloji', 'Sağlık', 'Hukuk', 'Finans', 'Eğitim', 'Tasarım', 'Medya', 'İş dünyası']
  const deneyimler = ['0-2 yıl', '2-5 yıl', '5-10 yıl', '10+ yıl']
  const uzmanlikAlanlari = ['Backend', 'Frontend', 'Mobil', 'Veri bilimi', 'DevOps', 'Ürün yönetimi', 'Tasarım', 'Satış', 'Finans', 'Hukuk']
  const gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.auth.getUser()
      const meta = data.user?.user_metadata
      setIsim(meta?.isim || '')
      setSoyisim(meta?.soyisim || '')

      const { data: mentorData } = await supabase
        .from('mentorlar')
        .select('*')
        .eq('kullanici_id', data.user.id)
        .single()

      if (mentorData) {
        setUnvan(mentorData.unvan || '')
        setFirma(mentorData.firma || '')
        setSektor(mentorData.sektor || '')
        setDeneyim(mentorData.deneyim || '')
        setHakkinda(mentorData.hakkinda || '')
        setUzmanlik(mentorData.uzmanlik || [])
        setMusaitGunler(mentorData.musait_gunler || [])
        setMusaitSaat(mentorData.musait_saat || '')
        setAvatarUrl(mentorData.avatar_url || '')
      }
    }
    getir()
  }, [])

  function uzmanlikToggle(alan) {
    if (uzmanlik.includes(alan)) {
      setUzmanlik(uzmanlik.filter(a => a !== alan))
    } else {
      setUzmanlik([...uzmanlik, alan])
    }
  }

  function gunToggle(gun) {
    if (musaitGunler.includes(gun)) {
      setMusaitGunler(musaitGunler.filter(g => g !== gun))
    } else {
      setMusaitGunler([...musaitGunler, gun])
    }
  }

 async function fotoyukle(e) {
    const dosya = e.target.files[0]
    if (!dosya) return
    setYukleniyor(true)

    const { data: userData } = await supabase.auth.getUser()
    const dosyaAdi = userData.user.id + '_avatar'

    const { error } = await supabase.storage
      .from('avatarlar')
      .upload(dosyaAdi, dosya, { upsert: true })

    if (!error) {
      const { data: urlData } = supabase.storage
        .from('avatarlar')
        .getPublicUrl(dosyaAdi)
      const yeniUrl = urlData.publicUrl + '?t=' + Date.now()
      setAvatarUrl(yeniUrl)

      await supabase.auth.updateUser({
        data: { avatar_url: yeniUrl }
      })
    }
    setYukleniyor(false)
  }
  async function kaydet() {
    const { data: userData } = await supabase.auth.getUser()

    await supabase.auth.updateUser({
      data: { isim, soyisim }
    })

    const { error } = await supabase.from('mentorlar').upsert({
      kullanici_id: userData.user.id,
      isim, soyisim, unvan, firma, sektor, deneyim, hakkinda,
      uzmanlik, musait_gunler: musaitGunler, musait_saat: musaitSaat,
      avatar_url: avatarUrl
    }, { onConflict: 'kullanici_id' })

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('Profil kaydedildi!')
    }
  }

  async function sifreDegistir() {
    if (!yeniSifre) {
      setMesaj('Lütfen yeni şifre gir.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: yeniSifre })
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('Şifre değiştirildi!')
      setYeniSifre('')
    }
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <a href="/dashboard/mentor" className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 mb-6">
          ← Dashboard'a dön
        </a>
        <h1 className="text-xl font-semibold text-black mb-1">Profilini düzenle</h1>
        <p className="text-sm text-gray-400 mb-8">Öğrenciler bu bilgileri görecek.</p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5 mb-6">

          {/* Profil fotoğrafı */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Profil fotoğrafı</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-blue-700 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  isim.charAt(0).toUpperCase()
                )}
              </div>
              <label className="text-sm text-black border border-gray-200 px-4 py-2 rounded-lg hover:bg-stone-50 cursor-pointer">
                {yukleniyor ? 'Yükleniyor...' : 'Fotoğraf seç'}
                <input type="file" accept="image/*" onChange={fotoyukle} className="hidden" />
              </label>
            </div>
          </div>

          {/* Ad soyad */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Ad & Soyad</label>
            <div className="flex gap-3">
              <input type="text" placeholder="Adın" value={isim} onChange={(e) => setIsim(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black" />
              <input type="text" placeholder="Soyadın" value={soyisim} onChange={(e) => setSoyisim(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black" />
            </div>
          </div>

          {/* Unvan & Firma */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Unvan & Şirket</label>
            <div className="flex gap-3">
              <input type="text" placeholder="Ör: Yazılım Mühendisi" value={unvan} onChange={(e) => setUnvan(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black" />
              <input type="text" placeholder="Ör: Google" value={firma} onChange={(e) => setFirma(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black" />
            </div>
          </div>

          {/* Sektör */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Sektör</label>
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
            <label className="text-xs font-medium text-gray-500 mb-2 block">Deneyim</label>
            <div className="flex gap-2">
              {deneyimler.map((d) => (
                <button key={d} onClick={() => setDeneyim(d)}
                  className={'flex-1 py-2.5 rounded-lg text-sm border transition-all ' + (deneyim === d ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Müsait günler */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Müsait günler</label>
            <div className="flex flex-wrap gap-2">
              {gunler.map((g) => (
                <button key={g} onClick={() => gunToggle(g)}
                  className={'px-3 py-2 rounded-lg text-sm border transition-all ' + (musaitGunler.includes(g) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Müsait saat aralığı */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Müsait saat aralığı</label>
            <input type="text" placeholder="Ör: 09:00 - 18:00" value={musaitSaat} onChange={(e) => setMusaitSaat(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black" />
          </div>

          {/* Hakkımda */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Hakkımda</label>
            <textarea placeholder="Kendini tanıt..." value={hakkinda} onChange={(e) => setHakkinda(e.target.value)}
              rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black resize-none" />
          </div>

          <button onClick={kaydet} className="bg-black text-white py-3 rounded-lg text-sm hover:bg-gray-800">
            Kaydet
          </button>

          {mesaj && <p className="text-sm text-center text-gray-500">{mesaj}</p>}
        </div>

        {/* Şifre değiştir */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-black">Şifre değiştir</h2>
          <input type="password" placeholder="Yeni şifre" value={yeniSifre} onChange={(e) => setYeniSifre(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black" />
          <button onClick={sifreDegistir} className="bg-black text-white py-3 rounded-lg text-sm hover:bg-gray-800">
            Şifreyi güncelle
          </button>
        </div>

      </div>
    </main>
  )
}