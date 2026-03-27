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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-2 text-black">Tekrar hoş geldin</h1>
        <p className="text-sm text-gray-400 mb-6">Hesabına giriş yap</p>
        <div className="flex flex-col gap-4" onKeyDown={(e) => e.key === 'Enter' && girisYap()}>
          <input
  type="email"
  placeholder="E-posta"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && girisYap()}
  className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black"
/>
        
          <input
  type="password"
  placeholder="Şifre"
  value={sifre}
  onChange={(e) => setSifre(e.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && girisYap()}
  className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black"
/>
          <button
            onClick={girisYap}
            className="bg-black text-white py-3 rounded-lg text-sm hover:bg-gray-800"
          >
            Giriş yap
          </button>
        </div>
        {mesaj && (
          <p className="text-sm text-gray-500 mt-4 text-center">{mesaj}</p>
        )}
        <p className="text-sm text-gray-400 text-center mt-6">
          Hesabın yok mu?{' '}
          <a href="/kayit" className="text-black underline">Kayıt ol</a>
        </p>
      </div>
    </main>
  )
}