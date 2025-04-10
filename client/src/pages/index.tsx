import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <ClipboardList className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Task Manager
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Organize your tasks efficiently and boost your productivity
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Create account
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
