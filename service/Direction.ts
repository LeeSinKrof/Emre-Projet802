async function getDirections(option: {coord1: any, coord2: any}): Promise<any> {
    const apiKey = '5b3ce3597851110001cf624833af880bacfa443eb51a88e09f6915ee';
    const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${option.coord1}&end=${option.coord2}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export { getDirections };
