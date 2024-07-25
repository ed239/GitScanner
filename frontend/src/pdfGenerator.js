import jsPDF from 'jspdf';

// const generatePDF = (repoInfo) => {
//   const doc = new jsPDF();

//   if (repoInfo) {
//     doc.text("Repository Info", 10, 10);
//     doc.text(`Name: ${repoInfo.repoData.name}`, 10, 20);
//     doc.text(`Full Name: ${repoInfo.repoData.full_name}`, 10, 30);
//     doc.text(`Owner: ${repoInfo.repoData.owner.login}`, 10, 40);
//     doc.text(`Description: ${repoInfo.repoData.description}`, 10, 50);
//     doc.text(`Stars: ${repoInfo.repoData.stargazers_count}`, 10, 60);
//     doc.text(`Forks: ${repoInfo.repoData.forks_count}`, 10, 70);
//     doc.text(`Open Issues: ${repoInfo.repoData.open_issues_count}`, 10, 80);
//     doc.text(`Watchers: ${repoInfo.repoData.watchers_count}`, 10, 90);
//     doc.text(`Created At: ${new Date(repoInfo.repoData.created_at).toLocaleString()}`, 10, 100);
//     doc.text(`Updated At: ${new Date(repoInfo.repoData.updated_at).toLocaleString()}`, 10, 110);
//     doc.text(`Pushed At: ${new Date(repoInfo.repoData.pushed_at).toLocaleString()}`, 10, 120);
//     doc.text(`Language: ${repoInfo.repoData.language}`, 10, 130);
//     doc.text(`License: ${repoInfo.repoData.license ? repoInfo.repoData.license.name : "None"}`, 10, 140);

//     if (repoInfo.contributors && repoInfo.contributors.length > 0) {
//       doc.text("Contributors:", 10, 150);
//       repoInfo.contributors.forEach((contributor, index) => {
//         doc.text(`${contributor.login} (${contributor.contributions} contributions)`, 10, 160 + (index * 10));
//       });
//     }

//     if (repoInfo.pullRequestsByContributor) {
//       doc.text("Pull Requests by Contributor:", 10, 170 + (repoInfo.contributors.length * 10));
//       Object.keys(repoInfo.pullRequestsByContributor).forEach((contributor, index) => {
//         doc.text(`${contributor}: ${repoInfo.pullRequestsByContributor[contributor]}`, 10, 180 + (repoInfo.contributors.length * 10) + (index * 10));
//       });
//     }
//   }

//   doc.save('repo-info.pdf');
// };

// export default generatePDF;

import html2canvas from 'html2canvas';
import styles from './app/Home.module.css';
import LineChartCommits from './LineChartCommits';
import { LineChartPulls } from './LineChartPulls';
import PieChart from './PieChart';
import { useState, useEffect } from 'react';


const getAllContributors = (repoInfo) => {
  if (!repoInfo || !repoInfo.contributors) {
    return [];
  }
  return repoInfo.contributors.map(contributor => contributor.login);
};

  const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#FF33A6', '#A633FF', '#FFAF33'
];



