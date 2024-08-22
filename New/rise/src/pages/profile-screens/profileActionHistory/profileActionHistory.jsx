
import styles from "../profileActionHistory/ProfileActionHistory.module.css"
import React, { useEffect, useState } from 'react';
import api from "../../../api"

const History = () => {
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
        
        if (!response.ok) {
          console.log(response)
          throw new Error('Erro ao buscar dados do usuário.');
        }

        const data = await response.json();

        // Processamento dos dados de mapeamento e ações
        const mappings = data.mapping.flatMap(mapping => 
          mapping.mappingActions.map(action => ({
            date: action.action.datetimeEnd,
            institute: action.action.ong.name,
            qtyServed: action.qtyServedAdults + action.qtyServedChildren,
          }))
        );

        setUserMappings(mappings);
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
    <div>
      <h2>Histórico da Marcação</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Instituto</th>
            <th>Qtde Atendidos</th>
          </tr>
        </thead>
        <tbody>
          {userMappings.map((mapping, index) => (
            <tr key={index}>
              <td>{new Date(mapping.date).toLocaleDateString()}</td>
              <td>{mapping.institute}</td>
              <td>{mapping.qtyServed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
