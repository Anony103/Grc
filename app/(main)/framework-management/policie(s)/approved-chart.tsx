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
    const [chartData, setChartData] = useState<ChartData<'bar'>>({
        labels: [], // Empty array for initial labels
        datasets: [], // Empty array for initial datasets
    });
    const [barOptions, setBarOptions] = useState<ChartOptions<'bar'>>({});

    useEffect(() => {
        const textColor = '#000';
        const textColorSecondary = '#888';
        const surfaceBorder = '#ccc';

        const approvedPolicies = policies.filter(policy => policy.status === 'Approved');
        const approvedControls = controls.filter(control => control.implementationStatus === 'Complete');

        const policyNames = approvedPolicies.map(policy => policy.policyName);
        const controlNames = approvedControls.map(control => control.controlName);

        const barData: ChartData<'bar'> = {
            labels: [...policyNames, ...controlNames],
            datasets: [
                {
                    label: 'Policies',
                    backgroundColor: '#4399d3',
                    borderColor: '#4399d3',
                    borderWidth: 1,
                    data: new Array(approvedPolicies.length).fill(0.85),
                },
                {
                    label: 'Controls',
                    backgroundColor: '#3ba56a',
                    borderColor: '#3ba56a',
                    borderWidth: 1,
                    data: new Array(approvedControls.length).fill(0.7),
                },
            ],
        };

        const barOptions: ChartOptions<'bar'> = {
            plugins: {
                legend: {
                    labels: { color: textColor },
                },
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { display: false },
                },
                y: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                },
            },
        };

        setChartData(barData);
        setBarOptions(barOptions);
    }, [policies, controls]);

    return <Chart type="bar" data={chartData} options={barOptions} />;
};


export default ApprovedBarChart;
