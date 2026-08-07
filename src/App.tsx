import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PlaceDetails from './pages/PlaceDetails';
import Districts from './pages/Districts';
import DistrictDetails from './pages/DistrictDetails';
import History from './pages/History';
import Culture from './pages/Culture';
import TravelGuide from './pages/TravelGuide';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Gallery from './pages/Gallery';
import Rivers from './pages/Rivers';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import { AuthProvider } from './context/AuthContext';
import GuestPreviewWrapper from './components/GuestPreviewWrapper';
import { RequireAuth, RequireAdmin } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Itinerary from './pages/Itinerary';
import AdminLayout from './pages/admin/AdminLayout';
import AdminHomeManager from './pages/admin/AdminHomeManager';
import AdminSectionPage from './pages/admin/AdminSectionPage';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNewsletter from './pages/admin/AdminNewsletter';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<GuestPreviewWrapper><Home /></GuestPreviewWrapper>} />
            <Route path="explore" element={<GuestPreviewWrapper><Explore /></GuestPreviewWrapper>} />
            <Route path="explore/:slug" element={<GuestPreviewWrapper><PlaceDetails /></GuestPreviewWrapper>} />
            <Route path="districts" element={<GuestPreviewWrapper><Districts /></GuestPreviewWrapper>} />
            <Route path="districts/:slug" element={<GuestPreviewWrapper><DistrictDetails /></GuestPreviewWrapper>} />
            <Route path="history" element={<GuestPreviewWrapper><History /></GuestPreviewWrapper>} />
            <Route path="culture" element={<GuestPreviewWrapper><Culture /></GuestPreviewWrapper>} />
            <Route path="guide" element={<GuestPreviewWrapper><TravelGuide /></GuestPreviewWrapper>} />
            <Route path="blog" element={<GuestPreviewWrapper><Blog /></GuestPreviewWrapper>} />
            <Route path="blog/:id" element={<GuestPreviewWrapper><BlogDetails /></GuestPreviewWrapper>} />
            <Route path="gallery" element={<GuestPreviewWrapper><Gallery /></GuestPreviewWrapper>} />
            <Route path="rivers" element={<GuestPreviewWrapper><Rivers /></GuestPreviewWrapper>} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />

            {/* Auth */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="itinerary" element={<Itinerary />} />

            {/* Admin (feature #1 / #5: same login, promoted via backend script,
                everything editable from one panel) */}
            <Route path="admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminHomeManager />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path=":sectionKey" element={<AdminSectionPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App
