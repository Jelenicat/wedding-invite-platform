import { Routes, Route } from "react-router-dom";
import WeddingPage from "./pages/WeddingPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/:slug" element={<WeddingPage />} />
      <Route path="/admin/:slug" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;