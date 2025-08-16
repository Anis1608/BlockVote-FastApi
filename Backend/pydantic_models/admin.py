from pydantic import BaseModel, Field

class AdminLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username of the super admin")
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address of the super admin")
    password: str = Field(..., min_length=8, description="Password for the super admin account")




