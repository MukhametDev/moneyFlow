import { addGroupBills, getGroupBillsForExport } from "./GroupBill";
import { addTransactions, getTransactions } from "./Transaction";
import { addBills, getBillsForExport } from "./Bill";
import { IBill, IGroupBill, ITransaction } from "../../type";

export function exportData() {
    const data = {
        groupBills: getGroupBillsForExport(),
        bills: getBillsForExport(),
        transactions: getTransactions(),
    }

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
}

export function importData(data: { groupBills: IGroupBill[]; bills: IBill[]; transactions: ITransaction[] }) {
    addTransactions(data.transactions);
    addGroupBills(data.groupBills);
    addBills(data.bills);
}