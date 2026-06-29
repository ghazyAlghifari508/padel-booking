# Acceptance Criteria — CourtFlow Padel Court Booking Automation System

**Versi:** 1.0  
**Status:** Draft lengkap untuk MVP  
**Produk:** CourtFlow  
**Jenis:** Padel court booking app, admin dashboard, n8n automation system  
**Backend:** Go  
**Automation:** n8n  
**Tanggal:** 29 Juni 2026  

---

# Scope

CourtFlow adalah aplikasi web untuk booking lapangan padel. Aplikasi memiliki sisi user, sisi admin, backend API menggunakan Go, database PostgreSQL, dan integrasi n8n untuk automation seperti email confirmation, notifikasi admin, Google Calendar event, Google Sheets logging, reminder, dan daily report.

Acceptance criteria ini menjadi acuan untuk menentukan apakah fitur CourtFlow sudah selesai, valid, dan layak dianggap done.

---

# Glossary

| Term | Meaning |
|---|---|
| User | Pengguna yang melakukan booking lapangan padel |
| Admin | Pengelola lapangan yang mengatur booking, lapangan, pembayaran, dan automation logs |
| Court | Lapangan padel yang dapat dibooking |
| Slot | Rentang waktu booking, misalnya 08:00–09:00 |
| Booking | Data pemesanan lapangan oleh user |
| Pending Payment | Booking sudah dibuat tetapi belum dibayar atau belum dikonfirmasi |
| Confirmed | Booking sudah valid dan slot terkunci |
| Cancelled | Booking dibatalkan oleh user atau admin |
| Expired | Booking melewati batas pembayaran atau batas konfirmasi |
| Completed | Booking sudah selesai digunakan |
| Automation Log | Catatan hasil workflow n8n |
| Active Booking | Booking dengan status pending_payment atau confirmed |
| Overlap | Kondisi ketika dua booking memakai court, tanggal, dan jam yang bertabrakan |

---

# 1. Authentication

## AC-1.1 Register User

Given pengunjung berada di halaman register.  
When pengunjung mengisi nama, email, nomor HP, dan password yang valid.  
Then sistem membuat akun user baru.  
And user dapat login menggunakan akun tersebut.

## AC-1.2 Duplicate Email

Given email sudah pernah terdaftar.  
When pengunjung mencoba register dengan email yang sama.  
Then sistem menolak registrasi.  
And sistem menampilkan pesan error yang jelas.

## AC-1.3 Login Valid

Given user memiliki akun yang valid.  
When user memasukkan email dan password yang benar.  
Then sistem berhasil login.  
And sistem mengembalikan access token dan refresh token.  
And user diarahkan ke halaman utama atau dashboard sesuai role.

## AC-1.4 Login Invalid

Given user memasukkan email atau password yang salah.  
When user menekan tombol login.  
Then sistem menolak login.  
And sistem tidak memberikan token.  
And sistem menampilkan pesan error yang jelas.

## AC-1.5 Logout

Given user sedang login.  
When user menekan tombol logout.  
Then sistem menghapus session atau token yang aktif.  
And user diarahkan kembali ke halaman login atau landing page.

## AC-1.6 Protected Route

Given user belum login.  
When user mencoba membuka halaman protected seperti `/my-bookings`.  
Then sistem mengarahkan user ke halaman login.

## AC-1.7 Admin Route Protection

Given user biasa sudah login.  
When user mencoba mengakses route admin seperti `/admin/bookings`.  
Then sistem menolak akses.  
And backend mengembalikan response forbidden.

---

# 2. Role & Authorization

## AC-2.1 Role User

Given akun memiliki role user.  
When user mengakses aplikasi.  
Then user hanya dapat melihat data miliknya sendiri.  
And user tidak dapat mengakses fitur admin.

## AC-2.2 Role Admin

Given akun memiliki role admin.  
When admin login.  
Then admin dapat mengakses dashboard admin.  
And admin dapat melihat seluruh booking.  
And admin dapat mengelola data court.

## AC-2.3 Backend Authorization

Given request dikirim langsung ke endpoint admin.  
When token tidak memiliki role admin.  
Then backend wajib menolak request dengan status forbidden.  
And frontend bukan satu-satunya pengaman akses.

## AC-2.4 User Booking Ownership

