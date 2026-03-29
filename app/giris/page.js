'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Giris() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [mesaj, setMesaj] = useState('')

  async function girisYap() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: sifre
    })
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      const rol = data.user?.user_metadata?.rol
      if (rol === 'mentor') {
        window.location.href = '/dashboard/mentor'
      } else {
        window.location.href = '/dashboard/ogrenci'
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex">

      {/* Sol panel */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 flex-col justify-between p-12">
        <a href="/" className="font-semibold text-white text-lg">MentorMeet</a>
        <div>
          <h2 className="text-3xl font-semibold text-white mb-4 leading-snug">
            Tekrar hoş geldin
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Mentorlarla bağlantı kur, sorularını sor ve kariyerine doğru adımı at.
          </p>
        </div>
        <p className="text-xs text-gray-600">© 2025 MentorMeet</p>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-black mb-2">Giriş yap</h1>
            <p className="text-sm text-gray-400">
              Hesabın yok mu?{' '}
              <a href="/kayit" className="text-black underline">Kayıt ol</a>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && girisYap()}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black"
            />
            <input
              type="password"
              placeholder="Şifre"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && girisYap()}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black"
            />
            <button
              onClick={girisYap}
              className="bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 mt-1"
            >
              Giriş yap
            </button>
            <a href="/sifremi-unuttum" className="text-xs text-gray-400 hover:text-black text-center">
  Şifremi unuttum
</a>
          </div>

          {mesaj && (
            <p className="text-sm text-gray-500 mt-4 text-center">{mesaj}</p>
          )}
        </div>
      </div>
    </main>
  )
}