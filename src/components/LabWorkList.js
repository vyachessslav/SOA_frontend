
import React, { useState, useEffect } from 'react';

const LabWorkList = () => {
    const [labWorks, setLabWorks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(async () => {
        let response = await fetch('http://localhost:8080/v1/labworks', {
            mode: 'no-cors',
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        try {
            setLabWorks(await response.json());
        } catch(error) {
            setError(error.message);
        }
    }, []);

    return (
        <div>
            <h1>Список лабораторных работ</h1>
            {error && <div className="error">Ошибка: {error}</div>}
            <table>
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Автор</th>
                </tr>
                </thead>
                <tbody>
                {labWorks.map(labWork => (
                    <tr>
                        <td>{labWork.name}</td>
                        <td>{labWork.author.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default LabWorkList;

