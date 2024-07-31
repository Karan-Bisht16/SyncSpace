import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { ColorContextProvider, ReRenderProvider, ConfirmationDialogProvider, SnackBarProvider } from "./store";

const store = configureStore({ reducer: reducers });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <>
        <React.StrictMode>
            <ColorContextProvider>
                <Provider store={store}>
                    <ReRenderProvider>
                        <ConfirmationDialogProvider>
                            <SnackBarProvider>
                                <App />
                            </SnackBarProvider>
                        </ConfirmationDialogProvider>
                    </ReRenderProvider>
                </Provider>
            </ColorContextProvider>
        </React.StrictMode>
        <Analytics />
        <SpeedInsights />
    </>
);