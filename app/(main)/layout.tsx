import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'GRC 360',
    description: 'A robust platform for managing SaaS governance and compliance, ensuring streamlined workflows, risk mitigation, and regulatory adherence for organizations of all sizes.',

    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'GRC 360',
        url: '/',
        description: 'A robust platform for managing SaaS governance and compliance, ensuring streamlined workflows, risk mitigation, and regulatory adherence for organizations of all sizes.',

        images: ['https://www.primefaces.org/static/social/diamond-react.png'],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function MainLayout({ children }: MainLayoutProps) {
    return <Layout>{children}</Layout>;
}
