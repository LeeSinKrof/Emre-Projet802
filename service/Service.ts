import axios, {type AxiosInstance} from 'axios';


export const restAPI: AxiosInstance = axios.create({
    baseURL: 'https://emre-projet802-rapi.azurewebsites.net',
});

class Service {

    public async getVehicleList() {
        return (await restAPI.get(`/vehicle`)).data;
    }

    public async getDirections(option: { coord1: any, coord2: any }): Promise<any> {
        return (await restAPI.get(`/direction?coord1=${option.coord1}&coord2=${option.coord2}`)).data;
    }

    public async getGeoCode(searchText: string) {
        return (await restAPI.get(`/geocode?search=${encodeURIComponent(searchText)}`)).data.features;

    }

    public async getStations(routeCoordinates: [number, number][], intervalKilometers: number) {
        return (await restAPI.post(`/station`, {routeCoordinates, intervalKilometers})).data;
    }

}

export default new Service();

