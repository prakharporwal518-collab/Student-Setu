import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProviders } from './context/AppContext'
import { DataProvider } from './context/DataContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <DataProvider>
          <App />
        </DataProvider>
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
)
