'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import Navbar from '../../../components/Navbar'

export default function OgrenciProfil() {
  const [isim, setIsim] = useState('')
  const [soyisim, setSoyisim] = useState('')
  const [egitim, setEgitim] = useState('')
  const [sehir, setSehir] = useState('')
  const [ilgiAlanlari, setIlgiAlanlari] = useState([])
  const [yeniSifre, setYeniSifre] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  const alanlar = ['Teknoloji', 'Sağlık', 'Hukuk', 'Finans', 'Eğitim', 'Tasarım', 'Medya', 'İş dünyası']

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.auth.getUser()
      const meta = data.user?.user_metadata
      setIsim(meta?.isim || '')
      setSoyisim(meta?.soyisim || '')
      setEgitim(meta?.egitim || '')
      setSehir(meta?.sehir || '')
      setIlgiAlanlari(meta?.ilgiAlanlari || [])
      setAvatarUrl(meta?.avatar_url || '')
    }
    getir()
  }, [])

  function ilgiToggle(alan) {
    if (ilgiAlanlari.includes(alan)) {
      setIlgiAlanlari(ilgiAlanlari.filter(a => a !== alan))
    } else {
      setIlgiAlanlari([...ilgiAlanlari, alan])
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
      setAvatarUrl(urlData.publicUrl)
    }
    setYukleniyor(false)
  }

  async function kaydet() {
    const { error } = await supabase.auth.updateUser({
      data: { isim, soyisim, egitim, sehir, ilgiAlanlari, avatar_url: avatarUrl }
    })
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
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <a href="/dashboard/ogrenci" className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 mb-6">
          ← Dashboard'a dön
        </a>
        <h1 className="text-xl font-semibold text-black mb-1">Profilim</h1>
        <p className="text-sm text-gray-400 mb-8">Bilgilerini güncel tut.</p>

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
              <label className="text-sm text-black border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
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

          {/* Eğitim */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Eğitim durumu</label>
            <div className="flex gap-2">
              {['Lise', 'Üniversite', 'Mezun'].map((s) => (
                <button key={s} onClick={() => setEgitim(s)}
                  className={'flex-1 py-2.5 rounded-lg text-sm border transition-all ' + (egitim === s ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Şehir */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Şehir</label>
            <input type="text" placeholder="Ör: İstanbul" value={sehir} onChange={(e) => setSehir(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black" />
          </div>

          {/* İlgi alanları */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">İlgi alanları</label>
            <div className="flex flex-wrap gap-2">
              {alanlar.map((a) => (
                <button key={a} onClick={() => ilgiToggle(a)}
                  className={'px-4 py-2 rounded-lg text-sm border transition-all ' + (ilgiAlanlari.includes(a) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                  {a}
                </button>
              ))}
            </div>
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