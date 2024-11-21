import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const LabWorkList = () => {
    const [labWorks, setLabWorks] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState('');
    const [filter, setFilter] = useState('');
    const [newLabWork, setNewLabWork] = useState({
        name: '',
        creationDate: '',
        coordinates: { x: 0, y: 0 },
        minimalPoint: 0,
        difficulty: 'NORMAL',
        author: {
            name: '',
            birthday: '',
            weight: 0,
            location: { x: 0, y: 0, name: '' },
        },
    });

    useEffect(() => {
        const fetchLabworks = async () => {
            try {
                let url = `http://localhost:8080/v1/labworks?pageNumber=${currentPage}&pageSize=${pageSize}`;
                if (sort) url += `&sort=${sort}`;
                if (filter) url += `&filter=${filter}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLabWorks(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchLabworks();
    }, [currentPage, pageSize, sort, filter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleNewLabWorkChange = (e) => {
        const { name, value, type } = e.target;
        setNewLabWork((prev) => {
            if(name === "author.birthday"){
                return {...prev, author: {...prev.author, birthday: value}};
            } else if(name.startsWith("coordinates.")){
                const [key] = name.split(".");
                return {...prev, coordinates: {...prev.coordinates, [name.split(".")[1]]: parseFloat(value)}};
            } else if(name.startsWith("author.location.")){
                const [key] = name.split(".");
                return {...prev, author: {...prev.author, location: {...prev.author.location, [name.split(".")[2]]: parseFloat(value)}}};
            }else if(name.startsWith("author.")){
                const [key] = name.split(".");
                return {...prev, author: {...prev.author, [name.split(".")[1]]: value}};
            } else if (type === 'number') {
                return { ...prev, [name]: parseFloat(value) };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };

    const handleAddLabWork = async () => {
        try {
            const response = await fetch('http://localhost:8080/v1/labworks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLabWork),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Ошибка при добавлении: ${response.status}`);
            }
            alert('Лабораторная работа добавлена!');
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    };

    const handleCalculateMinimalPointSum = async () => {
        try {
            const response = await fetch('http://localhost:8080/v1/labworks/minimal-point/sum', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sum = await response.json();
            alert(`Сумма minimalPoint: ${sum}`);
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    };

    const handleFindMinDifficulty = async () => {
        try {
            const response = await fetch('http://localhost:8080/v1/labworks/difficulty/min', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const labWork = await response.json();
            alert(`Лабораторная работа с минимальной сложностью: ${JSON.stringify(labWork)}`);
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    };

    const handleCountAuthor = async (e) => {
        e.preventDefault();
        const authorName = e.target.authorName.value;
        console.log(authorName);
        try {
            const response = await fetch(`http://localhost:8080/v1/labworks/${authorName}/count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const count = await response.json();
            alert(`Количество работ автора ${authorName}: ${count}`);
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    };

    const totalPages = Math.ceil((labWorks.totalCount || 0) / pageSize);


    return (
        <div>
            <h1>Список лабораторных работ</h1>
            {error && <div className="error">Ошибка: {error}</div>}
            <input type="text" placeholder="Фильтр" onChange={handleFilterChange} />
            <input type="text" placeholder="Сортировка (e.g., -creationDate,+name)" onChange={handleSortChange} />
            <select onChange={e => handlePageSizeChange(parseInt(e.target.value, 10))}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${page === currentPage + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page - 1)}>{page}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
                    </li>
                </ul>
            </nav>
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
                    <tr key={labWork.id}>
                        <td><Link to={`/labworks/${labWork.id}`}>{labWork.id}</Link></td>
                        <td>{labWork.name}</td>
                        <td>{new Date(labWork.creationDate).toLocaleDateString()}</td>
                        <td>{labWork.author.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => handlePageChange(page - 1)}>
                        {page}
                    </button>
                ))}
            </div>

            <h2>Добавить лабораторную работу</h2>
            <form>
                <label>
                    Название:
                    <input type="text" name="name" value={newLabWork.name} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Дата создания:
                    <input type="datetime-local" name="creationDate" value={newLabWork.creationDate} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Координата X:
                    <input type="number" name="coordinates.x" value={newLabWork.coordinates.x} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Координата Y:
                    <input type="number" name="coordinates.y" value={newLabWork.coordinates.y} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Минимальная оценка:
                    <input type="number" name="minimalPoint" value={newLabWork.minimalPoint} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Сложность:
                    <select name="difficulty" value={newLabWork.difficulty} onChange={handleNewLabWorkChange}>
                        <option value="VERY_EASY">VERY_EASY</option>
                        <option value="EASY">EASY</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="IMPOSSIBLE">IMPOSSIBLE</option>
                        <option value="INSANE">INSANE</option>
                    </select>
                </label>
                <label>
                    Имя автора:
                    <input type="text" name="author.name" value={newLabWork.author.name} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    День рождения автора:
                    <input type="datetime-local" name="author.birthday" value={newLabWork.author.birthday} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Вес автора:
                    <input type="number" name="author.weight" value={newLabWork.author.weight} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Координата X местоположения автора:
                    <input type="number" name="author.location.x" value={newLabWork.author.location.x} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Координата Y местоположения автора:
                    <input type="number" name="author.location.y" value={newLabWork.author.location.y} onChange={handleNewLabWorkChange} />
                </label>
                <label>
                    Название местоположения автора:
                    <input type="text" name="author.location.name" value={newLabWork.author.location.name} onChange={handleNewLabWorkChange} />
                </label>
                <button type="button" onClick={handleAddLabWork}>Добавить</button>
            </form>

            <h2>Дополнительные операции</h2>
            <button onClick={handleCalculateMinimalPointSum}>Рассчитать сумму minimalPoint</button>
            <button onClick={handleFindMinDifficulty}>Найти самую легкую лабу</button>
            <form onSubmit={handleCountAuthor}>
                <label>
                    Имя автора:
                    <input type="text" name="authorName" />
                </label>
                <button type="submit">Посчитать количество работ</button>
            </form>
        </div>
    );
};

export default LabWorkList;
