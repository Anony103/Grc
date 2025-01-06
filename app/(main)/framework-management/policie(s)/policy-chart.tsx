import React from 'react';
import { Chart } from 'primereact/chart';

export interface ChartData {
    labels: string[];
    datasets: Array<{
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }>;
}

export interface ChartOptions {
    plugins: {
        legend: {
            labels: {
                usePointStyle: boolean;
                color: string;
            };
        };
    };
}

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

const PolicyChart = ({ policies }: { policies: Policy[] }) => {
    const textColor = '#000'; // Replace with dynamic text color logic if needed.
    const documentStyle = getComputedStyle(document.documentElement);

    // Count policies by status
    const statusCounts = policies.reduce(
        (counts, policy) => {
            counts[policy.status] = (counts[policy.status] || 0) + 1;
            return counts;
        },
        {} as Record<string, number>
    );

    const pieData: ChartData = {
        labels: Object.keys(statusCounts), // Unique statuses as labels
        datasets: [
            {
                data: Object.values(statusCounts), // Count of each status
                backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500') || '#3f51b5',
                    documentStyle.getPropertyValue('--purple-500') || '#9c27b0',
                    documentStyle.getPropertyValue('--teal-500') || '#009688',
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--indigo-400') || '#6372c3',
                    documentStyle.getPropertyValue('--purple-400') || '#af50bf',
                    documentStyle.getPropertyValue('--teal-400') || '#30aa9f',
                ],
            },
        ],
    };

    const pieOptions: ChartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor,
                },
            },
        },
    };

    return <Chart type="doughnut" data={pieData} options={pieOptions} />;
};

export default PolicyChart;
