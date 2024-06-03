import React, { useCallback, useState } from 'react';
import { ChartJSModel, TopicsTimeSeries } from '../../api/createPlot';
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
import { Box, Spinner, Text } from '@chakra-ui/react';
import { TopicTable } from './topics-table';

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

export const options = (handleChartClick: any):ChartOptions<'line'> => ({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'ユーザ毎の声量分析',
        },
    },
    scales: {
        x: {
          ticks: {
            callback: function(val: any, index: number) {
              return index % 2 === 0 ? `${val}分` : '';
            }
          }
        }
      },
      hover: {
        mode: 'point'
    },
    onClick: handleChartClick,
})


export function useChartDataClick() {
    const [clickedData, setClickedData] = useState(null);

    const handleChartClick = useCallback((event: any, elements: any[]) => { 
        if (!elements || elements.length === 0) return;
        
        if (elements[0]['index'] !== null || elements[0]['index'] !== undefined ) {
            console.log(elements[0]['index']);
            setClickedData( elements[0]['index'] );
        }
    }, []);

    return { handleChartClick, clickedData };
}

export const RMSTimeSeries = ({data,topics}:{data:ChartJSModel, topics:TopicsTimeSeries}) => {
    const { handleChartClick, clickedData } = useChartDataClick();
    if (!data || !data.datasets) {
        return <Spinner />
    }

    const labels: string[] = data.labels;
    const datasetsList: any = Array.isArray(data.datasets) ? data.datasets.map(item => {
        return { ...item, lineTension: 0.3, pointRadius: 5, pointHoverRadius: 10};
      }) : data.datasets;
    
    const customOptions = options(handleChartClick);
    
    const graphData = {
        labels,
        datasets: datasetsList,
    }
    if (clickedData !== null) console.log(topics.topics[clickedData]);
    
    return(
        <>
        <Box h={'350px'}>
            <Chart type='line' options={customOptions} data={graphData} />
        </Box>
        <Box>
            {clickedData !==undefined && clickedData !== null && topics.topics[clickedData] ?
            (
                <TopicTable topics={topics.topics[clickedData]} segment={topics.segments[clickedData]} />
            ):(
            <Text
                textAlign={'center'}
                fontSize={'sm'}
                color={'gray.300'}
            >
                グラフをクリックしてください
            </Text>
            )}
        </Box>
        </>
    )
}

