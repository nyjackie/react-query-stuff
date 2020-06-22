import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

/**
 * Pie Chart
 * react component to render a Chart.js Pie chart
 * https://www.chartjs.org/docs/latest/charts/doughnut.html
 */

function PieChart(props) {
  const refCanvas = useRef(null);
  const { options, dataObj, responsive, data, labels, fill, color, view, title } = props;

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
      display: true,
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

PieChart.defaultProps = {
  color: Chart.defaults.global.defaultColor,
  view: 'pie',
};

PieChart.propTypes = {
  // this allows you to complete override the default options with your own
  option: PropTypes.object,
  // this allows you to completely override the data object
  dataObj: PropTypes.object,
  responsive: PropTypes.bool,
  fill: PropTypes.bool,
  view: PropTypes.string,
  data: PropTypes.array,
  //labels for legends
  labels: PropTypes.array,
  title: PropTypes.string,
  color: PropTypes.array,
};

export default PieChart;
