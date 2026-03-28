'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function MentorDashboard() {
  const [isim, setIsim] = useState('')
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

      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-600">
            {isim.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-black">{isim}</h1>
            <p className="text-sm text-gray-400 mt-1">Profilini tamamla — öğrenciler seni daha kolay bulsun</p>
          </div>
          <a href="/dashboard/mentor/profil" className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            Profili düzenle
          </a>
        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <h2 className="text-base font-semibold text-black mb-4">
              Görüşme talepleri
              {talepler.length > 0 && (
                <span className="ml-2 text-xs bg-black text-white px-2 py-0.5 rounded-full">{talepler.length}</span>
              )}
            </h2>
            {talepler.length === 0 ? (
              <p className="text-sm text-gray-400">Henüz bekleyen talep yok.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {talepler.map((t) => (
                  <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-black">Öğrenci</p>
                      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">Bekliyor</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{t.mesaj}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => talepGuncelle(t.id, 'onaylandi')}
                        className="flex-1 text-xs bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                      >
                        Kabul et
                      </button>
                      <button
                        onClick={() => talepGuncelle(t.id, 'reddedildi')}
                        className="flex-1 text-xs border border-gray-200 py-2 rounded-lg hover:bg-gray-50"
                      >
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
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="text-center min-w-12">
                    <p className="text-xs text-gray-400">{r.tarih}</p>
                    <p className="text-base font-semibold text-black">{r.saat}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">{r.isim}</p>
                    <p className="text-xs text-gray-400">Görüntülü görüşme</p>
                  </div>
                  <span className={'text-xs px-2 py-1 rounded-full font-medium ' + (r.durum === 'Onaylı' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700')}>
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