import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({
    className,
    icon: Icon,
    error,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        clsx(
                            "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white",
                            Icon && "pl-10",
                            error
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-800",
                            className
                        )
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
