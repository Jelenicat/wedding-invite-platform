import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import galleryAccess from "../data/galleryAccess";
import demoWedding from "../data/demoWedding";
import "../styles/gallery.css";

function GalleryLogin() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const wedding = demoWedding.find((item) => item.slug === slug);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!galleryAccess[slug]) {
      setError("Galerija za ovaj par ne postoji.");
      return;
    }

    if (galleryAccess[slug] !== password) {
      setError("Pogrešna šifra.");
      return;
    }

    sessionStorage.setItem(`gallery-auth-${slug}`, "true");
    navigate(`/${slug}/gallery`);
  };

  if (!wedding) {
    return (
      <section className="gallery-page-shell">
        <div className="gallery-glow gallery-glow-one" />
        <div className="gallery-glow gallery-glow-two" />

        <div className="gallery-auth-card">
          <p className="gallery-auth-kicker">Privatna galerija</p>
          <h1 className="gallery-auth-title">Galerija nije pronađena</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-page-shell">
      <div className="gallery-glow gallery-glow-one" />
      <div className="gallery-glow gallery-glow-two" />

      <div className="gallery-auth-card">
        <p className="gallery-auth-kicker">Privatna galerija</p>

        <h1 className="gallery-auth-title">
          {wedding.brideName}
          {wedding.groomName ? ` & ${wedding.groomName}` : ""}
        </h1>

        <p className="gallery-auth-text">
          Unesite šifru kako biste otvorili galeriju fotografija sa vašeg dana.
        </p>

        <form onSubmit={handleSubmit} className="gallery-auth-form">
          <input
            type="password"
            placeholder="Unesite šifru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="gallery-auth-input"
          />

          <button type="submit" className="gallery-main-button">
            Uloguj se
          </button>
        </form>

        {error ? <p className="gallery-error-text">{error}</p> : null}
      </div>
    </section>
  );
}

export default GalleryLogin;