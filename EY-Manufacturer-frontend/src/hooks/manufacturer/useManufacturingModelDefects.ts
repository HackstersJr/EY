import { useQuery } from '@tanstack/react-query';
import { getManufacturingModelDefects } from '@/lib/api';

export const useManufacturingModelDefects = (modelId: string) => {
    return useQuery({
        queryKey: ['manufacturingModelDefects', modelId],
        queryFn: () => getManufacturingModelDefects(modelId),
        enabled: !!modelId,
    });
};
