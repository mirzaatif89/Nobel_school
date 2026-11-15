import React from 'react';
import { createRoot } from 'react-dom/client';
import { Route } from './routes/index';
import { SiteHeader } from './components/site/SiteHeader';
import { SiteFooter } from './components/site/SiteFooter';
import { WhatsAppButton } from './components/site/WhatsAppButton';
import './styles.css';

const Home = Route.component;
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SiteHeader />
    <main id="main"><Home /></main>
    <SiteFooter />
    <WhatsAppButton />
  </React.StrictMode>
);
