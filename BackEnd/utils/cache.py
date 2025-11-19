"""
Simple in-memory cache for backend API responses
"""
from datetime import datetime, timedelta
from typing import Any, Optional

class SimpleCache:
    def __init__(self):
        self._cache = {}
        self._expiry = {}
    
    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        """Set a value in cache with TTL (time to live)"""
        self._cache[key] = value
        self._expiry[key] = datetime.now() + timedelta(seconds=ttl_seconds)
    
    def get(self, key: str) -> Optional[Any]:
        """Get a value from cache if not expired"""
        if key not in self._cache:
            return None
        
        if datetime.now() > self._expiry[key]:
            # Expired, remove from cache
            del self._cache[key]
            del self._expiry[key]
            return None
        
        return self._cache[key]
    
    def delete(self, key: str):
        """Delete a key from cache"""
        if key in self._cache:
            del self._cache[key]
            del self._expiry[key]
    
    def clear(self):
        """Clear all cache"""
        self._cache.clear()
        self._expiry.clear()

# Global cache instance
cache = SimpleCache()
