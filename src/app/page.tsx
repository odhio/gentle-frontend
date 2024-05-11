"use client"

import { initializeFirebaseApp } from '../lib/firebase/firebase'
import { AppRouter, usePathname, useSearchParams } from 'next/navigation';
import Room from './room/page';
import Login from './login/page';
import Lounge from './lounge/page';
import { useEffect, useState } from 'react';


initializeFirebaseApp()

export default function Root() {  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [params, setParams] = useState('');

  useEffect(() => {
    const paramValue = searchParams.get('params');
    if (paramValue !== null) {
      setParams(paramValue);
    }
  }, [searchParams]);

  const router = ([
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/lounge',
      element: <Lounge />
    },
    {
      path: '/room',
      element: <Room />
    }
  ]);
  
  const activeRoute = router.find(route => route.path === pathname);
  const Element = activeRoute ? activeRoute.element : <div>Not Found</div>;
  return <>{Element}</>;
}
