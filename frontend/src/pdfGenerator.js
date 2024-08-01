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
    let position = 10;

    // Create HTML structure
    container.innerHTML = `
      <div class="${styles.infoContainer}">
        <h2 class="${styles.projTitle}">${repoInfo.repoData.name}</h2>
        <div class="${styles.infoBoxPDF}">
          <h2 class="${styles.infoTitle}">Repository Information</h2>
          <p><strong>Name:</strong> ${repoInfo.repoData.name}</p>
          <p><strong>Description:</strong> ${repoInfo.repoData.description}</p>
          <p><strong>Created:</strong> ${repoInfo.repoData.created_at}</p>
          <p><strong>Updated:</strong> ${repoInfo.repoData.updated_at}</p>
          <p><strong>Language:</strong> ${repoInfo.repoData.language}</p>
          <p><strong>Size:</strong> ${repoInfo.repoData.size}</p>
          <p><strong>Number of Pull Requests:</strong> ${repoInfo.pulls.length}</p>
        </div>
        <div class="${styles.infoBoxPDF}">
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
        <div class="${styles.infoBoxPiePDF}">
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
          <div id="pie-commits-placeholder"></div>
        </div>
        <div class="${styles.infoBoxPiePDF}">
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
          <div id="pie-pulls-placeholder"></div>
        </div>
        <div class="${styles.infoBoxLargePDF}">
          <h2 class="${styles.infoTitle}">Commits Over Time</h2>
          <div id="chart-commits-placeholder"></div>
        </div>
       
      </div>
    `;


    document.body.appendChild(container);



    if (chartImageCommitsPie[repoIndex]) {
      const chartPieCommitsPlaceholder = container.querySelector('#pie-commits-placeholder');
      const chartPieCommitssImg = document.createElement('img');
      chartPieCommitssImg.src = chartImageCommitsPie[repoIndex];
      chartPieCommitssImg.style.width = '100%';
      chartPieCommitsPlaceholder.appendChild(chartPieCommitssImg);
    }

    if (chartImagePullsPie[repoIndex]) {
      const chartPiePullsPlaceholder = container.querySelector('#pie-pulls-placeholder');
      const chartPiePullsImg = document.createElement('img');
      chartPiePullsImg.src = chartImagePullsPie[repoIndex];
      chartPiePullsImg.style.width = '100%';
      chartPiePullsPlaceholder.appendChild(chartPiePullsImg);
    }

    if (chartImageCommitsLine[repoIndex]) {
      const chartCommitsPlaceholder = container.querySelector('#chart-commits-placeholder');
      const chartCommitsImg = document.createElement('img');
      chartCommitsImg.src = chartImageCommitsLine[repoIndex];
      chartCommitsImg.style.width = '100%';
      chartCommitsPlaceholder.appendChild(chartCommitsImg);
    }

    

    const canvasPart1 = await html2canvas(container, { scale: 2 });
    const imgDataPart1 = canvasPart1.toDataURL('image/png');
    const imgHeightPart1 = (canvasPart1.height * 190) / canvasPart1.width;

    // Add the captured part to the PDF, checking if it fits the current page
    if (position + imgHeightPart1 > pageHeight) {
      doc.addPage();
      position = 10;
    }
    doc.addImage(imgDataPart1, 'PNG', 10, position, 190, imgHeightPart1);
    position += imgHeightPart1;

    // Remove the first container from the DOM after capturing
    document.body.removeChild(container);

    // Add a new page for the second container
    doc.addPage();
    position = 10;

    // Second Container
    const container2 = document.createElement('div');
    container2.className = styles.containerPDF;

    // Create HTML structure for the second container
    container2.innerHTML = `
      <div class="${styles.infoContainer}">
        <div class="${styles.infoBoxLargePDF}">
          <h2 class="${styles.infoTitle}">Pulls Over Time</h2>
          <div id="chart-pulls-placeholder"></div>
        </div>
      </div>
    `;

    // Append the second container to the body to ensure it is part of the DOM
    document.body.appendChild(container2);

    if (chartImagePullsLine[repoIndex]) {
      const chartPullsPlaceholder = container2.querySelector('#chart-pulls-placeholder');
      const chartPullsImg = document.createElement('img');
      chartPullsImg.src = chartImagePullsLine[repoIndex];
      chartPullsImg.style.width = '100%';
      chartPullsPlaceholder.appendChild(chartPullsImg);
    }

    // const canvas = await html2canvas(container, { scale: 2 });
    // const imgData = canvas.toDataURL('image/png');

    // const imgHeight = (canvas.height * 190) / canvas.width;
    // let position = 10;
    const canvasPart2 = await html2canvas(container2, { scale: 2 });
    const imgDataPart2 = canvasPart2.toDataURL('image/png');
    const imgHeightPart2 = (canvasPart2.height * 190) / canvasPart2.width;

    // Add the captured part to the PDF, checking if it fits the current page
    // if (position + imgHeightPart2 > pageHeight) {
    //   doc.addPage();
    //   position = 10;
    // }
    doc.addImage(imgDataPart2, 'PNG', 10, position, 190, imgHeightPart2);
    position += imgHeightPart2;

    // if (repoIndex > 0) {
    //   doc.addPage();
    //   position = 10;
    // }

    if(repoIndex < repoInfoList.length-1){
      doc.addPage();
      position = 10;
    }

    // doc.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
    // position += imgHeight;



    // if (chartImagePullsLine) {
    //   doc.addPage();
    //   doc.addImage(chartImagePullsLine, 'PNG', 10, 10, 190, 100);
    // }


    document.body.removeChild(container2);
  }

  doc.save('repo-info.pdf');
};




export default generatePDF;