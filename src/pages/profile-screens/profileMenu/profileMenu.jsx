import React, { useEffect, useState } from 'react';
import styles from './ProfileMenu.module.css';
import CardLocate from '../../../components/cards/cardLocate/CardLocate';
import api from '../../../api';
import { useNavigate } from 'react-router-dom';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const UserProfile = () => {
  const [userMappings, setUserMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem('USER_TOKEN');

  useEffect(() => {
    const fetchOngs = async () => {
      try {
        const token = sessionStorage.getItem('USER_TOKEN');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const accountResponse = await api.get('/user/account', { headers });
        const userName = accountResponse.data.name;
        setUserName(userName);
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
      }
    }

    const fetchUserData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${userToken}`
        }
        const response = await api.get('/user/account', { headers });

        const { data } = response;
        console.log(data);
        const userName = response.data.name;
        setUserName(userName);
        setUserMappings(data.mapping);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Erro ao carregar os dados.');
        setLoading(false);
      }
    };

    if (userToken) {
      fetchUserData();
    }
  }, [userToken]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleViewAction = (mappingId) => {
    navigate(`/action-history/${mappingId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className={`col-12 col-md-12 ${styles["container"]}`}>
      <header className={styles["profile-header"]}>
        <button className={styles["back-button"]} onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
        </button>
        <h1 className={styles["header-1"]}>Histórico</h1>
      </header>

      <div className={`col-12 col-md-3 ${styles["profile-links"]}`}>
        <p className={styles["text"]}>Olá, {userName}!</p>
        <a className={styles["link"]} onClick={() => navigate("/updateData")} style={{ cursor: 'pointer' }}> Editar Perfil</a>
        <a className={styles["link"]} onClick={() => navigate("/updatePassword")} style={{ cursor: 'pointer' }}> Alterar Senha</a>
      </div> <br /><br /><br />

      <h2 className={styles["header-2"]}>Localizações Cadastradas:</h2> <br /><br />

      <div className={`row g-3 ${styles["cards-container"]}`}>
        {userMappings.map((i, index) => (
          <div key={index} className="col-12 col-md-4">
            <CardLocate
              address={i.address.street}
              date={formatDate(i.date)}
              onClick={() => handleViewAction(i.id)}
            />
          </div>
        ))}
      </div>


    </div>
  );
};

export default UserProfile;