import { FaSignOutAlt, FaHeart, FaChartBar, FaBars, FaUser } from 'react-icons/fa';
import style from './NavbarMobile.module.css';
import logo from '../../../utils/imgs/logo.png';    
import riselogo from '../../../utils/imgs/rise-logo.png';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { OngContext } from '../../context/ongContext/OngContext';
import AvatarComponent from '../../dataDisplay/avatar/AvatarComponent';
import { AuthContext } from '../../../pages/login/AuthContext';

const NavbarMobile = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { ongList } = useContext(OngContext);

    const handleClose = () => {
        const navbar = document.querySelector(`.${style.container}`);
        if (navbar) {
            navbar.classList.toggle(style.active);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <>
            <button className={style.toggle} onClick={handleClose}>
                <FaBars size={25} color="#2968C8" />
            </button>
            <div className={style.container}>
                <div className={style.column}>
                    <button className={style["button-navbar"]} onClick={() => handleNavigate('/user')}>
                        <FaUser size={25} color="#2968C8" />
                        <p>Perfil</p>
                    </button>
                    <button className={style["button-navbar"]} onClick={() =>{ logout(); handleNavigate('/') }}>
                        <FaHeart size={25} color="#2968C8" />
                        <p>Acesso Institucional</p>
                    </button>
                    {ongList && ongList.length > 0 && (
                        <button className={style["button-navbar"]} onClick={() => handleNavigate('/dashboard/main')}>
                            <FaChartBar size={25} color="#2968C8" />
                            <p>Dashboard</p>
                        </button>
                    )}
                    <button className={style["button-navbar"]} onClick={() =>{ logout(); handleNavigate('/') }}>
                        <FaSignOutAlt size={25} color="#2968C8" />
                        <p>Sair</p>
                    </button>
                </div>
                <div className={`${style.row} ${style["justify-center"]}`}>
                    <img src={logo} alt="Logo" />
                    <img src={riselogo} alt="Rise Logo" />
                </div>
            </div>
        </>
    );
};

export default NavbarMobile;
