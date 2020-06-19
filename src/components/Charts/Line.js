import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

/**
 * Line Chart
 * react component to render a Chart.js Line chart
 * https://www.chartjs.org/docs/latest/charts/line.html
 */

function LineChart(props) {
  const refCanvas = useRef(null);
  const { options, dataObj, responsive, data, labels, fill, maxTicksLimit } = props;

  const chartData = {
    labels,
    datasets: [
      {
        data,
        fill: !!fill,
        borderColor: 'blue',
      },
    ],
  };
  const chartOptions = {
    responsive: !!responsive,
    title: {
      display: false,
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
    },
  };

  useEffect(() => {
    const ctx = refCanvas.current;
    const myChart = new Chart(ctx, {
      type: 'line',
      data: dataObj || chartData,
      options: options || chartOptions,
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

LineChart.defaultProps = {
  maxTicksLimit: 5,
};

LineChart.propTypes = {
  // this allows you to complete override the default options with your own
  option: PropTypes.object,
  // this allows you to completely override the data object
  dataObj: PropTypes.object,
  responsive: PropTypes.bool,
  fill: PropTypes.bool,
  data: PropTypes.array,
  labels: PropTypes.array,
  maxTicksLimit: PropTypes.number,
};

export default LineChart;
