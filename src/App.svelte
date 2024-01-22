<script lang="ts">
    import {onMount} from 'svelte';
    import Map from "./Map.svelte";
    import Icon from '@iconify/svelte';
    import {getGeoCode} from "../service/Geocode";
    import {getVehicleList} from "../service/Service";
    import Vehicle from "./Vehicle.svelte";
    import Input from "./Input.svelte";

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

    function toggleSidebar() {
        isSidebarExpanded = !isSidebarExpanded;
    }


    function resetSearchResults() {
        searchResultsStart = [];
        searchResultsEnd = [];
        showCityList = true;
    }
    function selectVehicle(vehicle: any) {
        if (selectedVehicle && selectedVehicle.id === vehicle.id) {
            selectedVehicle = null;
        } else {
            selectedVehicle = vehicle;
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

            console.log(`Selected ${searchType} City Coordinates: ${selectedCity.geometry.coordinates}`);
        }

        searchType === 'end' ? (searchEnd = cityName) : (searchStart = cityName);
        showCityList = !showCityList;
    }




    async function searchInput(inputType: string) {
        resetSearchResults();

        let searchData;
        let startCity;
        let endCity;

        if (inputType === 'start') {
            searchData = await getGeoCode(searchStart);
            searchResultsStart = searchData;
            startCity = searchData && searchData.length > 0 ? searchData[0] : null;

        } else if (inputType === 'end') {
            searchData = await getGeoCode(searchEnd);
            searchResultsEnd = searchData;
            endCity = searchData && searchData.length > 0 ? searchData[0] : null;

        }

        if (searchData && searchData.length > 0) {
            const cityNames = searchData.map((result: any) => result.properties.name);
            console.log(`City Names (${inputType}):`, cityNames);
        }
    }



    onMount(async () => {
        //vehicleList = await getVehicleList();
        console.log(vehicleList);

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
    />

    <Map selectedStartCity={selectedStartCity} selectedEndCity={selectedEndCity}  />
</main>

<style>
    .sidebar {
        width: 60px;
    }

    .sidebar.expanded {
        width: 300px;
    }
</style>