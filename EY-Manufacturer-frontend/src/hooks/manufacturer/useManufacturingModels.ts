import { useQuery } from '@tanstack/react-query';
import { getManufacturingModels } from '@/lib/api';
import type { ManufacturingModelsParams } from '@/lib/types';

export const useManufacturingModels = (params?: ManufacturingModelsParams) => {
    return useQuery({
        queryKey: ['manufacturingModels', params],
        queryFn: () => getManufacturingModels(params),
    });
};
