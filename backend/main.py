from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta
import joblib
import pandas as pd
import os

app = FastAPI()
#atur cors agar hanya bisa diakses http://localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


#load model saat server start
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model_final.pkl")
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    #jika model tidak ada
    model = None
    print("Warning: model_final.pkl tidak ditemukan")
#user dummy
USER_DB = {
    "admin": "password123"
}
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "asdwq12"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# beri class untuk input
class ProductData(BaseModel):
    jumlah_penjualan: int
    harga: int
    diskon: int

class Token(BaseModel):
    access_token: str
    token_type: str

#buat token untuk login dan header
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@app.get("/")
def home():
    return {"message": "API is Running"}

#endpoint login
@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_password = USER_DB.get(form_data.username)
    if not user_password or form_data.password != user_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="username atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

#endpoint prediksi
@app.post("/predict")
async def predict(data: ProductData, token: str = Depends(oauth2_scheme)):
    if model is None:
        raise HTTPException(status_code=500, detail="model ML tidak termuat di server")
    try:
        input_dict = data.model_dump() if hasattr(data, 'model_dump') else data.dict()
        input_df = pd.DataFrame([input_dict])
        #prediksi model 
        prediction = model.predict(input_df)
        #jika prediksi 1 berarti laris jika lainya tidak laris
        status_hasil = "Laris" if int(prediction[0]) == 1 else "Tidak Laris"
        
        return {
            "status_produk": status_hasil,
            "raw_prediction": int(prediction[0]),
            "message": "prediksi berhasil dilakukan"
        }
        
    except Exception as e:
        #menangani error jika input tidak sesuai atau model gagal
        raise HTTPException(status_code=400, detail=f"Gagal melakukan prediksi: {str(e)}")

#untuk membaca data sales
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "sales_data.csv")

@app.get("/sales")
async def get_sales(token: str = Depends(oauth2_scheme)):
    if not os.path.exists(CSV_PATH):
        raise HTTPException(
            status_code=404, 
            detail=f"file CSV tidak ditemukan di path: {CSV_PATH}"
        )

    try:
        #bersihkan data
        df = pd.read_csv(CSV_PATH, sep=";")
        df = df.fillna(0)
        data_json = df.head(10).to_dict(orient="records")
        
        return data_json

    except Exception as e:
        print(f"Error reading CSV: {e}")
        raise HTTPException(status_code=500, detail="Gagal memproses data penjualan")
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)