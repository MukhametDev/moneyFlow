import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { OUR_API_ADDRESS, OUR_API_ENDPOINTS } from "../../API/Manager";
import { exportData, importData } from "../Models/Data";

interface IDataHandler {
    request: StrictRequest<DefaultBodyType> | undefined;
};

interface IData {
    groupBills: any;
    bills: any;
    transactions: any;
}

const dataUrl = OUR_API_ADDRESS + "/" + OUR_API_ENDPOINTS.DATA;

export const dataHandlers = [

    http.get(dataUrl, async () => {
        exportData();
        return HttpResponse.json({ success: true }, { status: 200 });
    }),

    http.post(dataUrl, async ({ request }: IDataHandler) => {
        if (request) {
            const data = (await request.json()) as IData;
            importData(data);
            return HttpResponse.json({ success: true }, { status: 200 });
        }
        return HttpResponse.error();
    }),
];
