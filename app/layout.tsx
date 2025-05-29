import './globals.css';
export { generateMetadata } from './[page]/head';
import EmotionRegistry from './theme/emotion'; 


const defaultMetadata = {
    title: 'editor',
    description: "Описание для SEO",
    authors: [{ name: "stalk9424", url: "" }],
    creator: "Telegram: @stalk9424",
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico'
    }
}




export default function RootLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <html lang="ru">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </head>
            
            <body>
                <EmotionRegistry>
                    { children }
                </EmotionRegistry>
            </body>
        </html>
    )
}