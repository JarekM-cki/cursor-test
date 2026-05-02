import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { PoligonThemeSync } from './components/system/PoligonThemeSync'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PoligonThemeSync />
    <App />
  </React.StrictMode>,
)
