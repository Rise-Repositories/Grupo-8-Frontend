import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import api from '../../../api';
import { AuthContext } from '../../../pages/login/AuthContext';
import riseLogo from '../../../utils/imgs/rise-logo.png';
import logo from '../../../utils/imgs/logo.png';
import { Select } from "antd";
import { OngContext } from '../../context/ongContext/OngContext';
import { Option } from 'antd/es/mentions';


const Sidebar = ({ handleOngId, toggleSidebar }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { ongList, setOngList, curOngId, setCurOngId, userRole, setUserRole } = useContext(OngContext);

    const handleNavigate = (path) => {
        navigate(path);
        toggleSidebar();
    };

    useEffect(() => {
        const fetchOngs = async () => {
            try {
                const token = sessionStorage.getItem('USER_TOKEN');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                const response = await api.get('/user/account', { headers });
                const ongsList = response.data.voluntary.map((v) => {
                    return {
                        id: v.ong.id,
                        name: v.ong.name,
                        role: v.role
                    };
                });
                setOngList(ongsList);

                if (ongsList.length > 1 && curOngId === 0) {
                    sessionStorage.setItem('SELECTED_ONG_ID', ongsList[0].id);
                    setCurOngId(ongList[0].id);
                    setUserRole(ongList[0].role);
                }
            } catch (error) {
                console.error("Erro ao buscar ONGs:", error);
            }
        };

        fetchOngs();
        console.log('=== ONG, ', ongList)
    }, []);

    const handleSelectChange = (value) => {
        console.log(value);
        setCurOngId(ongList[value].id);
        setUserRole(ongList[value].role);
    };

    const selectProps = ongList.length > 1 ? {
        onChange: handleSelectChange,
        options: ongList.map((ong) => ({
            value: ong.id,
            label: ong.name
        }))
    } : {
        value: ongList.length === 1 ? ongList[0].name : undefined,
        disabled: true
    };


    return (
        <>
            <div className={styles.content}>
                <div className={styles.upPart}>
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={"100px"} height={"100px"}>
                            <path fill="#ffffff" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                        </svg>
                    </h3>
                    <div className={styles.instituteName}>
                        {sessionStorage.getItem("CUR_ONG")}
                    </div>
                    <div>
                        <select
                            onChange={(e) => {handleSelectChange(e.target.value)}}
                            disabled={ongList.length <= 1}
                            className={styles.ongDropdown}
                        >
                            {
                                ongList.map((ong, key) => {
                                    return (
                                        <option value={key}>{ong.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>

                <ul className={styles.menuElements}>
                    <li className={styles.links} onClick={() => handleNavigate('/dashboard/main')}>
                        <a className={styles.linkContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z" /></svg>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li className={styles.links} onClick={() => handleNavigate('/dashboard/mapping')}>
                        <a className={styles.linkContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#ffffff" d="M565.6 36.2C572.1 40.7 576 48.1 576 56V392c0 10-6.2 18.9-15.5 22.4l-168 64c-5.2 2-10.9 2.1-16.1 .3L192.5 417.5l-160 61c-7.4 2.8-15.7 1.8-22.2-2.7S0 463.9 0 456V120c0-10 6.1-18.9 15.5-22.4l168-64c5.2-2 10.9-2.1 16.1-.3L383.5 94.5l160-61c7.4-2.8 15.7-1.8 22.2 2.7zM48 136.5V421.2l120-45.7V90.8L48 136.5zM360 422.7V137.3l-144-48V374.7l144 48zm48-1.5l120-45.7V90.8L408 136.5V421.2z" /></svg>
                            <span>Mapeamento</span>
                        </a>
                    </li>
                    <li className={styles.links}>
                        <a className={styles.linkContent} onClick={() => handleNavigate('/dashboard/action')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#ffffff" d="M163.9 136.9c-29.4-29.8-29.4-78.2 0-108s77-29.8 106.4 0l17.7 18 17.7-18c29.4-29.8 77-29.8 106.4 0s29.4 78.2 0 108L310.5 240.1c-6.2 6.3-14.3 9.4-22.5 9.4s-16.3-3.1-22.5-9.4L163.9 136.9zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5H192 32c-17.7 0-32-14.3-32-32V416c0-17.7 14.3-32 32-32H68.8l44.9-36c22.7-18.2 50.9-28 80-28H272h16 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H288 272c-8.8 0-16 7.2-16 16s7.2 16 16 16H392.6l119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384l0 0-.9 0c.3 0 .6 0 .9 0z" /></svg>
                            <span>Registro de Ação</span>
                        </a>
                    </li>
                    <li className={styles.links}>
                        <a className={styles.linkContent} onClick={() => handleNavigate('/dashboard/manage-volunteers')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="#ffffff" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>
                            <span>Gerenciar voluntários</span>
                        </a>
                    </li>
                    <li className={styles.links} onClick={() => handleNavigate('/dashboard/institute-list')}>
                        <a className={styles.linkContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="#ffffff" d="M480 48c0-26.5-21.5-48-48-48H336c-26.5 0-48 21.5-48 48V96H224V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V96H112V24c0-13.3-10.7-24-24-24S64 10.7 64 24V96H48C21.5 96 0 117.5 0 144v96V464c0 26.5 21.5 48 48 48H304h32 96H592c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48H480V48zm96 320v32c0 8.8-7.2 16-16 16H528c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16zM240 416H208c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16zM128 400c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32zM560 256c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H528c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32zM256 176v32c0 8.8-7.2 16-16 16H208c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16zM112 160c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h32zM256 304c0 8.8-7.2 16-16 16H208c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32zM112 320H80c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16zm304-48v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16zM400 64c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h32zm16 112v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16z" /></svg>
                            <span>Lista de instituições</span>
                        </a>
                    </li>
                    <li className={styles.links} onClick={() => { handleNavigate('/home'); }}>
                        <a className={styles.linkContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#ffffff" d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152l0 270.8c0 9.8-6 18.6-15.1 22.3L416 503l0-302.6zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6l0 251.4L32.9 502.7C17.1 509 0 497.4 0 480.4L0 209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77l0 249.3L192 449.4 192 255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" /></svg>
                            <span>Cadastrar Localizações</span>
                        </a>
                    </li>
                    <li className={styles.links} onClick={() => { logout(); handleNavigate('/'); }}>
                        <a className={styles.linkContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" /></svg>
                            <span>Sair</span>
                        </a>
                    </li>
                </ul>

                <div className={styles["logos"]}>
                    <img src={riseLogo} alt="Rise Logo" onClick={() => handleNavigate('/user')} />
                    |
                    <img src={logo} alt="Logo" />
                </div>
            </div>
        </>
    );
};

export default Sidebar;