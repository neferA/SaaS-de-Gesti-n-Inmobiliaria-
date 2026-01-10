import { createRoot } from 'react-dom/client'
import './modules/core/styles/index.css'
import App from './modules/core/components/app'

createRoot(document.getElementById('root')!).render(
    <App />
)
