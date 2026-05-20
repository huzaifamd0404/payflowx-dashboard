import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search Bar */}
      <div className="flex flex-1 items-center">
        <div className="relative w-96">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments, transactions..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100">
          <BellIcon className="h-6 w-6" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-4 border-l border-gray-200 pl-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Today's Volume</p>
            <p className="text-sm font-semibold text-gray-900">$45,231</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Success Rate</p>
            <p className="text-sm font-semibold text-green-600">98.5%</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
