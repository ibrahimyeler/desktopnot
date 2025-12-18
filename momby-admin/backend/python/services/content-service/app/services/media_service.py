import boto3
from fastapi import UploadFile
from app.core.config import settings
from typing import List, Optional
import uuid


class MediaService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.S3_BUCKET_NAME
    
    async def get_media(self, skip: int = 0, limit: int = 20) -> List[dict]:
        """Get all media files"""
        # This would typically query a database for media metadata
        # For now, return empty list
        return []
    
    async def upload_file(self, file: UploadFile, folder: str = "general") -> dict:
        """Upload a file to S3"""
        file_extension = file.filename.split('.')[-1]
        file_key = f"{folder}/{uuid.uuid4()}.{file_extension}"
        
        # Read file content
        file_content = await file.read()
        
        # Upload to S3
        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=file_key,
            Body=file_content,
            ContentType=file.content_type
        )
        
        # Generate URL
        file_url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{file_key}"
        
        return {
            "id": str(uuid.uuid4()),
            "filename": file.filename,
            "url": file_url,
            "content_type": file.content_type,
            "size": len(file_content)
        }
    
    async def delete_file(self, media_id: str) -> bool:
        """Delete a file from S3"""
        # This would typically look up the file key from database
        # For now, return True
        return True

