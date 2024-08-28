import React, { useCallback, useContext, useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import styles from "./DashboardWrapper.module.css";
import NavbarVertical from "../../components/navbar/navbarVertical/NavbarVertical";
import Sidebar from "../../components/navbar/sidebar/Sidebar";
import { Col } from "antd";

const DashboardWrapper = () => {

    const [ongId, setOngId] = useState("");

    function useOngId(e) {
        console.log('batata', e);
        setOngId(e);
    }

    return (
        <>
            <Col span={24} className={styles.page}>
                <Sidebar handleOngId={useOngId}/>
                <Col span={24}>
                    <Outlet context={[ongId]}/>
                </Col>
            </Col>
        </>
    );
}

export default DashboardWrapper;
