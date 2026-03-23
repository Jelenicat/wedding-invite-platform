import { Routes, Route } from "react-router-dom";
import WeddingPage from "./pages/WeddingPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import SeatingPage from "./pages/SeatingPage";import { useNavigate, useParams } from "react-router-dom";

function App() {
  return (
   <Routes>
  <Route path="/admin/:slug" element={<AdminPage />} />
  <Route path="/:slug" element={<WeddingPage />} />
  <Route path="*" element={<NotFoundPage />} />
  <Route path="/admin/:slug/seating" element={<SeatingPage />} />
</Routes>
  );
}

export default App;