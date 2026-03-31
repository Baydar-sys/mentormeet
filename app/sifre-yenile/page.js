'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function SifreYenile() {
  const [sifre, setSifre] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [tamamlandi, setTamamlandi] = useState(false)
  const [hazir, setHazir] = useState(false)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setHazir(true)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setHazir(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function sifreGuncelle() {
    if (!sifre.trim()) {
      setMesaj('Lütfen yeni şifrenizi girin.')
      return
    }
    if (sifre.length < 6) {
      setMesaj('Şifre en az 6 karakter olmalı.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: sifre })

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setTamamlandi(true)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex w-1/2 bg-gray-900 flex-col justify-between p-12">
        <a href="/" className="font-semibold text-white text-lg">MentorMeet</a>
        <div>
          <h2 className="text-3xl font-semibold text-white mb-4 leading-snug">Yeni şifre belirle</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Güçlü bir şifre seç ve hesabını güvende tut.</p>
        </div>
        <p className="text-xs text-gray-600">© 2025 MentorMeet</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {tamamlandi ? (
            <div className="text-center">
  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
    <span className="text-green-600 text-3xl">🎉</span>
  </div>
  <h1 className="text-2xl font-semibold text-black mb-2">MentorMeet'e hoş geldin!</h1>
  <p className="text-gray-500 text-sm leading-relaxed mb-2">
    Artık resmi bir MentorMeet mentörüsün.
  </p>
  <p className="text-gray-400 text-sm leading-relaxed mb-8">
    Profilini tamamla, öğrencilerden görüşme talepleri almaya başla ve deneyimlerini paylaş.
  </p>
  <div className="flex flex-col gap-3">
    <a href="/giris" className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800">
      Panele giriş yap
    </a>
    <a href="/mentor-ol" className="text-sm text-gray-400 hover:text-black">
      Mentor ol sayfasına dön
    </a>
  </div>
</div>
          ) : !hazir ? (
            <div className="text-center">
              <p className="text-sm text-gray-400">Bağlantı doğrulanıyor...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-black mb-2">Yeni şifre belirle</h1>
                <p className="text-sm text-gray-400">En az 6 karakter olmalı.</p>
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="Yeni şifre"
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sifreGuncelle()}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
                <button
                  onClick={sifreGuncelle}
                  className="bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800"
                >
                  Şifremi güncelle
                </button>
              </div>
              {mesaj && <p className="text-sm text-gray-500 mt-4 text-center">{mesaj}</p>}
            </>
          )}
        </div>
      </div>
    </main>
  )
}