'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

const gunSirasi = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
const gunKisa = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

export default function MentorProfil() {
  const [mentor, setMentor] = useState(null)
  const [benzerMentorlar, setBenzerMentorlar] = useState([])
  const [kullanici, setKullanici] = useState(null)
  const [mesaj, setMesaj] = useState('')
  const [gonderildi, setGonderildi] = useState(false)
  const [hata, setHata] = useState('')
  const [modalAcik, setModalAcik] = useState(false)
  const [yorumlar, setYorumlar] = useState([])
  const [yeniPuan, setYeniPuan] = useState(5)
  const [yeniYorum, setYeniYorum] = useState('')
  const [yorumMesaj, setYorumMesaj] = useState('')
  const [yorumModalAcik, setYorumModalAcik] = useState(false)

  useEffect(() => {
    async function getir() {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('id')
      if (!id) return

      const { data: userData } = await supabase.auth.getUser()
      setKullanici(userData.user)

      const { data } = await supabase
        .from('mentorlar')
        .select('*')
        .eq('kullanici_id', id)
        .single()

      setMentor(data)

      const { data: yorumData } = await supabase
        .from('yorumlar')
        .select('*')
        .eq('mentor_id', id)
        .order('created_at', { ascending: false })

      setYorumlar(yorumData || [])

      if (data?.sektor) {
        const { data: benzer } = await supabase
          .from('mentorlar')
          .select('*')
          .eq('sektor', data.sektor)
          .neq('kullanici_id', id)
          .limit(3)

        setBenzerMentorlar(benzer || [])
      }
    }
    getir()
  }, [])

  async function talepGonder() {
    if (!mesaj.trim()) {
      setHata('Lütfen bir mesaj yaz.')
      return
    }

    const { data: mevcutTalep } = await supabase
      .from('talepler')
      .select('id')
      .eq('ogrenci_id', kullanici.id)
      .eq('mentor_id', mentor.kullanici_id)
      .single()

    if (mevcutTalep) {
      setHata('Bu mentora zaten bir talep gönderdiniz.')
      return
    }

    const { error } = await supabase.from('talepler').insert({
      ogrenci_id: kullanici.id,
      mentor_id: mentor.kullanici_id,
      mesaj: mesaj,
      durum: 'bekliyor',
      ogrenci_isim: kullanici.user_metadata?.isim || '',
      ogrenci_soyisim: kullanici.user_metadata?.soyisim || '',
    })

    if (error) {
      setHata('Hata: ' + error.message)
    } else {
      setGonderildi(true)
      setHata('')
    }
  }

  async function yorumGonder() {
    if (!yeniYorum.trim()) {
      setYorumMesaj('Lütfen bir yorum yaz.')
      return
    }

    const { data: mevcutYorum } = await supabase
      .from('yorumlar')
      .select('id')
      .eq('ogrenci_id', kullanici.id)
      .eq('mentor_id', mentor.kullanici_id)
      .single()

    if (mevcutYorum) {
      setYorumMesaj('Bu mentor için zaten bir değerlendirme yazdınız.')
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    const { error } = await supabase.from('yorumlar').insert({
      ogrenci_id: kullanici.id,
      mentor_id: mentor.kullanici_id,
      puan: yeniPuan,
      yorum: yeniYorum,
      ogrenci_isim: userData.user?.user_metadata?.isim || '',
      ogrenci_soyisim: userData.user?.user_metadata?.soyisim || '',
    })

    if (error) {
      setYorumMesaj('Hata: ' + error.message)
    } else {
      setYorumModalAcik(false)
      setYeniYorum('')
      setYeniPuan(5)
      const { data: yorumData } = await supabase
        .from('yorumlar')
        .select('*')
        .eq('mentor_id', mentor.kullanici_id)
        .order('created_at', { ascending: false })
      setYorumlar(yorumData || [])
    }
  }

  const ortalamaPuan = yorumlar.length > 0
    ? (yorumlar.reduce((sum, y) => sum + y.puan, 0) / yorumlar.length).toFixed(1)
    : null

  if (!mentor) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-400 text-sm">Profil yükleniyor...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-700"></div>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl font-semibold text-blue-700 overflow-hidden border-4 border-white">
                {mentor.avatar_url ? (
                  <img src={mentor.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  mentor.isim?.charAt(0).toUpperCase()
                )}
              </div>
              {kullanici && kullanici.user_metadata?.rol !== 'mentor' ? (
                <button onClick={() => setModalAcik(true)} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">
                  Görüşme talep et
                </button>
              ) : !kullanici ? (
                <a href="/giris" className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">
                  Giriş yap
                </a>
              ) : null}
            </div>
            <h1 className="text-2xl font-semibold text-black mb-1">{mentor.isim} {mentor.soyisim}</h1>
            <p className="text-gray-500 mb-4">{mentor.unvan} · {mentor.firma}</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">{mentor.sektor}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">{mentor.deneyim} deneyim</span>
              {ortalamaPuan && (
                <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full">★ {ortalamaPuan} · {yorumlar.length} değerlendirme</span>
              )}
            </div>
          </div>
        </div>

        {mentor.hakkinda && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="text-base font-semibold text-black mb-3">Hakkımda</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{mentor.hakkinda}</p>
          </div>
        )}

        {mentor.musait_gunler?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="text-base font-semibold text-black mb-4">Müsaitlik</h2>
            <div className="grid grid-cols-7 gap-2 mb-3">
              {gunSirasi.map((gun, i) => (
                <div key={gun} className="text-center">
                  <p className="text-xs text-gray-400 mb-2">{gunKisa[i]}</p>
                  <div className={'w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium ' + (mentor.musait_gunler.includes(gun) ? 'bg-black text-white' : 'bg-gray-100 text-gray-300')}>
                    {mentor.musait_gunler.includes(gun) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
            {mentor.musait_saat && (
              <p className="text-sm text-gray-500 mt-3">Saat aralığı: {mentor.musait_saat}</p>
            )}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-semibold text-black">Değerlendirmeler</h2>
              {ortalamaPuan && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-semibold text-black">{ortalamaPuan}</span>
                  <div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={'text-sm ' + (s <= Math.round(ortalamaPuan) ? 'text-yellow-400' : 'text-gray-200')}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{yorumlar.length} değerlendirme</p>
                  </div>
                </div>
              )}
            </div>
            {null}
          </div>

          {yorumlar.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Henüz değerlendirme yok. İlk sen yaz!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {yorumlar.map((y, i) => (
                <div key={i} className={i < yorumlar.length - 1 ? "pb-4 border-b border-gray-100" : ""}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {y.ogrenci_isim ? y.ogrenci_isim.charAt(0).toUpperCase() : 'Ö'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">
                          {y.ogrenci_isim ? y.ogrenci_isim.charAt(0) + '. ' + (y.ogrenci_soyisim ? y.ogrenci_soyisim.charAt(0) + '.' : '') : 'Ö.K.'}
                        </p>
                        <div className="flex gap-0.5">
                          {[...Array(y.puan)].map((_, j) => (
                            <span key={j} className="text-yellow-400 text-xs">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(y.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed ml-10">{y.yorum}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {benzerMentorlar.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-black mb-4">Benzer mentorlar</h2>
            <div className="grid grid-cols-3 gap-4">
              {benzerMentorlar.map((m) => (
                <a key={m.kullanici_id} href={'/mentor?id=' + m.kullanici_id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700 overflow-hidden shrink-0">
                      {m.avatar_url ? (
                        <img src={m.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        m.isim?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">{m.isim} {m.soyisim}</p>
                      <p className="text-xs text-gray-400">{m.unvan}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{m.sektor}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalAcik && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            {gonderildi ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Talep gönderildi!</h3>
                <p className="text-sm text-gray-400 mb-4">{mentor.isim} talebini inceleyecek.</p>
                <button onClick={() => { setModalAcik(false); setGonderildi(false); setMesaj('') }} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gray-800">Tamam</button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-black mb-1">{mentor.isim} ile görüşme talep et</h3>
                <p className="text-sm text-gray-400 mb-4">Kendini tanıt ve ne hakkında konuşmak istediğini yaz.</p>
                <textarea placeholder="Merhaba..." value={mesaj} onChange={(e) => setMesaj(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black resize-none mb-3" />
                {hata && <p className="text-sm text-red-500 mb-3">{hata}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setModalAcik(false)} className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm hover:bg-gray-50">İptal</button>
                  <button onClick={talepGonder} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm hover:bg-gray-800">Gönder</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {yorumModalAcik && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-black mb-1">{mentor.isim} için değerlendirme yaz</h3>
            <p className="text-sm text-gray-400 mb-4">Deneyimini diğer öğrencilerle paylaş.</p>
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Puan</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map((p) => (
                  <button key={p} onClick={() => setYeniPuan(p)} className={'w-10 h-10 rounded-lg text-sm font-medium border transition-all ' + (yeniPuan >= p ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200')}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <textarea placeholder="Görüşme nasıldı?" value={yeniYorum} onChange={(e) => setYeniYorum(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black resize-none mb-3" />
            {yorumMesaj && <p className="text-sm text-red-500 mb-3">{yorumMesaj}</p>}
            <div className="flex gap-3">
              <button onClick={() => setYorumModalAcik(false)} className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm hover:bg-gray-50">İptal</button>
              <button onClick={yorumGonder} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm hover:bg-gray-800">Gönder</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}