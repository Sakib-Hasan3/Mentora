from fastapi import APIRouter, UploadFile, File, Form, Depends
from typing import Optional
from auth.dependencies.auth import get_current_user
from multimodal_rag.services.rag_chain import rag_chain
import base64

router = APIRouter(prefix="/multimodal", tags=["Multimodal RAG"])

@router.post("/chat")
async def multimodal_chat(
    input_type: str = Form(...),
    text: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    pdf: Optional[UploadFile] = File(None),
    query: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    content = None
    
    if input_type == "text" and text:
        content = text
    
    elif input_type == "image" and image:
        content = await image.read()
    
    elif input_type == "pdf" and pdf:
        content = await pdf.read()
    
    if not content:
        return {"success": False, "error": "No valid content provided"}
    
    result = await rag_chain.process(input_type, content, query or text or "")
    return result

@router.post("/knowledge/add")
async def add_to_knowledge(
    text: str = Form(...),
    metadata: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    from multimodal_rag.services.vector_store import vector_store
    vector_store.add_documents([text], [{"source": "user_upload", "user": current_user["id"]}])
    return {"success": True, "message": "Knowledge added successfully"}