'use client';

import useSessionStore from '@/store/useSessionStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateUserInfoAPI } from '@/services/user';
import { FiArrowLeft, FiCheck, FiEdit, FiUser, FiMail, FiKey, FiAward } from 'react-icons/fi';

export default function MyInfo() {
    const { userInfo, isLoggedIn, updateUserInfo } = useSessionStore();
    const router = useRouter();
    const [nickname, setNickname] = useState(userInfo?.nickname || '');
    const [editing, setEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

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
            setIsSaving(true);
            
            if (!nickname || !userInfo.email) {
                alert('닉네임 또는 이메일이 올바르지 않습니다.');
                setIsSaving(false);
                return;
            }

            // 백엔드로 데이터 전송
            const response = await updateUserInfoAPI(userInfo.email, nickname);

            const updatedUserInfo = {
                ...userInfo,
                nickname: response.data.nickname
            };

            updateUserInfo(updatedUserInfo);
            setSaveSuccess(true);
            setEditing(false);
            
            // 3초 후 성공 메시지 숨기기
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error updating user information:', error);
            alert('유저 정보 수정에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!userInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-blue-200 rounded mb-3"></div>
                    <div className="h-3 w-24 bg-blue-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.push('/')}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
                    >
                        <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all duration-200 mr-3">
                            <FiArrowLeft className="h-5 w-5" />
                        </div>
                        <span className="font-medium">홈으로</span>
                    </button>
                    
                    {saveSuccess && (
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm flex items-center shadow-sm animate-fadeIn">
                            <FiCheck className="mr-2" />
                            정보가 성공적으로 저장되었습니다
                        </div>
                    )}
                </div>
                
                {/* 메인 카드 */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-blue-100">
                    {/* 프로필 헤더 */}
                    <div className="relative">
                        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <div className="absolute bottom-0 transform translate-y-1/2 left-10 bg-white p-2 rounded-full border-4 border-white shadow-xl">
                            <div className="w-24 h-24 rounded-full overflow-hidden">
                                <img
                                    src={userInfo.picture || '/profile-placeholder.jpg'}
                                    alt={userInfo.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* 프로필 내용 */}
                    <div className="pt-16 pb-8 px-10">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* 좌측 프로필 정보 */}
                            <div className="md:w-1/3">
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{userInfo.name}</h2>
                                <p className="text-blue-500 font-medium mb-4">
                                    @{nickname || '닉네임을 설정해주세요'}
                                </p>
                                <p className="text-sm text-gray-500 mb-6">{userInfo.email}</p>
                                
                                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm mb-6">
                                    <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-3">여행 통계</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">계획된 여행</span>
                                            <span className="font-semibold text-gray-800">0개</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">방문 국가</span>
                                            <span className="font-semibold text-gray-800">0개</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">총 여행 일수</span>
                                            <span className="font-semibold text-gray-800">0일</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 우측 정보 섹션 */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">사용자 정보</h3>
                                    {!editing ? (
                                        <button 
                                            onClick={() => setEditing(true)}
                                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors duration-200"
                                        >
                                            <FiEdit className="mr-1.5" />
                                            정보 수정
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                setEditing(false);
                                                setNickname(userInfo?.nickname || ''); // 기존 닉네임으로 초기화
                                            }}
                                            className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors duration-200"
                                        >
                                            취소
                                        </button>
                                    )}
                                </div>
                                
                                <div className="space-y-5">
                                    <div className="flex p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="mr-4 text-blue-500 self-center">
                                            <FiUser className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">이름</p>
                                            <p className="font-medium text-gray-800">{userInfo.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="mr-4 text-blue-500 self-center">
                                            <FiMail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">이메일</p>
                                            <p className="font-medium text-gray-800">{userInfo.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="mr-4 text-blue-500 self-center">
                                            <FiKey className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">ID</p>
                                            <p className="font-medium text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded">
                                                {userInfo.sub ? userInfo.sub.substring(0, 12) + '...' : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="mr-4 text-blue-500 self-center">
                                            <FiAward className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 mb-1">닉네임</p>
                                            {editing ? (
                                                <div className="flex items-center">
                                                    <input
                                                        id="nickname"
                                                        type="text"
                                                        value={nickname}
                                                        onChange={(e) => setNickname(e.target.value)}
                                                        placeholder="닉네임 입력"
                                                        className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                                                    />
                                                    <button
                                                        onClick={handleSaveChanges}
                                                        disabled={isSaving}
                                                        className={`ml-2 px-4 py-2 rounded-lg text-white shadow-sm transition-all duration-200 flex items-center justify-center min-w-[80px] ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
                                                    >
                                                        {isSaving ? (
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <>저장<FiCheck className="ml-1.5" /></>
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="font-medium text-gray-800">
                                                    {nickname || '닉네임이 설정되지 않았습니다'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 추가 섹션: 간단한 가이드 */}
                <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-lg font-bold mb-2">여행 계획을 시작해보세요!</h3>
                    <p className="text-blue-100 mb-4">여행 계획을 세우고, 친구들과 공유하고, 여행의 추억을 기록해보세요.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium shadow-sm"
                    >
                        새 여행 만들기
                    </button>
                </div>
            </div>
        </div>
    );
}
