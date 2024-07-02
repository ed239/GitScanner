import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// const generateColors = (numColors) => {
//   const colors = [];
//   for (let i = 0; i < numColors; i++) {
//     const hue = (i * 360) / numColors;
//     colors.push(`hsl(${hue}, 70%, 50%)`);
//   }
//   return colors;
// };

const generateColorMap = (contributors) => {
  const colors = [];
  const colorMap = {};
  for (let i = 0; i < contributors.length; i++) {
    const hue = (i * 360) / contributors.length;
    const color = `hsl(${hue}, 70%, 50%)`;
    colors.push(color);
    colorMap[contributors[i].login] = color;
  }
  return colorMap;
};

const PieChart = ({ contributors, type, pullRequestsByContributor }) => {
  // const colors = generateColors(contributors.length);
  const colorMap = generateColorMap(contributors);
  
  const data = {
    labels: contributors.map((contributor) => contributor.login),
    datasets: [
      {
        label: 'Contributions',
        data: contributors.map((contributor) => contributor.contributions),
        backgroundColor: contributors.map((contributor) => colorMap[contributor.login]),
        hoverBackgroundColor: contributors.map((contributor) => colorMap[contributor.login]),
      },
    ],
  };

  console.log(contributors)



  const dataPR = {
    labels: Object.keys(pullRequestsByContributor),
    datasets: [
      {
        label: 'Pull Requests',
        data: Object.values(pullRequestsByContributor),
        backgroundColor: Object.keys(pullRequestsByContributor).map((login) => colorMap[login]),
        hoverBackgroundColor: Object.keys(pullRequestsByContributor).map((login) => colorMap[login]),
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };
if(type=="commits"){
  return <Pie data={data} options={options} />;
}
else{
  return <Pie data={dataPR} options={options} />;

}
};

export default PieChart;

