import React from "react";
import { clsx } from "clsx";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={clsx(
          "w-full px-4 py-2.5 rounded-lg border transition-all duration-200",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          "border-gray-300 dark:border-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed",
          "resize-vertical min-h-[100px]",
          error && "border-danger-500 focus:ring-danger-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};
