import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = (i * 360) / numColors;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const PieChart = ({ contributors, type }) => {
  const colors = generateColors(contributors.length);

  
  const data = {
    labels: contributors.map((contributor) => contributor.login),
    datasets: [
      {
        label: 'Contributions',
        data: contributors.map((contributor) => contributor.contributions),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  // const dataPR = {
  //   labels: contributors.map((contributor) => contributor.login),
  //   datasets: [
  //     {
  //       label: 'Contributions',
  //       data: contributors.map((contributor) => repoInfo.pullRequestsByContributor[contributor.login] || 0),
  //       backgroundColor: colors,
  //       hoverBackgroundColor: colors,
  //     },
  //   ],
  // };


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
  // return <Pie data={dataPR} options={options} />;

}
};

export default PieChart;

