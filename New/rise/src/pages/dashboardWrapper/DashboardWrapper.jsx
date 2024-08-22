import React, { useCallback, useContext, useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import styles from "./DashboardWrapper.module.css";
import NavbarVertical from "../../components/navbar/navbarVertical/NavbarVertical";
import Sidebar from "../../components/navbar/sidebar/Sidebar";

const DashboardWrapper = () => {

    const [ongId, setOngId] = useState("");

    function useOngId(e) {
        console.log('batata', e);
        setOngId(e);
    }

    return (
        <>
            <div className={styles.page}>
                <Sidebar handleOngId={useOngId}/>
                <div className={`col-md-12`}>
                    <Outlet context={[ongId]}/>
                </div>
            </div>
        </>
    );
}

export default DashboardWrapper;
