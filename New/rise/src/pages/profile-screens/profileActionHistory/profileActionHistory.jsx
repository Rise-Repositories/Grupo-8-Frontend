import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./ProfileActionHistory.module.css";
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

  const totalAttended = (adults, children) => adults + children;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
        </button>
        <h2 className={styles.h2NoMargin}>Histórico da Marcação</h2>
      </header>
      
      {mapping && (
        <div className={styles.mappingDetails}>
          <div className={styles.cardLocate}>
            <div className={styles.cardContent}>
              <p className={styles.address}>
                <strong>Endereço: </strong>{mapping.address.street}, {mapping.address.number}
              </p>
              <p className={styles.date}>
                <strong>Data inicial de marcação: </strong>{formatDate(mapping.date)}
              </p>
            </div>
          </div>

          <h2 className={styles.h2Margin}>Ações realizadas:</h2>

          <table className={styles.actionsTable}>
            <thead>
              <tr>
                <th>Data de atendimento</th>
                <th>Instituto</th>
                <th>Qtde Atendidos</th>
              </tr>
            </thead>
            <tbody>
              {mapping.mappingActions.map(action => (
                <tr key={action.id}>
                  <td>{new Date(action.action.datetimeEnd).toLocaleDateString()}</td>
                  <td>{action.action.ong.name}</td>
                  <td className={styles.centeredColumn}>
                    {totalAttended(action.qtyServedAdults, action.qtyServedChildren)}
                  </td>
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
