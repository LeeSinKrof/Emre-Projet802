import axios from 'axios';

const soapUrl = 'http://localhost:8000';


export class SoapService {

    static async calculateTravelTimeSoap(distance: number, autonomy: number, chargingTime: number, maxSpeed:number): Promise<number> {
        const xml = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                               xmlns:web="travel">
               <soapenv:Header/>
               <soapenv:Body>
                  <web:calculate_travel_time>
                     <web:distance>${distance}</web:distance>
                     <web:autonomy>${autonomy}</web:autonomy>
                     <web:charging_time>${chargingTime}</web:charging_time>
                     <web:max_speed>${maxSpeed}</web:max_speed>
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
