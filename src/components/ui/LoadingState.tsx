import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface LoadingStateProps {
  title?: string;
  message?: string;
  fullHeight?: boolean;
}

const LoadingState = ({
  title = 'Loading...',
  message = 'Please wait while we fetch the latest data.',
  fullHeight = false,
}: LoadingStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm ${
        fullHeight ? 'min-h-[320px]' : 'min-h-[220px]'
      }`}
    >
      <div className="mb-4 rounded-full bg-blue-50 p-3">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingState;