Given user A sudah login.  
When user A mencoba membuka booking milik user B.  
Then backend menolak akses.  
And user A tidak dapat melihat atau mengubah booking tersebut.

---

# 3. Court Management

## AC-3.1 Create Court

Given admin berada di halaman court management.  
When admin mengisi nama lapangan, deskripsi, lokasi, harga per jam, gambar, dan status.  
Then sistem berhasil membuat court baru.  
And court muncul di daftar court admin.

## AC-3.2 Required Fields

Given admin membuat court baru.  
When field wajib seperti nama, harga per jam, atau status kosong.  
Then sistem menolak submit.  
And sistem menampilkan pesan validasi pada field yang bermasalah.

## AC-3.3 Price Validation

Given admin mengisi harga per jam.  
When harga bernilai negatif, nol jika tidak diizinkan, atau bukan angka.  
Then sistem menolak input.  
And sistem meminta admin memasukkan harga valid dalam rupiah.

## AC-3.4 Edit Court

Given court sudah tersedia.  
When admin mengubah data court.  
Then sistem menyimpan perubahan.  
And data terbaru tampil di dashboard admin dan halaman user.

## AC-3.5 Deactivate Court

Given court aktif.  
When admin mengubah status court menjadi inactive.  
Then court tidak muncul sebagai pilihan booking untuk user.  
And data historis booking tetap tersimpan.

## AC-3.6 Delete Court

Given court belum memiliki booking historis.  
When admin menghapus court.  
Then sistem dapat menghapus atau soft-delete court sesuai implementasi.

Given court sudah memiliki booking historis.  
When admin menghapus court.  
Then sistem melakukan soft-delete atau menonaktifkan court.  
And booking historis tetap dapat dilihat oleh admin.

## AC-3.7 Public Court List

Given user membuka halaman daftar lapangan.  
When terdapat court aktif.  
Then sistem hanya menampilkan court dengan status active.

---

# 4. Court Schedule & Blocked Time

## AC-4.1 Operating Hours

Given admin mengatur jam operasional court.  
When user memilih tanggal tertentu.  
Then sistem hanya menampilkan slot sesuai jam operasional pada hari tersebut.

## AC-4.2 Closed Day

Given court ditandai tutup pada hari tertentu.  
When user memilih tanggal yang jatuh pada hari tersebut.  
Then sistem tidak menampilkan slot booking.  
And user melihat informasi bahwa court sedang tutup.

## AC-4.3 Blocked Time

Given admin membuat blocked time untuk maintenance atau event internal.  
When user melihat availability pada tanggal dan jam tersebut.  
Then slot yang masuk blocked time tidak dapat dipilih.

## AC-4.4 Blocked Time Overlap

Given admin membuat blocked time baru.  
When blocked time bertabrakan dengan booking confirmed.  
Then sistem menolak blocked time atau meminta admin menyelesaikan konflik terlebih dahulu.

## AC-4.5 Schedule Update Impact

Given admin mengubah jam operasional.  
When user membuka halaman booking.  
Then availability yang ditampilkan mengikuti schedule terbaru.

---

# 5. Availability Slot

## AC-5.1 View Availability

Given user memilih court dan tanggal.  
When frontend meminta data availability ke backend.  
Then backend mengembalikan daftar slot tersedia dan tidak tersedia.

## AC-5.2 Available Slot

Given slot berada dalam jam operasional.  
And tidak masuk blocked time.  
And tidak memiliki active booking.  
When user melihat slot tersebut.  
Then slot ditampilkan sebagai available.

## AC-5.3 Booked Slot

Given slot sudah memiliki booking dengan status pending_payment atau confirmed.  
When user melihat availability.  
Then slot ditampilkan sebagai booked atau disabled.  
And user tidak dapat memilih slot tersebut.

## AC-5.4 Expired or Cancelled Slot

Given booking pada slot tertentu memiliki status expired atau cancelled.  
When user melihat availability.  
Then slot tersebut dapat tersedia kembali jika tidak ada active booking lain.

## AC-5.5 Backend Validation

Given user memanipulasi frontend dan mengirim booking ke slot yang tidak tersedia.  
When request diterima backend.  
Then backend menolak request.  
And sistem mengembalikan pesan bahwa slot tidak tersedia.

## AC-5.6 Overlap Rule

Given sudah ada booking aktif pada court yang sama, tanggal yang sama, dan jam 19:00–20:00.  
When user mencoba membuat booking 19:30–20:30.  
Then backend menolak booking karena terjadi overlap.

