import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { OUR_API_ADDRESS, OUR_API_ENDPOINTS } from "../../API/Manager";
import { addTarget, deleteTarget, getTargets, updateTarget } from "../Models/Targets";
import { ITarget } from "../../type";

interface ITargetHandler {
    params: {
        targetId: string;
    };
    request?: StrictRequest<DefaultBodyType> | undefined;
};

const targetUrl = OUR_API_ADDRESS + "/" + OUR_API_ENDPOINTS.TARGETS;
const targetIdUrl = targetUrl + "/:" + OUR_API_ENDPOINTS.TARGETID;

export const targetHandlers = [

    http.get(targetUrl, async () => {
        const targets = getTargets();
        return HttpResponse.json(targets);
    }),

    http.post(targetUrl, async ({ request }: ITargetHandler) => {
        if (request) {
            const data = (await request.json()) as ITarget;
            addTarget(data);
            return HttpResponse.json({ success: true }, { status: 200 });

        }
        return HttpResponse.error();
    }),

    http.put(
        targetIdUrl,
        async ({ params, request }: ITargetHandler) => {
            if (request) {
                const { targetId } = params;
                const target = (await request.json()) as ITarget;
                updateTarget(targetId, target);
                return HttpResponse.json({ success: true }, { status: 200 });
            }
            return HttpResponse.error();
        }
    ),

    http.delete(targetIdUrl, async ({ params }: ITargetHandler) => {
        const { targetId } = params;
        deleteTarget(targetId);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),
];
