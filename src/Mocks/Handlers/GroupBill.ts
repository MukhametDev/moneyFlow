import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { OUR_API_ADDRESS, OUR_API_ENDPOINTS } from "../../API/Manager";
import {
    getGroupBill,
    createGroupBill,
    updateGroupBill,
    deleteGroupBill,
    getGroupBills,
    getIncomeByGroupBillId,
    getExpensesByGroupBillId,
    getBalanceByGroupBillId,
    getCurrentBalanceByGroupBillId,
} from "../Models/GroupBill";
import { IGroupBill } from "../../type";

interface IGroupBillHandler {
    params: {
        groupBillId: string;
    };
    request?: StrictRequest<DefaultBodyType> | undefined;
};


const groupBillUrl = OUR_API_ADDRESS + "/" + OUR_API_ENDPOINTS.GROUPBILL;
const groupBillIdUrl = groupBillUrl + "/:" + OUR_API_ENDPOINTS.GROUPBILLID;
const groupBillIncomeUrl = groupBillUrl + "/" + OUR_API_ENDPOINTS.INCOME + "/:" + OUR_API_ENDPOINTS.GROUPBILLID;
const groupBillExpensesUrl = groupBillUrl + "/" + OUR_API_ENDPOINTS.EXPENSES + "/:" + OUR_API_ENDPOINTS.GROUPBILLID;
const groupBillBalanceUrl = groupBillUrl + "/" + OUR_API_ENDPOINTS.BALANCE + "/:" + OUR_API_ENDPOINTS.GROUPBILLID;
const groupBillCurrentBalanceUrl = groupBillUrl + "/" + OUR_API_ENDPOINTS.CURRENT + "/:" + OUR_API_ENDPOINTS.GROUPBILLID;

export const groupBillHandlers = [

    http.get(groupBillUrl, () => {
        const groupBills = getGroupBills();
        return HttpResponse.json(groupBills);
    }),

    http.get(groupBillIdUrl, async ({ params }: IGroupBillHandler) => {
        const { groupBillId } = params;
        const groupBill = getGroupBill(groupBillId);
        return HttpResponse.json(groupBill);
    }),

    http.post(groupBillUrl, async ({ request }) => {
        const data = (await request.json()) as IGroupBill;
        createGroupBill(data);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),

    http.put(groupBillIdUrl, async ({ params, request }: IGroupBillHandler) => {
        if (request) {
            const { groupBillId } = params;
            const groupBill = (await request.json()) as IGroupBill;
            updateGroupBill(groupBillId, groupBill);
            return HttpResponse.json({ success: true }, { status: 200 });
        }
        return HttpResponse.error();
    }),

    http.delete(groupBillIdUrl, async ({ params }: IGroupBillHandler) => {
        const { groupBillId } = params;
        deleteGroupBill(groupBillId);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),

    http.get(groupBillIncomeUrl, async ({ params, request }: IGroupBillHandler) => {
        const { groupBillId } = params;

        if (request) {
            const url = new URL(request.url);
            const startDate = url.searchParams.get("startDate");
            const endDate = url.searchParams.get("endDate");
            if (startDate && endDate) {
                const sum = getIncomeByGroupBillId(groupBillId, startDate, endDate);
                return HttpResponse.json(sum, { status: 200 });
            }
        }

        return HttpResponse.error();
    }),

    http.get(groupBillExpensesUrl, async ({ params, request }: IGroupBillHandler) => {
        const { groupBillId } = params;

        if (request) {
            const url = new URL(request.url);
            const startDate = url.searchParams.get("startDate");
            const endDate = url.searchParams.get("endDate");
            if (startDate && endDate) {
                const sum = getExpensesByGroupBillId(groupBillId, startDate, endDate);
                return HttpResponse.json(sum, { status: 200 });
            }
        }

        return HttpResponse.error();
    }),

    http.get(groupBillBalanceUrl, async ({ params, request }: IGroupBillHandler) => {
        const { groupBillId } = params;

        if (request) {
            const url = new URL(request.url);
            const startDate = url.searchParams.get("startDate");
            const endDate = url.searchParams.get("endDate");
            if (startDate && endDate) {
                const balance = getBalanceByGroupBillId(groupBillId, startDate, endDate);
                return HttpResponse.json(balance, { status: 200 });
            }
        }

        return HttpResponse.error();
    }),

    http.get(groupBillCurrentBalanceUrl, async ({ params }: IGroupBillHandler) => {
        const { groupBillId } = params;
        const balance = getCurrentBalanceByGroupBillId(groupBillId);
        return HttpResponse.json(balance, { status: 200 });
    }),
];
