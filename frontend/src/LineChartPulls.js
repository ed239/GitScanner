import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const LineChartPulls = ({ pulls, allContributors }) => {
  console.log(pulls)
  const processPulls = (pulls) => {
    const pullData = {};
    pulls.forEach(pull => {
      console.log(pull)
      const date = new Date(pull.created_at).toLocaleDateString();
      const author = pull.user.login;
     
      if (!pullData[author]) {
        pullData[author] = {};
      }
      if (!pullData[author][date]) {
        pullData[author][date] = 0;
      }
      pullData[author][date]++;
    });
    

const authors = Object.keys(pullData);
const dates = Array.from(new Set(authors.flatMap(author => Object.keys(pullData[author])))).sort();

console.log(pullData)
const datasets = authors.map(author => ({
  label: author,
  data: dates.map(date => pullData[author][date] || 0),
  fill: false,
  borderColor: '#' + Math.floor(Math.random()*16777215).toString(16),
  tension: 0.1
}));

return { labels: dates, datasets };
};

const chartData = processPulls(pulls, allContributors);

return (

    <Line data={chartData} />
  
);
};

export default LineChartPulls;