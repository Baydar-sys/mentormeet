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
    <main className="min-h-screen bg-gray-50 flex">

      {/* Sol panel */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 flex-col justify-between p-12">
        <a href="/" className="font-semibold text-white text-lg">MentorMeet</a>
        <div>
          <h2 className="text-3xl font-semibold text-white mb-4 leading-snug">
            Doğru kararı vermek için doğru insanlarla konuş
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            50'den fazla alanda deneyimli mentor, üniversite seçiminde sana rehberlik etmek için burada.
          </p>
          <div className="flex gap-8 mt-10">
            <div>
              <p className="text-2xl font-semibold text-white">50+</p>
              <p className="text-xs text-gray-400 mt-1">Aktif mentor</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">500+</p>
              <p className="text-xs text-gray-400 mt-1">Görüşme yapıldı</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">20+</p>
              <p className="text-xs text-gray-400 mt-1">Farklı meslek</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600">© 2025 MentorMeet</p>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-black mb-2">Hesap oluştur</h1>
            <p className="text-sm text-gray-400">Zaten hesabın var mı? <a href="/giris" className="text-black underline">Giriş yap</a></p>
          </div>

          {/* Rol seçimi */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setRol('ogrenci')}
              className={'flex-1 py-3 rounded-xl text-sm border-2 transition-all ' + (rol === 'ogrenci' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400')}
            >
              Öğrenci
            </button>
            <button
              onClick={() => setRol('mentor')}
              className={'flex-1 py-3 rounded-xl text-sm border-2 transition-all ' + (rol === 'mentor' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400')}
            >
              Mentor
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Adın"
                value={isim}
                onChange={(e) => setIsim(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Soyadın"
                value={soyisim}
                onChange={(e) => setSoyisim(e.target.value)}
                className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black"
              />
            </div>

            {rol === 'ogrenci' && (
              <div className="flex gap-2">
                {['Lise', 'Üniversite', 'Mezun'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setEgitim(s)}
                    className={'flex-1 py-3 rounded-xl text-sm border transition-all ' + (egitim === s ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}
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
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black"
            />
            <input
              type="password"
              placeholder="Şifre"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && kayitOl()}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black"
            />
            <button
              onClick={kayitOl}
              className="bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 mt-1"
            >
              Kayıt ol
            </button>
          </div>

          {mesaj && (
            <p className="text-sm text-gray-500 mt-4 text-center">{mesaj}</p>
          )}
        </div>
      </div>
    </main>
  )
}