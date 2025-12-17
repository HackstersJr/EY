import { useQuery } from '@tanstack/react-query';
import { getManufacturingLocations } from '@/lib/api';
import type { ManufacturingLocationsParams } from '@/lib/types';

export const useManufacturingLocations = (params?: ManufacturingLocationsParams) => {
    return useQuery({
        queryKey: ['manufacturingLocations', params],
        queryFn: () => getManufacturingLocations(params),
    });
};
