import dayjs from "dayjs";
import { IBill } from "../../type";
import { getGroupBill } from "./GroupBill";
import { getTxByBillId } from "./Transaction";
import { v4 as uuidv4 } from 'uuid';

export let bills = [
    {
        id: "00924f0b-c772-491f-831a-80329a07d0fa",
        group_bill_id: "411ce821-5ba7-4829-a3c9-d31f2763d26e",
        name: "МелБанк",
        balance: 10050
    },
    {
        id: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5",
        group_bill_id: "411ce821-5ba7-4829-a3c9-d31f2763d26e",
        name: "СберБанк",
        balance: -25000
    },
    {
        id: "x9y8z7w6-v5u4-t3s2-r1q-p0o9n8m7l6",
        group_bill_id: "30d65281-6e8d-405a-8c3e-7e6dfa1cd6a1",
        name: "ВТБ",
        balance: 15600
    },
    {
        id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5",
        group_bill_id: "30d65281-6e8d-405a-8c3e-7e6dfa1cd6a1",
        name: "Тинькофф",
        balance: 8700
    },
    {
        id: "25679368-ddeb-4763-aad0-75c4c2f1d53f",
        group_bill_id: "b77d652c-f5ae-4385-8099-0aa4e1f79836",
        name: "Альфа-Банк",
        balance: 18900
    }
]

export function getBill(billId: string) {
    return bills.find((bill) => bill.id === billId);
}

export function getBills(groupBillId: string): IBill[] {
    return bills.filter((bill) => bill.group_bill_id=== groupBillId);
}

export function getBillsForExport() {
    return bills;
}

export function createBill(bill: IBill) {
    const groupBill = getGroupBill(bill.group_bill_id);
    const newBill = {
        id: uuidv4(),
        group_bill_id: bill.group_bill_id,
        name: bill.name,
        balance: bill.balance
    }

    if (groupBill) {
        groupBill.bills.push(newBill);
    }
}

export function addBill(bill: IBill) {
    if (bills.some((b) => b.id === bill.id)) {
        return;
    }
    bills.push(bill);
}

export function addBills(bills: IBill[]) {
    bills.forEach((bill) => addBill(bill));
}

export function updateBill(billId: string, bill: IBill) {
    const indexOldBill = bills.findIndex((bill) => bill.id === billId);
    const newBill = {
        id: billId,
        group_bill_id: bill.group_bill_id,
        name: bill.name,
        balance: bill.balance
    }

    bills[indexOldBill] = newBill;
}

export function deleteBill(billId: string) {
    bills = bills.filter((bill) => bill.id !== billId);;
}

export function getIncomeByBillId(billId: string, startDate: string, endDate: string) {
    const trans = getTxByBillId(billId).filter((transaction) => transaction.type === "Income" && dayjs(transaction.date) >= dayjs(startDate) && dayjs(transaction.date) <= dayjs(endDate));
    const sum = trans.reduce((total, transaction) => total + transaction.amount, 0);
    return sum;
}

export function getExpensesByBillId(billId: string, startDate: string, endDate: string) {
    const trans = getTxByBillId(billId).filter((transaction) => transaction.type === "Expense" && dayjs(transaction.date) >= dayjs(startDate) && dayjs(transaction.date) <= dayjs(endDate));
    const sum = trans.reduce((total, transaction) => total + transaction.amount, 0);
    return sum;
}

export function getBalanceByBillId(billId: string, startDate: string, endDate: string) {
    const income = getIncomeByBillId(billId, startDate, endDate);
    const expenses = getExpensesByBillId(billId, startDate, endDate);
    return income - expenses;
}

export function getCurrentBalanceByBillId(billId: string) {
    const bill = getBill(billId);
    if (bill?.balance) {
        return bill.balance;
    }
}