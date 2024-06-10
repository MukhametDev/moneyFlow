import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from "./store/authStore";

let serverReady: Promise<void>;
/**
 * Please prefer conditionally including a mocking file via bundler
 * during the build of your application.
 */
if (process.env.NODE_ENV === "development") {
    serverReady = import("./Mocks/index").then(({ startWorker }) => {
        return startWorker();
    });
} else {
    serverReady = Promise.resolve();
}
// interface State {
//     store: AuthStore;
// }



export const Context = createContext({
    store,
});

serverReady.then(() => {
    const root = ReactDOM.createRoot(
        document.getElementById("root") as HTMLElement
    );
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Context.Provider
                    value={{
                        store,
                    }}
                >
                    <App />
                </Context.Provider>
            </BrowserRouter>
        </React.StrictMode>
    );
});
