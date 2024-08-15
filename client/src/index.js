import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers";
// Importing contexts
import { ColorContextProvider } from "./contexts/Color.context";
import { ReRenderProvider } from "./contexts/ReRender.context";
import { SnackBarProvider } from "./contexts/SnackBar.context";
import { ConfirmationDialogProvider } from "./contexts/ConfirmationDialog.context";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

const store = configureStore({ reducer: reducers });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <>
        <React.StrictMode>
            <ColorContextProvider>
                <Provider store={store}>
                    <ReRenderProvider>
                        <SnackBarProvider>
                            <ConfirmationDialogProvider>
                                <App />
                            </ConfirmationDialogProvider>
                        </SnackBarProvider>
                    </ReRenderProvider>
                </Provider>
            </ColorContextProvider>
        </React.StrictMode>
        <Analytics />
        <SpeedInsights />
    </>
);