'use client'

import { logoutAPI } from '@/services/user';
import Link from 'next/link';
import useSessionStore from '@/store/useSessionStore';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { UserCircleIcon, MapIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'; // Import icons

export default function Header() {
    const { isLoggedIn, userInfo, clearUserInfo, checkTokenExpiration } = useSessionStore();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = useCallback(async () => {
        try {
            // 서버에 로그아웃 요청 (쿠키 만료)
            await logoutAPI();
            
            // 상태 초기화
            clearUserInfo();
            
            // 홈페이지로 이동
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            
            // 오류 발생해도 클라이언트 상태는 초기화
            clearUserInfo();
            router.push('/');
        }
    }, [clearUserInfo, router]);
    
    // 컴포넌트 마운트 시 토큰 유효성 확인
    useEffect(() => {
        // 로그인 상태일 때만 토큰 확인
        const checkToken = async () => {
            if (isLoggedIn) {
                const isExpired = await checkTokenExpiration();
                if (isExpired) {
                    // 토큰이 만료되었다면 자동 로그아웃
                    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
                    await handleLogout();
                }
            }
        };
        
        checkToken();
    }, [isLoggedIn, checkTokenExpiration, handleLogout]);

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
        <header className="bg-white shadow-sm sticky top-0 z-50"> {/* Slightly softer shadow, sticky header */}
            <div className="container mx-auto px-6 py-3 flex justify-between items-center"> {/* Reduced padding */}
                <Link href="/" className="flex items-center space-x-2"> {/* Added space-x for logo and title */}
                    <img src="/logo.png" alt="Logo" className="w-8 h-8" /> {/* Slightly smaller logo */}
                    <h1 className="text-xl font-semibold text-gray-900">Travel Planner</h1> {/* Adjusted font */}
                </Link>
                <nav className="flex items-center space-x-6"> {/* Increased spacing between nav items */}
                    {isLoggedIn && userInfo ? (
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center space-x-3 cursor-pointer" // Adjusted spacing
                                onClick={handleDropdownToggle}
                            >
                                <img src={userInfo.picture} alt={userInfo.name} className="w-8 h-8 rounded-full border border-gray-200" /> {/* Added subtle border */}
                                <span className="text-gray-700 font-medium text-sm">{userInfo.name}</span> {/* Adjusted font */}
                            </div>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden"> {/* Increased width slightly */}
                                    {/* User Info Section (Optional) - Can add user email or other details here if needed */}
                                    {/* <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                                        <p className="text-xs text-gray-500">{userInfo.email}</p> 
                                    </div> */}
                                    <Link
                                        href="/user/myInfo"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out" // Added missing classes
                                    >
                                        <UserCircleIcon className="w-5 h-5 mr-2 text-gray-500" /> {/* Added User icon */}
                                        <span>내 정보</span>
                                    </Link>
                                    <Link
                                        href={`/plan/list/${userInfo.nickname}`}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out border-t border-gray-100" // Added separator, flex for icon
                                    >
                                        <MapIcon className="w-5 h-5 mr-2 text-gray-500" /> {/* Added Map icon */}
                                        <span>내 여행 일정</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-150 ease-in-out border-t border-gray-100" // Added separator, flex for icon
                                    >
                                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> {/* Added Logout icon */}
                                        <span>로그아웃</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">로그인</Link> {/* Adjusted font and hover */}
                            {/* Removed About and Contact links for simplicity, can be added back if needed */}
                            {/* <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">About</Link> */}
                            {/* <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">Contact</Link> */}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
