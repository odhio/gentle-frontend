'use client'
import { Flex, Box, Spinner } from "@chakra-ui/react";
import { ChartMaterialResponse, getChartMaterial } from "../../api/createPlot";
import { UserTimeSeries } from "./user-time-series";
import { EmotionTimeSeries } from "./emotion-time-series";
import { EmotionSummary } from "./emotion-summary";
import { useEffect, useState } from "react";

type Props = {
    roomUuid: string
}
export const DisplayGraph = ({ roomUuid }: Props) => {
    const [data, setData] = useState<ChartMaterialResponse | undefined>(undefined)
    useEffect(() => {
        const fetch = async () => {
            const data = await getChartMaterial(roomUuid)
            return data
        }
        fetch().then(setData)
    }, [roomUuid])

    return (
        <>
            {data !== undefined ? (
                <Flex
                    color='white'
                    flexDirection={'row'}
                    flexWrap={'wrap'}
                    >
                    <Box w={'100%'} minW={'100%'} h={'300px'}>
                        <UserTimeSeries data={data.user_time_series} />
                    </Box>
                    <Box w={'45%'} h={'100%'} alignContent={'stretch'}>
                        <EmotionTimeSeries data={data.emotion_time_series} />
                    </Box>
                    <Box w={'45%'}>
                        <EmotionSummary data={data.emotion_summary} />
                    </Box>
                </Flex>
            ) : (
                <Spinner />
            )}
        </>
    )
}