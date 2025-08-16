from datetime import datetime
import pytz

IST = pytz.timezone("Asia/Kolkata")

def to_ist(utc_dt: datetime) -> datetime:
    if utc_dt.tzinfo is None:
        utc_dt = pytz.utc.localize(utc_dt)
    return utc_dt.astimezone(IST)
