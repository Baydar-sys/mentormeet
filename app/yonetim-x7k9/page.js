'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const ADMIN_EMAIL = 'mehmetbaydar183@gmail.com'

export default function Admin() {
  const [kullanici, setKullanici] = useState(null)
  const [aktifSekme, setAktifSekme] = useState('istatistik')
  const [istatistik, setIstatistik] = useState({ mentor: 0, gorusme: 0, basvuru: 0 })
  const [basvurular, setBasvurular] = useState([])
  const [talepler, setTalepler] = useState([])
  const [mentorlar, setMentorlar] = useState([])

  useEffect(() => {
    async function getir() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        window.location.href = '/giris'
        return
      }
      if (userData.user.user_metadata?.rol !== 'admin' && userData.user.email !== ADMIN_EMAIL) {
        window.location.href = '/'
        return
      }
      setKullanici(userData.user)

      const { count: mentorSayisi } = await supabase.from('mentorlar').select('*', { count: 'exact', head: true })
      const { count: gorusmeSayisi } = await supabase.from('talepler').select('*', { count: 'exact', head: true }).eq('durum', 'onaylandi')
      const { count: basvuruSayisi } = await supabase.from('mentor_basvurulari').select('*', { count: 'exact', head: true }).eq('durum', 'bekliyor')

      setIstatistik({
        mentor: mentorSayisi || 0,
        gorusme: gorusmeSayisi || 0,
        basvuru: basvuruSayisi || 0,
      })

      const { data: basvuruData } = await supabase.from('mentor_basvurulari').select('*').order('created_at', { ascending: false })
      setBasvurular(basvuruData || [])

      const { data: talepData } = await supabase.from('talepler').select('*').order('id', { ascending: false })
      setTalepler(talepData || [])

      const { data: mentorData } = await supabase.from('mentorlar').select('*').order('isim')
      setMentorlar(mentorData || [])
    }
    getir()
  }, [])

  async function basvuruGuncelle(id, yeniDurum) {
    const basvuru = basvurular.find(b => b.id === id)

    await supabase.from('mentor_basvurulari').update({ durum: yeniDurum }).eq('id', id)

    if (yeniDurum === 'onaylandi' && basvuru) {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: basvuru.email,
          isim: basvuru.isim,
          soyisim: basvuru.soyisim,
          unvan: basvuru.unvan,
          firma: basvuru.firma,
          sektor: basvuru.sektor,
          deneyim: basvuru.deneyim,
        })
      })
      const data = await res.json()
      if (data.error) {
        alert('Hata: ' + data.error)
        return
      }
      alert(basvuru.email + ' adresine davet e-postası gönderildi!')
    }

    setBasvurular(basvurular.map(b => b.id === id ? { ...b, durum: yeniDurum } : b))
  }

  if (!kullanici) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Yükleniyor...</p>
      </main>
    )
  }

  function durumRenk(durum) {
    if (durum === 'onaylandi') return 'bg-green-50 text-green-700'
    if (durum === 'reddedildi') return 'bg-red-50 text-red-700'
    return 'bg-yellow-50 text-yellow-700'
  }

  function durumYazi(durum) {
    if (durum === 'onaylandi') return 'Onaylandı'
    if (durum === 'reddedildi') return 'Reddedildi'
    return 'Bekliyor'
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold text-lg text-black">MentorMeet Admin</span>
        <a href="/" className="text-sm text-gray-500 hover:text-black">Siteye dön</a>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {[
            { id: 'istatistik', label: 'İstatistikler' },
            { id: 'basvurular', label: `Başvurular ${istatistik.basvuru > 0 ? '(' + istatistik.basvuru + ')' : ''}` },
            { id: 'talepler', label: 'Talepler' },
            { id: 'mentorlar', label: 'Mentorlar' },
          ].map((s) => (
            <button key={s.id} onClick={() => setAktifSekme(s.id)}
              className={'px-4 py-2.5 text-sm font-medium border-b-2 transition-all ' + (aktifSekme === s.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black')}>
              {s.label}
            </button>
          ))}
        </div>

        {aktifSekme === 'istatistik' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Aktif mentor', deger: istatistik.mentor },
              { label: 'Onaylı görüşme', deger: istatistik.gorusme },
              { label: 'Bekleyen başvuru', deger: istatistik.basvuru },
            ].map((k) => (
              <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-3xl font-semibold text-black mb-1">{k.deger}</p>
                <p className="text-sm text-gray-400">{k.label}</p>
              </div>
            ))}
          </div>
        )}

        {aktifSekme === 'basvurular' && (
          <div className="flex flex-col gap-4">
            {basvurular.length === 0 ? (
              <p className="text-sm text-gray-400">Henüz başvuru yok.</p>
            ) : (
              basvurular.map((b) => (
                <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-black">{b.isim} {b.soyisim}</p>
                      <p className="text-sm text-gray-400">{b.email} · {b.unvan} · {b.firma}</p>
                    </div>
                    <span className={'text-xs px-2 py-1 rounded-full font-medium ' + durumRenk(b.durum)}>
                      {durumYazi(b.durum)}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{b.sektor}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{b.deneyim}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{b.motivasyon}</p>
                  {b.linkedin && (
                    <a href={b.linkedin} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mb-4 block">
                      LinkedIn profili →
                    </a>
                  )}
                  {b.durum === 'bekliyor' && (
                    <div className="flex gap-2">
                      <button onClick={() => basvuruGuncelle(b.id, 'onaylandi')} className="flex-1 text-xs bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                        Onayla
                      </button>
                      <button onClick={() => basvuruGuncelle(b.id, 'reddedildi')} className="flex-1 text-xs border border-gray-200 py-2 rounded-lg hover:bg-stone-50">
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {aktifSekme === 'talepler' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Mesaj</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Durum</th>
                </tr>
              </thead>
              <tbody>
                {talepler.map((t, i) => (
                  <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                    <td className="px-4 py-3 text-xs text-gray-400">{t.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{t.mesaj}</td>
                    <td className="px-4 py-3">
                      <span className={'text-xs px-2 py-1 rounded-full font-medium ' + durumRenk(t.durum)}>
                        {durumYazi(t.durum)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {aktifSekme === 'mentorlar' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">İsim</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Unvan</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Sektör</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Deneyim</th>
                </tr>
              </thead>
              <tbody>
                {mentorlar.map((m, i) => (
                  <tr key={m.kullanici_id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                    <td className="px-4 py-3 font-medium text-black">{m.isim} {m.soyisim}</td>
                    <td className="px-4 py-3 text-gray-500">{m.unvan}</td>
                    <td className="px-4 py-3">
                      {m.sektor && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{m.sektor}</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{m.deneyim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  )
}