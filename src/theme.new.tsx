import React, { createContext, useContext, useState, ReactNode } from 'react';


interface ThemeContextProps {
    theme: Theme;
    setTheme: (theme: Theme)=> void;
}
interface Theme {
    pallete: {
        background: string
        paper: string
        primary: string
        secondary: string
        text: string
    }
}




const defaultTheme: Theme = {
    pallete: {
        background: '#2c303d',
        paper: '#3b3b3ba8',
        primary: '#6200ea',
        secondary: '#03dac6',    
        text: '#333333',        
    }
}




const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            { children }
        </ThemeContext.Provider>
    );
};
export const useTheme =()=> {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    
    return context;
}
