import { useQuery } from '@tanstack/react-query';
import { getManufacturingLocationDefects } from '@/lib/api';

export const useManufacturingLocationDefects = (locId: string) => {
    return useQuery({
        queryKey: ['manufacturingLocationDefects', locId],
        queryFn: () => getManufacturingLocationDefects(locId),
        enabled: !!locId,
    });
};
