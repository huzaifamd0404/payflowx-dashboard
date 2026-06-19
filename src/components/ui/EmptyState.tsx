import type { ComponentType, SVGProps } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  message,
  icon: Icon,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 w-fit rounded-full bg-gray-100 p-4">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{message}</p>
      {onAction && actionLabel ? (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
