import Link from 'next/link';
import Header from '../components/Header';

const AdminLoginPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h1 className="text-2xl font-bold mb-4">Login to Admin?</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full border rounded p-2"
              placeholder="Enter username"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded p-2"
              placeholder="Enter password"
              disabled
            />
          </div>
          <Link
            href="/admin"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-center block"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;