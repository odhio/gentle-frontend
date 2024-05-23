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
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: '会議全体の感情推移',
        },
    }
}

export const EmotionTimeSeries = ({data}:{data:ChartJSModel}) => {
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
        <Chart type='line' options={options} data={graphData} />
    </>
)
}

