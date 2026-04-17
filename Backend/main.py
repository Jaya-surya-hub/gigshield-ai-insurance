from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from routers import triggers, verification, admin, sustainability
from models import Zone

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GigShield API", version="1.0")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("VALIDATION ERROR:", exc.errors())
    print("BODY:", exc.body)
    return JSONResponse(status_code=422, content={"detail": exc.errors(), "body": exc.body})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire up the routers
app.include_router(triggers.router, prefix="/api/v1")
app.include_router(verification.router, prefix="/api/v1") # <-- Mount the new endpoint
app.include_router(admin.router, prefix="/api/v1")
app.include_router(sustainability.router, prefix='/api/v1')

@app.get("/")
def read_root():
    return {"status": "online", "message": "GigShield AI Core is active."}

@app.get("/api/v1/zones")
def get_all_zones(db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    return [{"id": z.id, "display_name": z.display_name, "description": z.description, "latitude": z.latitude, "longitude": z.longitude} for z in zones]
