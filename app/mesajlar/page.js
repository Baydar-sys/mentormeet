'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

function zamanFarki(tarih) {
  const simdi = new Date()
  const mesajTarihi = new Date(tarih)
  const fark = Math.floor((simdi - mesajTarihi) / 1000)
  if (fark < 60) return 'Az önce'
  if (fark < 3600) return Math.floor(fark / 60) + ' dk'
  if (fark < 86400) return Math.floor(fark / 3600) + ' sa'
  return Math.floor(fark / 86400) + ' gün'
}

export default function Mesajlar() {
  const [kullanici, setKullanici] = useState(null)
  const [konusmalar, setKonusmalar] = useState([])
  const [aktifKisi, setAktifKisi] = useState(null)
  const [mesajlar, setMesajlar] = useState([])
  const [yeniMesaj, setYeniMesaj] = useState('')
  const [solPanelAcik, setSolPanelAcik] = useState(true)
  const altRef = useRef(null)

  useEffect(() => {
    async function getir() {
      const { data: userData } = await supabase.auth.getUser()
      setKullanici(userData.user)

      const { data: talepler } = await supabase
        .from('talepler')
        .select('*')
        .or(`ogrenci_id.eq.${userData.user.id},mentor_id.eq.${userData.user.id}`)
        .eq('durum', 'onaylandi')

      const kisiler = []
      for (const t of talepler || []) {
        const kisiId = t.ogrenci_id === userData.user.id ? t.mentor_id : t.ogrenci_id
        const { data: mentorData } = await supabase
          .from('mentorlar')
          .select('isim, soyisim, kullanici_id, avatar_url')
          .eq('kullanici_id', kisiId)
          .single()

        if (mentorData) {
          kisiler.push({ id: kisiId, isim: mentorData.isim + ' ' + mentorData.soyisim, avatar_url: mentorData.avatar_url || '' })
        } else {
          const ogrenciIsim = t.ogrenci_isim && t.ogrenci_soyisim
            ? t.ogrenci_isim + ' ' + t.ogrenci_soyisim
            : t.ogrenci_isim || 'Öğrenci'
          kisiler.push({ id: kisiId, isim: ogrenciIsim, avatar_url: '' })
        }
      }
      setKonusmalar(kisiler)
    }
    getir()
  }, [])

  useEffect(() => {
    if (!aktifKisi || !kullanici) return

    async function mesajlariGetir() {
      const { data } = await supabase
        .from('mesajlar')
        .select('*')
        .or(`and(gonderen_id.eq.${kullanici.id},alici_id.eq.${aktifKisi.id}),and(gonderen_id.eq.${aktifKisi.id},alici_id.eq.${kullanici.id})`)
        .order('created_at', { ascending: true })

      setMesajlar(data || [])

      await supabase
        .from('mesajlar')
        .update({ okundu: true })
        .eq('alici_id', kullanici.id)
        .eq('gonderen_id', aktifKisi.id)

      window.dispatchEvent(new Event('focus'))
    }
    mesajlariGetir()

    const kanal = supabase
      .channel('mesajlar-kanal-' + aktifKisi.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mesajlar' }, (payload) => {
        setMesajlar((prev) => [...prev, payload.new])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mesajlar' }, (payload) => {
        setMesajlar((prev) => prev.map(m => m.id === payload.new.id ? payload.new : m))
      })
      .subscribe()

    return () => supabase.removeChannel(kanal)
  }, [aktifKisi, kullanici])

  useEffect(() => {
    altRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mesajlar])

  async function mesajGonder() {
    if (!yeniMesaj.trim()) return
    const { error } = await supabase.from('mesajlar').insert({
      gonderen_id: kullanici.id,
      alici_id: aktifKisi.id,
      icerik: yeniMesaj
    })
    if (!error) setYeniMesaj('')
  }

  function konusmaAc(k) {
    setAktifKisi(k)
    setSolPanelAcik(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <h1 className="text-xl font-semibold text-black mb-4 md:mb-6">Mesajlar</h1>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex" style={{ height: '600px' }}>

          <div className={`${solPanelAcik ? 'flex' : 'hidden'} md:flex w-full md:w-72 border-r border-gray-100 flex-col shrink-0`}>
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Konuşmalar</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {konusmalar.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-gray-400 text-xl">💬</span>
                  </div>
                  <p className="text-sm text-gray-400">Henüz onaylı görüşme yok.</p>
                  <p className="text-xs text-gray-300 mt-1">Mentor talebin onaylandığında burada görünür.</p>
                </div>
              ) : (
                konusmalar.map((k) => (
                  <div
                    key={k.id}
                    onClick={() => konusmaAc(k)}
                    className={'flex items-center gap-3 px-5 py-4 cursor-pointer transition-all ' + (aktifKisi?.id === k.id ? 'bg-gray-50 border-r-2 border-black' : 'hover:bg-gray-50')}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700 shrink-0 overflow-hidden">
                      {k.avatar_url ? (
                        <img src={k.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        k.isim.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{k.isim}</p>
                      <p className="text-xs text-gray-400">Görüşme onaylandı</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${!solPanelAcik ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
            {aktifKisi ? (
              <>
                <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                  <button onClick={() => setSolPanelAcik(true)} className="md:hidden text-gray-400 hover:text-black mr-1">←</button>
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700 overflow-hidden shrink-0">
                    {aktifKisi.avatar_url ? (
                      <img src={aktifKisi.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      aktifKisi.isim.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{aktifKisi.isim}</p>
                    <p className="text-xs text-gray-400">Çevrimiçi</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-4 bg-gray-50">
                  {mesajlar.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-3">
                        <span className="text-gray-400 text-xl">👋</span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Henüz mesaj yok</p>
                      <p className="text-xs text-gray-400 mt-1">İlk mesajı sen gönder!</p>
                    </div>
                  ) : (
                    mesajlar.map((m, i) => (
                      <div key={i} className={'flex flex-col ' + (m.gonderen_id === kullanici.id ? 'items-end' : 'items-start')}>
                        <div className={'max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ' + (m.gonderen_id === kullanici.id ? 'bg-black text-white rounded-br-sm' : 'bg-white text-black rounded-bl-sm border border-gray-100 shadow-sm')}>
                          {m.icerik}
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-xs text-gray-400">{zamanFarki(m.created_at)}</span>
                          {m.gonderen_id === kullanici.id && (
                            <span className="text-xs text-gray-400">{m.okundu ? '· Okundu' : '· İletildi'}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={altRef} />
                </div>

                <div className="px-4 md:px-6 py-4 border-t border-gray-100 bg-white flex gap-3">
                  <input
                    type="text"
                    placeholder="Mesaj yaz..."
                    value={yeniMesaj}
                    onChange={(e) => setYeniMesaj(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && mesajGonder()}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black outline-none focus:border-black"
                  />
                  <button onClick={mesajGonder} className="bg-black text-white px-4 py-2.5 rounded-xl text-sm hover:bg-gray-800 font-medium shrink-0">
                    Gönder
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Mesajlaşmaya başla</p>
                <p className="text-xs text-gray-400">Soldaki listeden bir konuşma seç.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}