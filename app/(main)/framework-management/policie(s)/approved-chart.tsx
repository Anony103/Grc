import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { ChartData, ChartOptions } from 'chart.js';

type Policy = {
    id: string;
    policyName: string;
    description: string;
    templateFile?: string;
    status: string;
    reviewComments?: string;
    createdBy: string;
    approvedBy?: string;
    reviewedBy?: string;
    reviewDate?: string;
    approvalDate?: string;
    createdAt: string;
    updatedAt: string;
    frameworkId: number;
    framework: string;
};

type Control = {
    id: string;
    clause: string;
    controlName: string;
    applicable: 'Y' | 'N';
    justification?: string;
    implementationStatus: 'Complete' | 'In Progress';
    evidenceFile?: string;
    responsible: string;
    createdAt: string;
    updatedAt: string;
    frameworkId: number;
    framework: string;
};

const ApprovedBarChart = ({ policies, controls }: { policies: Policy[]; controls: Control[] }) => {
    const [chartData, setChartData] = useState<ChartData<'bar'>>({});
    const [barOptions, setBarOptions] = useState<ChartOptions<'bar'>>({});

    useEffect(() => {
        const textColor = '#000';
        const textColorSecondary = '#888';
        const surfaceBorder = '#ccc';

        // Filter policies and controls by status
        const approvedPolicies = policies.filter(policy => policy.status === 'Approved');
        const approvedControls = controls.filter(control => control.implementationStatus === 'Complete');

        // Get the names of the approved policies and controls
        const policyNames = approvedPolicies.map(policy => policy.policyName);
        const controlNames = approvedControls.map(control => control.controlName);

        const totalLabels = [...policyNames, ...controlNames]; // Combine both policy and control names
        const totalData = [
            ...new Array(approvedPolicies.length).fill(1), // Each policy gets a bar
            ...new Array(approvedControls.length).fill(1), // Each control gets a bar
        ];

        const barData: ChartData<'bar'> = {
            labels: totalLabels, // Combined labels for both policies and controls
            datasets: [
                {
                    label: 'Policies',
                    backgroundColor: '#4399d3', // Blue for policies
                    borderColor: '#4399d3',
                    borderWidth: 1,
                    data: new Array(approvedPolicies.length).fill(0.85), // Policies bars
                    barThickness: 30, // Adjust bar thickness
                    categoryPercentage: 0.4, // Adjust spacing for bars
                    barPercentage: 0.9, // Adjust bar width
                    // offset: true,
                },
                {
                    label: 'Controls',
                    backgroundColor: '#3ba56a', // Green for controls
                    borderColor: '#3ba56a',
                    borderWidth: 1,
                    data: new Array(approvedControls.length).fill(0.7), // Controls bars
                    barThickness: 30, // Adjust bar thickness
                    categoryPercentage: 0.3, // Adjust spacing for bars
                    barPercentage: 0.9, // Adjust bar width
                    // offset: true,
                },
            ],
        };

        const barOptions: ChartOptions<'bar'> = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: { weight: '500' },
                    },
                    grid: { display: false },
                    border: { display: false },
                    // Ensure the x-axis displays labels correctly
                    offset: true,
                    ticks: {
                        // To display labels evenly for each policy-control pair
                        callback: function (value, index) {
                            return index % 2 === 0 ? value : ''; // Adjust the display of ticks
                        },
                    },
                },
                y: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                    border: { display: false },
                },
            },
        };

        setChartData(barData);
        setBarOptions(barOptions);
    }, [policies, controls]);

    return <Chart type="bar" data={chartData} options={barOptions} />;
};

export default ApprovedBarChart;
