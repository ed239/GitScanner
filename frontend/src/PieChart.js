import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);



const colors = [
  '#33FF57', '#CA0505', '#3357FF', '#F333FF', '#33C7FF', '#FF33A6', '#A633FF', '#FFAF33',
  '#FF5733', '#2E7E4D', '#9CFEF8', '#F3FF33', '#76A3A0', '#DDBFF9', '#33A6FF', '#100404',
  '#A45802', '#82F1AD', '#F29ADC', '#33A633'
];

const PieChart = ({ contributors, type, pullRequestsByContributor, setChartImageCommitsPie, setChartImagePullsPie }) => {
  const chartRef = useRef(null);
  // const colors = generateColors(contributors.length);

  const sortedContributors = [...contributors].sort((a, b) => a.login.localeCompare(b.login, undefined, { sensitivity: 'base' }));
  const sortedPRContributors = Object.keys(pullRequestsByContributor)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  const data = {
    labels: sortedContributors.map((contributor) => contributor.login),
    datasets: [
      {
        label: 'Contributions',
        data: sortedContributors.map((contributor) => contributor.contributions),
        backgroundColor: sortedContributors.map((_, index) => colors[index % colors.length]),
        hoverBackgroundColor: sortedContributors.map((_, index) => colors[index % colors.length]),
      },
    ],
  };
  console.log(sortedPRContributors)
  console.log(sortedContributors)

  const dataPR = {
    labels: sortedPRContributors,
    datasets: [
      {
        label: 'Pull Requests',
        data: sortedPRContributors.map((login) => pullRequestsByContributor[login]),
        backgroundColor: sortedPRContributors.map((_, index) => colors[index % colors.length]),
        hoverBackgroundColor: sortedPRContributors.map((_, index) => colors[index % colors.length]),
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
  
  useEffect(() => {
    if (chartRef.current) {
      html2canvas(chartRef.current.canvas).then((canvas) => {
        setChartImageCommitsPie(canvas.toDataURL('image/png'));
      });
    }
  }, [data, setChartImageCommitsPie]);

  return <Pie ref={chartRef} data={data} options={options} />;
}
else{
  useEffect(() => {
    if (chartRef.current) {
      html2canvas(chartRef.current.canvas).then((canvas) => {
        setChartImagePullsPie(canvas.toDataURL('image/png'));
      });
    }
  }, [dataPR, setChartImagePullsPie]);
  return <Pie ref={chartRef} data={dataPR} options={options} />;

}
};

export default PieChart;

