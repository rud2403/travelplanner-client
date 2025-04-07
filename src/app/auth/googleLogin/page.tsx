'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSessionStore from "@/store/useSessionStore";
import { fetchData } from '@/services/user';
import { Suspense } from 'react';

type UserResponse = {
    name: string;
    email: string;
    profilePictureUrl: string; // 필드 이름 변경: picture -> profilePictureUrl
    nickname: string;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
};

const GoogleLoginContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const { updateUserInfo, updateTokenExpiry } = useSessionStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const postCodeToServer = async () => {
            try {
                const data = await fetchData(code);
                console.log("Response data: ", data);
    
                if (data && data.data) {
                    const userData: UserResponse = data.data;
                    
                    // 사용자 정보 업데이트
                    updateUserInfo({
                        name: userData.name,
                        email: userData.email,
                        picture: userData.profilePictureUrl, // 필드 이름 변경에 맞춰 수정
                        nickname: userData.nickname
                    });
                    
                    // 토큰 만료 시간 업데이트
                    updateTokenExpiry(userData.accessTokenExpiresAt);
                }
    
                if (state) {
                    router.push(decodeURIComponent(state));
                } else {
                    router.push("/");
                }
            } catch (error) {
                console.error('Login error:', error);
                setError('Authentication failed. Please try again.');
                setLoading(false);
            }
        };
    
        if (code) {
            postCodeToServer();
        } else {
            setLoading(false);
        }
    }, [code, state, router, updateUserInfo, updateTokenExpiry]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100 p-4 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl animate-blob"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
                
                <div className="relative w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
                    
                    <div className="p-8 space-y-6 relative z-10">
                        <div className="text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="relative w-32 h-32">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-ping"></div>
                                    <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-700 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-4 border-4 border-transparent border-b-blue-500 border-r-purple-500 rounded-full animate-spin-slow"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                                로그인 중입니다
                            </h2>
                            <p className="text-gray-600 mb-4 text-lg">
                                Securely logging you into Travel Planner
                            </p>
                            
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-6">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full w-full animate-progress"></div>
                            </div>
                            
                            <p className="text-sm text-gray-500 mt-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Please do not close this window
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-200 rounded-full opacity-20 blur-3xl animate-blob"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
                
                <div className="relative w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 animate-gradient-x"></div>
                    
                    <div className="p-8 space-y-6 relative z-10 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-2">
                            Authentication Failed
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg">
                            {error}
                        </p>
                        
                        <button 
                            onClick={() => router.push('/auth/signin')}
                            className="w-full px-6 py-3 text-lg font-semibold text-white 
                            bg-gradient-to-r from-red-500 to-pink-600 
                            rounded-xl shadow-lg 
                            hover:from-red-600 hover:to-pink-700 
                            transition duration-300 
                            transform hover:-translate-y-1 
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const GoogleLogin = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <GoogleLoginContent />
        </Suspense>
    );
};

export default GoogleLogin;
