import { ITransaction } from "../../type";
import { getBill, getBills, updateBill } from "./Bill";
import { v4 as uuidv4 } from 'uuid';

export let transactions = [
    {
        id: "g7h8i9j0-k1l2-3m4n-5o6p-7q8r9s0t1u2v3",
        category: "Транспорт",
        amount: 35,
        date: "2020-06-20T15:30:00+01:00",
        comment: "Проезд на автобусе",
        type: "Expense",
        billId: "00924f0b-c772-491f-831a-80329a07d0fa"
    },
    {
        id: "q1r2s3t4-u5v6-7w8x-9y0z-a1b2c3d4e5f6",
        category: "Здоровье",
        amount: 75,
        date: "2020-06-15T10:00:00+01:00",
        comment: "Посещение стоматолога",
        type: "Expense",
        billId: "00924f0b-c772-491f-831a-80329a07d0fa"
    },
    {
        id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p",
        category: "Продукты",
        amount: 120,
        date: "2020-06-10T17:45:00+01:00",
        comment: "Продукты в супермаркете",
        type: "Expense",
        billId: "00924f0b-c772-491f-831a-80329a07d0fa"
    },
    {
        id: "f2a35c7d-b3f6-4d6f-b2d9-c7d3a6e0a8f1",
        category: "Рестораны и кафе",
        amount: 450,
        date: "2020-06-10T13:30:00+01:00",
        comment: "Обед в ресторане",
        type: "Expense",
        billId: "00924f0b-c772-491f-831a-80329a07d0fa"
    },
    {
        id: "bf8e0573-1e02-4798-a48e-3d760b89f47c",
        category: "Развлечения",
        amount: 258,
        date: "2024-05-12T11:00:00+01:00",
        comment: "За такси утром",
        type: "Income",
        billId: "00924f0b-c772-491f-831a-80329a07d0fa"
    },
    {
        id: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m2n4o5",
        category: "Без категории",
        amount: 100,
        date: "2024-06-02T00:00:00+01:00",
        comment: "New Transaction",
        type: "Expense",
        billId: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5"
    }
]

export function sortTransactions() {
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTransaction(transactionId: string) {
    const transactions = sortTransactions();
    return transactions.find((transaction) => transaction.id === transactionId);
}

export function getTransactions() {
    return transactions;
}

// get transactions by bill_id
export function getTxByBillId(billId: string) {
    const transactions = sortTransactions();
    return transactions.filter((transaction) => transaction.billId === billId);
}

// get transactions by group_bill_id
export function getTxByGroupBillId(groupBillId: string) {
    const transactions = sortTransactions();
    const bills = getBills(groupBillId);
    const billIds = bills.filter((bill) => bill.group_bill_id === groupBillId).map((bill) => bill.id);
    return transactions.filter((transaction) => billIds.includes(transaction.billId));
}

export function createTransaction(transaction: ITransaction) {
    const type = transaction.type;
    const bill = getBill(transaction.billId);

    const newTransaction = {
        id: uuidv4(),
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date.toString(),
        comment: transaction.comment,
        type: type,
        billId: transaction.billId,
    }
    transactions.push(newTransaction);

    if (bill) {
        if (type === "Income") {
            bill.balance += transaction.amount;
            updateBill(bill.id, bill);
        } else {
            bill.balance -= transaction.amount;
            updateBill(bill.id, bill);
        }
    }
}

export function addTransaction(transaction: ITransaction) {
    if (transactions.some((t) => t.id === transaction.id)) {
        return;
    }

    const newTransaction = {
        id: transaction.id,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date.toString(),
        comment: transaction.comment,
        type: transaction.type,
        billId: transaction.billId,
    }

    transactions.push(newTransaction);
}

export function addTransactions(newTrans: ITransaction[]) {
    newTrans.forEach((transaction) => addTransaction(transaction));
}

export function updateTransaction(transactionId: string, transaction: ITransaction) {
    const indexOldTran = transactions.findIndex((transaction) => transaction.id === transactionId);
    const oldTransaction = transactions[indexOldTran];
    const bill = getBill(transaction.billId);
    const type = transaction.type;

    const newTransaction = {
        id: transactionId,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date.toString(),
        comment: transaction.comment,
        type: type,
        billId: transaction.billId,
    }

    transactions[indexOldTran] = newTransaction;

    if (bill) {
        if (oldTransaction.type === "Income") {
            bill.balance -= oldTransaction.amount;
        } else {
            bill.balance += oldTransaction.amount;
        }

        if (type === "Income") {
            bill.balance += transaction.amount;
        } else {
            bill.balance -= transaction.amount;
        }

        updateBill(bill.id, bill);
    }
}

export function deleteTransaction(transactionId: string) {
    transactions = transactions.filter((transaction) => transaction.id !== transactionId);;

    const bill = getBill(transactionId);
    if (bill) {
        const transaction = getTransaction(transactionId);
        if (transaction) {
            if (transaction.type === "Income") {
                bill.balance -= transaction.amount;
            } else {
                bill.balance += transaction.amount;
            }
            updateBill(bill.id, bill);
        }
    }
}