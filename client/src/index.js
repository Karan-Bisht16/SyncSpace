import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers";
import { ColorContextProvider, ReRenderProvider } from "./store";

const store = configureStore({ reducer: reducers });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ColorContextProvider>
            <Provider store={store}>
                <ReRenderProvider>
                    <App />
                </ReRenderProvider>
            </Provider>
        </ColorContextProvider>
    </React.StrictMode>
);