## AC-5.7 Adjacent Slot

Given sudah ada booking aktif pada court yang sama dari 19:00–20:00.  
When user mencoba booking 20:00–21:00.  
Then sistem menerima booking jika slot tersebut tersedia.  
And sistem tidak menganggapnya overlap.

## AC-5.8 Availability Response Time

Given user memilih tanggal.  
When frontend meminta availability.  
Then backend mengembalikan response dalam waktu yang wajar.  
And target response MVP adalah di bawah 500ms untuk dataset kecil sampai menengah.

---

# 6. Booking Management — User

## AC-6.1 Create Booking

Given user sudah login.  
And user memilih court, tanggal, start time, dan end time yang tersedia.  
When user menekan tombol konfirmasi booking.  
Then sistem membuat booking baru.  
And status awal booking menjadi pending_payment atau confirmed sesuai mode pembayaran.

## AC-6.2 Booking Requires Login

Given pengunjung belum login.  
When pengunjung mencoba membuat booking.  
Then sistem mengarahkan pengunjung ke halaman login.  
And booking tidak dibuat sebelum authentication berhasil.

## AC-6.3 Booking Price Calculation

Given court memiliki harga per jam.  
And user memilih durasi booking.  
When booking dibuat.  
Then total_price dihitung berdasarkan harga per jam dikali durasi.

## AC-6.4 Booking History

Given user sudah memiliki booking.  
When user membuka halaman `/my-bookings`.  
Then sistem menampilkan daftar booking milik user tersebut.  
And booking user lain tidak ditampilkan.

## AC-6.5 Booking Detail

Given user membuka detail booking miliknya.  
When data booking tersedia.  
Then sistem menampilkan court, tanggal, jam, status booking, status pembayaran, dan total harga.

## AC-6.6 Cancel Booking by User

Given user memiliki booking dengan status pending_payment atau confirmed.  
When user menekan cancel booking.  
Then sistem membatalkan booking jika masih sesuai aturan cancellation.  
And status booking berubah menjadi cancelled.

## AC-6.7 Cancel Completed Booking

Given booking sudah berstatus completed.  
When user mencoba membatalkan booking.  
Then sistem menolak pembatalan.  
And sistem menampilkan pesan bahwa booking sudah selesai.

## AC-6.8 Cancelled Booking Releases Slot

Given booking dibatalkan.  
When user lain melihat availability pada slot yang sama.  
Then slot dapat tersedia kembali jika tidak ada active booking lain.

---

# 7. Booking Management — Admin

## AC-7.1 View All Bookings

Given admin sudah login.  
When admin membuka halaman booking management.  
Then sistem menampilkan seluruh booking dari semua user.

## AC-7.2 Filter Bookings

Given admin membuka daftar booking.  
When admin memfilter berdasarkan tanggal, court, status booking, atau payment status.  
Then sistem menampilkan data sesuai filter.

## AC-7.3 Approve Booking

Given booking berstatus pending_payment.  
When admin menekan approve atau confirm.  
Then status booking berubah menjadi confirmed.  
And sistem memicu workflow n8n booking_confirmed.

## AC-7.4 Reject Booking

Given booking berstatus pending_payment.  
When admin menekan reject.  
Then status booking berubah menjadi cancelled atau rejected sesuai implementasi.  
And sistem dapat memicu notifikasi pembatalan ke user.

## AC-7.5 Cancel Booking by Admin

Given booking berstatus confirmed.  
When admin membatalkan booking.  
Then status booking berubah menjadi cancelled.  
And slot dapat tersedia kembali.  
And sistem mengirim automation event booking_cancelled.

## AC-7.6 Admin Booking Detail

Given admin membuka detail booking.  
When data booking tersedia.  
Then admin dapat melihat data user, court, tanggal, jam, total harga, payment status, booking status, dan automation log terkait.

## AC-7.7 Booking Status Update Log

Given admin mengubah status booking.  
When perubahan berhasil.  
Then sistem menyimpan perubahan status.  
And perubahan dapat ditelusuri melalui updated_at atau audit log jika tersedia.

---

# 8. Payment

## AC-8.1 Payment Creation

Given user membuat booking dengan metode payment gateway.  
When booking berhasil dibuat.  
Then backend membuat payment request ke provider seperti Midtrans Sandbox.  
And sistem menyimpan payment_url jika tersedia.

