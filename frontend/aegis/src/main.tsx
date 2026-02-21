import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AccessibilityProvider }  from './accessibility/AccessibilityContext'
import App from './App'
import './index.css'
import { LanguageProvider } from './i18/LanguageContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <AccessibilityProvider>
                    <App />
                </AccessibilityProvider>
            </LanguageProvider>
        </BrowserRouter>
    </StrictMode>
)