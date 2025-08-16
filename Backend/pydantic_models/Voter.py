from pydantic import BaseModel

class Voters(BaseModel):
    id: int
    name: str
    age: int
    email: str
    address: str

    # class Config:
    #     orm_mode = True
    #     allow_population_by_field_name = True
    #     use_enum_values = True