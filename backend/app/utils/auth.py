import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

bearer = HTTPBearer(auto_error=False)

JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "dev_secret_replace_me")


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict:
    """
    Decode a Supabase JWT and return the payload.
    In dev, if no SUPABASE_JWT_SECRET is set and the token is 'dev',
    returns a mock user so you can test without a real Supabase project.
    """

    token = creds.credentials

    # Dev shortcut — remove before deploying
    if token == "dev" and os.getenv("ENV", "dev") == "dev":
        return {"sub": "00000000-0000-0000-0000-000000000001", "email": "dev@local"}

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {e}",
        )
