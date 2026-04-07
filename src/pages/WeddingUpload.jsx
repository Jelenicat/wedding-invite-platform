import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, uploadBytesResumable } from "firebase/storage";
import heic2any from "heic2any";
import { storage } from "../firebase";
import demoWedding from "../data/demoWedding";
import "../styles/gallery.css";

const MAX_FILES = 10;
const MAX_COMPRESSED_FILE_SIZE = 8 * 1024 * 1024;
const MAX_ORIGINAL_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

const DEFAULT_UPLOAD_BATCH_SIZE = 3;
const DEFAULT_PREPARE_BATCH_SIZE = 3;

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const JPEG_QUALITY = 0.82;

const MAX_UPLOAD_RETRIES = 2;
const UPLOAD_COOLDOWN_MS = 4000;

const getAdaptiveUploadBatchSize = () => {
  if (typeof navigator === "undefined") {
    return DEFAULT_UPLOAD_BATCH_SIZE;
  }

  const connection = navigator.connection;
  const effectiveType = connection?.effectiveType;

  if (effectiveType === "slow-2g" || effectiveType === "2g") return 1;
  if (effectiveType === "3g") return 2;

  return DEFAULT_UPLOAD_BATCH_SIZE;
};

const getAdaptivePrepareBatchSize = () => {
  if (typeof navigator === "undefined") {
    return DEFAULT_PREPARE_BATCH_SIZE;
  }

  const deviceMemory = navigator.deviceMemory;

  if (deviceMemory && deviceMemory <= 2) return 2;

  return DEFAULT_PREPARE_BATCH_SIZE;
};

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
    "Do 10 slika • JPG, PNG, WEBP, HEIC • maksimalno 8 MB po slici nakon obrade";

  const fileInputRef = useRef(null);
  const selectedPanelRef = useRef(null);
  const successCardRef = useRef(null);
  const limitPulseTimeoutRef = useRef(null);

  const activeUploadTasksRef = useRef(new Map());
  const cancelRequestedRef = useRef(false);
  const lastUploadAtRef = useRef(0);

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [loadingDots, setLoadingDots] = useState("");
  const [limitPulse, setLimitPulse] = useState(false);

  const remainingSlots = Math.max(0, MAX_FILES - files.length);
  const isAtLimit = files.length >= MAX_FILES;

  useEffect(() => {
    return () => {
      cancelRequestedRef.current = true;

      activeUploadTasksRef.current.forEach((task) => {
        try {
          task.cancel();
        } catch (err) {
          console.error("Greška pri cancel upload taska:", err);
        }
      });

      activeUploadTasksRef.current.clear();
    };
  }, []);

  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [files]);

  useEffect(() => {
    return () => {
      if (limitPulseTimeoutRef.current) {
        clearTimeout(limitPulseTimeoutRef.current);
      }
    };
  }, []);

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

  useEffect(() => {
    if (!uploading && !processing) {
      setLoadingDots("");
      return;
    }

    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === "...") return "";
        return `${prev}.`;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [uploading, processing]);

  const triggerLimitPulse = () => {
    setLimitPulse(false);

    requestAnimationFrame(() => {
      setLimitPulse(true);

      if (limitPulseTimeoutRef.current) {
        clearTimeout(limitPulseTimeoutRef.current);
      }

      limitPulseTimeoutRef.current = setTimeout(() => {
        setLimitPulse(false);
      }, 700);
    });
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buildFileId = (file, index) => {
    return `${file.name}-${file.size}-${file.lastModified}-${index}`;
  };

  const buildFileSignature = (file) => {
    return `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
  };

  const getUploadErrorMessage = (err) => {
    const code = err?.code || "";

    if (code === "storage/canceled") {
      return "Slanje fotografija je prekinuto.";
    }

    if (code === "storage/unauthorized") {
      return "Nemate dozvolu za slanje fotografija.";
    }

    if (code === "storage/retry-limit-exceeded") {
      return "Veza je bila nestabilna. Pokušajte ponovo.";
    }

    if (code === "storage/quota-exceeded") {
      return "Storage limit je dostignut. Pokušajte kasnije.";
    }

    if (!navigator.onLine) {
      return "Nemate internet konekciju. Proverite vezu i pokušajte ponovo.";
    }

    return "Došlo je do greške prilikom slanja fotografija.";
  };

  const getFileExtension = (fileName = "") => {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  };

  const isHeicLikeFile = (file) => {
    const ext = getFileExtension(file?.name || "");
    return (
      file?.type === "image/heic" ||
      file?.type === "image/heif" ||
      ext === "heic" ||
      ext === "heif"
    );
  };

  const isAllowedSelectedFile = (file) => {
    const ext = getFileExtension(file?.name || "");

    if (ALLOWED_TYPES.includes(file?.type)) {
      return true;
    }

    if (
      !file?.type &&
      ["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(ext)
    ) {
      return true;
    }

    return false;
  };

  const validateSelectedFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles || []);

    if (fileArray.length === 0) {
      return "Izaberite bar jednu fotografiju.";
    }

    for (const file of fileArray) {
      if (!isAllowedSelectedFile(file)) {
        return "Dozvoljene su JPG, PNG, WEBP i HEIC slike.";
      }

      if (file.size > MAX_ORIGINAL_FILE_SIZE) {
        return "Jedna ili više originalnih slika prelazi 20 MB.";
      }
    }

    return "";
  };

  const validatePreparedFiles = (preparedItems) => {
    if (!preparedItems.length) {
      return "Izaberite bar jednu fotografiju za slanje.";
    }

    if (preparedItems.length > MAX_FILES) {
      return `Možete poslati najviše ${MAX_FILES} slika odjednom.`;
    }

    for (const item of preparedItems) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(item.file.type)) {
        return "Dozvoljene su JPG, PNG i WEBP slike nakon obrade.";
      }

      if (item.file.size > MAX_COMPRESSED_FILE_SIZE) {
        return "Jedna ili više slika i nakon obrade prelazi 8 MB.";
      }
    }

    return "";
  };

  const handleChooseFiles = () => {
    if (uploading || processing || isAtLimit) {
      if (isAtLimit) {
        triggerLimitPulse();
      }
      return;
    }

    fileInputRef.current?.click();
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

  const buildCanvasFromImage = (image) => {
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
      return null;
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
    return canvas;
  };

  const convertHeicToJpeg = async (file) => {
    if (!isHeicLikeFile(file)) {
      return file;
    }

    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    const convertedBlob = Array.isArray(converted) ? converted[0] : converted;

    let nextName = file.name;
    if (!nextName.toLowerCase().match(/\.jpe?g$/)) {
      nextName = nextName.replace(/\.[^/.]+$/, "");
      nextName = `${nextName || "photo"}.jpg`;
    }

    return new File([convertedBlob], nextName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  };

  const compressImage = async (file) => {
    if (!file.type.startsWith("image/")) {
      return file;
    }

    const image = await loadImageFromFile(file);
    const canvas = buildCanvasFromImage(image);

    if (!canvas) {
      return file;
    }

    const preferredOutputType =
      file.type === "image/png" ? "image/png" : "image/jpeg";

    const preferredQuality =
      preferredOutputType === "image/png" ? undefined : JPEG_QUALITY;

    const preferredBlob = await canvasToBlob(
      canvas,
      preferredOutputType,
      preferredQuality
    );

    if (
      preferredBlob.size < file.size &&
      preferredBlob.size <= MAX_COMPRESSED_FILE_SIZE
    ) {
      let nextName = file.name;

      if (
        preferredOutputType === "image/jpeg" &&
        !nextName.toLowerCase().match(/\.jpe?g$/)
      ) {
        nextName = nextName.replace(/\.[^/.]+$/, "");
        nextName = `${nextName || "photo"}.jpg`;
      }

      return new File([preferredBlob], nextName, {
        type: preferredOutputType,
        lastModified: Date.now(),
      });
    }

    if (file.type !== "image/jpeg") {
      const jpegBlob = await canvasToBlob(canvas, "image/jpeg", JPEG_QUALITY);

      if (
        jpegBlob.size < file.size &&
        jpegBlob.size <= MAX_COMPRESSED_FILE_SIZE
      ) {
        let nextName = file.name.replace(/\.[^/.]+$/, "");
        nextName = `${nextName || "photo"}.jpg`;

        return new File([jpegBlob], nextName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      }
    }

    return file;
  };

  const prepareFilesForUpload = async (
    selectedFiles,
    batchSize = DEFAULT_PREPARE_BATCH_SIZE
  ) => {
    const prepared = [];

    for (let i = 0; i < selectedFiles.length; i += batchSize) {
      const batch = selectedFiles.slice(i, i + batchSize);

      const preparedBatch = await Promise.all(
        batch.map(async (item) => {
          try {
            const convertedFile = await convertHeicToJpeg(item.originalFile);
            const compressedFile = await compressImage(convertedFile);

            return {
              ...item,
              file: compressedFile,
              previewUrl: URL.createObjectURL(compressedFile),
            };
          } catch (err) {
            console.error("Greška pri obradi slike:", err);

            return {
              ...item,
              file: item.originalFile,
              previewUrl: URL.createObjectURL(item.originalFile),
            };
          }
        })
      );

      prepared.push(...preparedBatch);
    }

    return prepared;
  };

  const handleFileChange = async (e) => {
    setError("");
    setInfoMessage("");
    setSuccess(false);
    setSuccessCount(0);
    setUploadProgress(0);
    setUploadedCount(0);

    const selectedFiles = e.target.files;
    const selectedArray = Array.from(selectedFiles || []);

    if (selectedArray.length === 0) {
      return;
    }

    if (remainingSlots <= 0) {
      setError(`Možete imati najviše ${MAX_FILES} slika.`);
      triggerLimitPulse();
      resetFileInput();
      return;
    }

    const validationError = validateSelectedFiles(selectedArray);

    if (validationError) {
      setError(validationError);
      resetFileInput();
      return;
    }

    try {
      setProcessing(true);

      const existingSignatures = new Set(files.map((item) => item.signature));

      const uniqueIncoming = [];
      const duplicateNames = [];

      selectedArray.forEach((file) => {
        const signature = buildFileSignature(file);

        if (existingSignatures.has(signature)) {
          duplicateNames.push(file.name);
          return;
        }

        existingSignatures.add(signature);
        uniqueIncoming.push(file);
      });

      if (uniqueIncoming.length === 0) {
        setInfoMessage("Sve izabrane fotografije su već dodate.");
        resetFileInput();
        return;
      }

      const trimmedSelection = uniqueIncoming.slice(0, remainingSlots);

      if (duplicateNames.length > 0 && uniqueIncoming.length > remainingSlots) {
        setInfoMessage(
          "Neke fotografije su preskočene jer su duplikati, a dodat je samo broj slika do dozvoljenog maksimuma."
        );
      } else if (duplicateNames.length > 0) {
        setInfoMessage("Duplirane fotografije su automatski preskočene.");
      } else if (uniqueIncoming.length > remainingSlots) {
        setInfoMessage(
          `Dodato je ${trimmedSelection.length} ${
            trimmedSelection.length === 1 ? "slika" : "slike"
          }. Maksimalno možete imati ${MAX_FILES} fotografija.`
        );
        triggerLimitPulse();
      }

      const startIndex = files.length;

      const originalItems = trimmedSelection.map((file, index) => ({
        id: buildFileId(file, startIndex + index),
        originalFile: file,
        signature: buildFileSignature(file),
      }));

      const adaptivePrepareBatchSize = getAdaptivePrepareBatchSize();
      const preparedFiles = await prepareFilesForUpload(
        originalItems,
        adaptivePrepareBatchSize
      );

      const combinedFiles = [...files, ...preparedFiles];
      const preparedValidationError = validatePreparedFiles(combinedFiles);

      if (preparedValidationError) {
        preparedFiles.forEach((item) => {
          if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
          }
        });
        setError(preparedValidationError);
        resetFileInput();
        return;
      }

      setFiles(combinedFiles);
      setError("");
      resetFileInput();
    } catch (err) {
      console.error("Greška pri obradi slika:", err);
      setError("Došlo je do greške prilikom obrade fotografija.");
      resetFileInput();
    } finally {
      setProcessing(false);
    }
  };

  const revokePreviewById = (id) => {
    const target = files.find((item) => item.id === id);
    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
    }
  };

  const revokeAllPreviewUrls = (items) => {
    items.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
  };

  const removeSingleFile = (id) => {
    if (uploading || processing) return;

    revokePreviewById(id);

    setFiles((prev) => {
      const nextFiles = prev.filter((item) => item.id !== id);

      if (nextFiles.length === 0) {
        resetFileInput();
      }

      return nextFiles;
    });

    setError("");
    setInfoMessage("");
    setSuccess(false);
    setSuccessCount(0);
    setUploadProgress(0);
    setUploadedCount(0);
  };

  const handleResetAfterSuccess = () => {
    revokeAllPreviewUrls(files);

    setSuccess(false);
    setSuccessCount(0);
    setError("");
    setInfoMessage("");
    setFiles([]);
    setUploadProgress(0);
    setUploadedCount(0);
    resetFileInput();
  };

  const cancelAllUploads = () => {
    cancelRequestedRef.current = true;

    activeUploadTasksRef.current.forEach((task) => {
      try {
        task.cancel();
      } catch (err) {
        console.error("Greška pri prekidu upload-a:", err);
      }
    });

    activeUploadTasksRef.current.clear();
    setInfoMessage("Slanje fotografija je prekinuto.");
  };

  const buildStoragePath = (fileName) => {
    const randomPart = Math.random().toString(36).slice(2, 10);
    return `wedding-uploads/${slug}/${Date.now()}-${randomPart}-${fileName}`;
  };

  const uploadSingleFileWithProgress = (
    item,
    onProgress,
    onComplete,
    attempt = 0
  ) =>
    new Promise((resolve, reject) => {
      if (cancelRequestedRef.current) {
        reject(
          Object.assign(new Error("Upload canceled"), {
            code: "storage/canceled",
          })
        );
        return;
      }

      const storagePath = buildStoragePath(item.file.name);
      const storageRef = ref(storage, storagePath);

      const metadata = {
        contentType: item.file.type,
        customMetadata: {
          slug: slug || "",
          weddingType: wedding?.type || "wedding",
          brideName: wedding?.brideName || "",
          groomName: wedding?.groomName || "",
          originalName: item.originalFile?.name || item.file.name,
          uploadedAt: new Date().toISOString(),
        },
      };

      const uploadTask = uploadBytesResumable(storageRef, item.file, metadata);
      activeUploadTasksRef.current.set(item.id, uploadTask);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          onProgress(item.id, snapshot.bytesTransferred, snapshot.totalBytes);
        },
        async (err) => {
          activeUploadTasksRef.current.delete(item.id);

          if (
            !cancelRequestedRef.current &&
            err?.code !== "storage/canceled" &&
            attempt < MAX_UPLOAD_RETRIES
          ) {
            try {
              await uploadSingleFileWithProgress(
                item,
                onProgress,
                onComplete,
                attempt + 1
              );
              resolve();
              return;
            } catch (retryErr) {
              reject(retryErr);
              return;
            }
          }

          reject(err);
        },
        () => {
          activeUploadTasksRef.current.delete(item.id);
          onComplete(item.id);
          resolve();
        }
      );
    });

  const uploadInBatchesWithProgress = async (
    filesToUpload,
    batchSize = DEFAULT_UPLOAD_BATCH_SIZE
  ) => {
    const fileProgressMap = new Map();
    const completedSet = new Set();
    const failedItems = [];
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
      if (cancelRequestedRef.current) {
        break;
      }

      const batch = filesToUpload.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (item) => {
          try {
            await uploadSingleFileWithProgress(
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
            );
          } catch (err) {
            if (err?.code !== "storage/canceled") {
              failedItems.push(item);
            }
          }
        })
      );
    }

    if (
      !cancelRequestedRef.current &&
      completedSet.size === filesToUpload.length
    ) {
      setUploadProgress(100);
      setUploadedCount(filesToUpload.length);
    }

    return {
      completedCount: completedSet.size,
      failedItems,
      canceled: cancelRequestedRef.current,
    };
  };

  const handleUpload = async () => {
    setError("");
    setInfoMessage("");
    setSuccess(false);
    setSuccessCount(0);

    const now = Date.now();

    if (now - lastUploadAtRef.current < UPLOAD_COOLDOWN_MS) {
      const secondsLeft = Math.ceil(
        (UPLOAD_COOLDOWN_MS - (now - lastUploadAtRef.current)) / 1000
      );

      setError(
        `Sačekajte ${secondsLeft} ${
          secondsLeft === 1
            ? "sekundu"
            : secondsLeft >= 2 && secondsLeft <= 4
            ? "sekunde"
            : "sekundi"
        } pre novog slanja.`
      );
      return;
    }

    const validationError = validatePreparedFiles(files);

    if (validationError) {
      setError(validationError);
      return;
    }

    lastUploadAtRef.current = now;
    cancelRequestedRef.current = false;
    activeUploadTasksRef.current.clear();

    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadedCount(0);

      const adaptiveUploadBatchSize = getAdaptiveUploadBatchSize();

      const result = await uploadInBatchesWithProgress(
        files,
        adaptiveUploadBatchSize
      );

      if (result.canceled) {
        setInfoMessage("Slanje fotografija je prekinuto.");
        return;
      }

      if (result.completedCount > 0) {
        setSuccess(true);
        setSuccessCount(result.completedCount);
      }

      if (result.failedItems.length > 0) {
        const uploadedIds = new Set(
          files
            .filter(
              (item) =>
                !result.failedItems.some((failed) => failed.id === item.id)
            )
            .map((item) => item.id)
        );

        files.forEach((item) => {
          if (uploadedIds.has(item.id) && item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
          }
        });

        setFiles(result.failedItems);
        setError(
          `${result.failedItems.length} ${
            result.failedItems.length === 1
              ? "fotografija nije poslata"
              : "fotografije nisu poslate"
          }. Možete pokušati ponovo samo za njih.`
        );

        if (result.completedCount > 0) {
          setInfoMessage(
            `Uspešno poslato: ${result.completedCount}. Neuspešno: ${result.failedItems.length}.`
          );
        }

        resetFileInput();
        return;
      }

      revokeAllPreviewUrls(files);
      setFiles([]);
      resetFileInput();
    } catch (err) {
      console.error("Greška pri upload-u:", err);
      setError(getUploadErrorMessage(err));
    } finally {
      activeUploadTasksRef.current.clear();
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
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
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

            <button
              type="button"
              className="upload-submit-button upload-submit-button-secondary"
              onClick={cancelAllUploads}
            >
              Prekini slanje
            </button>
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
              disabled={uploading || processing || isAtLimit}
            >
              {processing
                ? `Priprema fotografija${loadingDots}`
                : isAtLimit
                ? "Dostignut maksimum od 10 slika"
                : "Izaberite fotografije"}
            </button>

            <p className="upload-hero-meta">{heroMetaText}</p>

            {!processing &&
              !isAtLimit &&
              remainingSlots > 0 &&
              files.length > 0 && (
                <p className="upload-processing-note">
                  Možete dodati još {remainingSlots}{" "}
                  {remainingSlots === 1 ? "sliku" : "slike"}.
                </p>
              )}

            {isAtLimit && (
              <p className="upload-processing-note">
                Dostigli ste maksimalan broj fotografija za jedno slanje.
              </p>
            )}

            {processing && (
              <p className="upload-processing-note">
                Obrada većih fotografija i HEIC fajlova može potrajati nekoliko
                sekundi{loadingDots}
              </p>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div
            className={`upload-selected-panel ${
              limitPulse ? "is-limit-pulse" : ""
            }`}
            ref={selectedPanelRef}
          >
            <div className="upload-selected-header">
              <div>
                <p className="upload-selected-title">Izabrane fotografije</p>
                <p className="upload-selected-helper">
                  Dodato {files.length} / {MAX_FILES} slika.
                </p>
              </div>

              <span className="upload-selected-count">
                {files.length} / {MAX_FILES}
              </span>
            </div>

            <div className="upload-selected-grid">
              {files.map((item) => (
                <div key={item.id} className="upload-selected-item">
                  <button
                    type="button"
                    className="upload-remove-button"
                    onClick={() => removeSingleFile(item.id)}
                    disabled={uploading || processing}
                    aria-label={`Ukloni ${item.file.name}`}
                    title="Ukloni fotografiju"
                  >
                    ×
                  </button>

                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
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
              {uploading
                ? `Slanje${loadingDots} ${uploadProgress}%`
                : `Pošalji fotografije (${files.length})`}
            </button>
          </div>
        )}

        {infoMessage ? (
          <p className="upload-processing-note">{infoMessage}</p>
        ) : null}

        {error ? <p className="upload-error-text">{error}</p> : null}

        {success ? (
          <div className="upload-success-overlay" ref={successCardRef}>
            <div className="upload-success-confetti" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  className={`upload-confetti-piece upload-confetti-piece-${
                    (index % 6) + 1
                  }`}
                />
              ))}
            </div>

            <div className="upload-success-card upload-success-card-wow">
              <div className="upload-success-icon upload-success-icon-wow">
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

              <div className="upload-success-content">
                <p className="upload-success-title">Hvala 💌</p>
                <p className="upload-success-description">
                  Uspešno je poslato {successCount}{" "}
                  {successCount === 1 ? "fotografija" : "fotografija"}.
                </p>
                <p className="upload-success-subtle">
                  Vaše uspomene su sačuvane i odmah dostupne mladencima.
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
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default WeddingUpload;