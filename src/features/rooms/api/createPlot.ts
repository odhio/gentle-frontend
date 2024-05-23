'use server'
import { client } from '@/lib/api'

export interface DatasetModel {
    label: string
    data: number[]
    backgroundColor: string
}

export interface ChartJSModel{
    labels: string[]
    datasets: DatasetModel | DatasetModel[]
}

export interface ChartMaterialResponse {
    user_time_series: ChartJSModel
    emotion_time_series: ChartJSModel
    emotion_summary: ChartJSModel
}

const KEY = (roomUuid: string) => `/api/analytics/create_plot/${roomUuid}`

export const getChartMaterial = async (roomUuid: string) => {
    const { data } = await client.post<ChartMaterialResponse>(KEY(roomUuid))
    return data
} 
