'use client';
import { useState } from 'react';
import BootAnimation from '@/components/Boot/BootAnimation';
import Home from './Home';

export default function Page() {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = () => {
    setBooted(true);
  };

  if (!booted) {
    return <BootAnimation onComplete={handleBootComplete} />;
  }

  return <Home />;
}
