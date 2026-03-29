'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

function MesleklerIcerik() {
  const searchParams = useSearchParams()
  const meslek = decodeURIComponent(searchParams.get('meslek') || '')
  const [mentorlar, setMentorlar] = useState([])

  useEffect(() => {
    async function getir() {
      if (!meslek) return
      const { data } = await supabase
        .from('mentorlar')
        .select('*')
        .eq('sektor', meslek)
      setMentorlar(data || [])
    }
    getir()
  }, [meslek])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
    
      <h1 className="text-2xl font-semibold text-black mb-1">{meslek} mentorları</h1>
      <p className="text-sm text-gray-400 mb-8">Bu alanda deneyimli kişilerle tanış.</p>

      {mentorlar.length === 0 ? (
        <p className="text-sm text-gray-400">Bu alanda henüz mentor yok.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {mentorlar.map((m) => (
            <a key={m.kullanici_id} href={'/mentor?id=' + m.kullanici_id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm block">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-lg font-semibold text-blue-700">
                  {m.isim ? m.isim.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="font-medium text-black">{m.isim} {m.soyisim}</p>
                  <p className="text-sm text-gray-400">{m.unvan}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{m.sektor}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{m.deneyim}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Meslekler() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<div className="p-10 text-sm text-gray-400">Yükleniyor...</div>}>
        <MesleklerIcerik />
      </Suspense>
    </main>
  )
}