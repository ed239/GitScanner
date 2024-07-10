'use client';
import { useState } from 'react';
// import type { NextRequest } from "next/server";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import styles from './Login.module.css';



export default function Login() {

    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');

    // const onLoginPressed = (e) => {
    //     e.preventDefault();
    //     console.log(username);
    //     console.log(password);
    // };

    // const { data: session } = useSession();
    // if (session) {
    //   redirect("/");
    // }
    return (
        <div className={styles.page}>
            <div className={styles.box}>
                {/* <form onSubmit={onLoginPressed}>
                    <h1 className={styles.title}>Git Scanner Login</h1>
                    <input type="text" placeholder="Username" className={styles.inputField} value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <input type="text" placeholder="Password" className={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit" className={styles.button}>Login</button>
                </form> */}
                <h1 className={styles.title}>Git Scanner Login</h1>
                <button className={styles.button} onClick={() => signIn("github")}>Sign in with github</button>
            </div>
        </div>
    );
}