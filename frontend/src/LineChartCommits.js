// import React from 'react';

import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
Chart.register(...registerables);

const LineChartCommits = ({ commits, allContributors, setChartImageCommitsLine }) => {
  const chartRef = useRef(null);
  const processCommits = (commits) => {
    const commitData = {};
    commits.forEach(commit => {
      console.log("In Line Chart Commit")
      console.log(commit)
      console.log(commit.commit.author.name)
      const date = new Date(commit.commit.author.date).toLocaleDateString();
      if(commit.author == null){
        return
      }
      const author = commit.author.login;
      
      
      // const author = commit.author.login ? commit.author.login : commit.commit.author.name;
      
        
     
      if (!commitData[author]) {
        commitData[author] = {};
      }
      if (!commitData[author][date]) {
        commitData[author][date] = 0;
      }
      commitData[author][date]++;
    });

// console.log(allContributors)
//   allContributors.forEach(author => {
//     console.log(author.login)
//     if (!commitData[author.login]) {
//       commitData[author.login] = {};
//     }
//   });

    

const authors = Object.keys(commitData);
const dates = Array.from(new Set(authors.flatMap(author => Object.keys(commitData[author])))).sort();

// authors.forEach(author => {
//   dates.forEach(date => {
//     if (!commitData[author][date]) {
//       commitData[author][date] = 0;
//     }
//   });
// });


const datasets = authors.map(author => ({
  label: author,
  data: dates.map(date => commitData[author][date] || 0),
  fill: false,
  borderColor: '#' + Math.floor(Math.random()*16777215).toString(16),
  tension: 0.1
}));

return { labels: dates, datasets };
};

const chartData = processCommits(commits, allContributors);

useEffect(() => {
  if (chartRef.current) {
    html2canvas(chartRef.current.canvas).then((canvas) => {
      setChartImageCommitsLine(canvas.toDataURL('image/png'));
    });
  }
}, [chartData, setChartImageCommitsLine]);

return (

    <Line ref ={chartRef} data={chartData} />
  
);
};

export default LineChartCommits;