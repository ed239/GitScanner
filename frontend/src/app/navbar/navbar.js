// components/Navbar.js
'use client';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useRouter } from 'next/navigation';
import { redirect } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


const Navbar = () => {
    // const router = useRouter();

  // const navigateToLogin = () => {
  //   router.push('/login');
  // };
  const { data: session } = useSession();

  // const session = await getServerSession(authOptions);

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          {session ? <button onClick={() => signOut()}>Log Out</button> :
        <button onClick={() => signIn()}>Log In</button>    
        }
        {/* <button onClick={() => signIn()}>Log In</button> */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
