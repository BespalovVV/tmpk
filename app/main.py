from fastapi import FastAPI
import uvicorn
from api.v1.user import router as userrouter
from api.v1.abonent import router as abonrouter
from api.v1.switch import router as switchrouter
from api.v1.address import router as addressrouter
from api.v1.offer import router as offerrouter
from api.v1.service import router as servicerouter
from api.v1.port import router as portrouter
from api.v1.task import router as taskrouter
from api.v1.auth import router as authrouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(userrouter, prefix="/api/v1")
app.include_router(abonrouter, prefix="/api/v1")
app.include_router(switchrouter, prefix="/api/v1")
app.include_router(addressrouter, prefix="/api/v1")
app.include_router(offerrouter, prefix="/api/v1")
app.include_router(servicerouter, prefix="/api/v1")
app.include_router(portrouter, prefix="/api/v1")
app.include_router(taskrouter, prefix="/api/v1")
app.include_router(authrouter, prefix="/api/v1")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
