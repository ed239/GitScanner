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



export default function Home() {
  const [links, setLinks] = useState(['']); // State to store input links
  const [repoInfoList, setRepoInfoList] = useState([]); // State to store fetched repository info
  const [error, setError] = useState(''); // State to handle errors

  const router = useRouter();

  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, '']);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRepoInfoList([]);
    console.log(links)

    const processedLinks = []
    for (const link of links) {
      const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+\/[\w-]+)/i;
      const match = link.match(regex);
      if (!match) {
        setError('Invalid GitHub repository link');
        console.error('Invalid GitHub repository link'); 
        return;
      }
      processedLinks.push(match[1]);
  }


  
    const data = {}
  console.log(processedLinks)
    try {
      for (const repoPath of processedLinks) {

       console.log(repoPath)
        
        const response = await axios.post('/api/fetchRepo', { link: repoPath.toString() });
        // console.log(response.data);
        data[repoPath] = response.data;
      }
  
     
      console.log(data);
      const repoInfoArray = Object.values(data);
      setRepoInfoList(repoInfoArray);
      
      return data;
  
    } catch (err) {
      console.error('Error fetching repository information:', err);
      setError('Error fetching repository information');
    }
  };

    const getAllContributors = (repoInfo) => {
    if (!repoInfo || !repoInfo.contributors) {
      return [];
    }
    return repoInfo.contributors.map(contributor => contributor.login);
  };

    const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#FF33A6', '#A633FF', '#FFAF33'
  ];


  const handleGeneratePDF = () => {
  
  };
  //   const handleGeneratePDF = () => {
//     if (repoInfo) {
//       generatePDF(repoInfo);
//     } else {
//       console.error('No repository info available to generate PDF.');
//     }
//   };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Git Scanner</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.roundedInput}
            placeholder="Enter GitHub repo link"
            value={links[0]}
            onChange={(e) => handleLinkChange(0, e.target.value)}
          />
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>Submit</button>
            <button type="button" onClick={handleAddLink} className={styles.submitButton}>Add Link</button>
          </div>
        </div>
        {links.slice(1).map((link, index) => (
          <div key={index + 1} className={styles.inputContainer}>
            <input
              type="text"
              className={styles.roundedInput}
              placeholder="Enter GitHub repo link"
              value={link}
              onChange={(e) => handleLinkChange(index + 1, e.target.value)}
            />
            <div className={styles.buttonPlaceholder}></div>
          </div>
        ))}
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {repoInfoList.map((repoInfo, index) => (
        <div key={index} className={styles.infoContainer}>
          <h2 className={styles.projTitle}>{repoInfo.repoData.name}</h2>
          <button onClick={handleGeneratePDF} className={styles.submitButton}>Download PDF</button>
          <div className={styles.infoBox}>
            <h2 className={styles.infoTitle}>Repository Information</h2>
            <p><strong>Name:</strong> {repoInfo.repoData.name}</p>
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
            <PieChart contributors={repoInfo.contributors} type="commits" pullRequestsByContributor={repoInfo.pullRequestsByContributor} />
          </div>

          <div className={styles.infoBoxLarge}>
            <h2 className={styles.infoTitle}>Commits Over Time</h2>
            <LineChartCommits commits={repoInfo.commits} allContributors={getAllContributors(repoInfo)} />
          </div>

          <div className={styles.infoBoxLarge}>
            <h2 className={styles.infoTitle}>Pulls Over Time</h2>
            <LineChartPulls pulls={repoInfo.pulls} allContributors={getAllContributors(repoInfo)} />
          </div>

          <div className={styles.infoBox}>
            <h2 className={styles.infoTitle}>Languages & Tools</h2>
            <br />
            <div className={styles.languagesContainer}>
              {Object.keys(repoInfo.languages).map((language, index) => (
                <div
                  key={language}
                  className={styles.languageBox}
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  {language}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}