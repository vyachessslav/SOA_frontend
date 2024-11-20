import React, { useState, useEffect } from 'react';

const LabWorkDetails = ({ match }) => {
    const { id } = match.params;
    const [labWork, setLabWork] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/labworks/${id}`, {mode: 'no-cors'})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                return response.json();
            })
            .then(data => setLabWork(data))
            .catch(error => setError(error.message));
    }, [id]);

    return (
        <div>
            <h1>Детали лабораторной работы</h1>
            {error && <div className="error">Ошибка: {error}</div>}
            {labWork && (
                <div>
                    <p><strong>ID:</strong> {labWork.id}</p>
                    <p><strong>Название:</strong> {labWork.name}</p>
                    <p><strong>Дата создания:</strong> {new Date(labWork.creationDate).toLocaleString()}</p>
                    <p><strong>Автор:</strong> {labWork.author.name}</p>
                </div>
            )}
        </div>
    );
};

export default LabWorkDetails;

