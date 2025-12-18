from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from app.services.media_service import MediaService

router = APIRouter()


@router.get("/")
async def get_media(
    skip: int = 0,
    limit: int = 20
):
    """Get all media files"""
    service = MediaService()
    media_files = await service.get_media(skip=skip, limit=limit)
    return media_files


@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    folder: str = "general"
):
    """Upload a media file (image, video, audio)"""
    service = MediaService()
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "video/mp4", "audio/mpeg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} not allowed"
        )
    
    result = await service.upload_file(file, folder)
    return result


@router.delete("/{media_id}")
async def delete_media(media_id: str):
    """Delete a media file"""
    service = MediaService()
    success = await service.delete_file(media_id)
    if not success:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"message": "Media deleted successfully"}

