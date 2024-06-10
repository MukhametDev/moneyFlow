import { ITarget } from "../../type";
import { getCurrentBalanceByGroupBillId } from "./GroupBill";
import { v4 as uuidv4 } from 'uuid';

const targets = [
    {
        id: '1',
        groupBillId: '411ce821-5ba7-4829-a3c9-d31f2763d26e',
        name: 'Цель A',
        target: 500,
        balance: 0,
        date: '2024-06-08T00:00:00+01:00',
    },
    {
        id: '2',
        groupBillId: '411ce821-5ba7-4829-a3c9-d31f2763d26e',
        name: 'Цель B',
        target: 1000,
        balance: 0,
        date: '2024-06-08T00:00:00+01:00',
    },
    {
        id: '3',
        groupBillId: '411ce821-5ba7-4829-a3c9-d31f2763d26e',
        name: 'Цель C',
        target: 750,
        balance: 0,
        date: '2024-06-08T00:00:00+01:00',
    }
];

export function getTargets() {
    targets.forEach(target => {
        target.balance = getCurrentBalanceByGroupBillId(target.groupBillId);
    })

    return targets;
}

export function addTarget(target: ITarget) {
    const newTarget = {
        id: uuidv4(),
        groupBillId: target.groupBillId,
        name: target.name,
        target: target.target,
        balance: getCurrentBalanceByGroupBillId(target.groupBillId),
        date: target.date.toString()
    }

    targets.push(newTarget);
}

export function updateTarget(id: string, target: ITarget) {
    const index = targets.findIndex((t) => t.id === id);
    const newTarget = {
        id: id,
        groupBillId: target.groupBillId,
        name: target.name,
        target: target.target,
        balance: getCurrentBalanceByGroupBillId(target.groupBillId),
        date: target.date.toString()
    }
    if (index !== -1) {
        targets[index] = newTarget;
    }
}

export function deleteTarget(id: string) {
    const index = targets.findIndex((t) => t.id === id);
    if (index !== -1) {
        targets.splice(index, 1);
    }
}

export function getTarget(id: string) {
    return targets.find((t) => t.id === id);
}