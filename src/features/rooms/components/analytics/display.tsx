'use client'
import { Flex, Box, Spinner, TabPanel, TabPanels, TabList, Tabs, VStack } from "@chakra-ui/react";
import { ChartMaterialResponse, getChartMaterial } from "../../api/createPlot";
import { UserTimeSeries } from "./user-time-series";
import { EmotionTimeSeries } from "./emotion-time-series";
import { EmotionSummary } from "./emotion-summary";
import { useEffect, useState } from "react";
import { CustomTab } from "@/components/tab-button";
import { RMSTimeSeries } from "./rms-time-series";
import { TopicsSummary } from "./topics-summary";
import { TopicsCombination } from "./term_combination";

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

    console.log(data);


    return (
        <>
            <Tabs variant='enclosed'
                w={'90%'}
                margin={'auto'}
            >
                <TabList mb='1em'>
                    <CustomTab>発言量／感情傾向</CustomTab>
                    <CustomTab>話題分析</CustomTab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {data !== undefined ? (
                            <Flex
                                color='white'
                                flexDirection={'column'}
                                flexWrap={'wrap'}
                                margin={'auto'}
                                w={'100%'}
                            >
                                <Box w={'100%'} h={'350px'} mb={'15'}>
                                    <UserTimeSeries data={data.user_time_series} />
                                </Box>
                                <Box w={'100%'} h={'350px'} mb={'15'}>
                                    <EmotionTimeSeries data={data.emotion_time_series} />
                                </Box>
                                <Box w={'100%'} h={'350px'} mb={'15'}>
                                    <EmotionSummary data={data.emotion_summary} />
                                </Box>
                            </Flex>
                        ) : (
                            <Box
                                w={'100%'}
                            >
                                <Spinner />
                            </Box>
                        )}
                    </TabPanel>
                    <TabPanel>

                        {data !== undefined ? (
                            <VStack
                                color='white'
                                flexDirection={'column'}
                                flexWrap={'wrap'}
                                margin={'auto'}
                                w={'100%'}
                            >
                                <Box w={'100%'} mb={'10'}>
                                    <RMSTimeSeries data={data.rms_time_series} topics={data.topics_time_series} />
                                </Box>
                                <Box w={'100%'} mb={'10'}>
                                    <Tabs variant='enclosed'
                                        w={'100%'}
                                        margin={'auto'}
                                    >
                                        <TabList mb='1em'>
                                            <CustomTab>単語頻度/重要度</CustomTab>
                                            <CustomTab>共起回数</CustomTab>
                                        </TabList>
                                        <TabPanels>
                                            <TabPanel>
                                                <TopicsSummary countup={data.topics_summary.simple_count} tfidf={data.topics_summary.tfidf} />
                                            </TabPanel>
                                            <TabPanel>
                                                {data !== undefined ? (
                                                    <TopicsCombination term_combination={data.term_combination} />
                                                ) : (
                                                    <Box
                                                        w={'100%'}
                                                    >
                                                        <Spinner />
                                                    </Box>
                                                )}
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>
                                </Box>
                            </VStack>
                        ) : (
                            <Box
                                w={'100%'}
                            >
                                <Spinner />
                            </Box>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs >
        </>
    )
}