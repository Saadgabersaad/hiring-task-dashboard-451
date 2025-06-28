'use client';
import {useParams, useRouter} from 'next/navigation';
import { useCameraDetails } from '@/modules/cameras/camera-details/hooks/useCameraDetails';
import { useUpdateCamera } from '@/modules/cameras/camera-details/hooks/useUpdateCamera';
import { useForm } from 'react-hook-form';
import {useEffect} from "react";
import Link from 'next/link';

export default function CameraDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { id: cameraId } = useParams();

    const { data, isLoading } = useCameraDetails(id);
    const { mutate, isPending, isSuccess } = useUpdateCamera(id);

    const form = useForm({
        values: data
            ? {
                name: data.name || '',
                status: data.is_active ? 'active' : 'inactive',
                rtsp_url: data.rtsp_url || '',
            }
            : {
                name: '',
                status: 'active',
                rtsp_url: '',
            },
    });

    const { register, handleSubmit } = form;

    const onSubmit = (formData: any) => {
        const payload = {
            name: formData.name,
            rtsp_url: formData.rtsp_url,
            is_active: formData.status === 'active',
        };

        console.log('📤 Payload to send:', payload);
        mutate(payload);
    };

    useEffect(() => {
        if (isSuccess) {
            const timeout = setTimeout(() => {
                router.push('/cameras');
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [isSuccess, router]);

    if (isLoading) return <p className="p-6">Loading Data...</p>;

    return (
        <div className="p-6 max-w-xl mt-5 mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">📷 Edit Camera Details</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1">📛 Name:</label>
                    <input {...register('name')} className="border w-full p-2 rounded" />
                </div>

                <div>
                    <label className="block mb-1">🔗 RTSP URL:</label>
                    <input {...register('rtsp_url')} className="border w-full p-2 rounded" />
                </div>

                <div>
                    <label className="block mb-1">⚙️ Status:</label>
                    <select {...register('status')} className="border w-full p-2 rounded">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {isPending ? 'Saving...' : '💾 Save'}
                </button>

                {isSuccess && (
                    <p className="text-green-600 mt-2">✅ Saved Successfully! Redirecting...</p>
                )}
                <Link
                    href={`/cameras/${id}/demographics`}
                    className="block text-center text-blue-600 hover:underline mt-4"
                >
                    ⚙️ Configure Demographics
                </Link>
                <Link
                    href={`/cameras/${cameraId}/demographics/results`}
                    className="mt-4 inline-block text-blue-600 underline"
                >
                    🔍 View Analytics
                </Link>

            </form>


        </div>
    );
}
