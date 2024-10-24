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
  const navigate = useNavigate();
  // Obtenção do token do usuário do sessionStorage
  const userToken = sessionStorage.getItem('USER_TOKEN');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${userToken}`
        }
        const response = await api.get('/user/account', { headers });

        const { data } = response;
        console.log(data);
        // Processamento dos dados de mapeamento e ações

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
    console.log("entrou")
    navigate(`/action-history/${mappingId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Adiciona horas para compensar o fuso horário se necessário
    date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className={styles["container"]}>
      <header className={styles["profile-header"]}>
        <button className={styles["back-button"]} onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
        </button>
        <h1 className={styles["header-1"]}>Histórico</h1>
      </header>

      <div className={styles["profile-links"]}>
        <p className={styles["text"]}>Olá Fernanda</p>
        <a className={styles["link"]} onClick={() => navigate("/updateData")}> Editar Perfil</a>
        <a className={styles["link"]} onClick={() => navigate("/updatePassword")}> Alterar Senha</a>
      </div> <br /><br /><br />

      <h2 className={styles["header-2"]}>Localizações Cadastradas:</h2> <br /><br />

      {userMappings.map((i) =>
        <CardLocate address={i.address.street} date={formatDate(i.date)} onClick={() => handleViewAction(i.id)} />
      )}
    </div>
  );
};

export default UserProfile;