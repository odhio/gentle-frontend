'use client'
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartJSModel } from '../../api/createPlot';
import { Spinner } from '@chakra-ui/react';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);
export const options = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '感情比率',
      },
    },
  };

export const EmotionSummary = ({data}:{data:ChartJSModel}) => {
    if (!data || !data.datasets) {
        return <Spinner />
    }
    const labels: string[] = data.labels;
    const datasetsList: any = data.datasets

    const graphData = {
        labels,
        datasets: datasetsList,
    }
    return(
    <>
        <Chart type='doughnut' options={options} data={graphData} />
    </>
)
}