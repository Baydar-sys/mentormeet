import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const { to, konu, icerik } = await request.json()

  const { error } = await resend.emails.send({
    from: 'MentorMeet <onboarding@resend.dev>',
    to,
    subject: konu,
    html: icerik
  })

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json({ success: true })
}