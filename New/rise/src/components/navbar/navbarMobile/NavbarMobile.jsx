import { FaSignOutAlt, FaHeart, FaChartBar, FaBars, FaUser } from 'react-icons/fa';
import style from './NavbarMobile.module.css';
import logo from '../../../utils/imgs/logo.png';    
import riselogo from '../../../utils/imgs/rise-logo.png';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { OngContext } from '../../context/ongContext/OngContext';
import Avatar from 'antd/es/avatar/avatar';
import AvatarComponent from '../../dataDisplay/avatar/AvatarComponent';

const NavbarMobile = () => {
    const navigate = useNavigate();

    const { ongList } = useContext(OngContext);

    const handleClose = () => {
        const navbar = document.querySelector(`.${style["container"]}`);
        if(navbar.style.display === "none"){
            navbar.style.display = "flex";
        }else{
            navbar.style.display = "none";
        }
    }

    const handleNavigate = (path) => {
        navigate(path);
    }

    return (
        <>
            <button className={style["toggle"]} onClick={handleClose}>
                <FaBars size={25} color="#2968C8"/>
            </button>
            <div className={style["container"]}>
                <div className={`${style["row"]} ${style["justify-end"]}`} onClick={() => handleNavigate('/user')}>
                    <AvatarComponent size={30} editable={false}/>
                </div>
                <div className={style["column"]}>
                    <button className={style["button-navbar"]} onClick={() => handleNavigate('/')}>
                        <FaHeart size={25} color="#2968C8"/>
                        <p>Acesso Institucional</p>
                    </button>
                    { ongList.length > 0 &&
                        <button className={style["button-navbar"]} onClick={() => handleNavigate('/dashboard/main')}>
                            <FaChartBar size={25} color="#2968C8"/>
                            <p>Dashboard</p>
                        </button>
                    }
                    <button className={style["button-navbar"]} onClick={() => handleNavigate('/')}>
                        <FaSignOutAlt size={25} color="#2968C8"/>
                        <p>Sair</p>
                    </button>
                </div>
                <div className={`${style["row"]} ${style["justify-center"]}`}>
                    <img src={logo}/>|
                    <img src={riselogo}/>
                </div>
            </div>
        </>
    );
}

export default NavbarMobile;