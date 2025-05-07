// index.tsx - Restructured for proper router nesting
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SigningOrSignout from "./components/signingOrSignout.tsx";
import HomePage from "./pages/homePage.tsx";
import BaseLayout from "./BaseLayout.tsx";
import ThemeContextProvider from "./components/hooks/themePrivider.tsx";
import Profile from "./pages/profile.tsx";
import Settings from "./components/settings.tsx";
import Billing from "./components/billing.tsx";
import Maps from "./pages/maps/Maps.tsx";
import CreateCommunity from "./components/CreateCommunity.tsx";

// Create router with layout wrappers for each route
const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout><HomePage /></BaseLayout>,
    },
    {
        path: '/communities/:communityName',
        element: <BaseLayout><HomePage /></BaseLayout>,
    },

    {
        path: '/create-community',
        element: <BaseLayout><CreateCommunity /></BaseLayout>,
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

]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeContextProvider>
            <RouterProvider router={router} />
        </ThemeContextProvider>
    </StrictMode>,
);
