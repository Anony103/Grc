'use client';

import React from 'react';

import { useContext } from 'react';

import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <div className="footer-logo-container">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'dim' ? 'dark' : 'dim'}.svg`} alt="diamond-layout" />
                <span className="footer-app-name">GRC 360</span>
            </div>
            <span className="footer-copyright">&#169; GRC 360 - 2023</span>
        </div>
    );
};

export default AppFooter;
