import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import demoWedding from "../data/demoWedding";
import "../styles/gallery.css";

const MAX_FILES = 10;
const MAX_COMPRESSED_FILE_SIZE = 8 * 1024 * 1024;
const MAX_ORIGINAL_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const UPLOAD_BATCH_SIZE = 3;

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const JPEG_QUALITY = 0.82;

function WeddingUpload() {
  const { slug } = useParams();
  const wedding = demoWedding.find((item) => item.slug === slug);
  const isBirthday = wedding?.type === "birthday";

  const heroTitle = isBirthday
    ? "Podelite najlepše trenutke sa proslave"
    : "Podelite trenutke koje su mladenci propustili";

  const heroSubtitle = isBirthday
    ? "Dodajte fotografije sa rođendana i sačuvajte uspomene na jednom mestu."
    : "Dodajte fotografije direktno mladencima.";

  const heroMetaText =
    "Do 10 slika • JPG, PNG, WEBP • maksimalno 8 MB po slici nakon obrade";

  const fileInputRef = useRef(null);
  const selectedPanelRef = useRef(null);
  const successCardRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const previewUrls = useMemo(() => {
    return files.map((item) => ({
      id: item.id,
      name: item.file.name,
      url: URL.createObjectURL(item.file),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (files.length > 0 && selectedPanelRef.current) {
      const timeout = setTimeout(() => {
        selectedPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [files]);

  useEffect(() => {
    if (success && successCardRef.current) {
      const timeout = setTimeout(() => {
        successCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  const validateSelectedFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles || []);

    if (fileArray.length === 0) {
      return "Izaberite bar jednu fotografiju.";
    }

    if (fileArray.length > MAX_FILES) {
      return `Možete poslati najviše ${MAX_FILES} slika odjednom.`;
    }

    for (const file of fileArray) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return "Dozvoljene su JPG, PNG i WEBP slike. Ako koristite iPhone i slika ne prolazi, sačuvajte je kao JPG pa pokušajte ponovo.";
      }

      if (file.size > MAX_ORIGINAL_FILE_SIZE) {
        return "Jedna ili više originalnih slika prelazi 20 MB.";
      }
    }

    return "";
  };

  const validatePreparedFiles = (preparedItems) => {
    if (!preparedItems.length) {
      return "Izaberite bar jednu fotografiju.";
    }

    if (preparedItems.length > MAX_FILES) {
      return `Možete poslati najviše ${MAX_FILES} slika odjednom.`;
    }

    for (const item of preparedItems) {
      if (!ALLOWED_TYPES.includes(item.file.type)) {
        return "Dozvoljene su JPG, PNG i WEBP slike.";
      }

      if (item.file.size > MAX_COMPRESSED_FILE_SIZE) {
        return "Jedna ili više slika i nakon obrade prelazi 8 MB.";
      }
    }

    return "";
  };

  const handleChooseFiles = () => {
    if (uploading || processing) return;
    fileInputRef.current?.click();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buildFileId = (file, index) => {
    return `${file.name}-${file.size}-${file.lastModified}-${index}`;
  };

  const loadImageFromFile = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Neuspešno učitavanje slike."));
      };

      img.src = objectUrl;
    });

  const canvasToBlob = (canvas, mimeType, quality) =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Neuspešna kompresija slike."));
            return;
          }
          resolve(blob);
        },
        mimeType,
        quality
      );
    });

  const compressImage = async (file) => {
    if (!file.type.startsWith("image/")) {
      return file;
    }

    const image = await loadImageFromFile(file);

    const { width, height } = image;
    const widthRatio = MAX_WIDTH / width;
    const heightRatio = MAX_HEIGHT / height;
    const ratio = Math.min(widthRatio, heightRatio, 1);

    const targetWidth = Math.round(width * ratio);
    const targetHeight = Math.round(height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return file;
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const quality = outputType === "image/png" ? undefined : JPEG_QUALITY;

    const compressedBlob = await canvasToBlob(canvas, outputType, quality);

    if (compressedBlob.size >= file.size) {
      return file;
    }

    let nextName = file.name;

    if (outputType === "image/jpeg" && !nextName.toLowerCase().match(/\.jpe?g$/)) {
      nextName = nextName.replace(/\.[^/.]+$/, "");
      nextName = `${nextName || "photo"}.jpg`;
    }

    return new File([compressedBlob], nextName, {
      type: outputType,
      lastModified: Date.now(),
    });
  };

  const prepareFilesForUpload = async (selectedFiles) => {
    const prepared = await Promise.all(
      selectedFiles.map(async (item) => {
        try {
          const compressedFile = await compressImage(item.originalFile);
          return {
            id: item.id,
            originalFile: item.originalFile,
            file: compressedFile,
          };
        } catch (err) {
          console.error("Greška pri kompresiji slike:", err);
          return {
            id: item.id,
            originalFile: item.originalFile,
            file: item.originalFile,
          };
        }
      })
    );

    return prepared;
  };

  const handleFileChange = async (e) => {
    setError("");
    setSuccess(false);
    setSuccessCount(0);
    setUploadProgress(0);
    setUploadedCount(0);

    const selectedFiles = e.target.files;
    const validationError = validateSelectedFiles(selectedFiles);

    if (validationError) {
      setError(validationError);
      setFiles([]);
      resetFileInput();
      return;
    }

    try {
      setProcessing(true);

      const originalItems = Array.from(selectedFiles).map((file, index) => ({
        id: buildFileId(file, index),
        originalFile: file,
      }));

      const preparedFiles = await prepareFilesForUpload(originalItems);
      const preparedValidationError = validatePreparedFiles(preparedFiles);

      if (preparedValidationError) {
        setError(preparedValidationError);
        setFiles([]);
        resetFileInput();
        return;
      }

      setFiles(preparedFiles);
    } catch (err) {
      console.error("Greška pri obradi slika:", err);
      setError("Došlo je do greške prilikom obrade fotografija.");
      setFiles([]);
      resetFileInput();
    } finally {
      setProcessing(false);
    }
  };

  const removeSingleFile = (id) => {
    if (uploading || processing) return;

    setFiles((prev) => {
      const nextFiles = prev.filter((item) => item.id !== id);

      if (nextFiles.length === 0) {
        resetFileInput();
      }

      return nextFiles;
    });

    setError("");
    setSuccess(false);
    setSuccessCount(0);
    setUploadProgress(0);
    setUploadedCount(0);
  };

  const handleResetAfterSuccess = () => {
    setSuccess(false);
    setSuccessCount(0);
    setError("");
    setFiles([]);
    setUploadProgress(0);
    setUploadedCount(0);
    resetFileInput();
  };

  const uploadSingleFileWithProgress = (item, onProgress, onComplete) =>
    new Promise((resolve, reject) => {
      const uniqueName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${item.file.name}`;

      const storageRef = ref(storage, `wedding-uploads/${slug}/${uniqueName}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          onProgress(item.id, snapshot.bytesTransferred, snapshot.totalBytes);
        },
        (err) => reject(err),
        () => {
          onComplete(item.id);
          resolve();
        }
      );
    });

  const uploadInBatchesWithProgress = async (
    filesToUpload,
    batchSize = UPLOAD_BATCH_SIZE
  ) => {
    const fileProgressMap = new Map();
    const completedSet = new Set();
    const fileLookup = new Map(filesToUpload.map((item) => [item.id, item]));

    const recalculateTotalProgress = () => {
      let transferred = 0;
      let total = 0;

      filesToUpload.forEach((item) => {
        const current = fileProgressMap.get(item.id) || {
          transferred: 0,
          total: item.file.size,
        };

        transferred += current.transferred;
        total += current.total;
      });

      const percent = total > 0 ? Math.round((transferred / total) * 100) : 0;
      setUploadProgress(percent);
      setUploadedCount(completedSet.size);
    };

    for (let i = 0; i < filesToUpload.length; i += batchSize) {
      const batch = filesToUpload.slice(i, i + batchSize);

      await Promise.all(
        batch.map((item) =>
          uploadSingleFileWithProgress(
            item,
            (id, bytesTransferred, totalBytes) => {
              fileProgressMap.set(id, {
                transferred: bytesTransferred,
                total: totalBytes,
              });
              recalculateTotalProgress();
            },
            (id) => {
              const existing = fileProgressMap.get(id);
              const targetItem = fileLookup.get(id);

              fileProgressMap.set(id, {
                transferred: existing?.total || targetItem?.file.size || 0,
                total: existing?.total || targetItem?.file.size || 0,
              });

              completedSet.add(id);
              recalculateTotalProgress();
            }
          )
        )
      );
    }

    setUploadProgress(100);
    setUploadedCount(filesToUpload.length);
  };

  const handleUpload = async () => {
    setError("");
    setSuccess(false);
    setSuccessCount(0);

    const validationError = validatePreparedFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    const totalFilesToUpload = files.length;

    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadedCount(0);

      await uploadInBatchesWithProgress(files, UPLOAD_BATCH_SIZE);

      setSuccess(true);
      setSuccessCount(totalFilesToUpload);
      setFiles([]);
      resetFileInput();
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
    <section
      className={`upload-page ${
        isBirthday ? "upload-page-birthday" : "upload-page-wedding"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="upload-hidden-input"
      />

      <div className="upload-shell">
        {uploading && (
          <div className="upload-progress-wrap">
            <div className="upload-progress-top">
              <span className="upload-progress-label">Upload u toku</span>
              <span className="upload-progress-value">{uploadProgress}%</span>
            </div>

            <div className="upload-progress-bar">
              <div
                className="upload-progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            <p className="upload-progress-count">
              Poslato {uploadedCount} / {files.length} fotografija
            </p>
          </div>
        )}

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

            <h1 className="upload-hero-title">{heroTitle}</h1>

            <p className="upload-hero-subtitle">{heroSubtitle}</p>

            <button
              type="button"
              className="upload-choose-button"
              onClick={handleChooseFiles}
              disabled={uploading || processing}
            >
              {processing ? "Priprema fotografija..." : "Izaberite fotografije"}
            </button>

            <p className="upload-hero-meta">{heroMetaText}</p>

            {processing && (
              <p className="upload-processing-note">
                Obrada većih fotografija može potrajati nekoliko sekundi.
              </p>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="upload-selected-panel" ref={selectedPanelRef}>
            <div className="upload-selected-header">
              <p className="upload-selected-title">Izabrane fotografije</p>
              <span className="upload-selected-count">
                {files.length} / {MAX_FILES}
              </span>
            </div>

            <div className="upload-selected-grid">
              {previewUrls.map((item) => (
                <div key={item.id} className="upload-selected-item">
                  <button
                    type="button"
                    className="upload-remove-button"
                    onClick={() => removeSingleFile(item.id)}
                    disabled={uploading || processing}
                    aria-label={`Ukloni ${item.name}`}
                    title="Ukloni fotografiju"
                  >
                    ×
                  </button>

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
              disabled={uploading || processing || files.length === 0}
            >
              {uploading ? `Slanje... ${uploadProgress}%` : "Pošalji fotografije"}
            </button>
          </div>
        )}

        {error ? <p className="upload-error-text">{error}</p> : null}

        {success ? (
          <div className="upload-success-card" ref={successCardRef}>
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
              <p className="upload-success-title">
                Fotografije su uspešno uploadovane
              </p>
              <p className="upload-success-description">
                Uspešno je poslato {successCount} fotografija.
              </p>
            </div>

            <button
              type="button"
              className="upload-submit-button upload-submit-button-secondary"
              onClick={handleResetAfterSuccess}
            >
              Pošalji još fotografija
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default WeddingUpload;