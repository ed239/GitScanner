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
import LoadingPopup from './LoadingPopup';




export default function Home() {
  const [links, setLinks] = useState(['']); // State to store input links
  const [repoInfoList, setRepoInfoList] = useState([]); // State to store fetched repository info
  const [error, setError] = useState(''); // State to handle errors
  const [chartImagePullsLine, setChartImagePullsLine] = useState([]);
  const [chartImageCommitsLine, setChartImageCommitsLine] = useState([]);
  const [chartImageCommitsPie, setChartImageCommitsPie] = useState([]);
  const [chartImagePullsPie, setChartImagePullsPie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  setIsLoading(true);
    try {
      for (const repoPath of processedLinks) {

       const token = localStorage.getItem('token');
       const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        // const response = await axios.post('/api/fetchRepo', { link: repoPath.toString() });
        const response = await axios.post('/api/fetchRepo', 
          { link: repoPath.toString() }, 
          { headers }
        );
        console.log(response.data);
        data[repoPath] = response.data;
      }
  
     
      console.log(data);
      const repoInfoArray = Object.values(data);
  
      setRepoInfoList(repoInfoArray);
      setIsLoading(false);
      
      return data;
  
    } catch (err) {
      setIsLoading(false);
      console.error('Error fetching repository information:', err);
      

      if (err.response && err.response.data.error === 'GitHub API rate limit exceeded') {
        setError('GitHub API rate limit exceeded. Please login or try again later.');
      } else {
        setError('Error getting repository information');
      }
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


  const updateChartImages = (repoIndex, chartType, imgSrc) => {
    switch (chartType) {
      case 'pullsLine':
        setChartImagePullsLine(prev => {
          const newCharts = [...prev];
          newCharts[repoIndex] = imgSrc; 
          return newCharts;
        });
        break;
      case 'commitsLine':
        setChartImageCommitsLine(prev => {
          const newCharts = [...prev];
          newCharts[repoIndex] = imgSrc; 
          return newCharts;
        });
        break;
      case 'commitsPie':
        setChartImageCommitsPie(prev => {
          const newCharts = [...prev];
          newCharts[repoIndex] = imgSrc; 
          return newCharts;
        });
        break;
      case 'pullsPie':
        setChartImagePullsPie(prev => {
          const newCharts = [...prev];
          newCharts[repoIndex] = imgSrc; 
          return newCharts;
        });
        break;
      default:
        console.error(`Unknown chart type: ${chartType}`);
    }
  };

  const handleGeneratePDF = async () => {
    if (repoInfoList && repoInfoList.length > 0) {
      setIsLoading(true);
      try {
        // Ensure the containers are not hidden initially
        document.querySelectorAll('.containerPDF').forEach(container => {
          container.classList.remove('hidden');
        });

        // Generate the PDF
        await generatePDF(repoInfoList, chartImageCommitsPie, chartImagePullsPie, chartImageCommitsLine, chartImagePullsLine);

        // Hide the containers after generating the PDF
        document.querySelectorAll('.containerPDF').forEach(container => {
          container.classList.add('hidden');
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsLoading(false); // Hide the loading popup
      }
    } else {
      console.error('No repository info available to generate PDF.');
    }
  };

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
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.roundedInput2}
              placeholder="Enter GitHub repo link"
              value={link}
              onChange={(e) => handleLinkChange(index + 1, e.target.value)}
            />
            {/* <div className={styles.buttonPlaceholder}></div> */}

            <div className={styles.buttonContainer}>
            <button type="submit" className={styles.notSeen}>Submit</button>
            <button type="button" onClick={handleAddLink} className={styles.notSeen}>Add Link</button>
          </div>
            </div>
          </div>
        ))}
      </form>
      <LoadingPopup isVisible={isLoading} />
      {Object.keys(repoInfoList).length > 0 && (
        <button onClick={handleGeneratePDF} className={styles.submitButton}>Download PDF</button>
        
      )}
      {error && <p className={styles.error}>{error}</p>}

      {repoInfoList.map((repoInfo, index) => (
        <div key={index} className={styles.infoContainer}>
        
          <h2 className={styles.projTitle}>{repoInfo.repoData.name}</h2>
          {/* <button onClick={handleGeneratePDF} className={styles.submitButton}>Download PDF</button> */}
          <div className={styles.infoBox}>
            <h2 className={styles.infoTitle}>Repository Information</h2>
            <p><strong>Name:</strong> {repoInfo.repoData.name}</p>
            <p><strong>Description:</strong> {repoInfo.repoData.description}</p>
            <p><strong>Created:</strong> {repoInfo.repoData.created_at}</p>
            <p><strong>Updated:</strong> {repoInfo.repoData.updated_at}</p>
            <p><strong>Size:</strong> {repoInfo.repoData.size}</p>
            <p><strong>Number of Commits:</strong> {repoInfo.commits.length}</p>
            <p><strong>Number of Pull Requests:</strong> {repoInfo.pulls.length}</p>
          </div>

          {/* <div className={styles.infoBox}>
            <h2 className={styles.infoTitle}>Contributor Information</h2>
          </div> */}
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

          <div className={styles.infoBoxPie}>
            <h2 className={styles.infoTitle}>Contributor Commits</h2>
            {repoInfo.commitsByContributor && Object.keys(repoInfo.commitsByContributor).length > 0 ? (
                <ul>
                  {Object.keys(repoInfo.commitsByContributor)
                    .sort((a, b) => a.localeCompare(b)) // Sorting the usernames alphabetically
                    .map((username) => (
                      <li key={username}>
                        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
                          {username}: {repoInfo.commitsByContributor[username]}
                        </a>
                      </li>
                    ))}
                </ul>
            ) : (
              <p>No contributors found.</p>
            )}
            <PieChart contributors={repoInfo.contributors} type="commits" pullRequestsByContributor={repoInfo.pullRequestsByContributor} setChartImageCommitsPie={(imgSrc) => updateChartImages(index, 'commitsPie', imgSrc)}  />
          </div>

          <div className={styles.infoBoxPie}>
              <h2 className={styles.infoTitle}>Contributor Pull Requests</h2>
              {repoInfo.pullRequestsByContributor && Object.keys(repoInfo.pullRequestsByContributor).length > 0 ? (
                <ul>
                  {Object.keys(repoInfo.pullRequestsByContributor)
                    .sort((a, b) => a.localeCompare(b)) // Sorting the usernames alphabetically
                    .map((username) => (
                      <li key={username}>
                        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
                          {username}: {repoInfo.pullRequestsByContributor[username]}
                        </a>
                      </li>
                    ))}
                </ul>
            ) : (
                <p>No contributors found.</p>
              )}
              
              <PieChart contributors={repoInfo.contributors} type="pr" pullRequestsByContributor={repoInfo.pullRequestsByContributor} setChartImagePullsPie={(imgSrc) => updateChartImages(index, 'pullsPie', imgSrc)} />
            </div>

          <div className={styles.infoBoxLarge}>
            <h2 className={styles.infoTitle}>Commits Over Time</h2>
            <LineChartCommits commits={repoInfo.commits} allContributors={getAllContributors(repoInfo)} setChartImageCommitsLine={(imgSrc) => updateChartImages(index, 'commitsLine', imgSrc)}  />
          </div>

          <div className={styles.infoBoxLarge}>
            <h2 className={styles.infoTitle}>Pulls Over Time</h2>
            {/* <LineChartPulls pulls={repoInfo.pulls} allContributors={getAllContributors(repoInfo)} /> */}
            <LineChartPulls pulls={repoInfo.pulls} allContributors={getAllContributors(repoInfo)}  setChartImagePullsLine={(imgSrc) => updateChartImages(index, 'pullsLine', imgSrc)}/>
          </div>

          
        </div>
      ))}
    </div>
  );
}