import dynamic from 'next/dynamic';
import { Program } from '@/types';

const Paint = dynamic(() => import('@/components/Programs/Paint'));

export const programs: Program[] = [
  {
    id: 'paint',
    name: 'Paint',
    icon: '/assets/icons/paint.png',
    Component: Paint,
  },
];
