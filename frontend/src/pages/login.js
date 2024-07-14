'use client';
import { useState } from 'react';
import styles from './styles/Login.module.css';
import { redirect } from 'next/dist/server/api-utils';


export default function Login() {

    const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;

    const onLoginPressed = (e) => {
        e.preventDefault();
        //console.log(username);
        //console.log(password);
        console.log("Client ID: " + clientID);
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + clientID)
    };
    return (
        <div className={styles.page}>
            <div className={styles.box}>
                <form onSubmit={onLoginPressed}>
                    <h1 className={styles.title}>Git Scanner Login</h1>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
}