import axios, { AxiosResponse } from 'axios';
import { Authresponse } from '../type';

export async function getJson(url: string): Promise<AxiosResponse> {
    try {
        const response = await $api.get(url)
        return response;
    }
    catch (error) {
        console.error(`Failed to fetch data from ${url}`, error);
        throw error;
    }
}

export async function postJson(url: string, data: any): Promise<AxiosResponse> {
    try {
        const response = await $api.post(url, data);
        return response;
    } catch (error) {
        console.error(`Failed to post data to ${url}`, error);
        throw error;
    }
}

export async function putJson(url: string, data: any): Promise<AxiosResponse> {
    try {
        const response = await axios.put(url, data);
        return response
    } catch (error) {
        console.error(`Failed to update data at ${url}`, error);
        throw error;
    }
}

export async function deleteJson(url: string): Promise<AxiosResponse> {
    try {
        const response = await axios.delete(url);
        return response;
    } catch (error) {
        console.error(`Failed to delete data from ${url}`, error);
        throw error;
    }
}

export const API_URL = 'http://localhost:8000';

export const $api = axios.create({
    withCredentials:true,
    baseURL:API_URL
})

$api.interceptors.request.use((config)=>{
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((config)=>{
    return config;
}, async (error)=>{
    const originalRequest = error.config;
    if(error.response.status == 401){
        originalRequest._isRetry = true
        try{
            const response = await axios.post<Authresponse>(`${API_URL}/refresh`,{withCredentials:true}) 
            localStorage.setItem('token',response.data.access_token);
            return $api.request(originalRequest);
        }catch(e){
            console.log('Не авторизован')
        }
    }
})