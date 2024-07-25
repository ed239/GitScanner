

// import { useEffect, useRef } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// Chart.register(...registerables);

// const LineChartPulls = ({ pulls, allContributors }) => {
//   const chartRef = useRef(null);

//   const processPulls = (pulls) => {
//     const pullData = {};
//     pulls.forEach((pull) => {
//       const date = new Date(pull.created_at).toLocaleDateString();
//       const author = pull.user.login;

//       if (!pullData[author]) {
//         pullData[author] = {};
//       }
//       if (!pullData[author][date]) {
//         pullData[author][date] = 0;
//       }
//       pullData[author][date]++;
//     });

//     const authors = Object.keys(pullData);
//     const dates = Array.from(new Set(authors.flatMap((author) => Object.keys(pullData[author])))).sort();

//     const datasets = authors.map((author) => ({
//       label: author,
//       data: dates.map((date) => pullData[author][date] || 0),
//       fill: false,
//       borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
//       tension: 0.1,
//     }));

//     return { labels: dates, datasets };
//   };

//   const chartData = processPulls(pulls, allContributors);

//   const generatePDF = async () => {
//     const chartCanvas = chartRef.current.chartInstance.canvas;
//     const canvas = await html2canvas(chartCanvas);
//     const imgData = canvas.toDataURL('image/png');

//     const pdf = new jsPDF();
//     pdf.addImage(imgData, 'PNG', 10, 10);
//     pdf.save('chart.pdf');
//   };

//   useEffect(() => {
//     generatePDF();
//   }, [chartData]);

//   return (
//     <div>
//       <Line ref={chartRef} data={chartData} />
//     </div>
//   );
// };

// export default LineChartPulls;

import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';

Chart.register(...registerables);

const LineChartPulls = ({ pulls, allContributors, setChartImagePullsLine }) => {
  const chartRef = useRef(null);

  const processPulls = (pulls) => {
    const pullData = {};
    pulls.forEach((pull) => {
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
    const dates = Array.from(new Set(authors.flatMap((author) => Object.keys(pullData[author])))).sort();

    const datasets = authors.map((author) => ({
      label: author,
      data: dates.map((date) => pullData[author][date] || 0),
      fill: false,
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
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
