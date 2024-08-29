import React, { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import styles from "./DashboardWrapper.module.css";
import Sidebar from "../../components/navbar/sidebar/Sidebar";
import { Col } from "antd";
import { Offcanvas } from "react-bootstrap";
import SidebarButton from "../../components/navbar/sidebarButton/sidebarButton";

const DashboardWrapper = () => {

    const [ongId, setOngId] = useState("");
    const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth >= 768);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarVisible(!sidebarVisible)
        } else {
            setSidebarVisible(true);
        }
    };

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
            setSidebarVisible(false);
        } else {
            setIsMobile(false);
            setSidebarVisible(true);
        }
        console.log('====  resize');
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
    });


    function useOngId(e) {
        setOngId(e);
    }

    useEffect(() => { }, [sidebarVisible]);

    return (
        <>
            {isMobile &&
                <>
                    <SidebarButton onClick={toggleSidebar} sidebarVisible={sidebarVisible} />
                    <Offcanvas show={sidebarVisible} placement="start">
                        <Offcanvas.Body className={`${styles['navbar-offcanvas']}`}>
                            <Sidebar handleOngId={useOngId} toggleSidebar={toggleSidebar} />
                        </Offcanvas.Body>
                    </Offcanvas>
                    <div className={`col-12`} >
                        <Outlet context={[ongId]} />
                    </div >
                </>
            }
            {!isMobile &&
                <>
                    <div className={styles.page}>
                        <div className={`col-md-3 col-xlg-2 ${styles['navbar']}`} >
                            <Sidebar handleOngId={useOngId} toggleSidebar={toggleSidebar} />
                        </div>
                        <div className={`col-md-9 col-xlg-10 ${styles['content']}`} >
                            <Outlet context={[ongId]} />
                        </div >
                    </div>
                </>
            }
        </>
    );
}

export default DashboardWrapper;
