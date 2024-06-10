import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { OUR_API_ADDRESS, OUR_API_ENDPOINTS } from "../../API/Manager";
import {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
} from "../Models/Transaction";
import { ITransaction } from "../../type";

interface ITransactionHandler {
    params: {
        transactionId: string;
    };
    request?: StrictRequest<DefaultBodyType> | undefined;
};

const transactionUrl = OUR_API_ADDRESS + "/" + OUR_API_ENDPOINTS.TRANSACTION;
const transactionIdUrl =
    transactionUrl + "/:" + OUR_API_ENDPOINTS.TRANSACTIONID;

export const transactionHandlers = [

    http.get(transactionIdUrl, async ({ params }: ITransactionHandler) => {
        const { transactionId } = params;
        const transaction = getTransaction(transactionId);
        return HttpResponse.json(transaction);
    }),

    http.post(transactionUrl, async ({ request }) => {
        const data = (await request.json()) as ITransaction;
        createTransaction(data);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),

    http.put(
        transactionIdUrl,
        async ({ params, request }: ITransactionHandler) => {
            if (request) {
                const { transactionId } = params;
                const transaction = (await request.json()) as ITransaction;
                updateTransaction(transactionId, transaction);
                return HttpResponse.json({ success: true }, { status: 200 });
            }
            return HttpResponse.error();
        }
    ),

    http.delete(transactionIdUrl, async ({ params }: ITransactionHandler) => {
        const { transactionId } = params;
        deleteTransaction(transactionId);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),
];
