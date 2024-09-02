'use client'

import Link from 'next/link';
import useSessionStore from '@/store/useSessionStore';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
    const { isLoggedIn, userInfo, clearUserInfo } = useSessionStore(); // Get login status, user info, and the clear function
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        // Clear the user info in the store
        clearUserInfo();
        // Clear the JWT from localStorage
        localStorage.removeItem('jwtToken');
        // Redirect to the home page or login page after logout
        router.push('/');
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-800">Travel Planner</h1>
                </Link>
                <nav className="flex space-x-4">
                    {isLoggedIn && userInfo ? (
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center space-x-4 cursor-pointer"
                                onClick={handleDropdownToggle}
                            >
                                <img src={userInfo.picture} alt={userInfo.name} className="w-8 h-8 rounded-full" />
                                <span className="text-gray-800 font-semibold">{userInfo.name}</span>
                            </div>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                                    <Link
                                        href="/user/myInfo"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        My Info
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}

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
