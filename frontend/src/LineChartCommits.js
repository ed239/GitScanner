// import React from 'react';

import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import html2canvas from 'html2canvas'
Chart.register(...registerables)

const LineChartCommits = ({
  commits,
  allContributors,
  setChartImageCommitsLine,
}) => {
  const chartRef = useRef(null)

  const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F333FF',
    '#33C7FF',
    '#FF33A6',
    '#A633FF',
    '#FFAF33',
    '#FF3333',
    '#2E7E4D',
    '#9CFEF8',
    '#F3FF33',
    '#76A3A0',
    '#DDBFF9',
    '#33A6FF',
    '#100404',
    '#A45802',
    '#82F1AD',
    '#F29ADC',
    '#33A633',
  ]

  const processCommits = (commits) => {
    const commitData = {}
    commits.forEach((commit) => {
      const date = new Date(commit.commit.author.date).toLocaleDateString()
      if (commit.author == null) {
        return
      }
      const author = commit.author.login

      // const author = commit.author.login ? commit.author.login : commit.commit.author.name;

      if (!commitData[author]) {
        commitData[author] = {}
      }
      if (!commitData[author][date]) {
        commitData[author][date] = 0
      }
      commitData[author][date]++
    })

    // console.log(allContributors)
    //   allContributors.forEach(author => {
    //     console.log(author.login)
    //     if (!commitData[author.login]) {
    //       commitData[author.login] = {};
    //     }
    //   });

    const authors = Object.keys(commitData).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    )

    const dates = Array.from(
      new Set(authors.flatMap((author) => Object.keys(commitData[author])))
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

    // authors.forEach(author => {
    //   dates.forEach(date => {
    //     if (!commitData[author][date]) {
    //       commitData[author][date] = 0;
    //     }
    //   });
    // });

    const datasets = authors.map((author, index) => ({
      label: author,
      data: dates.map((date) => commitData[author][date] || 0),
      fill: false,
      borderColor: colors[index % colors.length],
      tension: 0.1,
    }))

    return { labels: dates, datasets }
  }

  const chartData = processCommits(commits, allContributors)

  useEffect(() => {
    if (chartRef.current) {
      html2canvas(chartRef.current.canvas).then((canvas) => {
        setChartImageCommitsLine(canvas.toDataURL('image/png'))
      })
    }
  }, [chartData, setChartImageCommitsLine])

  return <Line ref={chartRef} data={chartData} />
}

export default LineChartCommits
