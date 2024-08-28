import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from "../profileActionHistory/ProfileActionHistory.module.css";
import api from "../../../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';

const History = () => {
  const { mappingId } = useParams();
  const [mapping, setMapping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userToken = sessionStorage.getItem('USER_TOKEN');

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${userToken}` };
        const response = await api.get(`/user/account`, { headers });

        if (response.status !== 200) {
          throw new Error('Erro ao buscar os detalhes do mapeamento.');
        }

        const selectedMapping = response.data.mapping.find(m => m.id === parseInt(mappingId));
        setMapping(selectedMapping);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMapping();
  }, [mappingId, userToken]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Adiciona horas para compensar o fuso horário se necessário
    date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
        </button>
        <h2>Histórico da Marcação</h2>
      </header>
      
      {mapping && (
        <div className={styles.mappingDetails}>
          <div className={styles.cardLocate}>
        
            <div className={styles.cardContent}>
              <p className={styles.address}>{mapping.address.street}, {mapping.address.number}</p>
              <p className={styles.date}>{formatDate(mapping.date)}</p>
            </div>
          </div>

          <h2>Ações realizadas:</h2>

          <table className={styles.actionsTable}>
            <thead>
              <tr>
                <th>Data de atendimento</th>
                <th>Instituto</th>
                <th>Descrição</th>
                <th>Qtde Crianças Atendidas</th>
                <th>Qtde Adultos Atendidos</th>
              </tr>
            </thead>
            <tbody>
              {mapping.mappingActions.map(action => (
                <tr key={action.id}>
                  <td>{new Date(action.action.datetimeEnd).toLocaleDateString()}</td>
                  <td>{action.action.ong.name}</td>
                  <td>{mapping.description}</td>
                  <td>{action.qtyServedChildren}</td>
                  <td>{action.qtyServedAdults}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
