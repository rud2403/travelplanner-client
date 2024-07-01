'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 동적으로 로드하는 PlanningComponent
const PlanningComponent = dynamic(() => import('@/components/plan/PlanningComponent'), {
  ssr: false,
});

const PlanningPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanningComponent />
    </Suspense>
  );
};

export default PlanningPage;
