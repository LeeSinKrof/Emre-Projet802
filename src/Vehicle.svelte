<!-- Vehicle.svelte -->
<script lang="ts">
    import Icon from "@iconify/svelte";

    export let vehicle: any;
    export let onSelect: () => void;
    export let selectedVehicle: any;
</script>

<div class="mb-4 flex p-2 rounded-md bg-amber-300 relative">
    {#if vehicle}
        <img src={vehicle.media?.image?.thumbnail_url} alt="image du véhicule" class="h-14 object-cover rounded-md mr-2 bg-amber-100"/>
        <div>
            <h2 class="text-md font-semibold mb-1 mr-4">{vehicle.naming?.model} {vehicle.naming?.chargetrip_version}</h2>
            <p class="text-sm mb-1">{vehicle.naming?.make} </p>
        </div>
        <span class="tooltip tooltip-left tooltip-secondary absolute top-0 right-0 mt-2 mr-2"
              data-tooltip="Détails" on:click={onSelect}>
          <label class="rounded-md hover:cursor-pointer">
            <Icon class="h-4 w-4" icon="tabler:info-octagon"/>
          </label>
        </span>
    {/if}
</div>

{#if selectedVehicle && selectedVehicle.id === vehicle?.id}
    <div class="text-black text-center">
        <h2 class="text-md font-semibold">Détails</h2>
        <div class="divider"></div>

        <ul>
            {#each selectedVehicle.connectors as {
                standard,
                max_electric_power,
                time,
                speed,
                power
            }}
                <li>Standard: {standard}</li>
                <li>Max Electric Power: {max_electric_power}</li>
                <li>Time: {time}</li>
                <li>Speed: {speed}</li>
                <li>Power: {power}</li>
                {#if standard.length > 1}
                    <div class="divider"></div>
                {/if}
            {/each}
        </ul>
    </div>
{/if}
