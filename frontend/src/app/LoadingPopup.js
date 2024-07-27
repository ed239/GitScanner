// LoadingPopup.js
import React, { useEffect, useState } from 'react';
import styles from './LoadingPopup.module.css'; // Import your CSS module

const messages = [
  "Creating report...",
  "Loading data...",
  "This may take up to a minute..."
];

const LoadingPopup = ({ isVisible }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 500); // Change message every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return isVisible ? (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.spinner}></div>
        <p>{messages[messageIndex]}</p>
      </div>
    </div>
  ) : null;
};

export default LoadingPopup;
