from fastapi import APIRouter

router = APIRouter()

@router.get("/{{entity_name}}s/", tags=["{{entity_name}}s"])
async def list_{{entity_name}}():
    return {"username": "list of {{entity_name}}s"}
