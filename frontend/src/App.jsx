import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Login } from './components/Login';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [predictData, setPredictData] = useState({ jumlah_penjualan: 0, harga: 0, diskon: 0 });
  const [predictionResult, setPredictionResult] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);

      const response = await api.post('/login', formData);
      setToken(response.data.access_token);
      setIsLoggedIn(true);
      alert('Login Berhasil!');
    } catch (error) {
      alert('Login Gagal! Gunakan admin/password123');
    }
  };
  const fetchSales = async () => {
    try {
      const response = await api.get('/sales', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalesData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchSales();
  }, [isLoggedIn]);

  //fungsi prediksi
  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/predict', predictData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPredictionResult(response.data.status_produk); 
      
    } catch (error) {
      alert('Gagal melakukan prediksi');
    }
  };
  //view login
  if (!isLoggedIn) {
    return <Login loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} />
  }

  return (
    <div className="dashboard-wrapper">
  <header className="dashboard-header">
    <h1>Mini AI Sales Dashboard</h1>
    <button onClick={() => setIsLoggedIn(false)} className="logout-btn">Logout</button>
  </header>
  
  <main className="dashboard-content">
    <div className="grid-container">
      
      {/*form prediksi*/}
      <section className="card predict-card">
        <div className="card-header">
          <h3>Prediksi Status Produk</h3>
          <p>Masukkan data untuk memprediksi performa produk</p>
        </div>
        <form onSubmit={handlePredict} className="predict-form">
          <div className="form-group">
            <label>Jumlah Penjualan</label>
            <input type="number" placeholder="Contoh: 150" onChange={(e) => setPredictData({...predictData, jumlah_penjualan: parseInt(e.target.value)})} />
          </div>
          
          <div className="form-group">
            <label>Harga Satuan (IDR)</label>
            <input type="number" placeholder="Contoh: 50000" onChange={(e) => setPredictData({...predictData, harga: parseInt(e.target.value)})} />
          </div>
          
          <div className="form-group">
            <label>Diskon (%)</label>
            <input type="number" placeholder="0 - 100" onChange={(e) => setPredictData({...predictData, diskon: parseInt(e.target.value)})} />
          </div>
          
          <button type="submit" className="btn-primary">Analisis Produk</button>
        </form>

        {predictionResult && (
          <div className={`result-box ${predictionResult === 'Laris' ? 'is-laris' : 'is-biasa'}`}>
            <span>Hasil Prediksi:</span>
            <strong>{predictionResult}</strong>
          </div>
        )}
      </section>

      {/*tabel data*/}
      <section className="card table-card">
        <div className="card-header">
          <h3>Riwayat Penjualan (CSV)</h3>
          <p>10 Data transaksi terakhir dari sistem</p>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Terjual</th>
                <th>Harga</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salesData.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.product_name}</strong></td>
                  <td>{item.jumlah_penjualan}</td>
                  <td>Rp {item.harga?.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${item.status === 'Laris' ? 'badge-success' : 'badge-neutral'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
    </div>
  </main>
</div>
  );
}

export default App;