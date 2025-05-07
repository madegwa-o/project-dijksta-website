// index.tsx - Restructured for proper router nesting
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SigningOrSignout from "./components/signingOrSignout.tsx";
import HomePage from "./pages/homePage.tsx";
import Map from "./pages/map.tsx";
import UserAccount from "./pages/UserAccount.tsx";
import BaseLayout from "./BaseLayout.tsx";
import ThemeContextProvider from "./components/hooks/themePrivider.tsx";
import Profile from "./pages/profile.tsx";
import Settings from "./components/settings.tsx";
import Billing from "./components/billing.tsx";
import Maps from "./pages/mockMap/Maps.tsx";

// Create router with layout wrappers for each route
const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout><HomePage /></BaseLayout>,
    },
    {
        path: '/login',
        element: <BaseLayout><SigningOrSignout /></BaseLayout>,
    },
    {
        path: '/signup',
        element: <BaseLayout><SigningOrSignout /></BaseLayout>,
    },
    {
        path: '/settings',
        element: <BaseLayout><Settings /></BaseLayout>,
    },
    {
        path: '/profile',
        element: <BaseLayout><Profile /></BaseLayout>,
    },
    {
        path: '/cash',
        element: <BaseLayout><Billing/></BaseLayout>,
    },
    {
        path: '/maps/mock',
        element: <BaseLayout><Maps /></BaseLayout>,
    },
    // Add additional routes
    {
        path: '/homes/popular',
        element: <BaseLayout><HomePage filter="popular" /></BaseLayout>,
    },
    {
        path: '/homes/all',
        element: <BaseLayout><HomePage filter="all" /></BaseLayout>,
    },
    {
        path: '/homes/new',
        element: <BaseLayout><HomePage filter="new" /></BaseLayout>,
    },
    {
        path: '/maps/directions',
        element: <BaseLayout><Map type="directions" /></BaseLayout>,
    },
    {
        path: '/maps/plots',
        element: <BaseLayout><Map type="plots" /></BaseLayout>,
    },
    {
        path: '/maps/roads',
        element: <BaseLayout><Map type="roads" /></BaseLayout>,
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeContextProvider>
            <RouterProvider router={router} />
        </ThemeContextProvider>
    </StrictMode>,
);