const generatePDF = async (repoInfoList,chartImageCommitsPie, chartImagePullsPie, chartImageCommitsLine,chartImagePullsLine) => {

//   const [imageSrc, setImageSrc] = useState('');

// useEffect(() => {
//   const myChart = new ChartJsImage();
//   myChart.setConfig({
//     type: 'bar',
//     data: { 
//       labels: ['Hello world', 'Foo bar'], 
//       datasets: [{ label: 'Foo', data: [1, 2] }]
//     },
//   });
//   myChart.toDataUrl().then((data) => setImageSrc(data));
// }, []);


  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;

  for (let repoIndex = 0; repoIndex < repoInfoList.length; repoIndex++) {
    const repoInfo = repoInfoList[repoIndex];

    // Create a container element to hold the HTML content for the repo
    const container = document.createElement('div');
    container.className = styles.containerPDF;

    // Create HTML structure
    container.innerHTML = `
      <div class="${styles.infoContainer}">
        <h2 class="${styles.projTitle}">${repoInfo.repoData.name}</h2>
        <div class="${styles.infoBox}">
          <h2 class="${styles.infoTitle}">Repository Information</h2>
          <p><strong>Name:</strong> ${repoInfo.repoData.name}</p>
          <p><strong>Description:</strong> ${repoInfo.repoData.description}</p>
          <p><strong>Created:</strong> ${repoInfo.repoData.created_at}</p>
          <p><strong>Updated:</strong> ${repoInfo.repoData.updated_at}</p>
          <p><strong>Language:</strong> ${repoInfo.repoData.language}</p>
          <p><strong>Size:</strong> ${repoInfo.repoData.size}</p>
          <p><strong>Number of Pull Requests:</strong> ${repoInfo.pulls.length}</p>
        </div>
        <div class="${styles.infoBox}">
          <h2 class="${styles.infoTitle}">Languages & Tools</h2>
          <br />
          <div class="${styles.languagesContainer}">
            ${Object.keys(repoInfo.languages).map((language, index) => `
              <div class="${styles.languageBox}" style="background-color: ${colors[index % colors.length]}">
                ${language}
              </div>
            `).join('')}
          </div>
        </div>
        <div class="${styles.infoBoxPie}">
          <h2 class="${styles.infoTitle}">Contributor Commits</h2>
          ${repoInfo.contributors && repoInfo.contributors.length > 0 ? `
            <ul>
              ${repoInfo.contributors.map(contributor => `
                <li>
                  <a href="${contributor.html_url}" target="_blank" rel="noopener noreferrer">
                    ${contributor.login}: ${contributor.contributions}
                  </a>
                </li>
              `).join('')}
            </ul>
          ` : `<p>No contributors found.</p>`}
        </div>
        <div class="${styles.infoBoxPie}">
          <h2 class="${styles.infoTitle}">Contributor Pull Requests</h2>
          ${repoInfo.pullRequestsByContributor && Object.keys(repoInfo.pullRequestsByContributor).length > 0 ? `
            <ul>
              ${Object.keys(repoInfo.pullRequestsByContributor).map(username => `
                <li>
                  <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer">
                    ${username}: ${repoInfo.pullRequestsByContributor[username]}
                  </a>
                </li>
              `).join('')}
            </ul>
          ` : `<p>No contributors found.</p>`}
        </div>
        <div class="${styles.infoBoxLarge}">
          <h2 class="${styles.infoTitle}">Commits Over Time</h2>
        </div>
        <div class="${styles.infoBoxLarge}">
          <h2 class="${styles.infoTitle}">Pulls Over Time</h2>
          <div id="chart-placeholder"></div>
          
        </div>
      </div>
    `;


    document.body.appendChild(container);


    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const imgHeight = (canvas.height * 190) / canvas.width;
    let position = 10;

    if (repoIndex > 0) {
      doc.addPage();
    }

    doc.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
    position += imgHeight;
    if(chartImageCommitsPie && chartImagePullsPie){
      doc.addPage();
      doc.addImage(chartImageCommitsPie, 'PNG', 10, 10, 70, 70);
      doc.addPage();
      doc.addImage(chartImagePullsPie, 'PNG', 10, 10, 70, 70);
    }

    if(chartImageCommitsLine){
      doc.addPage();
      doc.addImage(chartImageCommitsLine, 'PNG', 10, 10, 190, 100);
    }

    if (chartImagePullsLine) {
      doc.addPage();
      doc.addImage(chartImagePullsLine, 'PNG', 10, 10, 190, 100);
    }
    // if (chartImage) {
    //   const chartPlaceholder = container.querySelector('#chart-placeholder');
    //   const chartImg = document.createElement('img');
    //   chartImg.src = chartImage;
    //   chartPlaceholder.appendChild(chartImg);
    // }

    document.body.removeChild(container);
  }

  doc.save('repo-info.pdf');
};




export default generatePDF;