## AC-8.2 Manual Payment Mode

Given sistem menggunakan pembayaran manual pada MVP.  
When user membuat booking.  
Then booking berstatus pending_payment.  
And admin dapat mengubah payment_status menjadi paid setelah pembayaran diverifikasi manual.

## AC-8.3 Payment Success Webhook

Given payment gateway mengirim webhook sukses.  
When backend memverifikasi webhook valid.  
Then payment_status berubah menjadi paid.  
And booking dapat berubah menjadi confirmed sesuai aturan sistem.

## AC-8.4 Payment Failed

Given payment gateway mengirim status gagal.  
When backend menerima webhook valid.  
Then payment_status berubah menjadi failed.  
And booking tetap tidak confirmed.

## AC-8.5 Payment Expired

Given user tidak menyelesaikan pembayaran sampai batas waktu.  
When sistem menerima status expired atau menjalankan job expiry.  
Then payment_status berubah menjadi expired.  
And booking berubah menjadi expired.  
And slot tersedia kembali jika tidak ada active booking lain.

## AC-8.6 Amount Validation

Given payment webhook diterima.  
When nominal payment tidak sesuai dengan total_price booking.  
Then backend menolak update paid.  
And sistem mencatat error untuk pengecekan admin.

---

# 9. n8n Automation

## AC-9.1 Booking Created Webhook

Given booking baru berhasil dibuat.  
When status booking menjadi pending_payment.  
Then backend mengirim event booking_created ke webhook n8n.  
And payload berisi booking ID, user, court, tanggal, jam, status, dan total harga.

## AC-9.2 Booking Created Notification

Given n8n menerima event booking_created.  
When workflow berjalan.  
Then n8n mengirim notifikasi ke Telegram admin.  
And n8n mencatat data booking ke Google Sheets.

## AC-9.3 Booking Confirmed Webhook

Given booking berubah menjadi confirmed.  
When backend menyimpan status baru.  
Then backend mengirim event booking_confirmed ke webhook n8n.

## AC-9.4 Booking Confirmed Automation

Given n8n menerima event booking_confirmed.  
When workflow berjalan.  
Then n8n mengirim email konfirmasi ke user.  
And n8n membuat event di Google Calendar.  
And n8n mengirim notifikasi ke Telegram admin.

## AC-9.5 Booking Cancelled Automation

Given booking berubah menjadi cancelled.  
When backend mengirim event booking_cancelled ke n8n.  
Then n8n mengirim email cancellation ke user.  
And n8n mengirim notifikasi pembatalan ke admin.

## AC-9.6 Reminder H-1

Given terdapat booking confirmed untuk besok.  
When workflow reminder berjalan sesuai jadwal cron.  
Then n8n mengirim reminder ke user.  
And n8n dapat mengirim ringkasan jadwal besok ke admin.

## AC-9.7 Daily Report

Given hari sudah berakhir atau masuk jam laporan yang ditentukan.  
When workflow daily report berjalan.  
Then n8n mengambil data booking hari tersebut.  
And n8n mengirim laporan jumlah booking dan revenue ke admin.

## AC-9.8 n8n Failure Handling

Given workflow n8n gagal.  
When backend menerima response gagal atau timeout.  
Then sistem mencatat automation log dengan status failed.  
And admin dapat melihat error tersebut di halaman automation logs.

## AC-9.9 Webhook Security

Given request masuk ke webhook backend atau n8n.  
When request tidak memiliki secret token atau signature yang valid.  
Then sistem menolak request.

---

# 10. Automation Logs

## AC-10.1 Create Automation Log

Given backend memicu workflow n8n.  
When workflow selesai atau gagal.  
Then sistem menyimpan automation log.

## AC-10.2 View Automation Logs

Given admin membuka halaman automation logs.  
When data log tersedia.  
Then sistem menampilkan workflow name, event type, status, message, booking ID, dan executed_at.

## AC-10.3 Filter Automation Logs

Given admin berada di halaman automation logs.  
When admin memfilter berdasarkan status atau event type.  
Then sistem menampilkan log sesuai filter.

## AC-10.4 Failed Log Visibility

Given terdapat automation log dengan status failed.  
When admin melihat daftar log.  
Then log gagal harus terlihat jelas dengan status visual error.

