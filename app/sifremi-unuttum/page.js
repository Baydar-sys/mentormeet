'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SifremiUnuttum() {
  const [email, setEmail] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [gonderildi, setGonderildi] = useState(false)

  async function sifreSifirla() {
    if (!email.trim()) {
      setMesaj('Lütfen e-posta adresinizi girin.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://mentormeet-phi.vercel.app/sifre-yenile'
    })

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setGonderildi(true)
    }
  }

  return (
   <main className="min-h-screen" style={{backgroundColor: '#f8f7f4'}}>
      <div className="hidden md:flex w-1/2 bg-gray-900 flex-col justify-between p-12">
        <a href="/" className="font-semibold text-white text-lg">MentorMeet</a>
        <div>
          <h2 className="text-3xl font-semibold text-white mb-4 leading-snug">Şifreni sıfırla</h2>
          <p className="text-gray-400 text-sm leading-relaxed">E-posta adresini gir, sana şifre sıfırlama bağlantısı gönderelim.</p>
        </div>
        <p className="text-xs text-gray-600">© 2025 MentorMeet</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {gonderildi ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h1 className="text-2xl font-semibold text-black mb-2">E-posta gönderildi!</h1>
              <p className="text-sm text-gray-400 mb-6">
                {email} adresine şifre sıfırlama bağlantısı gönderdik.
              </p>
              <a href="/giris" className="text-sm text-black underline">Giriş sayfasına dön</a>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-black mb-2">Şifreni unuttun mu?</h1>
                <p className="text-sm text-gray-400">Hesabına kayıtlı e-posta adresini gir.</p>
              </div>
              <div className="flex flex-col gap-3">
                <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sifreSifirla()}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black" />
                <button onClick={sifreSifirla} className="bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800">
                  Sıfırlama bağlantısı gönder
                </button>
              </div>
              {mesaj && <p className="text-sm text-gray-500 mt-4 text-center">{mesaj}</p>}
              <p className="text-sm text-gray-400 text-center mt-6">
                Şifreni hatırladın mı?{' '}
                <a href="/giris" className="text-black underline">Giriş yap</a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}