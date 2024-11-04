import React, { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex justify-center h-screen items-center">
            {children}
        </div>
    );
}
