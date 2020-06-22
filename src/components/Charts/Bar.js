import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

/**
 * Bar Chart
 * react component to render a Chart.js Bar chart
 * https://www.chartjs.org/docs/latest/charts/bar.html
 */

function BarChart(props) {
  const refCanvas = useRef(null);
  const {
    options,
    dataObj,
    responsive,
    data,
    labels,
    fill,
    maxTicksLimit,
    color,
    view,
    title,
  } = props;

  const chartData = {
    labels,
    datasets: [
      {
        data,
        fill: !!fill,
        backgroundColor: color,
      },
    ],
  };
  const chartOptions = {
    responsive: !!responsive,
    title: {
      display: true,
      text: title,
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            maxTicksLimit,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            scaleBeginAtZero: true,
            maxTicksLimit,
          },
        },
      ],
    },
  };

  useEffect(() => {
    const ctx = refCanvas.current;
    const myChart = new Chart(ctx, {
      type: view,
      data: dataObj || chartData,
      options: options || chartOptions,
      stepValue: 0.2,
    });
    return function cleanup() {
      myChart.destroy();
    };
  });

  return (
    <canvas ref={refCanvas}>
      <p>there will be a tabular fallback here</p>
    </canvas>
  );
}

BarChart.defaultProps = {
  maxTicksLimit: 10,
  color: Chart.defaults.global.defaultColor,
  view: 'bar',
};

BarChart.propTypes = {
  // this allows you to complete override the default options with your own
  option: PropTypes.object,
  // this allows you to completely override the data object
  dataObj: PropTypes.object,
  responsive: PropTypes.bool,
  fill: PropTypes.bool,
  view: PropTypes.string,
  data: PropTypes.array,
  labels: PropTypes.array,
  title: PropTypes.string,
  maxTicksLimit: PropTypes.number,
  color: PropTypes.string,
};

export default BarChart;
