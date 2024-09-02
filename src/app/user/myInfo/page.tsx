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
            router.push('/user/signin');
        }
    }, [isLoggedIn, router]);

    const handleSaveChanges = async () => {
        if (!userInfo) {
            alert('User information is not available.');
            return;
        }

        try {
            if (!nickname || !userInfo.email) {
                alert('Nickname or Email is not available.');
                return;
            }

            // 백엔드로 데이터 전송
            const response = await updateUserInfoAPI(nickname, userInfo.email);

            const updatedUserInfo = {
                ...userInfo,
                nickname: response.data.nickname
            };

            updateUserInfo(updatedUserInfo);
            alert('User information updated successfully');
        } catch (error) {
            console.error('Error updating user information:', error);
            alert('Failed to update user information');
        }
    };

    if (!userInfo) {
        return null; // 로딩 상태를 추가할 수도 있습니다.
    }

    return (
        <div className="container mx-auto px-6 py-8 bg-white min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-2xl">
                <div className="flex flex-col items-center p-8 bg-gray-50 border-b border-gray-200">
                    {/* 프로필 사진 */}
                    <div className="mb-4">
                        <img
                            src={userInfo.picture}
                            alt={userInfo.name}
                            className="w-32 h-32 rounded-full object-cover shadow-md"
                        />
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">회원 정보</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Name:</span>
                            <span className="text-gray-600">{userInfo.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-600">{userInfo.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Sub:</span>
                            <span className="text-gray-600">{userInfo.sub || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Nickname:</span>
                            <input
                                id="nickname"
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-30 max-w-sm px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-right"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={handleSaveChanges}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        회원정보 수정
                    </button>
                </div>
            </div>
        </div>
    );
}
