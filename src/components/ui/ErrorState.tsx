import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const ErrorState = ({
  title = 'Something went wrong',
  message,
  actionLabel = 'Try Again',
  onAction,
}: ErrorStateProps) => {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <ExclamationCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
        <div>
          <h3 className="text-sm font-semibold text-red-900">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onAction ? (
            <button
              onClick={onAction}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
