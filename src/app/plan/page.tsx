'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 동적으로 로드하는 Planning
const Planning = dynamic(() => import('@/components/plan/planning'), {
  ssr: false,
});

const PlanningPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Planning />
    </Suspense>
  );
};

export default PlanningPage;