## AC-10.5 User Cannot Access Logs

Given user biasa mencoba mengakses automation logs.  
When request dikirim.  
Then backend menolak akses.

---

# 11. Notification

## AC-11.1 Email Confirmation

Given booking confirmed.  
When n8n workflow berjalan.  
Then user menerima email confirmation yang berisi court, tanggal, jam, dan status booking.

## AC-11.2 Email Cancellation

Given booking cancelled.  
When n8n workflow berjalan.  
Then user menerima email cancellation.

## AC-11.3 Admin Telegram Notification

Given booking baru dibuat.  
When n8n workflow berjalan.  
Then admin menerima notifikasi Telegram berisi ringkasan booking.

## AC-11.4 Notification Content

Given sistem mengirim notifikasi.  
When user atau admin membaca notifikasi.  
Then informasi minimal yang harus ada adalah nama user, nama court, tanggal, jam, status, dan total harga jika relevan.

---

# 12. Admin Dashboard

## AC-12.1 Dashboard Summary

Given admin membuka dashboard.  
When data tersedia.  
Then sistem menampilkan jumlah booking hari ini, booking pending, booking confirmed, dan estimasi revenue.

## AC-12.2 Latest Bookings

Given ada booking terbaru.  
When admin membuka dashboard.  
Then sistem menampilkan daftar booking terbaru secara ringkas.

## AC-12.3 Revenue Display

Given terdapat booking confirmed atau paid.  
When dashboard menghitung revenue.  
Then revenue hanya menghitung booking yang valid sesuai aturan sistem.

## AC-12.4 Empty State

Given belum ada booking.  
When admin membuka dashboard.  
Then sistem menampilkan empty state yang jelas, bukan tampilan error.

---

# 13. Reporting

## AC-13.1 Daily Report Data

Given admin membutuhkan laporan harian.  
When sistem menghitung data harian.  
Then sistem menghitung jumlah booking, booking confirmed, booking cancelled, dan total revenue.

## AC-13.2 Weekly Report Data

Given admin membutuhkan laporan mingguan.  
When sistem menghitung data mingguan.  
Then sistem mengelompokkan data berdasarkan tanggal.

## AC-13.3 n8n Report Delivery

Given workflow daily report berjalan.  
When data laporan berhasil dihitung.  
Then n8n mengirim ringkasan laporan ke admin melalui Telegram atau email.

---

# 14. API Response & Error Handling

## AC-14.1 Consistent Success Response

