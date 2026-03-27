'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Kayit() {
  const [isim, setIsim] = useState('')
  const [soyisim, setSoyisim] = useState('')
  const [egitim, setEgitim] = useState('')
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [rol, setRol] = useState('')
  const [mesaj, setMesaj] = useState('')

  async function kayitOl() {
    if (!rol) {
      setMesaj('Lütfen bir rol seçin.')
      return
    }
    const { error } = await supabase.auth.signUp({
      email,
      password: sifre,
      options: { data: { rol, isim, soyisim, egitim } }
    })
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('Kayıt başarılı! E-postanı kontrol et.')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-2 text-black">MentorMeet'e katıl</h1>
        <p className="text-sm text-gray-400 mb-6">Rolünü seç ve hemen başla</p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => { setRol('ogrenci'); setEgitim('') }}
            className={`flex-1 py-3 rounded-lg text-sm border transition-all ${
              rol === 'ogrenci'
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Öğrenci
          </button>
          <button
            onClick={() => { setRol('mentor'); setEgitim('') }}
            className={`flex-1 py-3 rounded-lg text-sm border transition-all ${
              rol === 'mentor'
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Mentor
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="İsim"
              value={isim}
              onChange={(e) => setIsim(e.target.value)}
              className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black"
            />
            <input
              type="text"
              placeholder="Soyisim"
              value={soyisim}
              onChange={(e) => setSoyisim(e.target.value)}
              className="w-1/2 border border-gray-200 rounded-lg px-3 py-3 text-sm text-black outline-none focus:border-black"
            />
          </div>

          {rol === 'ogrenci' && (
            <div className="flex gap-2">
              {['Lise', 'Üniversite', 'Mezun'].map((s) => (
                <button
                  key={s}
                  onClick={() => setEgitim(s)}
                  className={`flex-1 py-3 rounded-lg text-sm border transition-all ${
                    egitim === s
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black"
          />
          <button
            onClick={kayitOl}
            className="bg-black text-white py-3 rounded-lg text-sm hover:bg-gray-800"
          >
            Kayıt ol
          </button>
        </div>

        {mesaj && (
          <p className="text-sm text-gray-500 mt-4 text-center">{mesaj}</p>
        )}

        <p className="text-sm text-gray-400 text-center mt-6">
          Zaten hesabın var mı?{' '}
          <a href="/giris" className="text-black underline">Giriş yap</a>
        </p>
      </div>
    </main>
  )
}