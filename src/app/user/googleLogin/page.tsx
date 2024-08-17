"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode for decoding JWT
import useSessionStore from "@/store/useSessionStore";
import { fetchData } from '@/services/user';

type DecodedToken = {
    sub: string;
    name: string;
    email: string;
    picture: string;
    iat?: number;
    exp?: number;
};

const GoogleLogin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // state 파라미터 추출
    const { updateUserInfo, userInfo } = useSessionStore();
    const [loading, setLoading] = useState(true); // 로딩 상태 관리

    useEffect(() => {
        const postCodeToServer = async () => {
            try {
                const data = await fetchData(code);
                console.log("data : ", data); // 백으로부터 JWT 반환 받기 성공

                // JWT를 로컬 스토리지에 저장
                if (data) {
                    localStorage.setItem('jwtToken', data);

                    // JWT 디코드
                    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(data);
                    console.log("Decoded Token: ", decodedToken);

                    // 디코드된 정보에서 필요한 사용자 정보를 세션 스토어에 저장
                    // After decoding the JWT and updating userInfo
                    updateUserInfo({
                        sub: decodedToken.sub,
                        name: decodedToken.name,
                        email: decodedToken.email,
                        picture: decodedToken.picture,
                    });
                }

                console.log('userInfo : ', userInfo); // 세션 스토어에 저장된 유저 정보 확인

                // 로그인 전 페이지로 리다이렉트
                if (state) {
                    router.push(decodeURIComponent(state));
                } else {
                    router.push("/"); // 기본적으로 홈으로 리다이렉트
                }
            } catch (error) {
                console.log('error : ', error);
            } finally {
                setLoading(false); // 로딩 상태 종료
            }
        };

        if (code) {
            postCodeToServer();
        } else {
            setLoading(false); // code가 없는 경우 로딩 종료
        }
    }, [code, state, router, updateUserInfo, userInfo]);

    useEffect(() => {
        console.log('Updated userInfo:', userInfo); // userInfo 값이 업데이트될 때마다 콘솔에 출력
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

    return null;
};

export default GoogleLogin;
