// import DefaultNav from '@components/DefaultNav'
//
// export default function Home() {
//   return (
//       <>
//           <DefaultNav/>
//       </>
//   );
// }

// pages/index.js

"use client"
// pages/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push('/chat');
    }, [router]);

    return null;
}

