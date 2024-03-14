<script lang="ts">
    import {onMount} from 'svelte';
    import Map from "./Map.svelte";
    import Icon from '@iconify/svelte';
    import Vehicle from "./Vehicle.svelte";
    import Input from "./Input.svelte";
    import {success, warning, error} from "./notyf";
    import Service from "../service/Service";
    import {SoapService} from "../service/SoapService";

    let vehicleList: any = [];
    let selectedVehicle: any = null;
    let searchResultsStart: any = [];
    let searchResultsEnd: any = [];
    let searchStart: string = '';
    let searchEnd: string = '';
    let showCityList = true;
    let selectedStartCity: any = null;
    let selectedEndCity: any = null;
    let isSidebarExpanded = false;
    let distanceCity: number = 0;
    let travelTimeCity: number = 0;
    let travelTimeCityMinutes: number = 0;



    function toggleSidebar() {
        isSidebarExpanded = !isSidebarExpanded;
    }

    function resetSearchResults() {
        searchResultsStart = [];
        searchResultsEnd = [];
        showCityList = true;
    }

    function selectVehicle(vehicle: any) : boolean {
        if (selectedVehicle && selectedVehicle.id === vehicle.id) {
            selectedVehicle = null;
            return true;
        } else {
            selectedVehicle = vehicle;
            return false;
        }
    }

    function selectCity(cityName: string, isEnd: boolean = false) {
        const searchType = isEnd ? 'end' : 'start';
        const searchResults = isEnd ? searchResultsEnd : searchResultsStart;
        const selectedCity = searchResults.find((result: any) => result.properties.name === cityName);

        if (selectedCity) {
            if (isEnd) {
                selectedEndCity = selectedCity;
            } else {
                selectedStartCity = selectedCity;
            }
        }

        searchType === 'end' ? (searchEnd = cityName) : (searchStart = cityName);
        showCityList = !showCityList;
    }

    async function searchInput(inputType: string) {
        resetSearchResults();

        let searchData;

        if (inputType === 'start') {
            searchData = await Service.getGeoCode(searchStart);
            searchResultsStart = searchData;
        } else if (inputType === 'end') {
            searchData = await Service.getGeoCode(searchEnd);
            searchResultsEnd = searchData;
        }
    }

    async function calculateItineraire() {
        if (!selectedStartCity || !selectedEndCity) {
            warning("Veuillez sélectionner les villes de départ et d'arrivée.");
            return;
        }

        if (selectedVehicle === null) {
            warning("Veuillez sélectionner un véhicule.");
            return;
        }

        const startCoordinates = selectedStartCity.geometry.coordinates;
        const endCoordinates = selectedEndCity.geometry.coordinates;

        const directions = await Service.getDirections({coord1: startCoordinates, coord2: endCoordinates});

        const distance = directions ? (directions.features[0].properties.summary.distance) / 1000 : 0;
        distanceCity = Math.trunc(distance);

        const autonomy = selectedVehicle.range.chargetrip_range.best;
        const chargingTime = selectedVehicle.connectors[0].time / 60;
        const maxSpeed = Math.floor(selectedVehicle.range.chargetrip_range.best / 2);


        try {
            const travelTime = await SoapService.calculateTravelTimeSoap(distance, autonomy, chargingTime, maxSpeed);
            const hours = Math.floor(travelTime);
            const minutes = Math.round((travelTime - hours) * 60);

            travelTimeCity = hours;
            travelTimeCityMinutes = minutes;
            success("Calcul de l'itinéraire réussi.");
        } catch (e: any) {
            error("Erreur lors du calcul de l'itinéraire : " + e.message);
        }
    }

    onMount(async () => {
        vehicleList = await Service.getVehicleList();
    });
</script>

<main class="flex relative h-screen w-screen">
    <aside class="sidebar justify-start bg-white transition-all duration-300 max-h-full"
           class:expanded={isSidebarExpanded}>
        <section class="sidebar-title items-center p-4">
            <div class="flex flex-col items-center">
            <span class="tooltip tooltip-right tooltip-primary" data-tooltip="Véhicules">
                <label class="rounded-md hover:cursor-pointer" on:click={toggleSidebar}>
                    <Icon class="h-6 w-6 text-black text-center block" icon="tabler:car"/>
                </label>
            </span>
            </div>
        </section>
        <section class="sidebar-con overflow-y-auto max-h-full">
            <!-- Vehicle List Rendering -->
            {#if isSidebarExpanded}
                <div class="bg-white text-black rounded-lg shadow-md p-0.5 overflow-y-auto relative z-10">
                    {#each vehicleList as vehicle, index (index)}
                        <Vehicle
                                bind:vehicle={vehicle}
                                onSelect={() => selectVehicle(vehicle)}
                                selectedVehicle={selectedVehicle}
                        />
                    {/each}
                </div>
            {/if}

        </section>
    </aside>

    <Input
            bind:searchStart={searchStart}
            bind:searchEnd={searchEnd}
            bind:showCityList={showCityList}
            bind:searchResultsStart={searchResultsStart}
            bind:searchResultsEnd={searchResultsEnd}
            selectCity={selectCity}
            searchInput={searchInput}
            calculateItinerary="{calculateItineraire}"
            distance="{distanceCity}"
            travelTime="{travelTimeCity}"
            travelTimeMinutes="{travelTimeCityMinutes}"
    />

    <Map selectedStartCity={selectedStartCity} selectedEndCity={selectedEndCity} selectedVehicle={selectedVehicle}
    />
</main>

<style>
    .sidebar {
        width: 60px;
    }

    .sidebar.expanded {
        width: 300px;
    }
</style>