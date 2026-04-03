import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  listAll,
  getDownloadURL,
  ref,
  deleteObject,
  getBlob,
  getMetadata,
} from "firebase/storage";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { storage } from "../firebase";
import demoWedding from "../data/demoWedding";
import "../styles/gallery.css";

const PAGE_SIZE = 24;

function formatPhotoDate(dateString) {
  if (!dateString) return "Bez datuma";

  try {
    return new Intl.DateTimeFormat("sr-RS", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch {
    return "Bez datuma";
  }
}

function formatPhotoDayLabel(dateString) {
  if (!dateString) return "Bez datuma";

  try {
    return new Intl.DateTimeFormat("sr-RS", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return "Bez datuma";
  }
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2600);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`gallery-toast gallery-toast-${toast.type || "info"}`}>
      <div className="gallery-toast-content">
        <strong>{toast.title}</strong>
        {toast.message ? <span>{toast.message}</span> : null}
      </div>

      <button
        type="button"
        className="gallery-toast-close"
        onClick={onClose}
        aria-label="Zatvori obaveštenje"
      >
        ×
      </button>
    </div>
  );
}

function DeleteModal({
  open,
  photoName,
  deleting,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="gallery-modal-backdrop" onClick={onCancel}>
      <div
        className="gallery-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="gallery-modal-kicker">Brisanje fotografije</p>
        <h3 className="gallery-modal-title">Da li ste sigurni?</h3>
        <p className="gallery-modal-text">
          Ova fotografija će biti obrisana iz galerije.
          {photoName ? (
            <>
              <br />
              <strong>{photoName}</strong>
            </>
          ) : null}
        </p>

        <div className="gallery-modal-actions">
          <button
            type="button"
            className="gallery-toolbar-button"
            onClick={onCancel}
            disabled={deleting}
          >
            Otkaži
          </button>

          <button
            type="button"
            className="gallery-toolbar-button gallery-delete-button"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Brišem..." : "Obriši"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Lightbox({
  open,
  photo,
  canGoPrev,
  canGoNext,
  onClose,
  onPrev,
  onNext,
  onDownload,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && canGoPrev) onPrev();
      if (e.key === "ArrowRight" && canGoNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, onPrev, onNext, canGoPrev, canGoNext]);

  if (!open || !photo) return null;

  return (
    <div className="gallery-lightbox-backdrop" onClick={onClose}>
      <div
        className="gallery-lightbox-shell"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="gallery-lightbox-close"
          onClick={onClose}
          aria-label="Zatvori pregled"
        >
          ×
        </button>

        {canGoPrev ? (
          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-nav-left"
            onClick={onPrev}
            aria-label="Prethodna fotografija"
          >
            ‹
          </button>
        ) : null}

        {canGoNext ? (
          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-nav-right"
            onClick={onNext}
            aria-label="Sledeća fotografija"
          >
            ›
          </button>
        ) : null}

        <div className="gallery-lightbox-image-wrap">
          <img
            src={photo.url}
            alt={photo.name}
            className="gallery-lightbox-image"
          />
        </div>

        <div className="gallery-lightbox-footer">
          <div className="gallery-lightbox-meta">
            <strong>{photo.name || "Fotografija"}</strong>
            <span>{formatPhotoDate(photo.timeCreated)}</span>
          </div>

          <div className="gallery-lightbox-actions">
            <a
              href={photo.url}
              target="_blank"
              rel="noreferrer"
              className="gallery-action-link"
            >
              Otvori u novom tabu
            </a>

            <button
              type="button"
              className="gallery-action-link"
              onClick={() => onDownload(photo)}
            >
              Preuzmi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="gallery-collection-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="gallery-photo-card gallery-photo-card-skeleton">
          <div className="gallery-photo-frame gallery-skeleton-block" />
          <div className="gallery-photo-actions">
            <span className="gallery-skeleton-line" />
            <span className="gallery-skeleton-line" />
            <span className="gallery-skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryPhotoCard({
  photo,
  isSelected,
  isDeleting,
  isSingleDownloading,
  bulkDownloading,
  onToggleSelect,
  onOpenLightbox,
  onDownload,
  onDelete,
  onImageError,
}) {
  return (
    <div
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
          onClick={() => onToggleSelect(photo.fullPath)}
          disabled={isDeleting || bulkDownloading}
          aria-label={
            isSelected
              ? "Ukloni fotografiju iz izbora"
              : "Dodaj fotografiju u izbor"
          }
        >
          {isSelected ? "✓" : ""}
        </button>

        {photo.failed ? (
          <div className="gallery-photo-fallback">
            Fotografija nije mogla da se učita
          </div>
        ) : (
          <button
            type="button"
            className="gallery-photo-preview-button"
            onClick={() => onOpenLightbox(photo.fullPath)}
            aria-label="Otvori fotografiju"
          >
            <img
              src={photo.url}
              alt={photo.name}
              className="gallery-photo-image"
              loading="lazy"
              decoding="async"
              onError={() => onImageError(photo.fullPath)}
            />
          </button>
        )}
      </div>

      <div className="gallery-photo-meta">
        <strong className="gallery-photo-name">{photo.name || "Fotografija"}</strong>
        <span className="gallery-photo-date">
          {formatPhotoDate(photo.timeCreated)}
        </span>
      </div>

      <div className="gallery-photo-actions">
        <button
          type="button"
          onClick={() => onOpenLightbox(photo.fullPath)}
          className="gallery-action-link"
        >
          Pregled
        </button>

        <button
          type="button"
          onClick={() => onDownload(photo)}
          className="gallery-action-link"
          disabled={isSingleDownloading || isDeleting || bulkDownloading}
        >
          {isSingleDownloading ? "Preuzimam..." : "Preuzmi"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(photo)}
          className="gallery-delete-button"
          disabled={isDeleting || bulkDownloading}
        >
          {isDeleting ? "Brišem..." : "Obriši"}
        </button>
      </div>
    </div>
  );
}

