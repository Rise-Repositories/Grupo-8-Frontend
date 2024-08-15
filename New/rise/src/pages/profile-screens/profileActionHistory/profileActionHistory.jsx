import React from "react";
import styles from "../profileActionHistory/ProfileActionHistory.module.css"

const rows = [
    { date: '30/07/2023', institute: 'Instituto ACB', attendees: 3 },
    { date: '15/08/2023', institute: 'Hamburgada do Bem', attendees: 2 },
    { date: '01/09/2023', institute: 'Instituto ACB', attendees: 0 },
    { date: '30/09/2023', institute: 'Instituto Heleninha', attendees: 3 },
  ];
  
  function History() {
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Histórico da Marcação</h1>
        
        <div className={styles.mapContainer}>
          <h2 className={styles.address}>R. Eduardo Prado, 28</h2>
          {/* Mapa ou imagem do local */}
        </div>
  
        <h2 className={styles.actionsHeader}>Ações realizadas:</h2>
  
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Instituto</th>
              <th>Qtde Atendidos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.institute}</td>
                <td>{row.attendees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default History;