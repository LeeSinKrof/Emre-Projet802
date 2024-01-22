async function getGeoCode(searchText?: string): Promise<any> {
    const apiKey = '5b3ce3597851110001cf624833af880bacfa443eb51a88e09f6915ee';
    const apiUrl = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${searchText}&boundary.country=FR&size=5`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.features;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export { getGeoCode };
