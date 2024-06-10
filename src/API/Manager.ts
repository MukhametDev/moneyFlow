import { AxiosResponse } from "axios";
import { Authresponse, IBill, IGroupBill, ITarget, ITransaction } from "../type";
import { $api, deleteJson, getJson, postJson, putJson } from "./helper";

export const OUR_API_ADDRESS = `http://localhost:8000`;
console.log(OUR_API_ADDRESS)
export enum OUR_API_ENDPOINTS {
    TRANSACTIONS = 'transactions',
    TRANSACTION = 'transaction',
    TRANSACTIONID = 'transactionId',
    GROUPBILL = 'group-bill',
    GROUPBILLID = 'groupBillId',
    BILLS = 'bills',
    BILLID = 'billId',
    INCOME = 'income',
    EXPENSES = 'expenses',
    BALANCE = 'balance',
    CURRENT = 'current',
    DATA = 'data',
    TARGETS = 'targets',
    TARGETID = 'targetId',
}

const buildUrl = (endpoint: string, id?: string) => {
    return `${OUR_API_ADDRESS}/${endpoint}${id ? `/${id}` : ''}`;
}

// ------------- General -------------

export function exportData() {
    return getJson(buildUrl(OUR_API_ENDPOINTS.DATA));
}

export function importData(data: any) {
    return postJson(buildUrl(OUR_API_ENDPOINTS.DATA), data);
}

// ------------- Target -------------

export function getTargets() {
    return getJson(buildUrl(OUR_API_ENDPOINTS.TARGETS));
}

export function addTarget(target: ITarget) {
    return postJson(buildUrl(OUR_API_ENDPOINTS.TARGETS), target);
}

export function updateTarget(targetId: string, target: ITarget) {
    return putJson(buildUrl(OUR_API_ENDPOINTS.TARGETS, targetId), target);
}

export function deleteTarget(targetId: string) {
    return deleteJson(buildUrl(OUR_API_ENDPOINTS.TARGETS, targetId));
}

// ------------- Transactions -------------

export function getTransactions() {
    return getJson(buildUrl(OUR_API_ENDPOINTS.TRANSACTIONS));
}

// get transactions by bill_id
export function getTxByBillId(billId: string) {
    return getJson(buildUrl(OUR_API_ENDPOINTS.TRANSACTIONS, billId));
}

// get transactions by group_bill_id
export function getTxByGroupBillId(groupBillId: string) {
    const url = OUR_API_ENDPOINTS.TRANSACTIONS + '/' + OUR_API_ENDPOINTS.GROUPBILL;
    return getJson(buildUrl(url, groupBillId));
}

// ------------- Transaction -------------

export function getTransaction(transactionId: string) {
    return getJson(buildUrl(OUR_API_ENDPOINTS.TRANSACTION, transactionId));
}

export function createTransaction(transaction: ITransaction) {
    return postJson(buildUrl(OUR_API_ENDPOINTS.TRANSACTION), transaction);
}

export function updateTransaction(transactionId: string, transaction: ITransaction) {
    return putJson(buildUrl(OUR_API_ENDPOINTS.TRANSACTION, transactionId), transaction);
}

export function deleteTransaction(transactionId: string) {
    return deleteJson(buildUrl(OUR_API_ENDPOINTS.TRANSACTION, transactionId));
}

// ------------- Group Bill -------------

export function getGroupBills() {
    return getJson(buildUrl(OUR_API_ENDPOINTS.GROUPBILL));
}

export function getGroupBill(groupBillId: string) {
    return getJson(buildUrl(OUR_API_ENDPOINTS.GROUPBILL, groupBillId));
}

export function createGroupBill(groupBill: IGroupBill) {
    return postJson(buildUrl(OUR_API_ENDPOINTS.GROUPBILL), groupBill);
}

export function updateGroupBill(groupBillId: string, groupBill: IGroupBill) {
    return putJson(buildUrl(OUR_API_ENDPOINTS.GROUPBILL, groupBillId), groupBill);
}

