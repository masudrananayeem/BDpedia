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
import Gallery from './pages/Gallery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="explore/:slug" element={<PlaceDetails />} />
          <Route path="districts" element={<Districts />} />
          <Route path="districts/:slug" element={<DistrictDetails />} />
          <Route path="history" element={<History />} />
          <Route path="culture" element={<Culture />} />
          <Route path="guide" element={<TravelGuide />} />
          <Route path="blog" element={<Blog />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App