'use client'

import Link from 'next/link';
import useSessionStore from '@/store/useSessionStore';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { isLoggedIn, userInfo, clearUserInfo } = useSessionStore(); // Get login status, user info, and the clear function
    const router = useRouter();

    const handleLogout = () => {
        // Clear the user info in the store
        clearUserInfo();
        // Clear the JWT from localStorage
        localStorage.removeItem('jwtToken');
        // Redirect to the home page or login page after logout
        router.push('/');
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-800">Travel Planner</h1>
                </Link>
                <nav className="flex space-x-4">
                    {isLoggedIn && userInfo ? (
                        <div className="flex items-center space-x-4">
                            <img src={userInfo.picture} alt={userInfo.name} className="w-8 h-8 rounded-full" />
                            <span className="text-gray-800 font-semibold">{userInfo.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-800 transition duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/user/signin" className="text-gray-800 hover:text-blue-500 transition duration-300">Sign In</Link>
                            <Link href="/about" className="text-gray-800 hover:text-blue-500 transition duration-300">About</Link>
                            <Link href="/contact" className="text-gray-800 hover:text-blue-500 transition duration-300">Contact</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
