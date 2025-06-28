import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/library/api';

export const useUpdateCamera = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedData: any) => {
            console.log('📡 Updating camera with:', updatedData);

            const res = await api.put(`/cameras/${id}`, updatedData);
            return res.data;

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['camera', id] }); // نحدث بيانات الكاميرا
            queryClient.invalidateQueries({ queryKey: ['cameras'] }); // نحدث القائمة كمان
        },
    });
};
