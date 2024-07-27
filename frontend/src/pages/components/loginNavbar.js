'use client';
import Link from 'next/link';
import styles from './loginNavbar.module.css';
import { useRouter } from 'next/navigation';

const loginNavbar = () => {
    const router = useRouter();

  const navigateToHome = () => {
    router.push('/');
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <button onClick={navigateToHome} className={styles.loginButton}>
            Home
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default loginNavbar;