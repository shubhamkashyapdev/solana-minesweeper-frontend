import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import "./index.css"
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <React.StrictMode>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={{colorScheme:"dark"}}>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </MantineProvider>
    </React.StrictMode>
  </Router>
)
