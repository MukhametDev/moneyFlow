import { IGroupBill } from "../../type";
import { getBills, getExpensesByBillId, getIncomeByBillId } from "./Bill";
import { v4 as uuidv4 } from 'uuid';

export let groupBills: IGroupBill[] = [
    {
        id: "411ce821-5ba7-4829-a3c9-d31f2763d26e",
        userId: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5",
        name: "Мои счета",
        description:"",
        bills: [],
    },
    {
        id: "30d65281-6e8d-405a-8c3e-7e6dfa1cd6a1",
        userId: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5",
        name: "Накопления",
        description:"",
        bills: [],
    },
    {
        id: "b77d652c-f5ae-4385-8099-0aa4e1f79836",
        userId: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5",
        name: "На будущее",
        description:"",
        bills: [],
    }
]

export function getGroupBill(groupBillId: string) {
    return groupBills.find((groupBill) => groupBill.id === groupBillId);
}

export function getGroupBills() {
    const updatedGroupBills = groupBills.map(groupBill => {
        return {
            ...groupBill,
            bills: getBills(groupBill.id)
        };
    });
    return updatedGroupBills;
}

export function getGroupBillsForExport() {
    return groupBills;
}

export function createGroupBill(groupBill: IGroupBill) {
    const newGroupBill = {
        id: uuidv4(),
        userId: groupBill.userId,
        name: groupBill.name,
        description:groupBill.description,
        bills: groupBill.bills
    }
    groupBills.push(newGroupBill);
}

export function addGroupBill(groupBill: IGroupBill) {
    if (groupBills.some((gB) => gB.id === groupBill.id)) {
        return;
    }
    groupBills.push(groupBill);
}

export function addGroupBills(groupBills: IGroupBill[]) {
    groupBills.forEach((groupBill) => addGroupBill(groupBill));
}

export function updateGroupBill(groupBillId: string, groupBill: IGroupBill) {
    const indexOldGroup = groupBills.findIndex((groupBill) => groupBill.id === groupBillId);
    const newGroupBill = {
        id: groupBillId,
        userId: groupBill.userId,
        name: groupBill.name,
        description:groupBill.description,
        bills: groupBill.bills
    }

    groupBills[indexOldGroup] = newGroupBill;
}

export function deleteGroupBill(groupBillId: string) {
    groupBills = groupBills.filter((groupBill) => groupBill.id !== groupBillId);;
}

export function getIncomeByGroupBillId(groupBillId: string, startDate: string, endDate: string) {
    const bills = getBills(groupBillId);
    let sum = 0;
    bills.forEach(bill => {
        sum += getIncomeByBillId(bill.id, startDate, endDate)
    });
    return sum;
}

export function getExpensesByGroupBillId(groupBillId: string, startDate: string, endDate: string) {
    const bills = getBills(groupBillId);
    let sum = 0;
    bills.forEach(bill => {
        sum += getExpensesByBillId(bill.id, startDate, endDate)
    });
    return sum;
}

export function getBalanceByGroupBillId(groupBillId: string, startDate: string, endDate: string) {
    const income = getIncomeByGroupBillId(groupBillId, startDate, endDate);
    const expenses = getExpensesByGroupBillId(groupBillId, startDate, endDate);
    return income - expenses;
}

export function getCurrentBalanceByGroupBillId(groupBillId: string) {
    const bills = getBills(groupBillId);
    let sum = 0;
    bills.forEach(bill => {
        sum += bill.balance;
    });
    return sum;
}