function WeddingGallery() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [singleDownloadingId, setSingleDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sortBy, setSortBy] = useState("newest");
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const wedding = demoWedding.find((item) => item.slug === slug);
  const galleryTopRef = useRef(null);

  const showToast = useCallback((type, title, message = "") => {
    setToast({ type, title, message });
  }, []);

  useEffect(() => {
    const isAuthed = sessionStorage.getItem(`gallery-auth-${slug}`);
    if (isAuthed !== "true") {
      navigate(`/${slug}/gallery-login`);
    }
  }, [slug, navigate]);

  useEffect(() => {
    let isMounted = true;

    const fetchPhotos = async () => {
      try {
        setLoading(true);

        const folderRef = ref(storage, `wedding-uploads/${slug}`);
        const result = await listAll(folderRef);

        const items = await Promise.all(
          result.items.map(async (itemRef) => {
            const [url, metadata] = await Promise.all([
              getDownloadURL(itemRef),
              getMetadata(itemRef).catch(() => null),
            ]);

            return {
              id: itemRef.fullPath,
              name: itemRef.name,
              url,
              fullPath: itemRef.fullPath,
              failed: false,
              timeCreated: metadata?.timeCreated || null,
              updated: metadata?.updated || null,
              contentType: metadata?.contentType || "",
            };
          })
        );

        if (isMounted) {
          setPhotos(items);
        }
      } catch (error) {
        console.error("Greška pri učitavanju slika:", error);
        if (isMounted) {
          setPhotos([]);
          showToast("error", "Greška", "Fotografije nisu mogle da se učitaju.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPhotos();

    return () => {
      isMounted = false;
    };
  }, [slug, showToast]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, sortBy]);

  const sortedPhotos = useMemo(() => {
    const items = [...photos];

    items.sort((a, b) => {
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "", "sr");
      }

      if (sortBy === "name-desc") {
        return (b.name || "").localeCompare(a.name || "", "sr");
      }

      const aTime = a.timeCreated ? new Date(a.timeCreated).getTime() : 0;
      const bTime = b.timeCreated ? new Date(b.timeCreated).getTime() : 0;

      if (sortBy === "oldest") {
        return aTime - bTime;
      }

      return bTime - aTime;
    });

    return items;
  }, [photos, sortBy]);

  const filteredPhotos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return sortedPhotos;

    return sortedPhotos.filter((photo) => {
      const fileName = (photo.name || "").toLowerCase();
      const dateLabel = formatPhotoDayLabel(photo.timeCreated).toLowerCase();
      return fileName.includes(term) || dateLabel.includes(term);
    });
  }, [sortedPhotos, searchTerm]);

  const visiblePhotos = useMemo(() => {
    return filteredPhotos.slice(0, visibleCount);
  }, [filteredPhotos, visibleCount]);

  const hasMore = visibleCount < filteredPhotos.length;
  const selectedCount = selectedPhotos.size;

  const visibleSelectedCount = useMemo(() => {
    return visiblePhotos.filter((photo) => selectedPhotos.has(photo.fullPath)).length;
  }, [visiblePhotos, selectedPhotos]);

  const allVisibleSelected = useMemo(() => {
    return (
      visiblePhotos.length > 0 &&
      visiblePhotos.every((photo) => selectedPhotos.has(photo.fullPath))
    );
  }, [visiblePhotos, selectedPhotos]);

  const groupedVisiblePhotos = useMemo(() => {
    const groups = [];

    visiblePhotos.forEach((photo) => {
      const label = formatPhotoDayLabel(photo.timeCreated);
      const lastGroup = groups[groups.length - 1];

      if (!lastGroup || lastGroup.label !== label) {
        groups.push({ label, items: [photo] });
      } else {
        lastGroup.items.push(photo);
      }
    });

    return groups;
  }, [visiblePhotos]);

  const lightboxPhoto = useMemo(() => {
    if (lightboxIndex === null) return null;
    return filteredPhotos[lightboxIndex] || null;
  }, [lightboxIndex, filteredPhotos]);

  const isMobileDevice = useCallback(() => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(`gallery-auth-${slug}`);
    navigate(`/${slug}/gallery-login`);
  }, [navigate, slug]);

  const openDeleteModal = useCallback((photo) => {
    setDeleteTarget(photo);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (deletingId) return;
    setDeleteTarget(null);
  }, [deletingId]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget.fullPath);

      const fileRef = ref(storage, deleteTarget.fullPath);
      await deleteObject(fileRef);

      setPhotos((prev) =>
        prev.filter((photo) => photo.fullPath !== deleteTarget.fullPath)
      );

      setSelectedPhotos((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.fullPath);
        return next;
      });

      showToast("success", "Fotografija obrisana");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Greška pri brisanju slike:", error);
      showToast("error", "Greška", "Brisanje nije uspelo.");
    } finally {
      setDeletingId(null);
    }
  }, [deleteTarget, showToast]);

  const togglePhotoSelection = useCallback((fullPath) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);

      if (next.has(fullPath)) {
        next.delete(fullPath);
      } else {
        next.add(fullPath);
      }

      return next;
    });
  }, []);

  const handleSelectAllVisible = useCallback(() => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      visiblePhotos.forEach((photo) => next.add(photo.fullPath));
      return next;
    });
  }, [visiblePhotos]);

  const handleClearSelection = useCallback(() => {
    setSelectedPhotos(new Set());
  }, []);

  const handleClearVisibleSelection = useCallback(() => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      visiblePhotos.forEach((photo) => next.delete(photo.fullPath));
      return next;
    });
  }, [visiblePhotos]);

  const downloadSinglePhoto = useCallback(async (photo, fallbackIndex = 1) => {
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
    }, 1800);
  }, []);

  const downloadAsZip = useCallback(async (photosToDownload, zipName) => {
    const zip = new JSZip();

    await Promise.all(
      photosToDownload.map(async (photo, index) => {
        const fileRef = ref(storage, photo.fullPath);
        const blob = await getBlob(fileRef);
        const safeName = photo.name || `photo-${index + 1}.jpg`;
        zip.file(safeName, blob);
      })
    );

    const content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    saveAs(content, zipName);
  }, []);

  const downloadMultipleIndividually = useCallback(
    async (photosToDownload) => {
      for (let i = 0; i < photosToDownload.length; i++) {
        await downloadSinglePhoto(photosToDownload[i], i + 1);
        await new Promise((resolve) => setTimeout(resolve, 650));
      }
    },
    [downloadSinglePhoto]
  );

  const handleSmartDownload = useCallback(
    async (photosToDownload, zipName) => {
      if (!photosToDownload.length) return;

      try {
        setBulkDownloading(true);

        if (photosToDownload.length === 1) {
          await downloadSinglePhoto(photosToDownload[0], 1);
          showToast("success", "Preuzimanje je počelo");
          return;
        }

        if (isMobileDevice()) {
          await downloadMultipleIndividually(photosToDownload);
          showToast(
            "success",
            "Preuzimanje je pokrenuto",
            "Na telefonu se fotografije preuzimaju pojedinačno."
          );
          return;
        }

        await downloadAsZip(photosToDownload, zipName);
        showToast(
          "success",
          "Fotografije su pripremljene",
          `${photosToDownload.length} fotografija je preuzeto.`
        );
      } catch (error) {
        console.error("Greška pri preuzimanju fotografija:", error);
        showToast("error", "Greška", "Došlo je do greške prilikom preuzimanja.");
      } finally {
        setBulkDownloading(false);
      }
    },
    [
      downloadAsZip,
      downloadMultipleIndividually,
      downloadSinglePhoto,
      isMobileDevice,
      showToast,
    ]
  );

  const handleDownloadAll = useCallback(async () => {
    if (!filteredPhotos.length) return;
    await handleSmartDownload(filteredPhotos, `${slug}-sve-fotografije.zip`);
  }, [filteredPhotos, slug, handleSmartDownload]);

  const handleDownloadSelected = useCallback(async () => {
    if (!selectedPhotos.size) {
      showToast(
        "info",
        "Niste izabrali fotografije",
        "Prvo označite fotografije koje želite da preuzmete."
      );
      return;
    }

    const selectedItems = filteredPhotos.filter((photo) =>
      selectedPhotos.has(photo.fullPath)
    );

    await handleSmartDownload(
      selectedItems,
      `${slug}-izabrane-fotografije.zip`
    );
  }, [filteredPhotos, selectedPhotos, slug, handleSmartDownload, showToast]);

  const handleSinglePhotoDownload = useCallback(
    async (photo) => {
      try {
        setSingleDownloadingId(photo.fullPath);
        await downloadSinglePhoto(photo);
        showToast("success", "Preuzimanje je počelo");
      } catch (error) {
        console.error("Greška pri preuzimanju fotografije:", error);
        showToast("error", "Greška", "Fotografija nije mogla da se preuzme.");
      } finally {
        setSingleDownloadingId(null);
      }
    },
    [downloadSinglePhoto, showToast]
  );

  const handleImageError = useCallback((fullPath) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.fullPath === fullPath ? { ...photo, failed: true } : photo
      )
    );
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
    setTimeout(() => {
      galleryTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }, []);

  const openLightbox = useCallback(
    (fullPath) => {
      const index = filteredPhotos.findIndex(
        (photo) => photo.fullPath === fullPath
      );

      if (index !== -1) {
        setLightboxIndex(index);
      }
    },
    [filteredPhotos]
  );

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrevLightbox = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || prev <= 0) return prev;
      return prev - 1;
    });
  }, []);

  const goNextLightbox = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || prev >= filteredPhotos.length - 1) return prev;
      return prev + 1;
    });
  }, [filteredPhotos.length]);

  if (!wedding) {
    return (
      <section className="gallery-collection-page">
        <div className="gallery-collection-inner">
          <div className="gallery-empty-state">
            <h1 className="gallery-collection-title">Galerija nije pronađena</h1>
            <p className="gallery-collection-empty">
              Ovaj link nije povezan ni sa jednom galerijom.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-collection-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <DeleteModal
        open={!!deleteTarget}
        photoName={deleteTarget?.name}
        deleting={!!deletingId}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <Lightbox
        open={lightboxIndex !== null}
        photo={lightboxPhoto}
        canGoPrev={lightboxIndex > 0}
        canGoNext={
          lightboxIndex !== null && lightboxIndex < filteredPhotos.length - 1
        }
        onClose={closeLightbox}
        onPrev={goPrevLightbox}
        onNext={goNextLightbox}
        onDownload={handleSinglePhotoDownload}
      />

      <div className="gallery-collection-inner" ref={galleryTopRef}>
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

          <button
            onClick={handleLogout}
            className="gallery-secondary-button"
            disabled={bulkDownloading}
          >
            Izloguj se
          </button>
        </div>

        {loading ? (
          <>
            <div className="gallery-toolbar gallery-toolbar-loading">
              <div className="gallery-toolbar-left">
                <div className="gallery-skeleton-line wide" />
                <div className="gallery-skeleton-input" />
              </div>
              <div className="gallery-toolbar-actions">
                <div className="gallery-skeleton-button" />
                <div className="gallery-skeleton-button" />
                <div className="gallery-skeleton-button" />
              </div>
            </div>
            <SkeletonGrid />
          </>
        ) : photos.length === 0 ? (
          <div className="gallery-empty-state">
            <h2 className="gallery-empty-title">Još nema dodatih fotografija</h2>
            <p className="gallery-collection-empty">
              Kada gosti pošalju fotografije, ovde će se odmah prikazati.
            </p>
          </div>
        ) : (
          <>
            <div className="gallery-toolbar">
              <div className="gallery-toolbar-left">
                <p className="gallery-selection-text">
                  Izabrano: <strong>{selectedCount}</strong> / {photos.length}
                </p>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pretraži po nazivu ili datumu..."
                  className="gallery-search-input"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="gallery-sort-select"
                >
                  <option value="newest">Najnovije prvo</option>
                  <option value="oldest">Najstarije prvo</option>
                  <option value="name-asc">Naziv A–Š</option>
                  <option value="name-desc">Naziv Š–A</option>
                </select>
              </div>

              <div className="gallery-toolbar-actions">
                <button
                  type="button"
                  className="gallery-toolbar-button"
                  onClick={handleSelectAllVisible}
                  disabled={!visiblePhotos.length || allVisibleSelected}
                >
                  Selektuj prikazane
                </button>

                <button
                  type="button"
                  className="gallery-toolbar-button"
                  onClick={handleClearVisibleSelection}
                  disabled={visibleSelectedCount === 0}
                >
                  Poništi prikazane
                </button>

                <button
                  type="button"
                  className="gallery-toolbar-button"
                  onClick={handleClearSelection}
                  disabled={selectedCount === 0}
                >
                  Poništi sve
                </button>

                <button
                  type="button"
                  className="gallery-toolbar-button gallery-toolbar-button-dark"
                  onClick={handleDownloadSelected}
                  disabled={selectedCount === 0 || bulkDownloading}
                >
                  {bulkDownloading ? "Preuzimanje..." : "Preuzmi izabrane"}
                </button>

                <button
                  type="button"
                  className="gallery-toolbar-button gallery-toolbar-button-dark"
                  onClick={handleDownloadAll}
                  disabled={!filteredPhotos.length || bulkDownloading}
                >
                  {bulkDownloading ? "Preuzimanje..." : "Preuzmi sve prikazane"}
                </button>
              </div>
            </div>

            {!filteredPhotos.length ? (
              <div className="gallery-empty-state">
                <h2 className="gallery-empty-title">Nema rezultata</h2>
                <p className="gallery-collection-empty">
                  Nijedna fotografija ne odgovara ovoj pretrazi.
                </p>
                <button
                  type="button"
                  className="gallery-toolbar-button"
                  onClick={() => setSearchTerm("")}
                >
                  Očisti pretragu
                </button>
              </div>
            ) : (
              <>
                {groupedVisiblePhotos.map((group) => (
                  <div key={group.label} className="gallery-group">
                    <div className="gallery-group-header">
                      <h3 className="gallery-group-title">{group.label}</h3>
                      <span className="gallery-group-count">
                        {group.items.length} fotografija
                      </span>
                    </div>

                    <div className="gallery-collection-grid">
                      {group.items.map((photo) => {
                        const isSelected = selectedPhotos.has(photo.fullPath);
                        const isDeleting = deletingId === photo.fullPath;
                        const isSingleDownloading =
                          singleDownloadingId === photo.fullPath;

                        return (
                          <GalleryPhotoCard
                            key={photo.fullPath}
                            photo={photo}
                            isSelected={isSelected}
                            isDeleting={isDeleting}
                            isSingleDownloading={isSingleDownloading}
                            bulkDownloading={bulkDownloading}
                            onToggleSelect={togglePhotoSelection}
                            onOpenLightbox={openLightbox}
                            onDownload={handleSinglePhotoDownload}
                            onDelete={openDeleteModal}
                            onImageError={handleImageError}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                {hasMore ? (
                  <div className="gallery-load-more-wrap">
                    <button
                      type="button"
                      className="gallery-toolbar-button gallery-toolbar-button-dark"
                      onClick={handleLoadMore}
                    >
                      Učitaj još
                    </button>
                    <p className="gallery-load-more-text">
                      Prikazano {visiblePhotos.length} od {filteredPhotos.length} fotografija
                    </p>
                  </div>
                ) : (
                  <div className="gallery-load-more-wrap">
                    <p className="gallery-load-more-text">
                      Prikazane su sve fotografije ({filteredPhotos.length})
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default WeddingGallery;