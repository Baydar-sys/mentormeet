'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function OgrenciDashboard() {
  const [isim, setIsim] = useState('')
  const [egitim, setEgitim] = useState('')
  const [arama, setArama] = useState('')

  const meslekler = [
    { isim: "Yazılım mühendisi", alan: "Teknoloji", renk: "bg-blue-50 text-blue-700", mentor: "12" },
    { isim: "Doktor", alan: "Sağlık", renk: "bg-green-50 text-green-700", mentor: "8" },
    { isim: "Mimar", alan: "Tasarım", renk: "bg-purple-50 text-purple-700", mentor: "5" },
    { isim: "Avukat", alan: "Hukuk", renk: "bg-orange-50 text-orange-700", mentor: "6" },
    { isim: "Öğretmen", alan: "Eğitim", renk: "bg-yellow-50 text-yellow-700", mentor: "9" },
    { isim: "Psikolog", alan: "Sağlık", renk: "bg-pink-50 text-pink-700", mentor: "4" },
    { isim: "Finans uzmanı", alan: "Finans", renk: "bg-emerald-50 text-emerald-700", mentor: "7" },
    { isim: "Gazeteci", alan: "Medya", renk: "bg-red-50 text-red-700", mentor: "3" },
    { isim: "Girişimci", alan: "İş dünyası", renk: "bg-indigo-50 text-indigo-700", mentor: "11" },
  ]

  const filtrelenmis = meslekler.filter(m =>
    m.isim.toLowerCase().includes(arama.toLowerCase()) ||
    m.alan.toLowerCase().includes(arama.toLowerCase())
  )

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.auth.getUser()
      setIsim(data.user?.user_metadata?.isim || '')
      setEgitim(data.user?.user_metadata?.egitim || '')
    }
    getir()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-gray-900 rounded-2xl p-8 mb-8 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm mb-1">Hoş geldin</p>
            <h1 className="text-2xl font-semibold text-white mb-2">{isim}</h1>
            {egitim && <span className="text-xs text-gray-300 px-3 py-1 rounded-full border border-gray-700">{egitim}</span>}
          </div>
         
        </div>
        <div className="mb-6">
          <input type="text" placeholder="Meslek veya alan ara..." value={arama} onChange={(e) => setArama(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black bg-white" />
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-black">Meslekleri keşfet</h2>
          <a href="/meslekler" className="text-sm text-gray-400 hover:text-black">Tüm mentorlar</a>
        </div>
        {filtrelenmis.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">Sonuç bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtrelenmis.map((m) => <a key={m.isim} href={'/meslekler?meslek=' + encodeURIComponent(m.alan)} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm block"><span className={'text-xs px-2 py-1 rounded-full font-medium ' + m.renk}>{m.alan}</span><h3 className="font-medium text-black mt-3 mb-1">{m.isim}</h3><p className="text-sm text-gray-400">{m.mentor} mentor</p></a>)}
          </div>
        )}
      </div>
    </main>
  )
}