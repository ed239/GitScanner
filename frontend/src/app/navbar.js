// components/Navbar.js
'use client';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <button onClick={navigateToLogin} className={styles.loginButton}>
            Login
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
