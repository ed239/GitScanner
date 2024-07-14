// src/pages/page.js (or src/pages/index.js)
'use client';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';
import axios from 'axios';
import generatePDF from '../pdfGenerator';
import PieChart from '../PieChart.js';
import LineChartCommits from '../LineChartCommits.js';
import LineChartPulls from '@/LineChartPulls';

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
      console.error('Invalid GitHub repository link'); 
      return;
    }

    const repoPath = match[1]; 
    console.log(`Extracted repo path: ${repoPath}`); 

    try {
      const response = await axios.post('/api/fetchRepo', { link: repoPath });
      setRepoInfo(response.data);
      
      
    } catch (err) {
      setError('Error fetching repository information');
      console.error(err);
    }
  };

  const handleGeneratePDF = () => {
    if (repoInfo) {
      generatePDF(repoInfo);
    } else {
      console.error('No repository info available to generate PDF.');
    }
  };
  
  useEffect(() => {
    if (repoInfo) {
      console.log('Updated repoInfo:', repoInfo);
      console.log('Commits:', repoInfo.commits);
      console.log('Contributors:', repoInfo.contributors);
    }
  }, [repoInfo]);

  const getAllContributors = () => {
    if (!repoInfo || !repoInfo.contributors) {
      return [];
    }
    return repoInfo.contributors.map(contributor => contributor.login);
  };

  const processCommits = (commits) => {
    const commitData = {};
    commits.forEach(commit => {
      const date = new Date(commit.date).toLocaleDateString();
      const author = commit.author;
      if (!commitData[author]) {
        commitData[author] = {};
      }
      if (!commitData[author][date]) {
        commitData[author][date] = 0;
      }
      commitData[author][date]++;
    });

    const dates = Array.from(new Set(commits.map(commit => new Date(commit.date).toLocaleDateString()))).sort();
    const datasets = Object.keys(commitData).map(author => ({
      label: author,
      data: dates.map(date => commitData[author][date] || 0),
      fill: false,
      borderColor: '#' + Math.floor(Math.random()*16777215).toString(16), // random color
      tension: 0.1
    }));

    return { labels: dates, datasets };
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
        <button onClick={handleGeneratePDF} className={styles.submitButton}>Download PDF</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {repoInfo && (

        <div className={styles.infoContainer}>
          <div className={styles.infoBox}>
              <h2 className={styles.infoTitle}>Repository Information</h2>
              <p><strong>Description:</strong> {repoInfo.repoData.description}</p>
              <p><strong>Created:</strong> {repoInfo.repoData.created_at}</p>
              <p><strong>Updated:</strong> {repoInfo.repoData.updated_at}</p>
              <p><strong>Language:</strong> {repoInfo.repoData.language}</p>
              <p><strong>Size:</strong> {repoInfo.repoData.size}</p>
              <p><strong>Number of Pull Requests:</strong> {repoInfo.pulls.length}</p>
            </div>

            <div className={styles.infoBox}>
              <h2 className={styles.infoTitle}>Contributor Commits</h2>
              {repoInfo.contributors && repoInfo.contributors.length > 0 ? (
                <ul>
                  {repoInfo.contributors.map((contributor) => (
                    <li key={contributor.id}>
                      
                      <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                      {contributor.login}: {contributor.contributions} 
                      </a>
                      
                      
                    </li>
                    
                    
                  ))}
                </ul>
                
              ) : (
                <p>No contributors found.</p>
              )}

              {/* <PieChart contributors={repoInfo.contributors} type="commits" /> */}
              <PieChart contributors={repoInfo.contributors} type="commits" pullRequestsByContributor={repoInfo.pullRequestsByContributor} />
            </div>

            <div className={styles.infoBox}>
              <h2 className={styles.infoTitle}>Contributor Pull Requests</h2>
              {repoInfo.pullRequestsByContributor && Object.keys(repoInfo.pullRequestsByContributor).length > 0 ? (
              <ul>
                {Object.keys(repoInfo.pullRequestsByContributor).map((username, index) => (
                  <li key={username}>
                    <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
                      {username}: {Object.values(repoInfo.pullRequestsByContributor)[index]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
                <p>No contributors found.</p>
              )}
              
              {/* <PieChart contributors={repoInfo.contributors} type="pr" /> */}
              <PieChart contributors={repoInfo.contributors} type="pr" pullRequestsByContributor={repoInfo.pullRequestsByContributor} />
            </div>

            <div className={styles.infoBox}>
              <h2>Repository Info2</h2>
              {repoInfo.contributors && repoInfo.contributors.length > 0 ? (
                <ul>
                  {repoInfo.contributors.map((contributor) => (
                    <li key={contributor.id}>
                      
                      <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                      {contributor.login}: {contributor.author} 
                      </a>
                      
                      
                    </li>
                    
                    
                  ))}
                </ul>
                
              ) : (
                <p>No contributors found.</p>
              )}
            </div>

            
            <div className={styles.infoBoxLarge}>
            <h2 className={styles.infoTitle}>Commits Over Time</h2>
              <LineChartCommits commits={repoInfo.commits} allContributors={getAllContributors()} />
            </div>

            



            <div className={styles.infoBoxLarge}>
              <h2 className={styles.infoTitle}>Pulls Over Time</h2>
              <LineChartPulls pulls={repoInfo.pulls} allContributors={getAllContributors()} />
            </div>

            <div className={styles.infoBox}>
              <h2>Repository Info2</h2>
              <p><strong>Description:</strong> {repoInfo.repoData.description}</p>
            </div>
            
        </div>
        

        
     )}
    </div>
  );
}

{/* <div className={styles.repoInfo}>
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

          

        </div>  */}