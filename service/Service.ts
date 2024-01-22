/* eslint-disable max-len */
import { createClient, fetchExchange, cacheExchange } from '@urql/core';
import qql from 'graphql-tag';



const headers = {
    'x-client-id': '65a0fad803f11572e9c6ae4a',
    'x-app-id': '65a0fad803f11572e9c6ae4c',
};

const client = createClient({
    url: 'https://api.chargetrip.io/graphql',
    fetchOptions: {
        method: 'POST',
        headers,
    },
    exchanges: [fetchExchange, cacheExchange],
});



export const vehicleListQuery = qql`
query vehicleList($page: Int, $size: Int, $search: String) {
  vehicleList(
    page: $page, 
    size: $size, 
    search: $search, 
  ) {
    connectors {
      standard
      max_electric_power
      time
      speed
      power
    }
    id
    naming {
      make
      model
      chargetrip_version
    }
    media {
      image {
        thumbnail_url
      }
    }
  }
}
`;

export async function getVehicleList(option: { page?: number, size?: number, search?: string } = {}) {
    const { page = 1, size = 30, search = '' } = option;

    try {
        const result = await client.query(vehicleListQuery, { page, size, search }).toPromise();
        return result.data.vehicleList;
    } catch (error) {
        console.error('Error in getVehicleList:', error);
        throw error;
    }
}
