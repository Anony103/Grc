'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { useQRCode } from 'next-qrcode';

const Auth: React.FC = () => {
    const router = useRouter();
    const { Canvas } = useQRCode();
    return (
        <>
            <div className="flex h-screen">
                <div className="w-full lg:w-4 h-full text-center px-6 py-6 flex flex-column justify-content-between">
                    <img src={`/layout/images/logo-dark.png`} className="mt-4 px-8 pt-8" alt="diamond-layout" />
                    <div className="flex flex-column align-items-center gap-4">
                        <div className="mb-3">
                            <h2>Scan QR Code</h2>
                            <p>Use the grc360 authenticator app on your device to scan the QRcode</p>
                        </div>

                        <div className="flex justify-content-center align-items-center">
                        <Canvas
                        text={'https://github.com/bunlong/next-qrcode'}
                        options={{
                            errorCorrectionLevel: 'M',
                            margin: 3,
                            scale: 4,
                            width: 200,
                            color: {
                            dark: '#000000',
                            light: '#ffffff',
                            },
                        }}
                        />
                        </div>

                        {/* <Button
                            label="Back to Home"
                            className="w-full mb-4"
                            style={{ backgroundColor: '#7EE288' }}
                            onClick={() => router.push('/')}
                        /> */}
                    </div>

                    <p className="text-color-secondary font-semibold">
                        Need help?{' '}
                        <a className="text-primary hover:underline cursor-pointer font-medium">Click here</a> and let us help you.
                    </p>
                </div>
                <div
                    className="w-7 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/demo/images/auth/auth.svg')" }}
                ></div>
            </div>
        </>
    );
};

export default Auth;
