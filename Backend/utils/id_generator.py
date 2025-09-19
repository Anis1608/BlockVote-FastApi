import random
import string

def generateIdForSuperAdmin(prefix="ADM", length=15):
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choices(chars, k=length - len(prefix)))
    return prefix + random_part

def generateIdForAdmin(prefix="ADM", length=15):
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choices(chars, k=length - len(prefix)))
    return prefix + random_part

def generateIdForCandidate(prefix="CAND", length=15):
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choices(chars, k=length - len(prefix)))
    return prefix + random_part

def generateIdForVoters(prefix="VOT", length=10):
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choices(chars, k=length - len(prefix)))
    return prefix + random_part