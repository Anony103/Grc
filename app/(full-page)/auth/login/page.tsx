'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Page } from '@/types/layout';

const Login: Page = () => {
    return (
        <>
            <div className="flex h-screen bg-[#00242B]">
                <div className="w-full lg:w-4 h-full text-center px-6 py-6 flex flex-column justify-content-between">
                    <img src={`/layout/images/logo-dark.png`} className="mt-4 px-8 pt-8" alt="diamond-layout" />

                    <div className="flex flex-column align-items-center gap-4">
                        <div className="mb-3">
                            <h2>Login to your account</h2>
                            <p>
                                Forgot password? <a className="text-primary hover:underline cursor-pointer font-medium">Click here</a> to reset.
                            </p>
                        </div>
                        <InputText id="email" placeholder="Email" className="w-20rem" />
                        <InputText id="password" type="password" placeholder="Password" className="w-20rem" />
                        <Button label="CONTINUE" className="w-20rem" style={{ backgroundColor: '#7EE288' }}></Button>
                    </div>

                    <p className="text-color-secondary font-semibold">
                        A problem? <a className="text-primary hover:underline cursor-pointer font-medium">Click here</a> and let us help you.
                    </p>
                </div>
                <div className="w-8 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-center bg-no-repeat" style={{ backgroundImage: "url('/demo/images/auth/login.svg')" }}>
                    <div className="mt-auto mb-auto">
                        {/* <span className="block text-white text-7xl font-semibold">
                            Access to your <br />
                            Diamond <br />
                            Account
                        </span>
                        <span className="block text-white text-3xl mt-4">
                            Lorem ipsum dolor sit amet, consectetur
                            <br /> adipiscing elit. Donec posuere velit nec enim
                            <br /> sodales, nec placerat erat tincidunt.{' '}
                        </span> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
