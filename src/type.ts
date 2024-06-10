import { Dayjs } from "dayjs";

export enum TransactionType {
    Expense = 'Expense',
    Income = 'Income'
}

export interface ITransaction {
    id: string;
    category: string;
    amount: number;
    date: Dayjs;
    comment: string;
    type: TransactionType;
    billId: string;
}

export interface IGroupBill {
    id: string;
    userId: string;
    name: string;
    description:string;
    bills: IBill[]
}

export interface IBill {
    id: string;
    group_bill_id: string;
    name: string;
    balance: number;
}

export interface ITarget {
    id: string;
    groupBillId: string;
    name: string;
    target: number;
    balance: number;
    date: Dayjs;
}

export interface IDataItems {
    url: string;
    title: string;
    id: string;
}

export interface IData {
    email: string;
    username:string
    password: string;
}

export interface IUser{
    email:string
    isActivated:boolean
    username:string
    id:string
}

export interface Authresponse{
    access_token:string
    refresh_token:string
    user:IUser
}

export interface AuthRefreshResponse{
    data:IUser
    access_token:string
}

