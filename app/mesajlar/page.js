'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

export default function Mesajlar() {
  const [kullanici, setKullanici] = useState(null)
  const [konusmalar, setKonusmalar] = useState([])
  const [aktifKisi, setAktifKisi] = useState(null)
  const [mesajlar, setMesajlar] = useState([])
  const [yeniMesaj, setYeniMesaj] = useState('')
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
          .select('isim, soyisim, kullanici_id')
          .eq('kullanici_id', kisiId)
          .single()

        if (mentorData) {
          kisiler.push({ id: kisiId, isim: mentorData.isim + ' ' + mentorData.soyisim })
        } else {
          kisiler.push({ id: kisiId, isim: 'Öğrenci' })
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
    }
    mesajlariGetir()

    const kanal = supabase
      .channel('mesajlar-kanal')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mesajlar' }, (payload) => {
        setMesajlar((prev) => [...prev, payload.new])
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
    if (error) {
      console.log('mesaj hatası:', error)
    } else {
      setYeniMesaj('')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold text-black mb-6">Mesajlar</h1>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex" style={{ height: '600px' }}>

          <div className="w-64 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-400">Konuşmalar</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {konusmalar.length === 0 ? (
                <p className="text-xs text-gray-400 p-4">Henüz onaylı görüşme yok.</p>
              ) : (
                konusmalar.map((k) => (
                  <div
                    key={k.id}
                    onClick={() => setAktifKisi(k)}
                    className={'flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ' + (aktifKisi?.id === k.id ? 'bg-gray-100' : '')}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700 shrink-0">
                      {k.isim.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-black">{k.isim}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {aktifKisi ? (
              <>
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700">
                    {aktifKisi.isim.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-black">{aktifKisi.isim}</p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                  {mesajlar.map((m, i) => (
                    <div key={i} className={'flex ' + (m.gonderen_id === kullanici.id ? 'justify-end' : 'justify-start')}>
                      <div className={'max-w-xs px-4 py-2.5 rounded-2xl text-sm ' + (m.gonderen_id === kullanici.id ? 'bg-black text-white rounded-br-sm' : 'bg-gray-100 text-black rounded-bl-sm')}>
                        {m.icerik}
                      </div>
                    </div>
                  ))}
                  <div ref={altRef} />
                </div>

                <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
                  <input
                    type="text"
                    placeholder="Mesaj yaz..."
                    value={yeniMesaj}
                    onChange={(e) => setYeniMesaj(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && mesajGonder()}
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black outline-none focus:border-black"
                  />
                  <button
                    onClick={mesajGonder}
                    className="bg-black text-white px-4 py-2.5 rounded-lg text-sm hover:bg-gray-800"
                  >
                    Gönder
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400">Soldaki listeden bir konuşma seç.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}