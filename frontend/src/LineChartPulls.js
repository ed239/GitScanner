

import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';

Chart.register(...registerables);

const LineChartPulls = ({ pulls, allContributors, setChartImagePullsLine }) => {
  const chartRef = useRef(null);

  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33C7FF', '#FF33A6', '#A633FF', '#FFAF33',
    '#FF3333', '#2E7E4D', '#9CFEF8', '#F3FF33', '#76A3A0', '#DDBFF9', '#33A6FF', '#100404',
    '#A45802', '#82F1AD', '#F29ADC', '#33A633'
  ];

  const processPulls = (pulls) => {
    const pullData = {};
    pulls.forEach((pull) => {
      const date = new Date(pull.created_at).toLocaleDateString();
      const author = pull.user.login;

      if(pull.merged_at == null){
        return
      }

      if (!pullData[author]) {
        pullData[author] = {};
      }
      if (!pullData[author][date]) {
        pullData[author][date] = 0;
      }
      pullData[author][date]++;
    });

    // const authors = Object.keys(pullData).sort();
    // const dates = Array.from(new Set(authors.flatMap((author) => Object.keys(pullData[author])))).sort();

    const authors = Object.keys(pullData).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    const dates = Array.from(new Set(authors.flatMap(author => Object.keys(pullData[author]))))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    

    const datasets = authors.map((author, index) => ({
      label: author,
      data: dates.map((date) => pullData[author][date] || 0),
      fill: false,
      borderColor: colors[index % colors.length],
      tension: 0.1,
    }));

    return { labels: dates, datasets };
  };

  const chartData = processPulls(pulls, allContributors);

  useEffect(() => {
    if (chartRef.current) {
      html2canvas(chartRef.current.canvas).then((canvas) => {
        setChartImagePullsLine(canvas.toDataURL('image/png'));
      });
    }
  }, [chartData, setChartImagePullsLine]);

  return <Line ref={chartRef} data={chartData} />;
};

export default LineChartPulls;

