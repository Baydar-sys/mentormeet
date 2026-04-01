import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request) {
  const { email, isim, soyisim, unvan, firma, sektor, deneyim } = await request.json()

  const { data: userData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: {
      rol: 'mentor',
      isim,
      soyisim,
    },
    redirectTo: 'https://mentormeet-phi.vercel.app/sifre-yenile'
  })

  if (inviteError) {
    return Response.json({ error: inviteError.message }, { status: 500 })
  }

  await supabaseAdmin.from('mentorlar').upsert({
    kullanici_id: userData.user.id,
    isim,
    soyisim,
    unvan,
    firma,
    sektor,
    deneyim,
  }, { onConflict: 'kullanici_id' })

  return Response.json({ success: true })
}