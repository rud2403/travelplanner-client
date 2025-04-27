'use client';

import dynamic from 'next/dynamic';

// 동적으로 로드하는 Planning
const Planning = dynamic(() => import('@/components/plan/tempname'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

const PlanningPage = () => {
  return (
    <Planning />
  );
};

export default PlanningPage;
