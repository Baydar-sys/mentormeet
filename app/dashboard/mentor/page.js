'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function MentorDashboard() {
  const [isim, setIsim] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [talepler, setTalepler] = useState([])
  const [randevular] = useState([
    { isim: "Selin T.", tarih: "Bugün", saat: "15:00", durum: "Onaylı" },
    { isim: "Burak D.", tarih: "Yarın", saat: "11:00", durum: "Bekliyor" },
    { isim: "Ayşe M.", tarih: "29 Mart", saat: "14:00", durum: "Onaylı" },
  ])

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
    }
    getir()
  }, [])

  async function talepGuncelle(talepId, yeniDurum) {
    const { error } = await supabase
      .from('talepler')
      .update({ durum: yeniDurum })
      .eq('id', talepId)

    if (!error) {
      setTalepler(talepler.filter(t => t.id !== talepId))
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">

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
                      <p className="text-sm font-medium text-black">Öğrenci</p>
                      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">Bekliyor</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">{t.mesaj}</p>
                    <div className="flex gap-2">
                      <button onClick={() => talepGuncelle(t.id, 'onaylandi')} className="flex-1 text-xs bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                        Kabul et
                      </button>
                      <button onClick={() => talepGuncelle(t.id, 'reddedildi')} className="flex-1 text-xs border border-gray-200 py-2 rounded-lg hover:bg-gray-50">
                        Reddet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-base font-semibold text-black mb-4">Randevular</h2>
            <div className="flex flex-col gap-3">
              {randevular.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 overflow-hidden">
                  <div className="text-center min-w-12 bg-gray-50 rounded-lg py-2 shrink-0">
                    <p className="text-xs text-gray-400">{r.tarih}</p>
                    <p className="text-sm font-semibold text-black">{r.saat}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{r.isim}</p>
                    <p className="text-xs text-gray-400">Görüntülü görüşme</p>
                  </div>
                  <span className={'text-xs px-2 py-1 rounded-full font-medium shrink-0 ' + (r.durum === 'Onaylı' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700')}>
                    {r.durum}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}