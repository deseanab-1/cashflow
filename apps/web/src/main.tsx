import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { App as AntdApp } from 'antd';
import App from './App.tsx'
import { Auth0Provider } from "@auth0/auth0-react";
import './index.css'


function Auth0ProviderWithRedirectCallback({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || '/dashboard');
  };

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback>
        <AntdApp>
          <App />
        </AntdApp>
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
  </StrictMode>,
)