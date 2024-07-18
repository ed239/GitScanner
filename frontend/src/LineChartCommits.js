// import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const LineChartCommits = ({ commits, allContributors }) => {
  const processCommits = (commits) => {
    const commitData = {};
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date).toLocaleDateString();
      const author = commit.author.login;
     
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

return (

    <Line data={chartData} />
  
);
};

export default LineChartCommits;