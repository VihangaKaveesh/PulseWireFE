import Link from "next/link";

export default function HomeNavBar() {
  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="PulseWire Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            PulseWire
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex md:order-2 space-x-3">
          {/* Login Button */}
          <Link
            href="../login"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
