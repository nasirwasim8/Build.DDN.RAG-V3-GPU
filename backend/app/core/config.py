"""
Configuration settings for DDN Multimodal Semantic Search.
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings."""
    app_name: str = "DDN Multimodal Semantic Search"
    debug: bool = False

    # AI Models
    clip_model: str = "openai/clip-vit-base-patch32"
    blip_model: str = "Salesforce/blip-image-captioning-base"

    # NVIDIA API (optional)
    nvidia_api_key: Optional[str] = os.getenv("NVIDIA_API_KEY")
    
    # Celery Configuration for Async Processing
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    # Video Processing
    VIDEO_CHUNK_DURATION: float = 10.0  # Duration of each video chunk in seconds
    KEYFRAME_FPS: float = 1.0  # Keyframes per second to extract
    BATCH_SIZE: int = 8  # Batch size for AI processing
    
    # GPU Configuration
    GPU_COUNT: int = int(os.getenv("GPU_COUNT", "0"))  # Number of GPUs available (0 = CPU only)

    class Config:
        env_file = ".env"
        extra = "ignore"


class StorageConfig:
    """Storage configuration for DDN INFINIA and AWS S3."""

    def __init__(self):
        self.ddn_infinia_config = {
            'provider': 'DDN INFINIA',
            'endpoint_url': os.getenv('INFINIA_ENDPOINT', ''),
            'access_key': os.getenv('INFINIA_ACCESS_KEY', ''),
            'secret_key': os.getenv('INFINIA_SECRET_KEY', ''),
            'bucket_name': os.getenv('INFINIA_BUCKET', 'multimodal-search'),
            'region': os.getenv('INFINIA_REGION', 'us-east-1')
        }

        self.aws_config = {
            'provider': 'AWS S3',
            'access_key': os.getenv('AWS_ACCESS_KEY', ''),
            'secret_key': os.getenv('AWS_SECRET_KEY', ''),
            'bucket_name': os.getenv('AWS_BUCKET', ''),
            'region': os.getenv('AWS_REGION', 'us-east-1')
        }
        
        # Local cache configuration
        self.local_cache_config = {
            'enabled': False,
            'videos_path': '',
            'embeddings_path': ''
        }
        
        # Load persisted config
        self._load_config()

    def _get_config_path(self) -> str:
        """Get path to config file."""
        config_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
        if not os.path.exists(config_dir):
            os.makedirs(config_dir)
        return os.path.join(config_dir, "storage_config.json")

    def _load_config(self):
        """Load configuration from disk."""
        try:
            config_path = self._get_config_path()
            if os.path.exists(config_path):
                import json
                with open(config_path, 'r') as f:
                    data = json.load(f)
                    if 'aws' in data:
                        self.aws_config.update(data['aws'])
                    if 'ddn' in data:
                        self.ddn_infinia_config.update(data['ddn'])
                    if 'local_cache' in data:
                        self.local_cache_config.update(data['local_cache'])
                print(f"✅ Loaded configuration from {config_path}")
        except Exception as e:
            print(f"⚠️ Failed to load configuration: {e}")

    def _save_config(self):
        """Save configuration to disk."""
        try:
            config_path = self._get_config_path()
            import json
            with open(config_path, 'w') as f:
                json.dump({
                    'aws': self.aws_config,
                    'ddn': self.ddn_infinia_config,
                    'local_cache': self.local_cache_config
                }, f, indent=2)
            print(f"✅ Saved configuration to {config_path}")
        except Exception as e:
            print(f"❌ Failed to save configuration: {e}")

    def update_ddn_config(self, access_key: str, secret_key: str,
                          bucket_name: str, endpoint_url: str, region: str = "us-east-1"):
        """Update DDN INFINIA configuration."""
        self.ddn_infinia_config.update({
            'access_key': access_key,
            'secret_key': secret_key,
            'bucket_name': bucket_name,
            'endpoint_url': endpoint_url,
            'region': region
        })
        self._save_config()

    def update_aws_config(self, access_key: str, secret_key: str,
                          bucket_name: str, region: str = "us-east-1"):
        """Update AWS S3 configuration."""
        self.aws_config.update({
            'access_key': access_key,
            'secret_key': secret_key,
            'bucket_name': bucket_name,
            'region': region
        })
        self._save_config()

    def update_local_cache_config(self, enabled: bool, videos_path: str = '', 
                                   embeddings_path: str = ''):
        """Update local cache configuration."""
        self.local_cache_config.update({
            'enabled': enabled,
            'videos_path': videos_path,
            'embeddings_path': embeddings_path
        })
        self._save_config()

    def validate_config(self, config_type: str) -> tuple[bool, str]:
        """Validate storage configuration."""
        if config_type == 'ddn_infinia':
            config = self.ddn_infinia_config
            if not config.get('endpoint_url'):
                return False, "DDN INFINIA endpoint URL is required"
        elif config_type == 'aws':
            config = self.aws_config
        elif config_type == 'local_cache':
            config = self.local_cache_config
            if config.get('enabled'):
                if not config.get('videos_path'):
                    return False, "Videos path is required when local cache is enabled"
                if not config.get('embeddings_path'):
                    return False, "Embeddings path is required when local cache is enabled"
                # Check if paths exist
                videos_path = config.get('videos_path', '')
                embeddings_path = config.get('embeddings_path', '')
                if videos_path and not os.path.exists(videos_path):
                    return False, f"Videos path does not exist: {videos_path}"
                if embeddings_path and not os.path.exists(embeddings_path):
                    return False, f"Embeddings path does not exist: {embeddings_path}"
            return True, "Local cache configuration is valid"
        else:
            return False, f"Unknown config type: {config_type}"

        if not config.get('access_key'):
            return False, "Access key is required"
        if not config.get('secret_key'):
            return False, "Secret key is required"
        if not config.get('bucket_name'):
            return False, "Bucket name is required"

        return True, "Configuration is valid"


# Global instances
settings = Settings()
storage_config = StorageConfig()

