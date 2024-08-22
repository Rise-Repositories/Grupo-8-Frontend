import React, { useEffect, useState } from 'react';
import styles from './ProfileMenu.module.css';
import CardLocate from '../../../components/cards/cardLocate/CardLocate';
import api from '../../../api';



const UserProfile = () => {
    const [userMappings, setUserMappings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Obtenção do token do usuário do sessionStorage
    const userToken = sessionStorage.getItem('USER_TOKEN');
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const headers = {
              'Authorization': `Bearer ${userToken}`
          }
          const response = await api.get('/user/account', {headers});
  
          const {data}  =  response;
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
  

  return (
    <div className={styles["container"]}>
      <header>
        <button className={styles["back-button"]}>{'<-'}</button>
        <h1>Histórico</h1>
      </header>

      <div className={styles["profile-links"]}>
        <p>Olá Fernanda</p>
        <a href="#">Editar Perfil</a>
        <a href="#">Alterar Senha</a>
      </div> <br /><br /><br />

      <h2>Localizações Cadastradas:</h2> <br /><br />


      {userMappings.map((i) => 
        <CardLocate address={i.address.street} date={i.date}></CardLocate>
      )}


      {/* <div className={styles["location-card"]}>
        <div className={styles["map-preview"]}></div>
        <div className={styles["info"]}>
          <p>R. Eduardo Prado, 28</p>
          <p className={styles["date"]}>18/20/2024</p>
          <button className={styles["actions-button"]}>Ver ações</button>
        </div>
      </div> */}

    </div>
  );
};

export default UserProfile;