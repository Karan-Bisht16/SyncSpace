import { createContext, useState } from "react";

export const ReRenderContext = createContext();
export const ReRenderProvider = ({ children }) => {
    const [reRender, setReRender] = useState(false);

    return (
        <ReRenderContext.Provider value={{ reRender, setReRender }}>
            {children}
        </ReRenderContext.Provider>
    );
}