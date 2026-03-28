'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const [kullanici, setKullanici] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.auth.getUser()
      setKullanici(data.user)
      setYukleniyor(false)
    }
    getir()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setKullanici(session?.user || null)
      setYukleniyor(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const dashboardLink = kullanici?.user_metadata?.rol === 'mentor' ? '/dashboard/mentor' : '/dashboard/ogrenci'

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <a href="/" className="font-semibold text-lg text-black">MentorMeet</a>
      {yukleniyor ? (
        <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
      ) : kullanici ? (
        <div className="flex gap-4 items-center">
          <a href="/mesajlar" className="text-sm text-gray-600 hover:text-black">Mesajlar</a>
          <a href={dashboardLink} className="text-sm text-gray-600 hover:text-black">Dashboard</a>
          <span className="text-sm text-gray-500">{kullanici.user_metadata?.isim}</span>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Çıkış yap
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