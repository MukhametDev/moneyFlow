from fastapi import APIRouter, Depends, HTTPException

from app.bills.service import BillService
from app.groupbills.service import GroupBillService
from app.transactions.schemas import TransactionCreate, Transaction
from app.transactions.service import TransactionService
from app.user.auth import get_current_user
from app.user.models import User
from typing import List

router = APIRouter(
    tags=["Транзакции"]
)

@router.post("/transaction")
async def create_transaction(transaction: TransactionCreate, current_user: User = Depends(get_current_user)):
    bill = await BillService.find_by_id(transaction.bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    group_bill = await GroupBillService.find_by_id(bill.group_bill_id)
    if group_bill.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to add transaction to this bill")
    await TransactionService.insert_data_db(**transaction.dict())
    return await TransactionService.find_one_or_none(category=transaction.category, amount=transaction.amount, bill_id=transaction.bill_id)

@router.get("/transactions")
async def get_transactions(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized user. Please log in.")
    
    user_group_bills = await GroupBillService.find_all({"user_id": current_user.id})
    transactions = []
    
    # Для каждой группы счетов пользователя
    for group_bill in user_group_bills:
        # Получаем все счета для этой группы счетов
        bills = await BillService.find_all({"group_bill_id": group_bill.id})
        # Для каждого счета получаем транзакции и добавляем их в список
        for bill in bills:
            bill_transactions = await TransactionService.find_all_by_bill_id(bill.id)
            transactions.extend(bill_transactions)
    
    return transactions

@router.get("/transactions/{bill_id}")
async def get_transactions_by_bill_id(bill_id: int):
    return await TransactionService.find_all_by_bill_id(bill_id)

@router.get("/transaction/{transaction_id}",response_model=Transaction)
async def get_transaction_by_id(transaction_id: int):
    transaction = await TransactionService.find_by_id(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.put("/transaction/{transaction_id}")
async def update_transaction_by_id(transaction_id: int, updated_transaction: TransactionCreate):
    transaction = await TransactionService.find_by_id(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    await TransactionService.update_data(transaction_id, **updated_transaction.dict())
    return await TransactionService.find_by_id(transaction_id)

@router.delete("/transaction/{transaction_id}")
async def delete_transaction_by_id(transaction_id: int):
    transaction = await TransactionService.find_by_id(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    await TransactionService.delete_by_id(transaction_id)
    return {"detail": "Transaction deleted"}
