import React from 'react';
import { ChartJSModel } from '../../api/createPlot';
import {
    Chart as ChartJS,
    ChartOptions,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    BarElement,
  } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Spinner } from '@chakra-ui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: '会議全体の感情推移',
        },
    },
    scales: {
        x: {
          stacked: true,
          ticks: {
            callback: function(val, index) {
              return index % 2 === 0 ? `${val}分` : '';
            }
          }
        },
        y:{
          stacked: true,
        }
      }
}

export const EmotionTimeSeries = ({data}:{data:ChartJSModel}) => {
    if (!data || !data.datasets) {
        return <Spinner />
    }
    const labels: string[] = data.labels;
    const datasetsList: any = Array.isArray(data.datasets) ? data.datasets.map(item => {
        return { ...item, lineTension: 0.3 };
      }) : data.datasets;
        
    const graphData = {
        labels,
        datasets: datasetsList,
    }
    return(
    <>
        <Chart type='bar' options={options} data={graphData} />
    </>
)
}

