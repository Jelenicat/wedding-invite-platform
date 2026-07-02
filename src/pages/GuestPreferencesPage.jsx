import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import adminAccess from "../data/adminAccess";
import demoWedding from "../data/demoWedding";
import html2pdf from "html2pdf.js";

function GuestPreferencesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [exportStatus, setExportStatus] = useState({
    type: "",
    message: "",
  });
  const [isExporting, setIsExporting] = useState(false);

  const expectedPassword = adminAccess[slug];

  const invitation = useMemo(
    () => demoWedding.find((item) => item.slug === slug),
    [slug]
  );

  const rsvpOptions = invitation?.details?.rsvpOptions || {};

  const hasFoodPreferences = Boolean(rsvpOptions.foodPreferences);
  const hasMusicWish = Boolean(rsvpOptions.musicWish);
  const hasFastingOption = Boolean(rsvpOptions.fasting);

  const hasSpecialOptions =
    hasFoodPreferences || hasMusicWish || hasFastingOption;

  const getFastingLabel = (value) => {
    if (value === "posti") return "Posti";
    if (value === "ne_posti") return "Ne posti";
    return "";
  };

  const hasTextValue = (value) => {
    return typeof value === "string" && value.trim() !== "";
  };

  const getAttendanceLabel = (guest) => {
    if (guest.attending === "da") return "Dolazi";
    if (guest.attending === "ne") return "Ne dolazi";
    return "Bez odgovora";
  };

  const getFilterLabel = () => {
    if (filterType === "food") return "Hrana";
    if (filterType === "music") return "Muzika";
    if (filterType === "fasting") return "Post";
    if (filterType === "both") return "Hrana i muzika";
    return "Sve";
  };

  const getExportTitle = () => {
    if (filterType === "food") return "Napomene za hranu";
    if (filterType === "music") return "Muzičke želje";
    if (filterType === "fasting") return "Post gostiju";
    if (filterType === "both") return "Napomene za hranu i muzičke želje";
    return "Posebne RSVP poruke";
  };

  const getExportCountLabel = () => {
    if (filterType === "food") return "Ukupno napomena za hranu";
    if (filterType === "music") return "Ukupno muzičkih želja";
    if (filterType === "fasting") return "Ukupno odgovora za post";
    if (filterType === "both") return "Ukupno gostiju sa obe poruke";
    return "Ukupno posebnih odgovora";
  };

  const getExportButtonText = () => {
    if (filterType === "food") return "hranu";
    if (filterType === "music") return "muziku";
    if (filterType === "fasting") return "post";
    if (filterType === "both") return "oba";
    return "sve";
  };

  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  useEffect(() => {
    const savedAccess = localStorage.getItem(`admin-access-${slug}`);
    if (savedAccess === "true") {
      setIsAuthorized(true);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug || !isAuthorized || !hasSpecialOptions) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const rsvpsRef = collection(db, "events", slug, "rsvps");

    const unsubscribe = onSnapshot(
      rsvpsRef,
      (snapshot) => {
        const data = snapshot.docs
          .map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }))
          .filter((guest) => {
            const hasFood =
              hasFoodPreferences && hasTextValue(guest.foodPreferences);

            const hasMusic = hasMusicWish && hasTextValue(guest.musicWish);

            const hasFasting =
              hasFastingOption && hasTextValue(guest.fasting);

            return hasFood || hasMusic || hasFasting;
          })
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;
            return bTime - aTime;
          });

        setGuests(data);
        setLoading(false);
      },
      (error) => {
        console.error("Greška pri učitavanju posebnih RSVP odgovora:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [
    slug,
    isAuthorized,
    hasSpecialOptions,
    hasFoodPreferences,
    hasMusicWish,
    hasFastingOption,
  ]);

  useEffect(() => {
    const availableFilters = ["all"];

    if (hasFoodPreferences) availableFilters.push("food");
    if (hasMusicWish) availableFilters.push("music");
    if (hasFastingOption) availableFilters.push("fasting");
    if (hasFoodPreferences && hasMusicWish) availableFilters.push("both");

    if (!availableFilters.includes(filterType)) {
      setFilterType("all");
    }
  }, [filterType, hasFoodPreferences, hasMusicWish, hasFastingOption]);

  useEffect(() => {
    if (!exportStatus.message) return;

    const timer = setTimeout(() => {
      setExportStatus({ type: "", message: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [exportStatus]);

  const stats = useMemo(() => {
    const foodCount = hasFoodPreferences
      ? guests.filter((g) => hasTextValue(g.foodPreferences)).length
      : 0;

    const musicCount = hasMusicWish
      ? guests.filter((g) => hasTextValue(g.musicWish)).length
      : 0;

    const fastingCount = hasFastingOption
      ? guests.filter((g) => hasTextValue(g.fasting)).length
      : 0;

    const bothCount =
      hasFoodPreferences && hasMusicWish
        ? guests.filter((g) => {
            const hasFood = hasTextValue(g.foodPreferences);
            const hasMusic = hasTextValue(g.musicWish);
            return hasFood && hasMusic;
          }).length
        : 0;

    return {
      foodCount,
      musicCount,
      fastingCount,
      bothCount,
      total: guests.length,
    };
  }, [guests, hasFoodPreferences, hasMusicWish, hasFastingOption]);

  const filteredGuests = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return guests.filter((guest) => {
      const hasFood =
        hasFoodPreferences && hasTextValue(guest.foodPreferences);

      const hasMusic = hasMusicWish && hasTextValue(guest.musicWish);

      const hasFasting =
        hasFastingOption && hasTextValue(guest.fasting);

      if (filterType === "food" && !hasFood) return false;
      if (filterType === "music" && !hasMusic) return false;
      if (filterType === "fasting" && !hasFasting) return false;
      if (filterType === "both" && !(hasFood && hasMusic)) return false;

      if (!normalized) return true;

      const nameMatch = (guest.fullName || "")
        .toLowerCase()
        .includes(normalized);

      const foodMatch = (guest.foodPreferences || "")
        .toLowerCase()
        .includes(normalized);

      const musicMatch = (guest.musicWish || "")
        .toLowerCase()
        .includes(normalized);

      const fastingMatch = getFastingLabel(guest.fasting)
        .toLowerCase()
        .includes(normalized);

      return nameMatch || foodMatch || musicMatch || fastingMatch;
    });
  }, [
    guests,
    search,
    filterType,
    hasFoodPreferences,
    hasMusicWish,
    hasFastingOption,
  ]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!expectedPassword) {
      setAuthError("Za ovaj događaj nije podešen admin pristup.");
      return;
    }

    if (password === expectedPassword) {
      setIsAuthorized(true);
      setAuthError("");
      localStorage.setItem(`admin-access-${slug}`, "true");
    } else {
      setAuthError("Pogrešna lozinka.");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPassword("");
    localStorage.removeItem(`admin-access-${slug}`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "—";

    const date = new Date(timestamp.seconds * 1000);

    return new Intl.DateTimeFormat("sr-RS", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleExportPreferencesPDF = async () => {
    if (isExporting) return;

    setExportStatus({ type: "", message: "" });

    if (!filteredGuests.length) {
      setExportStatus({
        type: "warning",
        message: "Nema podataka za eksport za trenutno izabrani filter.",
      });
      return;
    }

    setIsExporting(true);

    let element = null;

    try {
      const formattedDate = new Date().toLocaleString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const chunkArray = (array, size) => {
        const chunks = [];

        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size));
        }

        return chunks;
      };

      const guestsPerPage = 8;
      const guestChunks = chunkArray(filteredGuests, guestsPerPage);
      const totalPages = guestChunks.length;

      const pagesHtml = guestChunks
        .map((guestChunk, pageIndex) => {
          const printableRows = guestChunk
            .map((guest, localIndex) => {
              const globalIndex = pageIndex * guestsPerPage + localIndex;

              const hasFood =
                hasFoodPreferences && hasTextValue(guest.foodPreferences);

              const hasMusic =
                hasMusicWish && hasTextValue(guest.musicWish);

              const hasFasting =
                hasFastingOption && hasTextValue(guest.fasting);

              const showFoodBlock =
                hasFood &&
                (filterType === "all" ||
                  filterType === "food" ||
                  filterType === "both");

              const showMusicBlock =
                hasMusic &&
                (filterType === "all" ||
                  filterType === "music" ||
                  filterType === "both");

              const showFastingBlock =
                hasFasting &&
                (filterType === "all" || filterType === "fasting");

              return `
                <section class="guest-card">
                  <div class="guest-head">
                    <div>
                      <div class="guest-index">Gost ${globalIndex + 1}</div>

                      <h2>${escapeHtml(guest.fullName || "Bez imena")}</h2>

                      <div class="guest-meta">
                        <span class="meta-badge">${escapeHtml(
                          getAttendanceLabel(guest)
                        )}</span>

                        ${
                          guest.attending === "da"
                            ? `<span class="meta-badge">${
                                Number(guest.guests) || 0
                              } osoba</span>`
                            : ""
                        }

                        <span class="meta-date">Poslato: ${escapeHtml(
                          formatDate(guest.createdAt)
                        )}</span>
                      </div>
                    </div>

                    <div class="tag-wrap">
                      ${hasFood ? `<span class="tag">Hrana</span>` : ""}
                      ${hasMusic ? `<span class="tag">Muzika</span>` : ""}
                      ${hasFasting ? `<span class="tag">Post</span>` : ""}
                    </div>
                  </div>

                  ${
                    showFoodBlock
                      ? `
                    <div class="answer-block">
                      <div class="answer-label">Napomena za hranu</div>
                      <div class="answer-value">${escapeHtml(
                        guest.foodPreferences?.trim() || "—"
                      )}</div>
                    </div>
                  `
                      : ""
                  }

                  ${
                    showMusicBlock
                      ? `
                    <div class="answer-block">
                      <div class="answer-label">Muzička želja</div>
                      <div class="answer-value">${escapeHtml(
                        guest.musicWish?.trim() || "—"
                      )}</div>
                    </div>
                  `
                      : ""
                  }

                  ${
                    showFastingBlock
                      ? `
                    <div class="answer-block">
                      <div class="answer-label">Post</div>
                      <div class="answer-value">${escapeHtml(
                        getFastingLabel(guest.fasting) || "—"
                      )}</div>
                    </div>
                  `
                      : ""
                  }
                </section>
              `;
            })
            .join("");

          return `
            <section class="pdf-page ${
              pageIndex < totalPages - 1 ? "page-break" : ""
            }">
              <div class="pdf-shell">
                <section class="hero">
                  <div class="hero-topline">Guest Preferences Export</div>

                  <h1>${escapeHtml(getExportTitle())}</h1>

                  <div class="hero-subtitle">
                    Događaj: <strong>${escapeHtml(slug)}</strong><br />
                    Generisano: ${escapeHtml(formattedDate)}<br />
                    Filter: <strong>${escapeHtml(getFilterLabel())}</strong><br />
                    Strana: <strong>${pageIndex + 1} / ${totalPages}</strong>
                  </div>
                </section>

                ${
                  pageIndex === 0
                    ? `
                  <div class="summary-grid">
                    <div class="summary-card">
                      <div class="summary-label">${escapeHtml(
                        getExportCountLabel()
                      )}</div>
                      <div class="summary-value">${filteredGuests.length}</div>
                      <div class="summary-note">Trenutni prikaz za eksport</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Ukupno posebnih odgovora</div>
                      <div class="summary-value">${stats.total}</div>
                      <div class="summary-note">Svi gosti sa dodatnim odgovorima</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Pretraga</div>
                      <div class="summary-value">${
                        search.trim() ? "Da" : "Ne"
                      }</div>
                      <div class="summary-note">
                        ${
                          search.trim()
                            ? `Upit: "${escapeHtml(search.trim())}"`
                            : "Bez dodatne pretrage"
                        }
                      </div>
                    </div>
                  </div>
                `
                    : ""
                }

                <div class="section-wrap">
                  <div class="section-title-row">
                    <div class="section-title">Pregled gostiju</div>
                  </div>

                  <section class="guest-list">
                    ${printableRows}
                  </section>
                </div>

                <div class="footer">
                  <div class="footer-line"></div>
                  Eksportovano iz admin panela za događaj <strong>${escapeHtml(
                    slug
                  )}</strong>
                </div>
              </div>
            </section>
          `;
        })
        .join("");

      element = document.createElement("div");
      element.style.width = "100%";
      element.style.maxWidth = "794px";
      element.style.margin = "0 auto";
      element.style.background = "#f6efe8";
      element.style.padding = "12px";
      element.style.boxSizing = "border-box";

      element.innerHTML = `
        <div class="pdf-root">
          <style>
            * {
              box-sizing: border-box;
            }

            .pdf-root {
              width: 100%;
              margin: 0 auto;
              color: #5f4b3f;
              font-family: Georgia, "Times New Roman", serif;
            }

            .pdf-page {
              width: 100%;
            }

            .page-break {
              page-break-after: always;
              break-after: page;
              margin-bottom: 12px;
            }

            .pdf-shell {
              background: #ffffff;
              border: 1px solid #e5d6c8;
              border-radius: 24px;
              overflow: hidden;
            }

            .hero {
              padding: 22px 20px 16px;
              border-bottom: 1px solid rgba(190, 162, 139, 0.22);
              background: #f8f2ec;
            }

            .hero-topline {
              font-size: 10px;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: #a1775f;
              margin-bottom: 12px;
            }

            .hero h1 {
              margin: 0;
              font-size: 28px;
              line-height: 1.1;
              font-weight: 700;
              color: #6b5447;
            }

            .hero-subtitle {
              margin-top: 10px;
              font-size: 13px;
              line-height: 1.6;
              color: #756255;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
              padding: 14px 20px 4px;
            }

            .summary-card {
              background: #ffffff;
              border: 1px solid #e6d8cb;
              border-radius: 16px;
              padding: 14px;
            }

            .summary-label {
              margin: 0 0 8px;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.14em;
              color: #90715d;
            }

            .summary-value {
              margin: 0;
              font-size: 22px;
              font-weight: 700;
              color: #6b5447;
              line-height: 1;
            }

            .summary-note {
              margin-top: 6px;
              font-size: 12px;
              color: #7b675b;
              line-height: 1.4;
            }

            .section-wrap {
              padding: 14px 20px 20px;
            }

            .section-title-row {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 12px;
            }

            .section-title-row::before,
            .section-title-row::after {
              content: "";
              flex: 1;
              height: 1px;
              background: #dbc8b8;
            }

            .section-title {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              color: #a1775f;
              white-space: nowrap;
            }

            .guest-list {
              display: grid;
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .guest-card {
              background: #ffffff;
              border: 1px solid #e5d6c8;
              border-radius: 18px;
              padding: 16px 16px 14px;
              page-break-inside: avoid;
              break-inside: avoid;
            }

            .guest-head {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 12px;
              flex-wrap: wrap;
            }

            .guest-index {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.16em;
              color: #7b675b;
              margin-bottom: 6px;
            }

            .guest-card h2 {
              margin: 0;
              font-size: 22px;
              line-height: 1.12;
              color: #6b5447;
            }

            .guest-meta {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-top: 10px;
              align-items: center;
            }

            .meta-badge {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-height: 28px;
              padding: 5px 9px;
              border-radius: 999px;
              background: #f4e8e1;
              color: #7a5549;
              font-size: 11px;
              font-weight: 700;
              border: 1px solid #ead6cb;
              white-space: nowrap;
            }

            .meta-date {
              font-size: 11px;
              color: #7b675b;
            }

            .tag-wrap {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }

            .tag {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-height: 28px;
              padding: 5px 9px;
              border-radius: 999px;
              background: #f7f1ea;
              color: #6c5a4f;
              font-size: 11px;
              font-weight: 700;
              border: 1px solid #eadfd6;
              white-space: nowrap;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .answer-block {
              margin-top: 14px;
              padding-top: 14px;
              border-top: 1px solid #f0e7df;
            }

            .answer-label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: #7b675b;
              margin-bottom: 6px;
            }

            .answer-value {
              font-size: 14px;
              line-height: 1.6;
              color: #5f4b3f;
              white-space: pre-wrap;
            }

            .footer {
              padding: 0 20px 18px;
              text-align: center;
              font-size: 11px;
              color: #8a776a;
            }

            .footer-line {
              height: 1px;
              background: #e0d0c3;
              margin-bottom: 10px;
            }
          </style>

          ${pagesHtml}
        </div>
      `;

      await html2pdf()
        .set({
          margin: [4, 4, 4, 4],
          filename: `preferences-${slug}-${filterType}.pdf`,
          image: { type: "jpeg", quality: 0.9 },
          html2canvas: {
            scale: 1.35,
            useCORS: true,
            backgroundColor: "#f6efe8",
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
          },
        })
        .from(element)
        .save();

      setExportStatus({
        type: "success",
        message: "PDF je uspešno preuzet.",
      });
    } catch (error) {
      console.error("Greška pri eksportu PDF-a:", error);

      setExportStatus({
        type: "error",
        message: "Došlo je do greške pri kreiranju PDF fajla.",
      });
    } finally {
      if (element) {
        element.remove();
      }

      setIsExporting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div style={styles.page}>
        <div style={styles.loginCard}>
          <p style={styles.kicker}>Admin pristup</p>

          <h1 style={styles.title}>Posebne RSVP poruke</h1>

          <p style={styles.subtitle}>
            Pregledaj napomene za hranu, muzičke želje i post gostiju.
          </p>

          <p style={styles.slug}>Događaj: {slug}</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label htmlFor="admin-password" style={styles.label}>
                Lozinka
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Unesite lozinku"
                style={styles.input}
                required
              />
            </div>

            {authError && <p style={styles.error}>{authError}</p>}

            <button type="submit" style={styles.button}>
              Uloguj se
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!hasSpecialOptions) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={styles.kicker}>Admin panel</p>

          <h1 style={styles.title}>Posebne RSVP poruke</h1>

          <p style={styles.emptyTitle}>Nema dodatnih opcija za ovaj događaj</p>

          <p style={styles.emptyText}>
            Za ovaj slug nisu uključene napomene za hranu, muzičke želje ili
            post.
          </p>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => navigate(`/admin/${slug}`)}
            >
              Nazad na admin
            </button>

            <button
              type="button"
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              Odjavi se
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Učitavanje...</h1>
          <p style={styles.emptyText}>Pripremam posebne RSVP odgovore.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerTop}>
          <div>
            <p style={styles.kicker}>Admin panel</p>

            <h1 style={styles.title}>Posebne RSVP poruke</h1>

            <p style={styles.subtitle}>
              Na jednom mestu vidiš napomene za hranu, muzičke želje i post
              gostiju.
            </p>

            <p style={styles.slug}>Događaj: {slug}</p>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => navigate(`/admin/${slug}`)}
            >
              Nazad na admin
            </button>

            <button
              type="button"
              style={{
                ...styles.exportButton,
                ...(isExporting ? styles.exportButtonDisabled : {}),
              }}
              onClick={handleExportPreferencesPDF}
              disabled={isExporting}
            >
              {isExporting ? "Priprema..." : `Preuzmi ${getExportButtonText()}`}
            </button>

            <button
              type="button"
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              Odjavi se
            </button>
          </div>
        </div>

        {exportStatus.message && (
          <div
            style={{
              ...styles.statusBanner,
              ...(exportStatus.type === "success"
                ? styles.statusSuccess
                : exportStatus.type === "warning"
                ? styles.statusWarning
                : styles.statusError),
            }}
          >
            {exportStatus.message}
          </div>
        )}

        <div style={styles.statsRow}>
          {hasFoodPreferences && (
            <div style={styles.statBox}>
              <span style={styles.statIcon}>✿</span>
              <span style={styles.statNumber}>{stats.foodCount}</span>
              <span style={styles.statLabel}>Napomena za hranu</span>
            </div>
          )}

          {hasMusicWish && (
            <div style={styles.statBox}>
              <span style={styles.statIcon}>♪</span>
              <span style={styles.statNumber}>{stats.musicCount}</span>
              <span style={styles.statLabel}>Muzička želja</span>
            </div>
          )}

          {hasFastingOption && (
            <div style={styles.statBox}>
              <span style={styles.statIcon}>♨</span>
              <span style={styles.statNumber}>{stats.fastingCount}</span>
              <span style={styles.statLabel}>Post</span>
            </div>
          )}

          {hasFoodPreferences && hasMusicWish && (
            <div style={styles.statBox}>
              <span style={styles.statIcon}>♡</span>
              <span style={styles.statNumber}>{stats.bothCount}</span>
              <span style={styles.statLabel}>Hrana i muzika</span>
            </div>
          )}

          <div style={styles.statBox}>
            <span style={styles.statIcon}>✦</span>
            <span style={styles.statNumber}>{stats.total}</span>
            <span style={styles.statLabel}>Ukupno posebnih odgovora</span>
          </div>
        </div>
      </div>

      <div style={styles.searchCard}>
        <div style={styles.searchGrid}>
          <div style={styles.field}>
            <label htmlFor="guest-search" style={styles.label}>
              Pretraga
            </label>

            <input
              id="guest-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži po imenu, sadržaju poruke ili postu"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Filter</label>

            <div style={styles.filterGrid}>
              <button
                type="button"
                onClick={() => setFilterType("all")}
                style={{
                  ...styles.filterButton,
                  ...(filterType === "all" ? styles.filterButtonActive : {}),
                }}
              >
                Sve
              </button>

              {hasFoodPreferences && (
                <button
                  type="button"
                  onClick={() => setFilterType("food")}
                  style={{
                    ...styles.filterButton,
                    ...(filterType === "food" ? styles.filterButtonActive : {}),
                  }}
                >
                  Hrana
                </button>
              )}

              {hasMusicWish && (
                <button
                  type="button"
                  onClick={() => setFilterType("music")}
                  style={{
                    ...styles.filterButton,
                    ...(filterType === "music" ? styles.filterButtonActive : {}),
                  }}
                >
                  Muzika
                </button>
              )}

              {hasFastingOption && (
                <button
                  type="button"
                  onClick={() => setFilterType("fasting")}
                  style={{
                    ...styles.filterButton,
                    ...(filterType === "fasting"
                      ? styles.filterButtonActive
                      : {}),
                  }}
                >
                  Post
                </button>
              )}

              {hasFoodPreferences && hasMusicWish && (
                <button
                  type="button"
                  onClick={() => setFilterType("both")}
                  style={{
                    ...styles.filterButton,
                    ...(filterType === "both" ? styles.filterButtonActive : {}),
                  }}
                >
                  Hrana + muzika
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.listCard}>
        {filteredGuests.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>Nema rezultata</p>

            <p style={styles.emptyText}>
              Nema gostiju koji odgovaraju trenutnoj pretrazi ili filteru.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {filteredGuests.map((guest) => {
              const hasFood =
                hasFoodPreferences && hasTextValue(guest.foodPreferences);

              const hasMusic =
                hasMusicWish && hasTextValue(guest.musicWish);

              const hasFasting =
                hasFastingOption && hasTextValue(guest.fasting);

              const showFoodBlock =
                hasFood &&
                (filterType === "all" ||
                  filterType === "food" ||
                  filterType === "both");

              const showMusicBlock =
                hasMusic &&
                (filterType === "all" ||
                  filterType === "music" ||
                  filterType === "both");

              const showFastingBlock =
                hasFasting &&
                (filterType === "all" || filterType === "fasting");

              return (
                <div key={guest.id} style={styles.guestRow}>
                  <div style={styles.guestHeader}>
                    <div>
                      <p style={styles.guestName}>
                        {guest.fullName || "Bez imena"}
                      </p>

                      <div style={styles.metaRow}>
                        <span style={styles.metaBadge}>
                          {getAttendanceLabel(guest)}
                        </span>

                        {guest.attending === "da" && (
                          <span style={styles.metaBadge}>
                            {guest.guests || 0} osoba
                          </span>
                        )}

                        <span style={styles.metaDate}>
                          Poslato: {formatDate(guest.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div style={styles.tagRow}>
                      {hasFood && <span style={styles.softTag}>Hrana</span>}
                      {hasMusic && <span style={styles.softTag}>Muzika</span>}
                      {hasFasting && <span style={styles.softTag}>Post</span>}
                    </div>
                  </div>

                  {showFoodBlock && (
                    <div style={styles.answerBlock}>
                      <p style={styles.answerLabel}>Napomena za hranu</p>
                      <p style={styles.answerValue}>
                        {guest.foodPreferences?.trim()}
                      </p>
                    </div>
                  )}

                  {showMusicBlock && (
                    <div style={styles.answerBlock}>
                      <p style={styles.answerLabel}>Muzička želja</p>
                      <p style={styles.answerValue}>
                        {guest.musicWish?.trim()}
                      </p>
                    </div>
                  )}

                  {showFastingBlock && (
                    <div style={styles.answerBlock}>
                      <p style={styles.answerLabel}>Post</p>
                      <p style={styles.answerValue}>
                        {getFastingLabel(guest.fasting)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    background:
      "linear-gradient(180deg, #f7f1eb 0%, #f3ebe3 50%, #efe5dc 100%)",
    color: "#3f3028",
    fontFamily: "Georgia, serif",
  },
  loginCard: {
    maxWidth: "520px",
    margin: "80px auto",
    background: "rgba(255, 253, 249, 0.96)",
    borderRadius: "28px",
    padding: "32px",
    boxShadow: "0 18px 45px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
    backdropFilter: "blur(8px)",
  },
  card: {
    maxWidth: "1150px",
    margin: "0 auto 24px",
    background: "rgba(255, 253, 249, 0.96)",
    borderRadius: "30px",
    padding: "30px",
    boxShadow: "0 18px 45px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
    backdropFilter: "blur(8px)",
  },
  searchCard: {
    maxWidth: "1150px",
    margin: "0 auto 24px",
    background: "rgba(255, 253, 249, 0.96)",
    borderRadius: "24px",
    padding: "24px 28px",
    boxShadow: "0 14px 32px rgba(63, 48, 40, 0.06)",
    border: "1px solid rgba(120, 90, 70, 0.1)",
  },
  listCard: {
    maxWidth: "1150px",
    margin: "0 auto",
    background: "rgba(255, 253, 249, 0.96)",
    borderRadius: "30px",
    padding: "28px",
    boxShadow: "0 18px 45px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  },
  kicker: {
    margin: "0 0 8px",
    fontSize: "12px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#9a7b67",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "clamp(30px, 4vw, 42px)",
    lineHeight: 1.08,
  },
  subtitle: {
    margin: "0 0 8px",
    color: "#76655a",
    fontSize: "15px",
    lineHeight: 1.6,
    maxWidth: "700px",
  },
  slug: {
    margin: 0,
    color: "#8a7467",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginTop: "24px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    color: "#6c5a4f",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  input: {
    height: "48px",
    borderRadius: "16px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    padding: "0 16px",
    fontSize: "15px",
    outline: "none",
    background: "#fff",
    color: "#3f3028",
  },
  button: {
    height: "48px",
    borderRadius: "999px",
    border: "none",
    background: "#8c6b5a",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(140, 107, 90, 0.24)",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    minHeight: "46px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
    fontWeight: 600,
  },
  exportButton: {
    minHeight: "46px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid transparent",
    background: "linear-gradient(135deg, #b8826f 0%, #9f6d5c 100%)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    boxShadow: "0 10px 24px rgba(184, 130, 111, 0.28)",
  },
  exportButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  logoutButton: {
    minHeight: "46px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
    fontWeight: 600,
  },
  statusBanner: {
    marginTop: "18px",
    borderRadius: "18px",
    padding: "14px 16px",
    fontSize: "14px",
    lineHeight: 1.6,
    border: "1px solid transparent",
  },
  statusSuccess: {
    background: "#edf7f0",
    color: "#245b37",
    borderColor: "#cfe8d6",
  },
  statusWarning: {
    background: "#fff7e8",
    color: "#7a5a12",
    borderColor: "#f0ddae",
  },
  statusError: {
    background: "#fdf0ef",
    color: "#8b2f2b",
    borderColor: "#f0c8c5",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginTop: "26px",
  },
  statBox: {
    background: "linear-gradient(180deg, #f8efe7 0%, #f4e9df 100%)",
    borderRadius: "20px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    border: "1px solid rgba(120, 90, 70, 0.08)",
  },
  statIcon: {
    fontSize: "18px",
    color: "#9a7b67",
  },
  statNumber: {
    fontSize: "30px",
    fontWeight: "bold",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "14px",
    color: "#6c5a4f",
  },
  searchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    alignItems: "end",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
    gap: "10px",
    width: "100%",
  },
  filterButton: {
    minHeight: "46px",
    padding: "10px 12px",
    borderRadius: "16px",
    border: "1px solid rgba(120, 90, 70, 0.16)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: 1.2,
    textAlign: "center",
  },
  filterButtonActive: {
    background: "#8c6b5a",
    color: "#fff",
    border: "1px solid #8c6b5a",
    boxShadow: "0 8px 18px rgba(140, 107, 90, 0.22)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  guestRow: {
    padding: "22px",
    borderRadius: "22px",
    background: "linear-gradient(180deg, #fcf7f2 0%, #faf4ee 100%)",
    border: "1px solid rgba(120, 90, 70, 0.1)",
  },
  guestHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  guestName: {
    margin: "0 0 12px",
    fontSize: "22px",
    fontWeight: 600,
    color: "#3b2d25",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  metaBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: "32px",
    padding: "0 12px",
    borderRadius: "999px",
    background: "#efe3d8",
    color: "#6c5a4f",
    fontSize: "13px",
    fontWeight: 600,
  },
  metaDate: {
    fontSize: "13px",
    color: "#8a7467",
  },
  tagRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  softTag: {
    display: "inline-flex",
    alignItems: "center",
    height: "30px",
    padding: "0 12px",
    borderRadius: "999px",
    background: "rgba(140, 107, 90, 0.09)",
    color: "#7b6153",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  answerBlock: {
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid rgba(120, 90, 70, 0.1)",
  },
  answerLabel: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#9a7b67",
  },
  answerValue: {
    margin: "8px 0 0",
    fontSize: "16px",
    lineHeight: 1.7,
    color: "#3f3028",
    whiteSpace: "pre-wrap",
  },
  emptyState: {
    padding: "30px 10px",
    textAlign: "center",
  },
  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
    color: "#4a392f",
  },
  emptyText: {
    color: "#7a675b",
    margin: 0,
    lineHeight: 1.6,
  },
  error: {
    color: "#b42318",
    margin: 0,
  },
};

export default GuestPreferencesPage;