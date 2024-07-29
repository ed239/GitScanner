// components/Navbar.js
'use client';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const router = useRouter();
    const [token, setToken] = useState("")

    useEffect(() => {
      setToken(localStorage.getItem("token"));
    },[])

  const navigateToLogin = () => {
    router.push('/login');
  };

  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          {!token? <button onClick={navigateToLogin} className={styles.loginButton}>
            Login
          </button> : <button onClick={logout} className={styles.loginButton}>Logout</button>
          }
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
