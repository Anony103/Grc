'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Chart } from 'primereact/chart';
import { ProductService } from '@/demo/service/ProductService';
import { Demo } from '@/types/demo';
import { LayoutContext } from '../../layout/context/layoutcontext';

const metrics: Demo.Metric[] = [
    {
        title: 'Low Risk',
        icon: 'pi pi-shield',
        color_light: '#22c55e', // Bright green for low risk
        color_dark: '#15803d', // Dark green for low risk
        textContent: [
            { amount: '640', text: 'Active Cases' },
            { amount: '1,420', text: 'Resolved Cases' }
        ]
    },
    {
        title: 'Medium Risk',
        icon: 'pi pi-exclamation-triangle',
        color_light: '#fbbf24', // Yellow-orange for medium risk
        color_dark: '#d97706', // Deep yellow-orange
        textContent: [
            { amount: '2,100', text: 'Pending Tasks' },
            { amount: '9,640', text: 'Closed Tasks' }
        ]
    },
    {
        title: 'High Risk',
        icon: 'pi pi-fire',
        color_light: '#f87171', // Light red for high risk
        color_dark: '#b91c1c', // Deep red for high risk
        textContent: [
            { amount: '8,272', text: 'Monitored Events' },
            { amount: '25,402', text: 'Incidents Logged' }
        ]
    },
    {
        title: 'Critical Risk',
        icon: 'pi pi-ban',
        color_light: '#dc2626', // Intense red for critical risk
        color_dark: '#7f1d1d', // Very dark red
        textContent: [
            { amount: '12', text: 'Immediate Attention Needed' },
            { amount: '85', text: 'Critical Responses Sent' }
        ]
    }
];

const Dashboard = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const orderWeek = [
        { name: 'This Week', code: '1' },
        { name: 'Last Week', code: '0' }
    ];

    const [products, setProducts] = useState(null);
    const [revenueChart, setRevenueChart] = useState({});
    const [revenueChartOptions, setRevenueChartOptions] = useState({});

    const initChart = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';

        const revenueChart = {
            labels: ['Critical Risks', 'Moderate Risks', 'Low Risks'],
            datasets: [
                {
                    data: [40, 35, 25],
                    backgroundColor: ['#ef4444', '#fb923c', '#22c55e'],
                    borderColor: [surfaceBorder]
                }
            ]
        };

        const revenueChartOptions = {
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: textColor
                    }
                }
            }
        };

        setRevenueChart(revenueChart);
        setRevenueChartOptions(revenueChartOptions);
    };

    useEffect(() => {
        initChart();
    }, [layoutConfig.colorScheme]);


    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data));
    }, []);

    return (
        <div className="layout-dashboard">
            <div className="grid">
                {metrics.map((metric) => (
                    <div className="col-12 md:col-6 xl:col-3" key={metric.title}>
                        <div
                            className="card shadow-1 flex flex-column"
                            style={{
                                color: metric.color_light,
                                borderLeft: '4px solid'
                            }}
                        >
                            <div className="flex align-items-center">
                                <span className="text-xl ml-2 font-semibold" style={{ color: metric.color_light }}>
                                    {metric.title}
                                </span>
                            </div>

                            <div className="grid mt-3">
                                {metric.textContent.map((content, i) => (
                                    <div className={`col-6 flex flex-column p-3 text-center ${i === 0 ? 'border-right-1 surface-border' : ''}`} key={i}>
                                        <span className="text-color text-2xl font-semibold">{content.amount}</span>
                                        <span className="text-color font-semibold">{content.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="col-12 lg:col-4">
                    <div className="card">
                        <h4>Tasks</h4>
                        <p>Overview of your pending tasks.</p>
                        <div className="mt-4">
                            <span className="block mb-2">
                                <span className="font-semibold">12 Pending</span> task to fulfill
                            </span>
                            <div className="w-full border-round" style={{ height: '7px', backgroundColor: 'var(--surface-d)' }}>
                                <div className="w-7 h-full border-round" style={{ backgroundColor: '#64B5F6' }}></div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="block mb-2">
                                <span className="font-semibold">40+ in-progress</span> task to fulfill
                            </span>
                            <div className="w-full border-round" style={{ height: '7px', backgroundColor: 'var(--surface-d)' }}>
                                <div className="w-5 h-full border-round" style={{ backgroundColor: '#A5D6A7' }}></div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="block mb-2">
                                <span className="font-semibold">4 Completed</span> task to fulfill
                            </span>
                            <div className="w-full border-round" style={{ height: '7px', backgroundColor: 'var(--surface-d)' }}>
                                <div className="w-8 h-full border-round" style={{ backgroundColor: '#7986CB' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h4>Team Overview</h4>

                        <ul className="list-none p-0 m-0">
                            <li className="p-3 surface-border border-bottom-1 flex justify-content-between align-items-center">
                                <span className="font-bold">Name</span>
                                <span className="font-bold">Role</span>
                            </li>
                            {products &&
                                products.slice(0, 7).map((product, i) => (
                                    <li key={i} className={`p-3 surface-border ${i !== 6 ? 'border-bottom-1' : ''}`}>
                                        <div className="flex justify-content-between align-items-center">
                                            <div className="flex gap-3 align-items-center">
                                                <img src={`/demo/images/product/${product.image}`} className="w-4rem h-4remE shadow-5 border-circle" alt={product.name} />
                                                <span>{product.name}</span>
                                            </div>
                                            <span className="font-semibold">{product.role}</span>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                <div className="col-12 lg:col-8">
                    <div className="card">
                        <h4>Risk Distribution</h4>
                        <p>Heatmap or scatterplot showing risks across various departments or assets.</p>
                        <div className="flex justify-content-center align-items-center">
                            <Chart type="pie" data={revenueChart} options={revenueChartOptions} style={{ width: '50%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
