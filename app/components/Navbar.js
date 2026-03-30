'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const [kullanici, setKullanici] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [okunmamisMesaj, setOkunmamisMesaj] = useState(0)

  async function bildirimleriGetir(userId) {
    const { data: mesajlar } = await supabase
      .from('mesajlar')
      .select('id')
      .eq('alici_id', userId)
      .eq('okundu', false)
    setOkunmamisMesaj(mesajlar?.length || 0)
  }

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.auth.getUser()
      setKullanici(data.user)
      setAvatarUrl(data.user?.user_metadata?.avatar_url || '')
      setYukleniyor(false)
      if (data.user) bildirimleriGetir(data.user.id)
    }
    getir()

    window.addEventListener('focus', getir)

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setKullanici(session?.user || null)
      setAvatarUrl(session?.user?.user_metadata?.avatar_url || '')
      setYukleniyor(false)
      if (session?.user) bildirimleriGetir(session.user.id)
    })

    return () => {
      window.removeEventListener('focus', getir)
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!kullanici) return
    const kanal = supabase
      .channel('bildirimler')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mesajlar' }, () => {
        bildirimleriGetir(kullanici.id)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mesajlar' }, () => {
        bildirimleriGetir(kullanici.id)
      })
      .subscribe()
    return () => supabase.removeChannel(kanal)
  }, [kullanici])

  const dashboardLink = kullanici?.user_metadata?.rol === 'mentor' ? '/dashboard/mentor' : '/dashboard/ogrenci'
  const profilLink = kullanici?.user_metadata?.rol === 'mentor' ? '/dashboard/mentor/profil' : '/dashboard/ogrenci/profil'

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <a href={kullanici ? dashboardLink : '/'} className="font-semibold text-lg text-black">MentorMeet</a>
      {yukleniyor ? (
        <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
      ) : kullanici ? (
        <div className="flex gap-3 items-center">
          <a href="/mesajlar" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black">
            Mesajlar
            {okunmamisMesaj > 0 && (
              <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {okunmamisMesaj}
              </span>
            )}
          </a>
          <a href={profilLink} className="flex items-center gap-2 hover:opacity-80">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700 overflow-hidden shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                kullanici.user_metadata?.isim?.charAt(0).toUpperCase()
              )}
            </div>
          </a>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            className="text-sm bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800"
          >
            Çıkış
          </button>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <a href="/giris" className="text-sm text-gray-600 hover:text-black">Giriş yap</a>
          <a href="/kayit" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Kayıt ol
          </a>
        </div>
      )}
    </nav>
  )
}