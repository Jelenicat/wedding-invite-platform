import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  listAll,
  getDownloadURL,
  ref,
  deleteObject,
  getBlob,
} from "firebase/storage";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { storage } from "../firebase";
import demoWedding from "../data/demoWedding";
import "../styles/gallery.css";

function WeddingGallery() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [downloading, setDownloading] = useState(false);

  const wedding = demoWedding.find((item) => item.slug === slug);

  useEffect(() => {
    const isAuthed = sessionStorage.getItem(`gallery-auth-${slug}`);
    if (isAuthed !== "true") {
      navigate(`/${slug}/gallery-login`);
    }
  }, [slug, navigate]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const folderRef = ref(storage, `wedding-uploads/${slug}`);
        const result = await listAll(folderRef);

        const urls = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);

            return {
              id: itemRef.fullPath,
              name: itemRef.name,
              url,
              fullPath: itemRef.fullPath,
            };
          })
        );

        setPhotos(urls.reverse());
      } catch (error) {
        console.error("Greška pri učitavanju slika:", error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [slug]);

  const selectedCount = selectedPhotos.length;

  const allSelected = useMemo(() => {
    return photos.length > 0 && selectedPhotos.length === photos.length;
  }, [photos, selectedPhotos]);

  const isMobileDevice = () => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem(`gallery-auth-${slug}`);
    navigate(`/${slug}/gallery-login`);
  };

  const handleDelete = async (fullPath) => {
    const confirmed = window.confirm("Da li sigurno želite da obrišete ovu sliku?");
    if (!confirmed) return;

    try {
      const fileRef = ref(storage, fullPath);
      await deleteObject(fileRef);

      setPhotos((prev) => prev.filter((photo) => photo.fullPath !== fullPath));
      setSelectedPhotos((prev) => prev.filter((item) => item !== fullPath));
    } catch (error) {
      console.error("Greška pri brisanju slike:", error);
      alert("Brisanje nije uspelo.");
    }
  };

  const togglePhotoSelection = (fullPath) => {
    setSelectedPhotos((prev) =>
      prev.includes(fullPath)
        ? prev.filter((item) => item !== fullPath)
        : [...prev, fullPath]
    );
  };

  const handleSelectAll = () => {
    setSelectedPhotos(photos.map((photo) => photo.fullPath));
  };

  const handleClearSelection = () => {
    setSelectedPhotos([]);
  };

  const downloadSinglePhoto = async (photo, fallbackIndex = 1) => {
    const fileRef = ref(storage, photo.fullPath);
    const blob = await getBlob(fileRef);

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = photo.name || `photo-${fallbackIndex}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);
  };

  const downloadAsZip = async (photosToDownload, zipName) => {
    const zip = new JSZip();

    await Promise.all(
      photosToDownload.map(async (photo, index) => {
        const fileRef = ref(storage, photo.fullPath);
        const blob = await getBlob(fileRef);

        let safeName = photo.name;
        if (!safeName) {
          safeName = `photo-${index + 1}.jpg`;
        }

        zip.file(safeName, blob);
      })
    );

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, zipName);
  };

  const downloadMultipleIndividually = async (photosToDownload) => {
    for (let i = 0; i < photosToDownload.length; i++) {
      await downloadSinglePhoto(photosToDownload[i], i + 1);

      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  };

  const handleSmartDownload = async (photosToDownload, zipName) => {
    if (!photosToDownload.length) return;

    try {
      setDownloading(true);

      if (photosToDownload.length === 1) {
        await downloadSinglePhoto(photosToDownload[0], 1);
        return;
      }

      if (isMobileDevice()) {
        await downloadMultipleIndividually(photosToDownload);
        return;
      }

      await downloadAsZip(photosToDownload, zipName);
    } catch (error) {
      console.error("Greška pri preuzimanju fotografija:", error);
      alert("Došlo je do greške prilikom preuzimanja fotografija.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!photos.length) return;

    await handleSmartDownload(photos, `${slug}-sve-fotografije.zip`);
  };

  const handleDownloadSelected = async () => {
    if (!selectedPhotos.length) {
      alert("Prvo izaberite fotografije koje želite da preuzmete.");
      return;
    }

    const selectedItems = photos.filter((photo) =>
      selectedPhotos.includes(photo.fullPath)
    );

    await handleSmartDownload(selectedItems, `${slug}-izabrane-fotografije.zip`);
  };

  const handleSinglePhotoDownload = async (photo) => {
    try {
      setDownloading(true);
      await downloadSinglePhoto(photo);
    } catch (error) {
      console.error("Greška pri preuzimanju fotografije:", error);
      alert("Došlo je do greške prilikom preuzimanja fotografije.");
    } finally {
      setDownloading(false);
    }
  };

  if (!wedding) {
    return (
      <section className="gallery-collection-page">
        <div className="gallery-collection-inner">
          <h1 className="gallery-collection-title">Galerija nije pronađena</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-collection-page">
      <div className="gallery-collection-inner">
        <div className="gallery-collection-header">
          <div>
            <p className="gallery-auth-kicker">Privatna galerija</p>
            <h1 className="gallery-collection-title">
              {wedding.brideName}
              {wedding.groomName ? ` & ${wedding.groomName}` : ""}
            </h1>
            <p className="gallery-collection-text">
              Sve fotografije koje su gosti poslali na jednom mestu.
            </p>
          </div>

          <button onClick={handleLogout} className="gallery-secondary-button">
            Izloguj se
          </button>
        </div>

        {loading ? (
          <p className="gallery-collection-empty">Učitavanje fotografija...</p>
        ) : photos.length === 0 ? (
          <p className="gallery-collection-empty">Još nema dodatih fotografija.</p>
        ) : (
          <>
            <div className="gallery-toolbar">
              <div className="gallery-toolbar-left">
                <p className="gallery-selection-text">
                  Izabrano: <strong>{selectedCount}</strong> / {photos.length}
                </p>
              </div>

              <div className="gallery-toolbar-actions">
                <button
                  type="button"
                  className="gallery-toolbar-button"
                  onClick={handleSelectAll}
                  disabled={allSelected}
                >
                  Selektuj sve
                </button>

                <button
                  type="button"
                  className="gallery-toolbar-button"
                  onClick={handleClearSelection}
                  disabled={selectedCount === 0}
                >
                  Poništi izbor
                </button>

                <button
                  type="button"
                  className="gallery-toolbar-button gallery-toolbar-button-dark"
                  onClick={handleDownloadSelected}
                  disabled={selectedCount === 0 || downloading}
                >
                  {downloading ? "Preuzimanje..." : "Preuzmi izabrane"}
                </button>

                <button
                  type="button"
                  className="gallery-toolbar-button gallery-toolbar-button-dark"
                  onClick={handleDownloadAll}
                  disabled={!photos.length || downloading}
                >
                  {downloading ? "Preuzimanje..." : "Preuzmi sve"}
                </button>
              </div>
            </div>

            <div className="gallery-collection-grid">
              {photos.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.fullPath);

                return (
                  <div
                    key={photo.fullPath}
                    className={`gallery-photo-card ${
                      isSelected ? "gallery-photo-card-selected" : ""
                    }`}
                  >
                    <div className="gallery-photo-frame">
                      <button
                        type="button"
                        className={`gallery-select-badge ${
                          isSelected ? "gallery-select-badge-active" : ""
                        }`}
                        onClick={() => togglePhotoSelection(photo.fullPath)}
                      >
                        {isSelected ? "✓" : ""}
                      </button>

                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="gallery-photo-image"
                      />
                    </div>

                    <div className="gallery-photo-actions">
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="gallery-action-link"
                      >
                        Otvori
                      </a>

                      <button
                        type="button"
                        onClick={() => handleSinglePhotoDownload(photo)}
                        className="gallery-action-link"
                      >
                        Preuzmi
                      </button>

                      <button
                        onClick={() => handleDelete(photo.fullPath)}
                        className="gallery-delete-button"
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default WeddingGallery;