<script lang="ts">
    import {onMount, onDestroy, afterUpdate} from 'svelte';
    import {Map, MapStyle, config, Marker} from '@maptiler/sdk';
    import "@maptiler/sdk/dist/maptiler-sdk.css";
    import * as maptilersdk from '@maptiler/sdk';

    import colors from "tailwindcss/colors";
    import {getDirections} from "../service/Direction";

    let map: any;
    let mapContainer: any;
    let startCityMarker: any;
    let endCityMarker: any;

    export let selectedStartCity: any;
    export let selectedEndCity: any;

    config.apiKey = 'jVmLD1SYxCeMk5vViw0q';

    onMount(() => {
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

            map.once('load', () => {
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
            });
            const directionsData = await getDirections({coord1: startMarkerCoord, coord2: endMarkerCoord});

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
                map.fitBounds(bounds, {padding: 50});
            } else {
                console.warn("Directions route source not found.");
            }
        }
    });

    onDestroy(() => {
        map.remove();
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
