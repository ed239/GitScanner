'use client';
import { useState } from 'react';
import styles from './styles/Login.module.css';


export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onLoginPressed = (e) => {
        e.preventDefault();
        console.log(username);
        console.log(password);
    };
    return (
        <div className={styles.page}>
            <div className={styles.box}>
                <form onSubmit={onLoginPressed}>
                    <h1 className={styles.title}>Git Scanner Login</h1>
                    <input type="text" placeholder="Username" className={styles.inputField} value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <input type="text" placeholder="Password" className={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
}