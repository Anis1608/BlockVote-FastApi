from datetime import datetime



def json_serializer_for_time(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()  # convert datetime to ISO string
    raise TypeError("Type not serializable")



# def json_serializer_for_time(obj):
#     if isinstance(obj, datetime):  # ✅ datetime type, not "datetime" string
#         return obj.isoformat()
#     raise TypeError("Type not serializable")
