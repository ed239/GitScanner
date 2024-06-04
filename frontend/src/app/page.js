// src/pages/page.js (or src/pages/index.js)
'use client';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToOneTimeLink = () => {
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Git Scanner</h1>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>Try it</button>
        <button className={styles.button} onClick={navigateToLogin}>Login</button>
      </div>
    </div>
  );
}

