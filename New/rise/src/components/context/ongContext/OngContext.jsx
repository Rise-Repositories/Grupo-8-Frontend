import { createContext, useState } from "react";


export const OngContext = createContext();

export const OngProvider = ({children}) => {
    const [ongList, setOngList] = useState(null);
    const [curOngId, setCurOngId] = useState(0);
    const [userRole, setUserRole] = useState(null);

    return (
        <OngContext.Provider value={{ ongList, setOngList, curOngId, setCurOngId, userRole, setUserRole }}>
            {children}
        </OngContext.Provider>
    );
};