'use client';

import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignIn() {
  const router = useRouter();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleRedirectUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL;

  const handleGoogleSignIn = () => {
    const referrer = document.referrer;
    alert("referrer : " +  referrer);

    const googleURL =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
      googleClientId +
      "&redirect_uri=" +
      googleRedirectUrl +
      "&response_type=code" +
      "&scope=email profile" +
      "&state=" + encodeURIComponent(referrer);

    window.location.href = googleURL;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <Image 
                src="/logo.png" 
                alt="Travel Planner Logo" 
                width={120} 
                height={120} 
                className="mx-auto mb-4 rounded-full shadow-md"
              />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-gray-500 mb-6">Sign in to continue your travel planning</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-4 py-3 
                  bg-white border border-gray-300 rounded-lg 
                  text-gray-700 hover:bg-gray-50 
                  transition duration-300 ease-in-out 
                  transform hover:-translate-y-1 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaGoogle className="mr-3 text-red-500 text-xl" />
                <span className="font-semibold">Continue with Google</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