Given API request berhasil.  
When backend mengirim response.  
Then response menggunakan format JSON yang konsisten.

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {}
}
```

## AC-14.2 Consistent Error Response

Given API request gagal.  
When backend mengirim response.  
Then response error menggunakan format JSON yang konsisten.

```json
{
  "success": false,
  "message": "Selected slot is not available",
  "errors": []
}
```

## AC-14.3 Validation Error

Given input user tidak valid.  
When backend melakukan validasi.  
Then backend mengembalikan error message yang menjelaskan field bermasalah.

## AC-14.4 Not Found

Given data tidak ditemukan.  
When user atau admin meminta resource tersebut.  
Then backend mengembalikan response not found.

## AC-14.5 Unauthorized

Given request tidak memiliki token valid.  
When request mengakses protected endpoint.  
Then backend mengembalikan unauthorized.

## AC-14.6 Forbidden

Given request memiliki token valid tetapi role tidak sesuai.  
When request mengakses endpoint terbatas.  
Then backend mengembalikan forbidden.

---

# 15. Design & Responsiveness

## AC-15.1 Landing Page Responsive

Given user membuka landing page di mobile, tablet, atau desktop.  
When halaman dimuat.  
Then layout tetap rapi dan mudah digunakan.

## AC-15.2 Booking Flow Mobile Friendly

Given user membuka booking flow di mobile.  
When user memilih court, tanggal, dan slot.  
Then elemen UI mudah ditekan dan tidak saling bertumpuk.

## AC-15.3 Admin Table Responsive

Given admin membuka dashboard di layar kecil.  
When tabel booking terlalu lebar.  
Then sistem menyediakan horizontal scroll atau tampilan card-based list.

## AC-15.4 Status Badge Consistency

Given status booking tampil di berbagai halaman.  
When status ditampilkan.  
Then warna dan label status harus konsisten.

## AC-15.5 Color Palette

Given UI CourtFlow dibuat.  
When desain diterapkan.  
Then warna utama mengikuti palette CourtFlow, yaitu emerald green, lime, slate navy, soft white, dan warna status yang sudah ditentukan.

## AC-15.6 Typography

Given UI CourtFlow dibuat.  
When teks ditampilkan.  
Then font utama menggunakan Plus Jakarta Sans atau alternatif yang disepakati.

---

# 16. Security

## AC-16.1 Password Hashing

Given user membuat akun.  
When password disimpan.  
Then password wajib di-hash dan tidak boleh disimpan dalam bentuk plain text.

## AC-16.2 CORS

Given backend menerima request dari frontend.  
When request berasal dari domain tidak diizinkan.  
Then backend menolak request sesuai konfigurasi CORS.

## AC-16.3 Input Sanitization

Given user mengirim input teks.  
When backend menerima input.  
Then backend melakukan validasi dan sanitasi untuk mengurangi risiko XSS atau injection.

## AC-16.4 Admin Endpoint Protection

Given endpoint admin tersedia.  
When request tidak memiliki role admin.  
Then backend menolak request.

## AC-16.5 Payment Webhook Verification

Given payment webhook diterima.  
When signature atau token tidak valid.  
Then backend menolak webhook.

## AC-16.6 n8n Webhook Secret

Given n8n webhook digunakan.  
When request tidak membawa secret yang valid.  
Then webhook tidak diproses.

---

# 17. Performance

## AC-17.1 Availability Performance

Given user memilih tanggal booking.  
When sistem mengambil availability.  
Then response target berada di bawah 500ms untuk MVP dataset.

## AC-17.2 Landing Page Load

Given user membuka landing page.  
When koneksi normal.  
Then halaman utama harus dimuat dengan cepat dan tidak terasa berat.

## AC-17.3 Query Pagination

Given admin membuka daftar booking dengan data banyak.  
When data ditampilkan.  
Then sistem menggunakan pagination atau limit agar tidak memuat seluruh data sekaligus.

## AC-17.4 Frontend Loading State

Given frontend sedang mengambil data.  
When request belum selesai.  
Then UI menampilkan loading state yang jelas.

---

# 18. Accessibility

## AC-18.1 Button Label

Given user menggunakan aplikasi.  
When user melihat tombol.  
Then setiap tombol memiliki label yang jelas.

## AC-18.2 Form Label

Given user mengisi form.  
When field ditampilkan.  
Then setiap field memiliki label atau placeholder yang mudah dipahami.

## AC-18.3 Error Placement

Given terjadi error validasi.  
When error ditampilkan.  
Then error muncul dekat dengan field yang bermasalah.

## AC-18.4 Status Text

Given sistem menampilkan status booking.  
When status ditampilkan.  
Then status tidak hanya bergantung pada warna, tetapi juga memiliki teks.

## AC-18.5 Keyboard Navigation

Given user memakai keyboard.  
When user berpindah antar elemen form dan tombol.  
Then elemen penting dapat difokuskan secara berurutan.

---

# 19. Definition of Done

Fitur dianggap done jika seluruh acceptance criteria terkait sudah terpenuhi, validasi backend berjalan, UI responsive, error handling jelas, dan tidak ada bug kritikal pada flow utama.

Untuk MVP CourtFlow, project dianggap done jika user dapat register, login, melihat court, melihat availability, membuat booking, membatalkan booking, melihat riwayat booking, admin dapat mengelola court dan booking, sistem mencegah double booking, n8n workflow berjalan, dan automation logs dapat dilihat admin.

---

# 20. MVP Checklist

| Area | Done Criteria |
|---|---|
| Auth | Register, login, logout, protected route berjalan |
| Role | User dan admin memiliki akses berbeda |
| Court | Admin dapat CRUD court, user melihat court aktif |
| Availability | Slot tersedia dan booked tampil dengan benar |
| Booking | User dapat booking dan cancel |
| Overlap | Backend menolak booking bentrok |
| Admin | Admin dapat approve, reject, dan cancel booking |
| Payment | Manual payment atau Midtrans Sandbox berjalan |
| n8n | Booking created dan confirmed memicu workflow |
| Logs | Automation logs tampil di dashboard admin |
| Notification | Email atau Telegram terkirim |
| Responsive | User side dan admin side dapat digunakan di mobile |
| Documentation | API dan README tersedia |
