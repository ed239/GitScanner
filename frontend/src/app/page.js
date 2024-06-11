// src/pages/page.js (or src/pages/index.js)
'use client';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Git Scanner</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.roundedInput}
          placeholder="Enter text"
        />
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
}

