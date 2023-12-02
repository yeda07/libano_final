import React, { useState, useEffect } from 'react';

function UsersComponent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiusers/');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
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
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>ID:</strong> {user.id}<br />
            <strong>Nombre:</strong> {user.nombre}<br />
            <strong>Correo:</strong> {user.correo}<br />
            {/* Agrega más campos según la estructura de tus datos de usuario */}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersComponent;
