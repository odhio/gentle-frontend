'use server'
import { client } from '@/lib/api'

export interface TopicsTimeSeries {
    topics: { [key: string]: number }[] // int
    segments: string[]
}


export interface TopicsSummary {
    simple_count: { [key: string]: number} // int
    tfidf: { [key: string]: number} // float
}

export interface DatasetModel {
    label: string
    data: number[]
    backgroundColor: string
    lineTension?: number
}

export interface ChartJSModel{
    labels: string[]
    datasets: DatasetModel | DatasetModel[]
}


export interface TermCombination {
    col_1: { [key: string]: string }
    col_2: { [key: string]: string }
    count: { [key: string]: number }
}

export interface ChartMaterialResponse {
    user_time_series: ChartJSModel
    emotion_time_series: ChartJSModel
    emotion_summary: ChartJSModel
    topics_time_series: TopicsTimeSeries
    rms_time_series: ChartJSModel
    topics_summary: TopicsSummary
    term_combination: TermCombination
}

const KEY = (roomUuid: string) => `/api/analytics/create_plot/${roomUuid}`

export const getChartMaterial = async (roomUuid: string) => {
    try {
        const { data } = await client.post<ChartMaterialResponse>(KEY(roomUuid))
        return data
    } catch (e) {
        console.error(e)
        return undefined
    }
} 
