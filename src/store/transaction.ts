import { makeAutoObservable } from "mobx";
import dayjs, { Dayjs } from "dayjs";
import {
    createTransaction,
    deleteTransaction,
    getIncomeByBillId,
    getIncomeByGroupBillId,
    getTxByBillId,
    getTxByGroupBillId,
    updateTransaction,
    getBalanceByBillId,
    getCurrentBalanceByBillId,
    getExpensesByBillId,
    getCurrentBalanceByGroupBillId,
    getBalanceByGroupBillId,
    getExpensesByGroupBillId,
} from "../API/Manager";
import { ITransaction, TransactionType } from "../type";
import { billStore } from "./bill";
import { groupBillStore } from "./groupBill";

class Transaction {
    // ------------- Categories -------------
    categories = [
        "Без категории",
        "Продукты",
        "Рестораны и кафе",
        "Транспорт",
        "Жилье",
        "Коммунальные услуги",
        "Одежда и аксессуары",
        "Здоровье и красота",
        "Развлечения",
        "Путешествия",
        "Образование",
        "Подарки",
    ];

    // ------------- State -------------
    transaction: ITransaction = {
        id: "",
        category: this.categories[0],
        amount: 0,
        date: dayjs(),
        comment: "",
        type: TransactionType.Expense,
        billId: "",
    };

    transactions: ITransaction[] = [];
    type: TransactionType = TransactionType.Expense;

    dataChart: { label: string; value: number; }[] = [];

    income: number = 0;
    expense: number = 0;
    balance: number = 0;
    current: number = 0;

    startDate = dayjs().startOf("month");
    endDate = dayjs().endOf("month");

    isLoading = false;

    constructor() {
        makeAutoObservable(this);
        this.resetDataChart();
    }

    // ------------- Chart Methods -------------
    getCategoryChart = () => {
        this.resetDataChart();
        this.transactions.forEach(transaction => {
            if (transaction.type === this.type) {
                const categoryIndex = this.categories.indexOf(transaction.category);
                if (categoryIndex !== -1) {
                    this.dataChart[categoryIndex].value += transaction.amount;
                }
            }
        });
        this.dataChart = this.dataChart.filter(data => data.value !== 0);
        this.sortDataChart();
    };

    resetDataChart = () => {
        this.dataChart = this.categories.map(category => ({ label: category, value: 0 }));
    };

    sortDataChart = () => {
        this.dataChart.sort((a, b) => b.value - a.value);
    }

    // ------------- Setters -------------
    setType = (type: TransactionType) => {
        this.type = type;
        this.getCategoryChart();
    };

    setTransaction = (transaction: ITransaction) => {
        this.transaction = { ...transaction };
    };

    resetTransaction = () => {
        this.transaction = {
            id: "",
            category: this.transaction.category,
            amount: 0,
            date: dayjs(),
            comment: "",
            type: this.transaction.type,
            billId: "",
        };
    };

    setTransactionType = (type: TransactionType) => {
        this.transaction.type = type;
    };

    setTransactions = (data: any) => {
        if (data) {
            this.transactions = data.map((data: ITransaction) => ({
                ...data,
                date: dayjs(data.date).startOf('day'),
            }));
        }
    };

    setIsLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    };

    setIncome = (income: number) => {
        this.income = income;
    };

    setExpense = (expense: number) => {
        this.expense = expense;
    };

    setBalance = (balance: number) => {
        this.balance = balance;
    };

    setCurrent = (current: number) => {
        this.current = current;
    };

    setDate = (startDate: Dayjs, endDate: Dayjs) => {
        this.startDate = startDate.startOf('day');
        this.endDate = endDate.endOf('day');
        this.getTransactions().then(() => this.updateGeneral()).then(() => this.getCategoryChart());
    };

    // ------------- Transaction Methods -------------
    getTransactions = async () => {
        const billId = billStore.bill.id;
        const groupBillId = groupBillStore.groupBill.id;

        try {
            let response;

            if (billId) {
                response = await getTxByBillId(billId);
            } else if (groupBillId) {
                response = await getTxByGroupBillId(groupBillId);
            }

            if (response) {
                const transactions = response.data.filter((transaction: ITransaction) => {
                    const transactionDate = dayjs(transaction.date).startOf("day");
                    return transactionDate.isAfter(this.startDate) && transactionDate.isBefore(this.endDate);
                });
                this.setTransactions(transactions);
            }
            this.setIsLoading(true);

        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            this.setIsLoading(false);
        }
    };

    addTransaction = async (transaction: ITransaction) => {
        try {
            await createTransaction(transaction);
            await this.getTransactions();
            await this.updateGeneral();
            await groupBillStore.fetchGroupBills();
            this.resetTransaction();
        } catch (error) {
            console.error("Failed to add transaction", error);
        }
    };

    updateTransaction = async (transactionId: string, transaction: ITransaction) => {
        try {
            await updateTransaction(transactionId, transaction);
            await this.getTransactions();
            await this.updateGeneral();
            await groupBillStore.fetchGroupBills();
            this.resetTransaction();
        } catch (error) {
            console.error("Failed to update transaction", error);
        }
    };

    deleteTransaction = async (transactionId: string) => {
        try {
            await deleteTransaction(transactionId);
            await this.getTransactions();
            await this.updateGeneral();
            await groupBillStore.fetchGroupBills();
            this.resetTransaction();
        } catch (error) {
            console.error("Failed to delete transaction", error);
        }
    };

    // ------------- Data Fetching -------------
    fetchData = async (billId: string, groupBillId: string, fetchByBillId: Function, fetchByGroupBillId: Function) => {
        try {
            const responseByBill = await fetchByBillId(billId, this.startDate.toString(), this.endDate.toString());
            const responseByGroupBill = await fetchByGroupBillId(groupBillId, this.startDate.toString(), this.endDate.toString());
            return responseByBill.data + responseByGroupBill.data;
        } catch (error) {
            console.error("Failed to fetch data", error);
            return 0;
        }
    };

    // ------------- General Update -------------
    updateGeneral = async () => {
        try {
            const billId = billStore.bill.id;
            const groupBillId = groupBillStore.groupBill.id;

            this.setIncome(await this.fetchData(billId, groupBillId, getIncomeByBillId, getIncomeByGroupBillId));
            this.setExpense(await this.fetchData(billId, groupBillId, getExpensesByBillId, getExpensesByGroupBillId));
            this.setBalance(await this.fetchData(billId, groupBillId, getBalanceByBillId, getBalanceByGroupBillId));

            const currentByBill = await getCurrentBalanceByBillId(billId);
            const currentByGroupBill = await getCurrentBalanceByGroupBillId(groupBillId);
            this.setCurrent(currentByBill.data + currentByGroupBill.data);
        } catch (error) {
            console.error("Failed to update general data", error);
        }
    };
}

export const tranStore: Transaction = new Transaction();
