'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode for decoding JWT
import useSessionStore from "@/store/useSessionStore";
import { fetchData } from '@/services/user';
import { Suspense } from 'react';

type DecodedToken = {
    sub: string;
    name: string;
    email: string;
    picture: string;
    iat?: number;
    exp?: number;
};

const GoogleLoginContent = () => { // Renamed for clarity
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const { updateUserInfo, userInfo } = useSessionStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const postCodeToServer = async () => {
            try {
                const data = await fetchData(code);
                console.log("data : ", data);

                if (data) {
                    localStorage.setItem('jwtToken', data);

                    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(data);
                    console.log("Decoded Token: ", decodedToken);

                    updateUserInfo({
                        sub: decodedToken.sub,
                        name: decodedToken.name,
                        email: decodedToken.email,
                        picture: decodedToken.picture,
                    });
                }

                console.log('userInfo : ', userInfo);

                if (state) {
                    router.push(decodeURIComponent(state));
                } else {
                    router.push("/");
                }
            } catch (error) {
                console.log('error : ', error);
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            postCodeToServer();
        } else {
            setLoading(false);
        }
    }, [code, state, router, updateUserInfo, userInfo]);

    useEffect(() => {
        console.log('Updated userInfo:', userInfo);
    }, [userInfo]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg">
                    <div className="flex items-center justify-center mb-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                    <h2 className="text-center text-2xl font-semibold text-gray-700">Processing Google login...</h2>
                    <p className="text-center text-gray-500 mt-2">This may take a few seconds, please don&apos;t close this page.</p>
                </div>
            </div>
        );
    }

    return null; // Return null when not loading
};

const GoogleLogin = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GoogleLoginContent />
        </Suspense>
    );
};

export default GoogleLogin;
