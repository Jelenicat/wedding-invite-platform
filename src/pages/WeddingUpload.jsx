import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import demoWedding from "../data/demoWedding";
import "../styles/gallery.css";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function WeddingUpload() {
  const { slug } = useParams();
  const wedding = demoWedding.find((item) => item.slug === slug);
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const previewUrls = useMemo(() => {
    return files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  const validateFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles || []);

    if (fileArray.length === 0) {
      return "Izaberite bar jednu fotografiju.";
    }

    if (fileArray.length > MAX_FILES) {
      return "Možete poslati najviše 10 slika odjednom.";
    }

    for (const file of fileArray) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return "Dozvoljene su samo JPG, PNG i WEBP slike.";
      }

      if (file.size > MAX_FILE_SIZE) {
        return "Jedna ili više slika prelazi 8 MB.";
      }
    }

    return "";
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    setError("");
    setSuccess(false);

    const selectedFiles = e.target.files;
    const validationError = validateFiles(selectedFiles);

    if (validationError) {
      setError(validationError);
      setFiles([]);
      return;
    }

    setFiles(Array.from(selectedFiles));
  };

  const handleUpload = async () => {
    setError("");
    setSuccess(false);

    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setUploading(true);

      for (const file of files) {
        const uniqueName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${file.name}`;

        const storageRef = ref(storage, `wedding-uploads/${slug}/${uniqueName}`);
        await uploadBytes(storageRef, file);
      }

      setSuccess(true);
      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Greška pri upload-u:", err);
      setError("Došlo je do greške prilikom slanja fotografija.");
    } finally {
      setUploading(false);
    }
  };

  if (!wedding) {
    return (
      <section className="upload-page">
        <div className="upload-shell">
          <h1 className="upload-hero-title">Stranica nije pronađena</h1>
        </div>
      </section>
    );
  }

  const coverImage =
    wedding.uploadCoverImage || "/images/upload/default-upload-cover.jpg";

  return (
    <section className="upload-page">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="upload-hidden-input"
      />

      <div className="upload-shell">
        <div className="upload-hero-card">
          <div className="upload-hero-image-wrap">
            <img
              src={coverImage}
              alt={`${wedding.brideName} ${wedding.groomName || ""}`}
              className="upload-hero-image"
            />
            <div className="upload-hero-image-overlay" />
          </div>

          <div className="upload-hero-content">
            <p className="upload-hero-kicker">
              {wedding.brideName}
              {wedding.groomName ? ` & ${wedding.groomName}` : ""}
            </p>

            <div className="upload-hero-divider" />

            <h1 className="upload-hero-title">
              Podelite trenutke koje su mladenci propustili
            </h1>

            <p className="upload-hero-subtitle">
              Dodajte fotografije direktno mladencima.
            </p>

            <button
              type="button"
              className="upload-choose-button"
              onClick={handleChooseFiles}
            >
              Izaberite fotografije
            </button>

            <p className="upload-hero-meta">
              Do 10 slika • JPG, PNG, WEBP • maksimalno 8 MB po slici
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="upload-selected-panel">
            <div className="upload-selected-header">
              <p className="upload-selected-title">Izabrane fotografije</p>
              <span className="upload-selected-count">
                {files.length} / {MAX_FILES}
              </span>
            </div>

            <div className="upload-selected-grid">
              {previewUrls.map((item) => (
                <div key={item.name} className="upload-selected-item">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="upload-selected-image"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="upload-submit-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Slanje..." : "Pošalji fotografije"}
            </button>
          </div>
        )}

        {error ? <p className="upload-error-text">{error}</p> : null}

     {success ? (
  <div className="upload-success-card">
    <div className="upload-success-icon">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 7L9 18L4 13"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <div>
      <p className="upload-success-title">Fotografije su uspešno uploadovane</p>
      <p className="upload-success-description">
        Hvala vam što ste podelili uspomene sa ovog posebnog dana.
      </p>
    </div>
  </div>
) : null}
      </div>
    </section>
  );
}

export default WeddingUpload;