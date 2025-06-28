'use client';

import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCameraDetails } from '@/modules/cameras/camera-details/hooks/useCameraDetails';
import { useCreateDemographicsConfig } from '@/modules/cameras/demographics/hooks/useCreateDemographicsConfig';
import { useUpdateDemographicsConfig } from '@/modules/cameras/demographics/hooks/useUpdateDemographicsConfig';
import { useEffect } from 'react';
import Link from 'next/link';

export default function CameraDemographicsForm() {
    const { id: cameraId } = useParams();
    const { data: camera, isLoading } = useCameraDetails(cameraId as string);
    const config = camera?.demographics_config;

    const form = useForm({
        defaultValues: {
            track_history_max_length: 10,
            exit_threshold: 30,
            min_track_duration: 5,
            detection_confidence_threshold: 0.8,
            demographics_confidence_threshold: 0.8,
            min_track_updates: 5,
            box_area_threshold: 0.1,
            save_interval: 600,
            frame_skip_interval: 1.0,
        },
    });

    const { register, handleSubmit, reset } = form;

    useEffect(() => {
        if (config) {
            reset(config);
        }
    }, [config, reset]);

    const { mutate: createConfig, isPending: isCreating, isSuccess: isCreated } = useCreateDemographicsConfig();
    const { mutate: updateConfig, isPending: isUpdating, isSuccess: isUpdated } = useUpdateDemographicsConfig(config?.id);

    const onSubmit = (formData: any) => {
        const payload = {
            ...formData,
            camera_id: cameraId,
            box_area_threshold: parseFloat(formData.box_area_threshold),
            frame_skip_interval: parseFloat(formData.frame_skip_interval),
            detection_confidence_threshold: parseFloat(formData.detection_confidence_threshold),
            demographics_confidence_threshold: parseFloat(formData.demographics_confidence_threshold),
        };

        if (config?.id) {
            updateConfig(payload);
        } else {
            createConfig(payload);
        }
    };

    if (isLoading) return <p className="p-6">Loading camera data...</p>;

    return (

        <div className="p-6 max-w-xl mt-5 mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">🎛️ Demographics Configuration</h1>

            {camera?.name && (
                <p className="text-center text-gray-600 font-bold text-lg mb-4">📷 Camera Name: <strong>{camera.name}</strong></p>
            )}


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="📊 Track History Max Length" {...register('track_history_max_length')} />
                <Input label="🚪 Exit Threshold" {...register('exit_threshold')} />
                <Input label="⏱️ Min Track Duration" {...register('min_track_duration')} />
                <Input label="🎯 Detection Confidence Threshold" step="0.01" {...register('detection_confidence_threshold')} />
                <Input label="🧠 Demographics Confidence Threshold" step="0.01" {...register('demographics_confidence_threshold')} />
                <Input label="🔁 Min Track Updates" {...register('min_track_updates')} />
                <Input label="📦 Box Area Threshold" step="0.01" {...register('box_area_threshold')} />
                <Input label="💾 Save Interval (seconds)" {...register('save_interval')} />
                <Input label="⏩ Frame Skip Interval" step="0.1" {...register('frame_skip_interval')} />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    disabled={isCreating || isUpdating}
                >
                    {isCreating || isUpdating ? 'Saving...' : '💾 Save Configuration'}
                </button>

                {(isCreated || isUpdated) && (
                    <>
                        <p className="text-green-600 text-center mt-2">✅ Configuration saved successfully!</p>

                        <Link
                            href={`/cameras/${cameraId}/demographics/results`}
                            className="mt-4 inline-block text-blue-600 underline text-center w-full"
                        >
                            🔍 View Analytics
                        </Link>
                    </>
                )}
            </form>
        </div>
    );
}

const Input = ({ label, ...rest }: { label: string; [key: string]: any }) => (
    <div>
        <label className="block mb-1 font-medium">{label}</label>
        <input {...rest} type="number" step={rest.step || '1'} className="border w-full p-2 rounded" />
    </div>
);
