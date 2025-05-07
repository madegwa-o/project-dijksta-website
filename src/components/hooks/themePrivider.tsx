import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
    setTheme: React.Dispatch<React.SetStateAction<string>>; // Add setTheme
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

interface ThemeContextProviderProps {
    children: ReactNode;
}

export default function ThemeContextProvider({ children } : ThemeContextProviderProps) {
    const [theme, setTheme] = useState<string>(() => {
        // First try to get the theme from localStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme;
        }

        // Otherwise, respect system preferences
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "dark";
        }

        // Default to light theme
        return "light";
    });

    useEffect(() => {
        // Apply the current theme to the body element
        document.body.className = theme;
        localStorage.setItem("theme", theme); // Persist the theme
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e : MediaQueryListEvent) => {
            // Only change if user hasn't manually set a preference
            if (!localStorage.getItem("theme")) {
                setTheme(e.matches ? "dark" : "light");
            }
        };

        // Add event listener
        mediaQuery.addEventListener('change', handleChange);

        // Clean up
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
