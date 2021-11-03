import apiClient from '../utils/ApiClient';

export function saveAndUpdateLpn(requestBody: any){
    console.debug("Saving and update Plan")
    console.debug(requestBody)
    return apiClient.post(`/generic/container/`, requestBody);
}

export function fetchContainer(id: string){
    console.debug("fetchContainer id"+id)
    return apiClient.post(`/generic/container/`+id);
}