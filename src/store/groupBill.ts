import { makeAutoObservable } from "mobx";
import { IGroupBill } from "../type";
import { getGroupBills } from "../API/Manager";


const emptyGroupBill: IGroupBill = {
    id: "",
    userId: "",
    name: "",
    description:"",
    bills: []
};

class GroupBill {
    groupBill = { ...emptyGroupBill };
    groupBills: IGroupBill[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    setGroupBill(groupBill: IGroupBill) {
        this.groupBill = { ...groupBill };
    }

    setGroupBills(groupBills: IGroupBill[]) {
        this.groupBills = [...groupBills];
    }

    resetGroupBill() {
        this.groupBill = { ...emptyGroupBill };
    }

    fetchGroupBills = async () => {
        try {
            getGroupBills()
            .then((response) => this.setGroupBills(response.data))
            .catch((err)=>console.log(err))
        } catch (error) {
            console.error("Failed to fetch group bills", error);
        }
    }
}

export const groupBillStore = new GroupBill();