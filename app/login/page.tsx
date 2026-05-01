import Image from "next/image";
import Link from "next/link";
import { TrendingUp, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f7f4]">
      {/* Left side: Image and Impact Statement */}
      <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-screen">
        <Image
          src="/images/garden-bg.png"
          alt="Lush green garden"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Save food, <br />
            reduce waste, <br />
            make impact
          </h1>
          <p className="text-white/90 text-lg max-w-md mb-8">
            Join a community of thousands preserving the harvest and nourishing the planet through sustainable redistribution.
          </p>
          
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center space-x-4 max-w-sm border border-white/30">
            <div className="bg-green-500 rounded-full p-2 flex items-center justify-center">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Total Savings</p>
              <p className="text-white text-xl font-bold">12,402 Tons CO2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-10">Login to continue your sustainable journey</p>

          <form className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="hello@ecoeat.com"
                className="w-full bg-[#e8ede7] border-transparent rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="text-sm font-semibold text-green-700 hover:text-green-800">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#e8ede7] border-transparent rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-green-600 bg-[#e8ede7] border-transparent rounded focus:ring-green-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700 font-medium">
                Remember me
              </label>
            </div>

            <div className="pt-2 flex flex-col space-y-4">
              <button
                type="button"
                className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-semibold py-3.5 rounded-lg transition-colors shadow-md hover:shadow-lg flex justify-center items-center"
              >
                Login
              </button>
              
              <Link
                href="/register"
                className="w-full bg-transparent border-2 border-[#e0e5df] hover:border-green-600 text-green-700 font-semibold py-3.5 rounded-lg transition-colors flex justify-center items-center"
              >
                Register account
              </Link>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 font-medium">
            Don't have an account? <Link href="/register" className="text-green-700 font-bold hover:underline">Sign up</Link>
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 flex items-start space-x-3 text-gray-500">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              Every transaction is logged on our transparent carbon methodology ledger to ensure genuine ecological impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
