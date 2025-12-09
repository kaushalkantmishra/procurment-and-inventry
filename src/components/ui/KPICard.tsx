import React from "react";
import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = "text-primary-600",
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={clsx(
                  "font-medium",
                  trend.isPositive
                    ? "text-success-600 dark:text-success-400"
                    : "text-danger-600 dark:text-danger-400"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={clsx(
            "p-3 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20",
            iconColor
          )}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};
