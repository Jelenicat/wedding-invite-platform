import { Routes, Route } from "react-router-dom";
import WeddingPage from "./pages/WeddingPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import SeatingPage from "./pages/SeatingPage";

// 👇 DODAJ OVO
import GalleryLogin from "./pages/GalleryLogin";
import WeddingGallery from "./pages/WeddingGallery";
import WeddingUpload from "./pages/WeddingUpload";

function App() {
  return (
    <Routes>
      {/* ADMIN */}
      <Route path="/admin/:slug" element={<AdminPage />} />
      <Route path="/admin/:slug/seating" element={<SeatingPage />} />

      {/* 👇 NOVO – GALLERY */}
      <Route path="/:slug/upload" element={<WeddingUpload />} />
      <Route path="/:slug/gallery-login" element={<GalleryLogin />} />
      <Route path="/:slug/gallery" element={<WeddingGallery />} />

      {/* POSTOJEĆE */}
      <Route path="/:slug" element={<WeddingPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;