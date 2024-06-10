import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { OUR_API_ADDRESS, OUR_API_ENDPOINTS } from "../../API/Manager";
import {
    updateBill,
    getBill,
    createBill,
    deleteBill,
    bills,
    getIncomeByBillId,
    getExpensesByBillId,
    getBalanceByBillId,
    getCurrentBalanceByBillId,
} from "../Models/Bill";
import { IBill } from "../../type";

interface IBillHandler {
    params: {
        billId: string;
    };
    request?: StrictRequest<DefaultBodyType> | undefined;
};

const billUrl = OUR_API_ADDRESS + "/" + OUR_API_ENDPOINTS.BILLS;
const billIdUrl = billUrl + "/:" + OUR_API_ENDPOINTS.BILLID;
const billIncomeUrl = billUrl + "/" + OUR_API_ENDPOINTS.INCOME + "/:" + OUR_API_ENDPOINTS.BILLID;
const billExpensesUrl = billUrl + "/" + OUR_API_ENDPOINTS.EXPENSES + "/:" + OUR_API_ENDPOINTS.BILLID;
const billBalanceUrl = billUrl + "/" + OUR_API_ENDPOINTS.BALANCE + "/:" + OUR_API_ENDPOINTS.BILLID;
const billCurrentBalanceUrl = billUrl + "/" + OUR_API_ENDPOINTS.CURRENT + "/:" + OUR_API_ENDPOINTS.BILLID;

export const billHandlers = [

    http.get(billUrl, () => {
        return HttpResponse.json(bills);
    }),

    http.get(billIdUrl, async ({ params }: IBillHandler) => {
        const { billId } = params;
        const bill = getBill(billId);
        return HttpResponse.json(bill);
    }),

    http.post(billUrl, async ({ request }) => {
        const data = (await request.json()) as IBill;
        createBill(data);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),

    http.put(billIdUrl, async ({ params, request }: IBillHandler) => {
        if (request) {
            const { billId } = params;
            const bill = (await request.json()) as IBill;
            updateBill(billId, bill);
            return HttpResponse.json({ success: true }, { status: 200 });
        }
        return HttpResponse.error();
    }),

    http.delete(billIdUrl, async ({ params }: IBillHandler) => {
        const { billId } = params;
        deleteBill(billId);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),

    http.get(billIncomeUrl, async ({ params, request }: IBillHandler) => {
        const { billId } = params;

        if (request) {
            const url = new URL(request.url);
            const startDate = url.searchParams.get("startDate");
            const endDate = url.searchParams.get("endDate");
            if (startDate && endDate) {
                const sum = getIncomeByBillId(billId, startDate, endDate);
                return HttpResponse.json(sum, { status: 200 });
            }
        }

        return HttpResponse.error();
    }),

    http.get(billExpensesUrl, async ({ params, request }: IBillHandler) => {
        const { billId } = params;

        if (request) {
            const url = new URL(request.url);
            const startDate = url.searchParams.get("startDate");
            const endDate = url.searchParams.get("endDate");
            if (startDate && endDate) {
                const sum = getExpensesByBillId(billId, startDate, endDate);
                return HttpResponse.json(sum, { status: 200 });
            }
        }

        return HttpResponse.error();
    }),

    http.get(billBalanceUrl, async ({ params, request }: IBillHandler) => {
        const { billId } = params;

        if (request) {
            const url = new URL(request.url);
            const startDate = url.searchParams.get("startDate");
            const endDate = url.searchParams.get("endDate");
            if (startDate && endDate) {
                const balance = getBalanceByBillId(billId, startDate, endDate);
                return HttpResponse.json(balance, { status: 200 });
            }
        }

        return HttpResponse.error();
    }),

    http.get(billCurrentBalanceUrl, async ({ params }: IBillHandler) => {
        const { billId } = params;
        const balance = getCurrentBalanceByBillId(billId);
        return HttpResponse.json(balance, { status: 200 });
    }),
];
