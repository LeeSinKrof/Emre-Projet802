<script lang="ts">

    export let searchStart: string;
    export let searchEnd: string;
    export let showCityList: boolean;
    export let searchResultsStart: any[];
    export let searchResultsEnd: any[];
    export let selectCity: (cityName: string, isEnd?: boolean) => void;
    export let searchInput: (inputType: string) => void;

    export let calculateItinerary: () => void;

    export let distance: number;

    export let travelTime: number;

    export let travelTimeMinutes: number;


</script>

<div class="flex flex-col ">
    <div class="flex flex-row items-start p-4 h-1/6 z-20 ml-4 space-x-4 bg-white">
        <!-- Search Start Input -->
        <div class="mt-4">
            <input
                    bind:value={searchStart}
                    name="searchStart"
                    class="input-ghost-primary input text-black input-md bg-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Ville de départ    "
                    on:input={() => searchInput('start')}
            />
            {#if showCityList && searchResultsStart && searchResultsStart.length > 0 && searchStart !== ''}
                <div class="mt-2 text-black">
                    {#each searchResultsStart as result}
                        <div
                                class="border bg-white rounded-md px-4 py-2 mb-2 hover:bg-blue-500 hover:text-white cursor-pointer transition duration-300"
                                on:click={() => selectCity(result.properties.name)}
                        >
                            {#if result.properties.name.length > 20}
                                {result.properties.name.slice(0, 20) + '...'}
                            {:else}
                                {result.properties.name}
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}


        </div>

        <!-- Search End Input -->
        <div class="mt-4">
            <input
                    bind:value={searchEnd}
                    name="searchEnd"
                    class="input-ghost-primary input text-black input-md bg-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Ville d'arrivée"
                    on:input={() => searchInput('end')}
            />
            {#if showCityList && searchResultsEnd && searchResultsEnd.length > 0 && searchEnd !== ''}
                <div class="mt-2 text-black">
                    {#each searchResultsEnd as result}
                        <div
                                class="border bg-white rounded-md px-4 py-2 mb-2 hover:bg-blue-500 hover:text-white cursor-pointer transition duration-300"
                                on:click={() => selectCity(result.properties.name, true)}
                        >
                            {#if result.properties.name.length > 20}
                                {result.properties.name.slice(0, 20) + '...'}
                            {:else}
                                {result.properties.name}
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}


        </div>
        <div class="mt-4">
            <button on:click={calculateItinerary}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Calculer Itinéraire
            </button>
        </div>
    </div>


    <div class="flex flex-row items-start justify-center p-4 z-10 ml-4 space-x-4 bg-white text-black">
        <p class="">Distance : {distance} km</p>
        {#if travelTime >= 1}
            <p class="">Temps de trajet : {travelTime} heures et {travelTimeMinutes} minutes</p>
        {:else}
            <p class="">Temps de trajet : {travelTimeMinutes} minutes</p>
        {/if}
    </div>

</div>

