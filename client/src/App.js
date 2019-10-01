import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
    const [users, setUsers] = useState();

    useEffect(() => {
        let url = 'http://localhost:8080/api/users';
        axios
            .get(url)
            .then(data => setUsers(data.data))
            .catch(err => console.log(err));
    }, []);

    const deleteUser = id => {
        axios.delete(`http://localhost:8080/api/users/${id}`).then(res => {
            console.log(res);
            let filtered = users.filter(user => {
                return user.id != res.data;
            });
            setUsers(filtered);
        });
    };

    return (
        <div className="App">
            <h1>Users</h1>
            {users &&
                users.map((user, i) => {
                    return (
                        <div key={i}>
                            <h1>{user.name}</h1>
                            <div>{user.bio}</div>
                            <button onClick={() => deleteUser(user.id)}>
                                Delete
                            </button>
                        </div>
                    );
                })}
        </div>
    );
}

export default App;
