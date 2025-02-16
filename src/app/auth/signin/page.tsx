'use client';

import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleRedirectUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL;

  const handleGoogleSignIn = () => {
    const referrer = document.referrer; // 현재 URL 가져오기
    alert("referrer : " +  referrer);

    const googleURL =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
      googleClientId +
      "&redirect_uri=" +
      googleRedirectUrl +
      "&response_type=code" +
      "&scope=email profile" +
      "&state=" + encodeURIComponent(referrer); // 현재 URL을 state 파라미터에 포함

    window.location.href = googleURL;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Sign in to Your Account</h1>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm transition duration-200"
        >
          <FaGoogle className="mr-3" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
