

export let numberOfStations: number = 0;
export let distanceRemaining: number = 0;

export class Utils {
    static async getNumberOfStations(stations: number): Promise<number> {
        numberOfStations = stations;
        return numberOfStations;
    }

    static async getDistanceRemaining(dist: number): Promise<number> {
        distanceRemaining = dist;
        return distanceRemaining;
    }
}