import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ExclamationTriangleIcon className="h-16 w-16 text-gray-300" />
      <h1 className="mt-4 text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-lg font-medium text-gray-600">Page not found</p>
      <p className="mt-1 text-sm text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
