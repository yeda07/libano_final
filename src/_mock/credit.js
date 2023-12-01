import React, { useState, useEffect } from 'react';

function CreditApplicationsComponent() {
  const [creditApplications, setCreditApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apicreditos/');
        if (response.ok) {
          const data = await response.json();
          setCreditApplications(data);
        } else {
          console.error('Error al obtener datos de la API:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Lista de Aplicaciones de Crédito</h1>
      <ul>
        {creditApplications.map(application => (
          <li key={application.id}>
            <strong>ID:</strong> {application.id}<br />
            <strong>Total de Crédito:</strong> {application.total_credito}<br />
            <strong>Monto Inicial:</strong> {application.monto_inicial}<br />
            <strong>Fecha de Crédito:</strong> {application.fecha_credito}<br />
            <strong>Usuario:</strong> {application.usuario}<br />
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreditApplicationsComponent;
