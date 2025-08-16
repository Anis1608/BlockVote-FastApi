import uvicorn
from fastapi import FastAPI
import database.models
from database.db import Base , engine
from routes.user import router
from routes.super_admin_routes import router as super_admin_router
from routes.admin_routes import router as admin


Base.metadata.create_all(bind=engine)
app = FastAPI(title="PostgreSQL API")


app.include_router(router)
app.include_router(super_admin_router, prefix="/api", tags=["Super Admin"])
app.include_router(admin, prefix="/api", tags=["Admin"])


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)
