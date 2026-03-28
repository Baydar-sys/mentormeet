'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function OgrenciDashboard() {
  const [isim, setIsim] = useState('')

  useEffect(() => {
    async function kullaniciyiGetir() {
      const { data } = await supabase.auth.getUser()
      setIsim(data.user?.user_metadata?.isim || '')
    }
    kullaniciyiGetir()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-black mb-1">Meslekleri keşfet</h1>
        <p className="text-gray-400 text-sm mb-8">Seni ilgilendiren bir alana tıkla, o meslekten bir mentorla tanış.</p>

        <input
          type="text"
          placeholder="Meslek veya alan ara..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-black mb-8"
        />

        <div className="grid grid-cols-3 gap-4">
          {[
            { isim: "Yazılım mühendisi", alan: "Teknoloji", mentor: "12 mentor", renk: "bg-blue-50 text-blue-700" },
            { isim: "Doktor", alan: "Sağlık", mentor: "8 mentor", renk: "bg-green-50 text-green-700" },
            { isim: "Mimar", alan: "Tasarım", mentor: "5 mentor", renk: "bg-purple-50 text-purple-700" },
            { isim: "Avukat", alan: "Hukuk", mentor: "6 mentor", renk: "bg-orange-50 text-orange-700" },
            { isim: "Öğretmen", alan: "Eğitim", mentor: "9 mentor", renk: "bg-yellow-50 text-yellow-700" },
            { isim: "Psikolog", alan: "Sağlık", mentor: "4 mentor", renk: "bg-pink-50 text-pink-700" },
            { isim: "Finans uzmanı", alan: "Finans", mentor: "7 mentor", renk: "bg-emerald-50 text-emerald-700" },
            { isim: "Gazeteci", alan: "Medya", mentor: "3 mentor", renk: "bg-red-50 text-red-700" },
            { isim: "Girişimci", alan: "İş dünyası", mentor: "11 mentor", renk: "bg-indigo-50 text-indigo-700" },
          ].map((meslek) => (
            <a key={meslek.isim} href={'/meslekler?meslek=' + encodeURIComponent(meslek.alan)} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm block">
              <span className={'text-xs px-2 py-1 rounded-full font-medium ' + meslek.renk}>
                {meslek.alan}
              </span>
              <h3 className="font-medium text-black mt-3 mb-1">{meslek.isim}</h3>
              <p className="text-sm text-gray-400">{meslek.mentor}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}