export function deleteGroupBill(groupBillId: string) {
    return deleteJson(buildUrl(OUR_API_ENDPOINTS.GROUPBILL, groupBillId));
}

export function getIncomeByGroupBillId(groupBillId: string, startDate: string, endDate: string) {
    const url = OUR_API_ENDPOINTS.GROUPBILL + '/' + OUR_API_ENDPOINTS.INCOME;
    return getJson(buildUrl(url, groupBillId) + `?startDate=${startDate}&endDate=${endDate}`);
}

export function getExpensesByGroupBillId(groupBillId: string, startDate: string, endDate: string) {
    const url = OUR_API_ENDPOINTS.GROUPBILL + '/' + OUR_API_ENDPOINTS.EXPENSES;
    return getJson(buildUrl(url, groupBillId) + `?startDate=${startDate}&endDate=${endDate}`);
}

export function getBalanceByGroupBillId(groupBillId: string, startDate: string, endDate: string) {
    const url = OUR_API_ENDPOINTS.GROUPBILL + '/' + OUR_API_ENDPOINTS.BALANCE;
    return getJson(buildUrl(url, groupBillId) + `?startDate=${startDate}&endDate=${endDate}`);
}

export function getCurrentBalanceByGroupBillId(groupBillId: string) {
    const url = OUR_API_ENDPOINTS.GROUPBILL + '/' + OUR_API_ENDPOINTS.CURRENT;
    return getJson(buildUrl(url, groupBillId));
}

// ------------- Bill -------------

export function getBills() {
    return getJson(buildUrl(OUR_API_ENDPOINTS.BILLS));
}

export function getBill(billId: string) {
    return getJson(buildUrl(OUR_API_ENDPOINTS.BILLS, billId));
}

export function createBill(bill: IBill) {
    return postJson(buildUrl(OUR_API_ENDPOINTS.BILLS), bill);
}

export function updateBill(billId: string, bill: IBill) {
    return putJson(buildUrl(OUR_API_ENDPOINTS.BILLS, billId), bill);
}

export function deleteBill(billId: string) {
    return deleteJson(buildUrl(OUR_API_ENDPOINTS.BILLS, billId));
}

export function getIncomeByBillId(billId: string, startDate: string, endDate: string) {
    const url = OUR_API_ENDPOINTS.BILLS + '/' + OUR_API_ENDPOINTS.INCOME;
    return getJson(buildUrl(url, billId) + `?startDate=${startDate}&endDate=${endDate}`);
}

export function getExpensesByBillId(billId: string, startDate: string, endDate: string) {
    const url = OUR_API_ENDPOINTS.BILLS + '/' + OUR_API_ENDPOINTS.EXPENSES;
    return getJson(buildUrl(url, billId) + `?startDate=${startDate}&endDate=${endDate}`);
}

export function getBalanceByBillId(billId: string, startDate: string, endDate: string) {
    const url = OUR_API_ENDPOINTS.BILLS + '/' + OUR_API_ENDPOINTS.BALANCE;
    return getJson(buildUrl(url, billId) + `?startDate=${startDate}&endDate=${endDate}`);
}

export function getCurrentBalanceByBillId(billId: string) {
    const url = OUR_API_ENDPOINTS.BILLS + '/' + OUR_API_ENDPOINTS.CURRENT;
    return getJson(buildUrl(url, billId));
}

export default class AuthService{
    static async login(username:string,email:string,password:string):Promise<AxiosResponse<Authresponse>>{
        return $api.post<Authresponse>('auth/login',{username,email,password})
    }

    static async registration(username:string,email:string,password:string):Promise<AxiosResponse<Authresponse>>{
        return $api.post<Authresponse>('auth/register',{username,email,password})
    }

    static async logout():Promise<void>{
        return $api.post ('auth/logout')
    }
    
}