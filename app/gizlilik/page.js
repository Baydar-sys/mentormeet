import Navbar from '../components/Navbar'

export default function Gizlilik() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-4xl font-semibold text-black mb-4">Gizlilik politikası</h1>
        <p className="text-gray-400 text-sm mb-12">Son güncelleme: Mart 2025</p>

        <div className="flex flex-col gap-10">

          <div>
            <h2 className="text-lg font-semibold text-black mb-3">1. Toplanan bilgiler</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              MentorMeet olarak kayıt sırasında ad, soyad, e-posta adresi ve eğitim durumu gibi temel bilgileri topluyoruz. Bunların yanı sıra platform kullanımına ilişkin teknik veriler de toplanabilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-3">2. Bilgilerin kullanımı</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Topladığımız bilgileri yalnızca platformun işleyişi için kullanıyoruz. Öğrenci-mentor eşleştirmesi, mesajlaşma ve görüşme sistemi bu veriler sayesinde çalışır. Kişisel verilerinizi üçüncü taraflarla paylaşmıyoruz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-3">3. Veri güvenliği</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Verileriniz Supabase altyapısı üzerinde güvenli biçimde saklanmaktadır. Şifreler şifrelenmiş olarak tutulur ve hiçbir zaman düz metin olarak saklanmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-3">4. Çerezler</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Platformumuz oturum yönetimi için çerez kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz ancak bu durumda bazı özellikler çalışmayabilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-3">5. Haklarınız</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Kişisel verilerinize erişme, düzeltme veya silme hakkına sahipsiniz. Bu konudaki taleplerinizi iletişim sayfamız üzerinden bize iletebilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-3">6. İletişim</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Gizlilik politikamızla ilgili sorularınız için <span className="text-black">iletisim@mentormeet.com</span> adresine e-posta gönderebilirsiniz.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="font-semibold text-black">MentorMeet</span>
          <p className="text-sm text-gray-400">© 2025 MentorMeet. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="/hakkimizda" className="text-sm text-gray-400 hover:text-black">Hakkımızda</a>
            <a href="/sss" className="text-sm text-gray-400 hover:text-black">SSS</a>
            <a href="/mentor-ol" className="text-sm text-gray-400 hover:text-black">Mentor ol</a>
          </div>
        </div>
      </footer>
    </main>
  )
}