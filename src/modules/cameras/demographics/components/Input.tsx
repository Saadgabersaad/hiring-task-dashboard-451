"use client";

import {Controller, Control, FieldValues, FieldError, Path} from "react-hook-form";

type FormItemProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    control: Control<T>;
    type?: string;
    required?: boolean;
    min?: number;
    max?: number;
    placeholder?: string;
    className?: string;
    step?: number;
    rules?: any;
};

export function FormItem<T extends FieldValues>({
                                                    label,
                                                    name,
                                                    control,
                                                    type = "text",
                                                    required = false,
                                                    min,
                                                    max,
                                                    placeholder,
                                                    className = "",
                                                    step,
                                                    rules = {},
                                                }: FormItemProps<T>) {
    return (
        <div className={`mb-4 ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <Controller
                name={name}
                control={control}
                rules={{ required: required ? `${label} is required` : false, ...rules }}
                render={({ field, fieldState }) => (
                    <>
                        <input
                            {...field}
                            type={type}
                            min={min}
                            max={max}
                            step={step}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2 border ${
                                fieldState.error ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {fieldState.error && (
                            <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
                        )}
                    </>
                )}
            />
        </div>
    );
}
