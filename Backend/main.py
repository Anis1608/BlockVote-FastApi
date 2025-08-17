import uvicorn
from fastapi import FastAPI
from database.db import Base , engine
from routes.user import router
from routes.super_admin_routes import router as super_admin_router
from routes.admin_routes import router as admin
from routes.cast_vote import router as cast_vote_router
from routes.public_routes import router as public_router
from routes.election_routes import router as election_router


Base.metadata.create_all(bind=engine)
app = FastAPI(title="PostgreSQL API")


app.include_router(router)
app.include_router(super_admin_router, prefix="/api", tags=["Super Admin"])
app.include_router(admin, prefix="/api", tags=["Admin"])
app.include_router(cast_vote_router , prefix="/api", tags=["Cast Vote"])
app.include_router(public_router, prefix="/api", tags=["Public_router"])
app.include_router(election_router, prefix="/api", tags=["Election_router"])


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)
