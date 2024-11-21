import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const LabWorkDetails = () => {
    const { id } = useParams();
    const [labWork, setLabWork] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLabworks = async () => {
            try {
                const response = await fetch(`http://localhost:8080/v1/labworks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setLabWork(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchLabworks();
    }, [id]);

    return (
        <div>
            <h1>Детали лабораторной работы</h1>
            {error && <div className="error">Ошибка: {error}</div>}
            {labWork && (
                <div>
                    <p><strong>Название:</strong> {labWork.name}</p>
                    <p><strong>Дата создания:</strong> {new Date(labWork.creationDate).toLocaleString()}</p>
                    <p><strong>Автор:</strong> {labWork.author.name}</p>
                </div>
            )}
        </div>
    );
};

export default LabWorkDetails;
