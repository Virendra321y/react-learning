import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './Layout';

// Layout wrapper to conditionally show/hide Layout based on route
const AppLayout = ({ children }) => {
    const location = useLocation();
    const hideLayoutRoutes = ['/login', '/register'];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

    if (shouldHideLayout) {
        return children;
    }

    return <Layout>{children}</Layout>;
};

export default AppLayout;
