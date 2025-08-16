from pydantic import BaseModel, Field

class SuperAdmin(BaseModel):
    super_admin_id: str = Field(..., description="Unique identifier for the super admin")
    username: str = Field(..., min_length=3, max_length=50, description="Username of the super admin")
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address of the super admin")
    password: str = Field(..., min_length=8, description="Password for the super admin account")


class SuperAdminLogin(BaseModel):
    super_admin_id: str = Field(..., description="Unique identifier for the super admin")
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address of the super admin")
    password: str = Field(..., min_length=8, description="Password for the super admin account")


class SuperAdminCreatesAdmin(BaseModel):
    name: str = Field(..., min_length=3, max_length=50, description="Username of the new admin")
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address of the new admin")
    password: str = Field(..., min_length=8, description="Password for the new admin account")
    election_id: int = Field(..., description="ID of the election the admin is associated with")
    admin_of_state: str = Field(..., description="State the admin is responsible for")