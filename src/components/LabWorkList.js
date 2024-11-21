import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

const LabWorkList = () => {
    const [labWorks, setLabWorks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLabworks = async () => {
            try {
                const response = await fetch('http://localhost:8080/v1/labworks', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setLabWorks(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchLabworks();
    }, []);

    return (
        <div>
            <h1>Список лабораторных работ</h1>
            {error && <div className="error">Ошибка: {error}</div>}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Дата создания</th>
                    <th>Автор</th>
                </tr>
                </thead>
                <tbody>
                {labWorks.map(labWork => (
                    <tr>
                        <td><Link to={`/labworks/${labWork.id}`}>{labWork.id}</Link></td>
                        <td>{labWork.name}</td>
                        <td>{new Date(labWork.creationDate).toLocaleString()}</td>
                        <td>{labWork.author.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default LabWorkList;
