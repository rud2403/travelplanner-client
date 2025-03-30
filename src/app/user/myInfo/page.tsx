'use client';

import useSessionStore from '@/store/useSessionStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateUserInfoAPI } from '@/services/user';

export default function MyInfo() {
    const { userInfo, isLoggedIn, updateUserInfo } = useSessionStore();
    const router = useRouter();
    const [nickname, setNickname] = useState(userInfo?.nickname || '');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/signin');
        }
    }, [isLoggedIn, router]);

    const handleSaveChanges = async () => {
        if (!userInfo) {
            alert('올바르지 않은 유저 정보입니다.');
            return;
        }

        try {
            if (!nickname || !userInfo.email) {
                alert('닉네임 또는 이메일이 올바르지 않습니다.');
                return;
            }

            // 백엔드로 데이터 전송
            const response = await updateUserInfoAPI(userInfo.email, nickname);

            const updatedUserInfo = {
                ...userInfo,
                nickname: response.data.nickname
            };

            updateUserInfo(updatedUserInfo);
            alert('유저 정보 수정이 완료되었습니다.');
        } catch (error) {
            console.error('Error updating user information:', error);
            alert('유저 정보 수정에 실패했습니다.');
        }
    };

    if (!userInfo) {
        return null; // 로딩 상태를 추가할 수도 있습니다.
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-2xl mx-auto">
                <div className="p-6 bg-blue-500 text-white flex items-center justify-between">
                    <h1 className="text-xl font-semibold">내 정보</h1>
                    <button 
                        onClick={() => router.push('/')}
                        className="text-white hover:text-blue-100 transition-colors duration-200 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        홈으로
                    </button>
                </div>
                
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                    {/* 프로필 사진 섹션 */}
                    <div className="flex flex-col items-center md:w-1/3">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                            <img
                                src={userInfo.picture || '/profile-placeholder.jpg'}
                                alt={userInfo.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">{userInfo.name}</h2>
                        <p className="text-sm text-gray-500">{userInfo.email}</p>
                    </div>
                    
                    {/* 정보 섹션 */}
                    <div className="flex-1">
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                                <h3 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">기본 정보</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span className="text-gray-600">이름</span>
                                        <span className="font-medium text-gray-800">{userInfo.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span className="text-gray-600">이메일</span>
                                        <span className="font-medium text-gray-800">{userInfo.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">ID</span>
                                        <span className="font-medium text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded">
                                            {userInfo.sub ? userInfo.sub.substring(0, 12) + '...' : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                                <h3 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">닉네임 설정</h3>
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                        <span className="text-gray-600 text-sm">닉네임</span>
                                        <input
                                            id="nickname"
                                            type="text"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            placeholder="닉네임 입력"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSaveChanges}
                                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
