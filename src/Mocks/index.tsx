import { setupWorker, SetupWorker } from "msw/browser";
import { groupBillHandlers } from "./Handlers/GroupBill";
import { billHandlers } from "./Handlers/Bill";
import { transactionHandlers } from "./Handlers/Transaction";
import { transactionsHandlers } from "./Handlers/Transactions";
import { dataHandlers } from "./Handlers/Data";
import { targetHandlers } from "./Handlers/Target";

const worker: SetupWorker = setupWorker(
    ...groupBillHandlers,
    ...billHandlers,
    ...transactionHandlers,
    ...transactionsHandlers,
    ...dataHandlers,
    ...targetHandlers
);

export function startWorker(): Promise<void> | void {
    if (process.env.NODE_ENV !== "development") {
        console.log("develop");
        return worker.start({
            serviceWorker: {
                url: "/cost-control-pages/mockServiceWorker.js",
            },
            onUnhandledRequest(req, print) {
                return; // Пропустим все запросы, не подходящие под наши хэндлеры
            },
        }) as Promise<void>; // либа не экспортирует нужный интерфейс
    } else {
        console.log("MSW is disabled in production mode");
    }
}
