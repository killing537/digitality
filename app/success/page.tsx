export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-green-100 p-6 rounded-full mb-6">
        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-black mb-2">Pembayaran Berhasil!</h1>
      <p className="text-gray-500 mb-8">Terima kasih telah berbelanja di DigiPay. Produk Anda sedang diproses.</p>
      <a href="/" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold">Kembali ke Beranda</a>
    </div>
  );
}
