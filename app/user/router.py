from fastapi import APIRouter, HTTPException, Request, Response, Depends
from sqlalchemy import select
from app.database import async_session_maker
from app.exceptions import IncorectEmailorPassword, UserAlreadyExistsException
from app.user.models import User
from app.user.service import AuthUser
from app.user.schemas import SUserRegister, SToken, UpdateUserName
from app.user.auth import (
    authenticate_user, 
    get_hashed_password, 
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.user.auth import get_current_user
from app.config import settings

router = APIRouter(
    prefix='/auth',
    tags=['Авторизация и регистрация']
)

@router.post("/register")
async def register(user_data: SUserRegister):
    existing_user = await AuthUser.find_one_or_none(email=user_data.email)
    if existing_user:
        raise UserAlreadyExistsException
    hashed_password = get_hashed_password(user_data.password)
    await AuthUser.insert_data_db(username=user_data.username, email=user_data.email, password=hashed_password)

@router.post("/login")
async def login(response: Response, user_data: SUserRegister):
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise IncorectEmailorPassword
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    response.set_cookie("access_token", access_token, httponly=True)
    response.set_cookie("refresh_token", refresh_token, httponly=True)
    return {"access_token": access_token, "refresh_token": refresh_token,"id":user.id,"name":user.username,"email":user.email}
@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Refresh token is missing")
        
        payload = decode_token(refresh_token, settings.REFRESH_SECRET_KEY)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        access_token = create_access_token({"sub": str(user_id)})
        response.set_cookie("access_token", access_token, httponly=True)
        data = await AuthUser.find_by_id(int(user_id))
        return {"data": data,"access_token":access_token}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
    

@router.post("/logout")
async def logout_user(response:Response):
        response.delete_cookie("access_token")

@router.get("/user")
async def read_user_me(current_user:User = Depends(get_current_user)):
    return current_user

@router.put("username")
async def update_username(username:UpdateUserName,current_user:User = Depends(get_current_user)):
    user_id = current_user.id
    new_username = username.username

    existing_user = await AuthUser.find_one_or_none(username=new_username)
    if existing_user:
        raise HTTPException(status_code=400,detail="Username already taken")
    
    await AuthUser.update_username(user_id,new_username)
    updated_user = await AuthUser.find_by_id(user_id)
    return updated_user
