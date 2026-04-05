'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function MentorDashboard() {
  const [isim, setIsim] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [talepler, setTalepler] = useState([])
  const [onayliGorusmeler, setOnayliGorusmeler] = useState([])

  useEffect(() => {
    async function getir() {
      const { data: userData } = await supabase.auth.getUser()
      setIsim(userData.user?.user_metadata?.isim || '')

      const { data: mentorData } = await supabase
        .from('mentorlar')
        .select('avatar_url')
        .eq('kullanici_id', userData.user.id)
        .single()

      if (mentorData) setAvatarUrl(mentorData.avatar_url || '')

      const { data: talepData } = await supabase
        .from('talepler')
        .select('*')
        .eq('mentor_id', userData.user.id)
        .eq('durum', 'bekliyor')

      setTalepler(talepData || [])

      const { data: onayliData } = await supabase
        .from('talepler')
        .select('*')
        .eq('mentor_id', userData.user.id)
        .eq('durum', 'onaylandi')

      setOnayliGorusmeler(onayliData || [])
    }
    getir()
  }, [])

  async function talepGuncelle(talepId, yeniDurum) {
    const talep = talepler.find(t => t.id === talepId)

    const { error } = await supabase
      .from('talepler')
      .update({ durum: yeniDurum })
      .eq('id', talepId)

    if (!error) {
      setTalepler(talepler.filter(t => t.id !== talepId))

      const { data: mentorProfil } = await supabase
        .from('mentorlar')
        .select('isim, soyisim')
        .eq('kullanici_id', (await supabase.auth.getUser()).data.user.id)
        .single()

      const mentorIsim = mentorProfil ? mentorProfil.isim + ' ' + mentorProfil.soyisim : 'Mentor'

      if (yeniDurum === 'onaylandi') {
        setOnayliGorusmeler(prev => [...prev, { ...talep, durum: 'onaylandi' }])
        await fetch('/api/bildirim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'mehmetbaydar183@gmail.com',
            konu: 'Görüşme talebiniz onaylandı! 🎉',
            icerik: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
              <h1 style="font-size: 24px; font-weight: 600; color: #000; margin-bottom: 8px;">Talebiniz onaylandı!</h1>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 16px;"><strong>${mentorIsim}</strong> görüşme talebinizi onayladı.</p>
              <a href="https://mentormeet-phi.vercel.app/mesajlar" style="background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">Mesajlara git</a>
            </div>`
          })
        })
      } else if (yeniDurum === 'reddedildi') {
        await fetch('/api/bildirim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'mehmetbaydar183@gmail.com',
            konu: 'Görüşme talebiniz hakkında bilgi',
            icerik: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
              <h1 style="font-size: 24px; font-weight: 600; color: #000; margin-bottom: 8px;">Talep güncellemesi</h1>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">Üzgünüz, <strong>${mentorIsim}</strong> şu an için görüşme talebinizi karşılayamıyor.</p>
              <a href="https://mentormeet-phi.vercel.app/meslekler" style="background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">Diğer mentorlara bak</a>
            </div>`
          })
        })
      }
    }
  }

  return (
   <main className="min-h-screen" style={{backgroundColor: '#f8f7f4'}}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

        <div className="bg-gray-900 rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center text-xl font-semibold text-white overflow-hidden shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              isim.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-400 text-sm mb-0.5">Hoş geldin</p>
            <h1 className="text-xl font-semibold text-white truncate">{isim}</h1>
          </div>
          <a href="/dashboard/mentor/profil" className="text-xs border border-gray-600 text-gray-300 px-3 py-2 rounded-lg hover:border-gray-400 hover:text-white transition-all shrink-0">
            Düzenle
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Görüşme talepleri */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-black">Görüşme talepleri</h2>
              {talepler.length > 0 && (
                <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {talepler.length}
                </span>
              )}
            </div>
            {talepler.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-400">Henüz bekleyen talep yok.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {talepler.map((t) => (
                  <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-black">
                        {t.ogrenci_isim ? t.ogrenci_isim + ' ' + t.ogrenci_soyisim : 'Öğrenci'}
                      </p>
                      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">Bekliyor</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">{t.mesaj}</p>
                    <div className="flex gap-2">
                      <button onClick={() => talepGuncelle(t.id, 'onaylandi')} className="flex-1 text-xs bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                        Kabul et
                      </button>
                      <button onClick={() => talepGuncelle(t.id, 'reddedildi')} className="flex-1 text-xs bg-black border-gray-200 py-2 rounded-lg hover:bg-gray-50">
                        Reddet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Onaylı görüşmeler */}
          <div>
            <h2 className="text-base font-semibold text-black mb-4">Onaylı görüşmeler</h2>
            {onayliGorusmeler.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-400">Henüz onaylı görüşme yok.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {onayliGorusmeler.map((t) => (
                  <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-sm font-semibold text-green-700 shrink-0">
                      {t.ogrenci_isim ? t.ogrenci_isim.charAt(0).toUpperCase() : 'Ö'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">
                        {t.ogrenci_isim ? t.ogrenci_isim + ' ' + t.ogrenci_soyisim : 'Öğrenci'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{t.mesaj}</p>
                    </div>
                    {!t.sonlandirildi ? (
  <div className="flex gap-2 shrink-0">
    <a href="/mesajlar" className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-black hover:bg-gray-50">
      Mesaj
    </a>
    <button
      onClick={async () => {
        const { error } = await supabase.from('talepler').update({ sonlandirildi: true }).eq('id', t.id)
        if (!error) setOnayliGorusmeler(onayliGorusmeler.map(g => g.id === t.id ? { ...g, sonlandirildi: true } : g))
      }}
      className="text-xs border border-red-200 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50"
    >
      Sonlandır
    </button>
  </div>
) : (
  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full shrink-0">Tamamlandı</span>
)}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}