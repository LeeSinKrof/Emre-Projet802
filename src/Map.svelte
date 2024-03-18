<script lang="ts">
    import {onMount, onDestroy, afterUpdate} from 'svelte';
    import {Map, MapStyle, config, Marker} from '@maptiler/sdk';
    import "@maptiler/sdk/dist/maptiler-sdk.css";
    import * as maptilersdk from '@maptiler/sdk';


    import colors from "tailwindcss/colors";
    import Service from "../service/Service";
    import {Utils} from "../service/Utils";

    let map: any;
    let mapContainer: any;
    let startCityMarker: any;
    let endCityMarker: any;
    let chargingStationMarkers: any[] = [];
    let chargingStations: any[] = [];
    let distanceRemaining: number;

    export let selectedStartCity: any;
    export let selectedEndCity: any;
    export let selectedVehicle: any;

    config.apiKey = 'jVmLD1SYxCeMk5vViw0q';



    onMount(async () => {
        const initialState = {lng: 1, lat: 46, zoom: 6};

        map = new Map({
            container: mapContainer,
            style: MapStyle.STREETS,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom
        });

        startCityMarker = new Marker({color: colors.blue[400]}).setLngLat([0, 0]).addTo(map);
        endCityMarker = new Marker({color: colors.red[400]}).setLngLat([0, 0]).addTo(map);


        map.on('load', async function () {
            map.addSource('directions_route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': []
                    }
                }
            });
        });
    });

    afterUpdate(async () => {

        if ((startCityMarker && selectedStartCity && selectedStartCity.geometry && selectedStartCity.geometry.coordinates) &&
            (endCityMarker && selectedEndCity && selectedEndCity.geometry && selectedEndCity.geometry.coordinates)) {

            const startMarkerCoord = selectedStartCity.geometry.coordinates;
            const endMarkerCoord = selectedEndCity.geometry.coordinates;
            startCityMarker.setLngLat(selectedStartCity.geometry.coordinates);
            endCityMarker.setLngLat(selectedEndCity.geometry.coordinates);


            const directionsData = await Service.getDirections({coord1: startMarkerCoord, coord2: endMarkerCoord});


            const existingLayer = map.getLayer('directions_route');
            if (!existingLayer) {
                map.addLayer({
                    'id': 'directions_route',
                    'type': 'line',
                    'source': 'directions_route',
                    'layout': {},
                    'paint': {
                        'line-color': '#3887be',
                        'line-width': 4
                    }
                });
            }
            const directionsRouteSource = map.getSource('directions_route');
            if (directionsRouteSource) {
                directionsRouteSource.setData({type: 'Feature', geometry: directionsData.features[0].geometry});
                const bounds = new maptilersdk.LngLatBounds(startMarkerCoord, endMarkerCoord);
                map.fitBounds(bounds, {padding: 10});
            }


            chargingStationMarkers.forEach((marker: any) => marker.remove());
            chargingStationMarkers = [];

            chargingStations = await Service.getStations(directionsData.features[0].geometry.coordinates, selectedVehicle.range.chargetrip_range.best);

            chargingStations = chargingStations.slice(1,-1);

            await Utils.getNumberOfStations(chargingStations.length);



            chargingStations.forEach((station: any) => {
                const marker = new Marker({color: colors.green[400]}).setLngLat(station).addTo(map);
                chargingStationMarkers.push(marker);
            });

            if (chargingStations.length > 0) {
                const lastStation = chargingStations[chargingStations.length - 1];
                const lastStationEndDistance = await Service.getDirections({ coord1: lastStation, coord2: endMarkerCoord });
                distanceRemaining = lastStationEndDistance.features[0].properties.summary.distance / 1000;
                await Utils.getDistanceRemaining(distanceRemaining);
            }

        }


    });

    onDestroy(() => {
        map.remove();
        chargingStationMarkers.forEach((marker:any) => marker.remove());
    });

</script>

<div class="map-wrap">
    <div class="map" bind:this={mapContainer}></div>
</div>

<style>
    .map-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .map {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
