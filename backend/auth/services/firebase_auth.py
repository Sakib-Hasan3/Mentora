import logging
import time
import httpx
from jose import jwt, JWTError

logger = logging.getLogger(__name__)

# Cache for Google's public certificates
GOOGLE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
certs_cache = {}
certs_expiry = 0

async def get_google_public_keys() -> dict:
    """
    Fetch Google public certificates used to sign Firebase ID tokens.
    Uses in-memory caching to avoid hitting Google's endpoints on every request.
    """
    global certs_cache, certs_expiry
    now = time.time()
    if not certs_cache or now > certs_expiry:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(GOOGLE_CERTS_URL, timeout=10.0)
                if resp.status_code == 200:
                    certs_cache = resp.json()
                    # Cache for 1 hour
                    certs_expiry = now + 3600
                    logger.info("Successfully fetched and cached Google public certificates.")
                else:
                    logger.error(f"Failed to fetch Google public keys: status_code={resp.status_code}")
        except Exception as e:
            logger.error(f"Exception fetching Google public keys: {e}")
    return certs_cache

async def verify_firebase_token(token: str, project_id: str) -> dict | None:
    """
    Verify the Firebase ID Token cryptographically.
    Verifies signature, audience, issuer, and expiration.
    
    Args:
        token: The Firebase ID Token sent from the frontend.
        project_id: The expected Firebase Project ID.
        
    Returns:
        The decoded JWT claims payload dict if valid, else None.
    """
    try:
        # 1. Parse JWT header to extract key ID (kid) and signing algorithm (alg)
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        alg = header.get("alg")
        
        if not kid:
            logger.warning("Firebase ID Token missing 'kid' in header.")
            return None
            
        if alg != "RS256":
            logger.warning(f"Firebase ID Token uses unsupported algorithm: {alg}. Expected RS256.")
            return None
            
        # 2. Retrieve current public certificates from Google
        certs = await get_google_public_keys()
        public_cert = certs.get(kid)
        
        if not public_cert:
            logger.warning(f"Firebase ID Token 'kid' ({kid}) not found in Google public certificates.")
            return None
            
        # 3. Decode and verify JWT using the matched public certificate
        payload = jwt.decode(
            token,
            public_cert,
            algorithms=["RS256"],
            audience=project_id,
            issuer=f"https://securetoken.google.com/{project_id}"
        )
        return payload
        
    except JWTError as e:
        logger.warning(f"Firebase token verification failed (JWTError): {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error verifying Firebase token: {e}", exc_info=True)
        return None
