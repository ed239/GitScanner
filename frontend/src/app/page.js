// src/pages/page.js (or src/pages/index.js)
'use client';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import { useState } from 'react';
import axios from 'axios';

// export default function Home() {
//   const router = useRouter();

//   const navigateToLogin = () => {
//     router.push('/login');
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//   };


//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Git Scanner</h1>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <input
//           type="text"
//           className={styles.roundedInput}
//           placeholder="Enter text"
//         />
//         <button type="submit" className={styles.submitButton}>
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }

export default function Home() {
  const [link, setLink] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRepoInfo(null);
    console.log(`Submitted link: ${link}`);

    const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+\/[\w-]+)/i;
    const match = link.match(regex);
    if (!match) {
      setError('Invalid GitHub repository link');
      console.error('Invalid GitHub repository link'); // Log invalid link error
      return;
    }

    const repoPath = match[1]; // Extracting the repository path from the match
    console.log(`Extracted repo path: ${repoPath}`); // Log the extracted repo path

    try {


      console.log(repoPath)
      const response = await axios.post('/api/fetchRepo', { link: repoPath });
      setRepoInfo(response.data);
    } catch (err) {
      setError('Error fetching repository information');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Git Scanner</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.roundedInput}
          placeholder="Enter GitHub repo link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button type="submit" className={styles.submitButton} >
          Submit
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {repoInfo && (
        <div className={styles.repoInfo}>
          <h2>Repository Info</h2>
          <p><strong>Name:</strong> {repoInfo.name}</p>
          <p><strong>Description:</strong> {repoInfo.repoData.description}</p>
          <p><strong>Created:</strong> {repoInfo.repoData.created_at}</p>
          <p><strong>Updated:</strong> {repoInfo.repoData.updated_at}</p>
          <p><strong>Language:</strong> {repoInfo.repoData.language}</p>
          <p><strong>Size:</strong> {repoInfo.repoData.size}</p>
          <p><strong>Number of Pull Requests:</strong> {repoInfo.pulls.length}</p>

          <h3>Contributors</h3>
          {repoInfo.contributors && repoInfo.contributors.length > 0 ? (
            <ul>
              {repoInfo.contributors.map((contributor) => (
                <li key={contributor.id}>
                  <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                    {contributor.login} ({contributor.contributions} contributions)
                  </a>
                  <p>Pull Requests: {repoInfo.pullRequestsByContributor[contributor.login] || 0}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No contributors found.</p>
          )}



        </div>
      )}
    </div>
  );
}