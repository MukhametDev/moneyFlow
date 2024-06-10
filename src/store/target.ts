import { makeAutoObservable } from "mobx";
import { ITarget } from "../type";
import dayjs from "dayjs";
import { addTarget, deleteTarget, getTargets, updateTarget } from "../API/Manager";

const emptyTarget: ITarget = {
    id: "",
    groupBillId: "",
    name: "",
    target: 0,
    balance: 0,
    date: dayjs(),
};

class Target {
    target: ITarget = { ...emptyTarget };
    targets: ITarget[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    setTarget = (target: ITarget) => {
        this.target = { ...target };
    }

    resetTarget = () => {
        this.target = { ...emptyTarget };
    }

    setBalance = (balance: number) => {
        this.target.balance = balance;
    }

    addTarget = async (target: ITarget) => {
        await addTarget(target).then(() => {
            this.getTargets();
        })
        this.resetTarget();
    }

    updateTarget = async (id: string, target: ITarget) => {
        await updateTarget(id, target).then(() => {
            this.getTargets();
        })
        this.resetTarget();
    }

    deleteTarget = async (id: string) => {
        await deleteTarget(id).then(() => {
            this.getTargets();
        })
        this.resetTarget();
    }

    getTargets = async () => {
        await getTargets().then((response) => {
            this.targets = response.data;
        })
    }
}

export const targetStore = new Target();