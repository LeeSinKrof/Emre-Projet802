import axios from 'axios';
import {distanceRemaining, numberOfStations} from "./Utils";

const soapUrl = 'https://sapi-projet802.azurewebsites.net';

export class SoapService {


    static async calculateTravelTimeSoap(duration: number, chargingTime: number, autonomy: number): Promise<number> {


        const xml = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                               xmlns:web="travel">
               <soapenv:Header/>
               <soapenv:Body>
                  <web:calculate_travel_time>
                     <web:duration>${duration}</web:duration>
                     <web:charging_time>${chargingTime}</web:charging_time>
                     <web:number_of_stations>${numberOfStations}</web:number_of_stations>
                        <web:distance_remaining>${distanceRemaining}</web:distance_remaining>
                        <web:autonomy>${autonomy}</web:autonomy>
                  </web:calculate_travel_time>
               </soapenv:Body>
            </soapenv:Envelope>`;

        try {
            const soapResponse = await axios.post(soapUrl, xml, {
                headers: {
                    'Content-Type': 'text/xml',
                },
            });

            const parser = new DOMParser();
            const xmlDoc: any = parser.parseFromString(soapResponse.data, 'text/xml');
            const resultElements = xmlDoc.getElementsByTagNameNS('travel', 'calculate_travel_timeResult');

            if (resultElements.length > 0) {
                return parseFloat(resultElements[0].textContent);
            } else {
                throw new Error("No result found");
            }
        } catch (e: any) {
            throw new Error("Error occurred during SOAP call: " + e.message);
        }
    }
}
