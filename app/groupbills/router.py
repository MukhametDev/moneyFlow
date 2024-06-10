from fastapi import APIRouter, Depends, HTTPException

from app.groupbills.dependencies import create_group_bill_in_db
from app.groupbills.schemas import GroupBill, GroupBillCreate
from app.groupbills.service import GroupBillService
from app.user.auth import get_current_user
from app.user.models import User
# from app.groupbills.models import GroupBill


router = APIRouter(
    tags=['Группа счетов']
)

@router.get("/group-bill")
async def get_group_bills(current_user:User = Depends(get_current_user)):
    group_bills = await GroupBillService.find_all({"user_id": current_user.id})
    if not group_bills:
        raise HTTPException(status_code=404,detail="GroupBill not found")
    return group_bills


@router.post("/group-bills")
async def create_group_bills(group_bill:GroupBillCreate,current_user:User = Depends(get_current_user)):
    data = group_bill.dict()
    data["user_id"] = current_user.id
    await GroupBillService.insert_data_db(**data)
    return await GroupBillService.find_one_or_none(user_id=current_user.id, name=group_bill.name)

@router.get("/group-bills/{group_bill_id}")
async def get_group_bill_by_id(group_bill_id: int):
    group_bill = await GroupBillService.find_by_id(group_bill_id)
    if not group_bill:
        raise HTTPException(status_code=404, detail="GroupBill not found")
    return group_bill

@router.put("/group-bills/{group_bill_id}")
async def update_group_bill_by_id(group_bill_id: int, updated_group_bill: GroupBillCreate):
    await GroupBillService.update_data(group_bill_id, **updated_group_bill.dict())
    return await GroupBillService.find_by_id(group_bill_id)

@router.delete("/group-bills/{group_bill_id}")
async def delete_group_bill_by_id(group_bill_id: int):
    group_bill = await GroupBillService.find_by_id(group_bill_id)
    if not group_bill:
        raise HTTPException(status_code=404, detail="GroupBill not found")
    await GroupBillService.delete_by_id(group_bill_id)
    return