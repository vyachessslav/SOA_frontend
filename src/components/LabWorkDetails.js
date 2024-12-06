import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import '../styles/styles.css';
import { firstServiceUrl, secondServiceUrl } from '../index.js';


const LabWorkDetails = () => {
    const [labWork, setLabWork] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchLabwork = async () => {
            try {
                const response = await fetch(`${firstServiceUrl}/labworks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLabWork(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchLabwork();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setLabWork((prev) => {
            if (name === 'author.birthday') {
                return { ...prev, author: { ...prev.author, birthday: value } };
            } else if (name.startsWith('coordinates.')) {
                const [key] = name.split('.');
                return { ...prev, coordinates: { ...prev.coordinates, [name.split('.')[1]]: parseFloat(value) } };
            } else if (name.startsWith('author.location.')) {
                const [key] = name.split('.');
                return { ...prev, author: { ...prev.author, location: { ...prev.author.location, [name.split('.')[2]]: parseFloat(value) } } };
            } else if (name.startsWith('author.')) {
                const [key] = name.split('.');
                return { ...prev, author: { ...prev.author, [name.split('.')[1]]: value } };
            } else if (type === 'number') {
                return { ...prev, [name]: parseFloat(value) };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateLabWork = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${firstServiceUrl}/labworks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(labWork),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setIsEditing(false);
            alert('Лабораторная работа обновлена!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteLabWork = async () => {
        if (window.confirm('Вы действительно хотите удалить эту лабораторную работу?')) {
            try {
                const response = await fetch(`${firstServiceUrl}/labworks/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert('Лабораторная работа удалена!');
                navigate('/');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleIncreaseDifficulty = async (steps) => {
        try {
            const response = await fetch(`${secondServiceUrl}/labwork/${id}/difficulty/increase/${steps}`, {
                method: 'POST',
            });
            if (!response.ok) {
                if (response.status === 400) {
                    const json = await response.json();
                    alert(json['message']);
                }
                else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            else {
                alert('Сложность успешно повышена!');
                //Refetch labWork to update the UI
                const updatedLabWorkResponse = await fetch(`${firstServiceUrl}/labworks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const updatedLabWork = await updatedLabWorkResponse.json();
                setLabWork(updatedLabWork);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDecreaseDifficulty = async (steps) => {
        try {
            const response = await fetch(`${secondServiceUrl}/labwork/${id}/difficulty/decrease/${steps}`, {
                method: 'POST',
            });
            if (!response.ok) {
                if (response.status === 400) {
                    const json = await response.json();
                    alert(json['message']);
                }
                else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            else {
                alert('Сложность успешно понижена!');
                //Refetch labWork to update the UI
                const updatedLabWorkResponse = await fetch(`${firstServiceUrl}/labworks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const updatedLabWork = await updatedLabWorkResponse.json();
                setLabWork(updatedLabWork);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Детали лабораторной работы</h1>
            {error && <div className='error'>Ошибка: {error}</div>}
            {labWork && (
                <div>
                    <p><strong>ID:</strong> {labWork.id}</p>
                    <p><strong>Название:</strong> {labWork.name}</p>
                    <p><strong>Дата создания:</strong> {format(new Date(labWork.creationDate), 'yyyy-MM-dd HH:mm:ss')}</p>
                    <p><strong>Автор:</strong> {`${labWork.author.name} (${format(new Date(labWork.author.birthday), 'yyyy-MM-dd')})`}</p>
                    <p><strong>Координаты:</strong> ({labWork.coordinates.x}, {labWork.coordinates.y})</p>
                    <p><strong>Минимальная оценка:</strong> {labWork.minimalPoint}</p>
                    <p><strong>Сложность:</strong> {labWork.difficulty}</p>
                    <p><strong>Местоположение автора:</strong> ({labWork.author.location.x}, {labWork.author.location.y}, {labWork.author.location.name})</p>
                    {!isEditing && <button onClick={handleEditClick}>Изменить</button>}
                    {isEditing && (
                        <form onSubmit={handleUpdateLabWork}>
                            <label>
                                Название:
                                <input type="text" name="name" value={labWork.name} onChange={handleInputChange} />
                            </label>
                            <label>
                                Дата создания:
                                <input type="datetime-local" name="creationDate" value={labWork.creationDate} onChange={handleInputChange} />
                            </label>
                            <label>
                                Координата X:
                                <input type="number" name="coordinates.x" value={labWork.coordinates.x} onChange={handleInputChange} />
                            </label>
                            <label>
                                Координата Y:
                                <input type="number" name="coordinates.y" value={labWork.coordinates.y} onChange={handleInputChange} />
                            </label>
                            <label>
                                Минимальная оценка:
                                <input type="number" name="minimalPoint" value={labWork.minimalPoint} onChange={handleInputChange} />
                            </label>
                            <label>
                                Сложность:
                                <select name="difficulty" value={labWork.difficulty} onChange={handleInputChange}>
                                    <option value="VERY_EASY">VERY_EASY</option>
                                    <option value="EASY">EASY</option>
                                    <option value="NORMAL">NORMAL</option>
                                    <option value="IMPOSSIBLE">IMPOSSIBLE</option>
                                    <option value="INSANE">INSANE</option>
                                </select>
                            </label>
                            <label>
                                Имя автора:
                                <input type="text" name="author.name" value={labWork.author.name} onChange={handleInputChange} />
                            </label>
                            <label>
                                День рождения автора:
                                <input type="datetime-local" name="author.birthday" value={labWork.author.birthday} onChange={handleInputChange} />
                            </label>
                            <label>
                                Вес автора:
                                <input type="number" name="author.weight" value={labWork.author.weight} onChange={handleInputChange} />
                            </label>
                            <label>
                                Координата X местоположения автора:
                                <input type="number" name="author.location.x" value={labWork.author.location.x} onChange={handleInputChange} />
                            </label>
                            <label>
                                Координата Y местоположения автора:
                                <input type="number" name="author.location.y" value={labWork.author.location.y} onChange={handleInputChange} />
                            </label>
                            <label>
                                Название местоположения автора:
                                <input type="text" name="author.location.name" value={labWork.author.location.name} onChange={handleInputChange} />
                            </label>
                            <button type="submit">Сохранить</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Отмена</button>
                        </form>
                    )}
                    <button onClick={handleDeleteLabWork}>Удалить</button>
                </div>
            )}
            <div>
                <button onClick={() => handleIncreaseDifficulty(1)}>Повысить сложность на 1</button>
                <button onClick={() => handleIncreaseDifficulty(2)}>Повысить сложность на 2</button>
                <button onClick={() => handleDecreaseDifficulty(1)}>Понизить сложность на 1</button>
                <button onClick={() => handleDecreaseDifficulty(2)}>Понизить сложность на 2</button>
            </div>
        </div>
    );
};

export default LabWorkDetails;
