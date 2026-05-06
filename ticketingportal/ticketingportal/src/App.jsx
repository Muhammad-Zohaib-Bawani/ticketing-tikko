import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Discover from './pages/Discover.jsx';
import Browse from './pages/Browse.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import Tickets from './pages/Tickets.jsx';
import Organizer from './pages/Organizer.jsx';
import Confirmation from './pages/Confirmation.jsx';
import Trending from './pages/Trending.jsx';
import News from './pages/News.jsx';
import Venues from './pages/Venues.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import TopProgressBar from './components/TopProgressBar.jsx';
import './App.css';

function App() {
  return (
    <>
      <TopProgressBar />
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/news" element={<News />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/browse/:category" element={<Browse />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/checkout/:id" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/tickets" element={<RequireAuth><Tickets /></RequireAuth>} />
          <Route path="/organizer" element={<Organizer />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
