import { makeAutoObservable } from "mobx";
import { IBill } from "../type";

const emptyBill: IBill = {
    id: "",
    group_bill_id: "",
    name: "",
    balance: 0
};

class Bill {
    bill: IBill = { ...emptyBill };

    constructor() {
        makeAutoObservable(this)
    }

    setBill(bill: IBill) {
        this.bill = { ...bill };
    }

    resetBill() {
        this.bill = { ...emptyBill };
    }

    setBalance = (balance: number) => {
        this.bill.balance = balance;
    }
}

export const billStore = new Bill();