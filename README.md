# Sales Prediction AI - Fullstack Integration

Proyek ini adalah sistem prediksi keberhasilan penjualan produk Laris/Tidak Laris menggunakan Machine Learning (Random Forest), yang diintegrasikan ke dalam sistem Fullstack berbasis **FastAPI** dan **React.js**.

## Tech Stack

- **Machine Learning:** Python, Scikit-Learn, Pandas, Joblib.
- **Backend:** FastAPI, JWT Authentication, Uvicorn.
- **Frontend:** React.js, Axios

## Fitur Utama

1. **Authentication:** Login aman menggunakan JWT
2. **Sales Dashboard:** Menampilkan 10 data penjualan terbaru langsung dari file CSV
3. **AI Prediction:** Input data  untuk mendapatkan prediksi status produk secara real-time dari model ML
4. **Data Cleaning:** Penanganan otomatis untuk nilai kosong (NaN) agar integrasi data lancar

## Cara menjalankan proyek
# ML
run semua cell di ml_1.ipynb untuk mendapatkan model_final.pkl jika ingin mencoba atau tidak ada

# backend
```bash 
cd backend
pip install -r ../requirements.txt
python main.py
```
server akan berjalan di **http://localhost:8000**

# frontend
```bash
cd frontend
npm install
npm run dev
```

akses UI di **http://localhost:5173**

# akses umum 

**Username: admin**
**Password: password123**


## Alur integrasi
Sistem ini menggunakan model Random Forest Classifier yang telah dilatih sebelumnya. Alur kerjanya:
1. Model dimuat saat server FastAPI pertama kali dijalankan
2. Frontend mengirimkan data fitur via POST request ke endpoint **/predict**
3. Backend melakukan inference menggunakan model dan mengembalikan hasil dalam format JSON
4. UI menampilkan hasil prediksi secara dinamis kepada pengguna

## Error handling 
**CORS Policy:** Sudah dikonfigurasi agar dapat diakses oleh frontend lokal

**Path Validation:** Menggunakan os.path untuk memastikan file CSV dan Model ditemukan di berbagai OS

**Data Integrity:** Menggunakan .fillna(0) untuk mencegah error pada serialisasi JSON jika terdapat data kosong

## Struktur Proyek

```text
.
├── backend/
│   ├── main.py            # API server dan integrasi model
│   └── model_final.pkl    # Serialized ML model
├── frontend/
│   ├── src/               # React source code
│   └── ...
├── sales_data.csv         # Raw Data
├── ml_1.ipynb             # untuk ML
└── requirements.txt       # python dependencies


