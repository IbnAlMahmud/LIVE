import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthProvider } from '@/contexts/AuthContext';

import About from '@/pages/public/About';
import Contact from '@/pages/public/Contact';
import Process from '@/pages/public/Process';
import Solutions from '@/pages/public/Solutions';
import Insights from '@/pages/public/Insights';
import FAQPublic from '@/pages/public/FAQPublic';
import Legal from '@/pages/public/Legal';
import Home from '@/pages/public/Home';
import DemosPublic from '@/pages/public/Demos';
import DemoDetail from '@/pages/public/DemoDetail';
import StartProject from '@/pages/public/StartProject';
import Work from '@/pages/public/Work';
import ServicesPublic from '@/pages/public/Services';
import PricingPublic from '@/pages/public/Pricing';

import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import Leads from '@/pages/admin/Leads';
import Projects from '@/pages/admin/Projects';
import DemosAdmin from '@/pages/admin/Demos';
import Settings from '@/pages/admin/Settings';

import Analytics from '@/pages/admin/Analytics';
import Notifications from '@/pages/admin/Notifications';
import Media from '@/pages/admin/Media';
import Blog from '@/pages/admin/Blog';
import FAQ from '@/pages/admin/FAQ';
import Testimonials from '@/pages/admin/Testimonials';
import PricingAdmin from '@/pages/admin/Pricing';
import ServicesAdmin from '@/pages/admin/Services';
import Homepage from '@/pages/admin/Homepage';
import Navigation from '@/pages/admin/Navigation';
import SEO from '@/pages/admin/SEO';
import Pixel from '@/pages/admin/Pixel';
import System from '@/pages/admin/System';

import { MetaPixel } from '@/components/analytics/MetaPixel';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MetaPixel />
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/demos" element={<DemosPublic />} />
            <Route path="/services" element={<ServicesPublic />} />
            <Route path="/pricing" element={<PricingPublic />} />
            <Route path="/start-project" element={<StartProject />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/process" element={<Process />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/faq" element={<FAQPublic />} />
            <Route path="/privacy" element={<Legal page="privacy" />} />
            <Route path="/terms" element={<Legal page="terms" />} />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
          
          {/* Demo Detail without MainLayout (so it can be full screen) */}
          <Route path="/demos/:slug" element={<DemoDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            
            <Route path="projects" element={<Projects />} />
            <Route path="demos" element={<DemosAdmin />} />
            <Route path="media" element={<Media />} />
            <Route path="blog" element={<Blog />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="testimonials" element={<Testimonials />} />
            
            <Route path="leads" element={<Leads />} />
            <Route path="pricing" element={<PricingAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            
            <Route path="homepage" element={<Homepage />} />
            <Route path="navigation" element={<Navigation />} />
            
            <Route path="settings" element={<Settings />} />
            <Route path="seo" element={<SEO />} />
            <Route path="pixel" element={<Pixel />} />
            <Route path="system" element={<System />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
