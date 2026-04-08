import Navbar from '../components/Navbar'

export const metadata = {
  title: "Gizlilik Politikası | MentorMeet",
  description: "MentorMeet gizlilik politikası — kişisel verilerinizin nasıl toplandığı ve kullanıldığı hakkında bilgi.",
}

export default function Gizlilik() {
  return (
    <main className="min-h-screen" style={{backgroundColor: '#f8f7f4'}}>
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 pt-12 md:pt-20 pb-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-black mb-2">Gizlilik politikası</h1>
        <p className="text-gray-400 text-sm mb-10">Son güncelleme: Mart 2025</p>

        <div className="flex flex-col gap-8">
          {[
            {
              baslik: "1. Toplanan bilgiler",
              icerik: "MentorMeet olarak kayıt sırasında ad, soyad, e-posta adresi ve eğitim durumu gibi temel bilgileri topluyoruz. Bunların yanı sıra platform kullanımına ilişkin teknik veriler de toplanabilir."
            },
            {
              baslik: "2. Bilgilerin kullanımı",
              icerik: "Topladığımız bilgileri yalnızca platformun işleyişi için kullanıyoruz. Öğrenci-mentor eşleştirmesi, mesajlaşma ve görüşme sistemi bu veriler sayesinde çalışır. Kişisel verilerinizi üçüncü taraflarla paylaşmıyoruz."
            },
            {
              baslik: "3. Veri güvenliği",
              icerik: "Verileriniz Supabase altyapısı üzerinde güvenli biçimde saklanmaktadır. Şifreler şifrelenmiş olarak tutulur ve hiçbir zaman düz metin olarak saklanmaz."
            },
            {
              baslik: "4. Çerezler",
              icerik: "Platformumuz oturum yönetimi için çerez kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz ancak bu durumda bazı özellikler çalışmayabilir."
            },
            {
              baslik: "5. Haklarınız",
              icerik: "Kişisel verilerinize erişme, düzeltme veya silme hakkına sahipsiniz. Bu konudaki taleplerinizi iletişim sayfamız üzerinden bize iletebilirsiniz."
            },
            {
              baslik: "6. İletişim",
              icerik: "Gizlilik politikamızla ilgili sorularınız için iletisim@mentormeet.com adresine e-posta gönderebilirsiniz."
            },
          ].map((madde, i) => (
            <div key={i} className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="text-lg font-semibold text-black mb-3">{madde.baslik}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{madde.icerik}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-semibold text-black">MentorMeet</span>
          <p className="text-sm text-gray-400">© 2026 MentorMeet. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="/hakkimizda" className="text-sm text-gray-400 hover:text-black">Hakkımızda</a>
            <a href="/gizlilik" className="text-sm text-gray-400 hover:text-black">Gizlilik</a>
            <a href="/mentor-ol" className="text-sm text-gray-400 hover:text-black">Mentor ol</a>
          </div>
        </div>
      </footer>
    </main>
  )
}