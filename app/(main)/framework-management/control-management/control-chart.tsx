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

const ControlChart = ({ controls }: { controls: Control[] }) => {
    const textColor = '#000'; // Replace with dynamic text color logic if needed.
    const documentStyle = getComputedStyle(document.documentElement);

    // Count controls by implementation status
    const statusCounts = controls.reduce(
        (counts, control) => {
            counts[control.implementationStatus] = (counts[control.implementationStatus] || 0) + 1;
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
                    documentStyle.getPropertyValue('--green-500') || '#4caf50',
                    documentStyle.getPropertyValue('--orange-500') || '#ff9800',
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--green-400') || '#81c784',
                    documentStyle.getPropertyValue('--orange-400') || '#ffb74d',
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

export default ControlChart;
