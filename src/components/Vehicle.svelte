<script lang="ts">
    import Icon from "@iconify/svelte";

    export let vehicle: any;
    export let onSelect: () => boolean;
    export let selectedVehicle: any;

    let showDetails = false;

    function toggleDetails() {
        showDetails = !showDetails;
    }
</script>

<div class={selectedVehicle && selectedVehicle.id === vehicle?.id ? "mb-4 flex p-2 rounded-md bg-blue-300 relative hover:cursor-pointer": "mb-4 flex p-2 rounded-md bg-amber-300 relative hover:cursor-pointer"} on:click={onSelect}>
    {#if vehicle}
        <img src={vehicle.media?.image?.thumbnail_url} alt="image du véhicule" class="h-14 object-cover rounded-md mr-2 bg-amber-100"/>
        <div>
            <h2 class="text-md font-semibold mb-1 mr-4">{vehicle.naming?.model} {vehicle.naming?.chargetrip_version}</h2>
            <p class="text-sm mb-1">{vehicle.naming?.make} </p>
        </div>
        <span class="tooltip tooltip-left tooltip-secondary absolute top-0 right-0 mt-2 mr-2"
              data-tooltip="Détails" on:click={toggleDetails}>
          <label class="rounded-md hover:cursor-pointer">
            <Icon class="h-5 w-5" icon="tabler:info-octagon"/>
          </label>
        </span>
    {/if}
</div>

{#if showDetails && selectedVehicle && selectedVehicle.id === vehicle?.id}
    <div class="text-black text-center">
        <h2 class="text-md font-semibold">Détails</h2>
        <div class="divider"></div>

        <ul>
            {#each selectedVehicle.connectors as {
                standard,
                time,
                power
            }, i}
                {#if i === 0}
                    <li>Standard: {standard}</li>
                    <li>Temps chargement: {Math.floor(time / 60)} heures</li>
                    <li>Puissance: {power} Kw</li>
                    <li>Autonomie: {selectedVehicle.range.chargetrip_range.best} km</li>
                {/if}
            {/each}
        </ul>
    </div>
{/if}
