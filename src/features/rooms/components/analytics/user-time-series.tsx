import React from 'react';
import { ChartJSModel } from '../../api/createPlot';
import {
    Chart as ChartJS,
    ChartOptions,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController,
  } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Spinner } from '@chakra-ui/react';

ChartJS.register(
    CategoryScale,
    LineController,
    LinearScale,
    LineElement,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: '発言量の推移',
        },
    },
    scales: {
        x: {
          ticks: {
            callback: function(val, index) {
              return index % 2 === 0 ? `${val}分` : '';
            }
          }
        }
      }
}

export const UserTimeSeries = ({data}:{data:ChartJSModel}) => {
    if (!data || !data.datasets) {
        return <Spinner />;
    }

    const labels: string[] = data.labels;
    const datasetsList: any = Array.isArray(data.datasets) ? data.datasets.map(item => {
        return { ...item, lineTension: 0.3 };
      }) : data.datasets;
        
    const graphData = {
        labels,
        datasets: datasetsList
    } 
    return(
    <>
        <Chart type='line' options={options} data={graphData} />
    </>
)
}

