import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import adminAccess from "../data/adminAccess";

function AdminPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [manualGuest, setManualGuest] = useState({
    fullName: "",
    guests: 1,
  });
  const [addingGuest, setAddingGuest] = useState(false);

  const expectedPassword = adminAccess[slug];

  useEffect(() => {
    const savedAccess = localStorage.getItem(`admin-access-${slug}`);
    if (savedAccess === "true") {
      setIsAuthorized(true);
    }
  }, [slug]);

  const fetchGuests = async () => {
    if (!slug || !isAuthorized) return;

    try {
      setLoading(true);
      setError("");

      const q = query(collection(db, "rsvps"), where("slug", "==", slug));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setGuests(data);
    } catch (err) {
      console.error("Greška pri učitavanju gostiju:", err);
      setError("Došlo je do greške pri učitavanju odgovora.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [slug, isAuthorized]);

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

  const handleManualGuestChange = (e) => {
    const { name, value } = e.target;

    setManualGuest((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();

    if (!manualGuest.fullName.trim()) {
      alert("Unesite ime i prezime gosta.");
      return;
    }

    if (!slug) {
      alert("Nedostaje slug događaja.");
      return;
    }

    try {
      setAddingGuest(true);

      await addDoc(collection(db, "rsvps"), {
        slug,
        eventType: "manual",
        fullName: manualGuest.fullName.trim(),
        attending: "da",
        guests: Number(manualGuest.guests) || 1,
        source: "admin",
        createdAt: serverTimestamp(),
      });

      setManualGuest({
        fullName: "",
        guests: 1,
      });

      await fetchGuests();
    } catch (err) {
      console.error("Greška pri ručnom dodavanju gosta:", err);
      alert("Došlo je do greške pri dodavanju gosta.");
    } finally {
      setAddingGuest(false);
    }
  };

  const handleDeleteGuest = async (guestId, guestName) => {
    const confirmed = window.confirm(
      `Da li ste sigurni da želite da obrišete gosta "${guestName}"?`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "rsvps", guestId));
      await fetchGuests();
    } catch (err) {
      console.error("Greška pri brisanju gosta:", err);
      alert("Došlo je do greške pri brisanju gosta.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date =
        typeof timestamp.toDate === "function"
          ? timestamp.toDate()
          : new Date(timestamp);

      return date.toLocaleString("sr-RS");
    } catch {
      return "";
    }
  };

  const escapeCsvValue = (value) => {
    const stringValue = value == null ? "" : String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const comingGuests = useMemo(
    () => guests.filter((guest) => guest.attending === "da"),
    [guests]
  );

  const notComingGuests = useMemo(
    () => guests.filter((guest) => guest.attending === "ne"),
    [guests]
  );

  const totalConfirmedPeople = useMemo(
    () =>
      comingGuests.reduce((sum, guest) => {
        return sum + (Number(guest.guests) || 0);
      }, 0),
    [comingGuests]
  );

  const handleExportCSV = () => {
    if (!comingGuests.length) {
      alert("Nema gostiju koji dolaze za eksport.");
      return;
    }

    const headers = [
      "Ime i prezime",
      "Broj osoba",
      "Izvor",
      "Datum odgovora",
    ];

    const rows = comingGuests.map((guest) => [
      guest.fullName || "",
      guest.guests || 0,
      guest.source === "admin" ? "Ručno dodat" : "RSVP forma",
      formatDate(guest.createdAt),
    ]);

    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `dolaze-${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (!isAuthorized) {
    return (
      <div style={styles.page}>
        <div style={styles.loginCard}>
          <p style={styles.kicker}>Admin pristup</p>
          <h1 style={styles.title}>Prijava</h1>
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

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.headerCard}>
          <h1 style={styles.title}>Admin panel</h1>
          <p>Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.headerCard}>
          <h1 style={styles.title}>Admin panel</h1>
          <p style={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div style={styles.headerTop}>
          <div>
            <p style={styles.kicker}>Admin panel</p>
            <h1 style={styles.title}>Pregled odgovora</h1>
            <p style={styles.slug}>Događaj: {slug}</p>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate(`/admin/${slug}/seating`)}
              style={styles.secondaryButton}
            >
              Napravi raspored
            </button>

            <button type="button" onClick={handleExportCSV} style={styles.exportButton}>
              Eksport dolazaka
            </button>

            <button type="button" onClick={handleLogout} style={styles.logoutButton}>
              Odjavi se
            </button>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{comingGuests.length}</span>
            <span style={styles.statLabel}>Potvrdilo dolazak</span>
          </div>

          <div style={styles.statBox}>
            <span style={styles.statNumber}>{notComingGuests.length}</span>
            <span style={styles.statLabel}>Ne dolazi</span>
          </div>

          <div style={styles.statBox}>
            <span style={styles.statNumber}>{totalConfirmedPeople}</span>
            <span style={styles.statLabel}>Ukupno osoba</span>
          </div>
        </div>
      </div>

      <div style={styles.manualCard}>
        <p style={styles.manualKicker}>Ručni unos</p>
        <h2 style={styles.sectionTitle}>Dodaj gosta koji dolazi</h2>

        <form onSubmit={handleAddGuest} style={styles.manualForm}>
          <div style={styles.field}>
            <label htmlFor="manual-fullName" style={styles.label}>
              Ime i prezime
            </label>
            <input
              id="manual-fullName"
              type="text"
              name="fullName"
              value={manualGuest.fullName}
              onChange={handleManualGuestChange}
              placeholder="Unesite ime i prezime"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="manual-guests" style={styles.label}>
              Broj osoba
            </label>
            <input
              id="manual-guests"
              type="number"
              name="guests"
              min="1"
              max="20"
              value={manualGuest.guests}
              onChange={handleManualGuestChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={addingGuest}>
            {addingGuest ? "Dodavanje..." : "Dodaj gosta"}
          </button>
        </form>
      </div>

      <div style={styles.columns}>
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Dolaze</h2>

          {comingGuests.length === 0 ? (
            <p style={styles.emptyText}>Još nema potvrđenih dolazaka.</p>
          ) : (
            <div style={styles.list}>
              {comingGuests.map((guest) => (
                <div key={guest.id} style={styles.guestRow}>
                  <div style={styles.guestRowTop}>
                    <div>
                      <p style={styles.guestName}>{guest.fullName}</p>
                      <p style={styles.guestMeta}>
                        Broj osoba: {guest.guests || 0}
                      </p>
                      {guest.source === "admin" && (
                        <p style={styles.manualBadge}>Ručno dodat</p>
                      )}
                    </div>

                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() => handleDeleteGuest(guest.id, guest.fullName)}
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Ne dolaze</h2>

          {notComingGuests.length === 0 ? (
            <p style={styles.emptyText}>Još nema negativnih odgovora.</p>
          ) : (
            <div style={styles.list}>
              {notComingGuests.map((guest) => (
                <div key={guest.id} style={styles.guestRow}>
                  <div style={styles.guestRowTop}>
                    <div>
                      <p style={styles.guestName}>{guest.fullName}</p>
                      <p style={styles.guestMeta}>Nije u mogućnosti da dođe</p>
                    </div>

                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() => handleDeleteGuest(guest.id, guest.fullName)}
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "#f8f3ed",
    color: "#3f3028",
    fontFamily: "Georgia, serif",
  },
  loginCard: {
    maxWidth: "480px",
    margin: "80px auto",
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  headerCard: {
    maxWidth: "1100px",
    margin: "0 auto 24px",
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  manualCard: {
    maxWidth: "1100px",
    margin: "0 auto 24px",
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  kicker: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#9a7b67",
  },
  manualKicker: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#9a7b67",
  },
  title: {
    margin: "10px 0 8px",
    fontSize: "36px",
    lineHeight: 1.1,
  },
  slug: {
    margin: 0,
    color: "#7b675b",
  },
  form: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  manualForm: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    alignItems: "end",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#6c5a4f",
  },
  input: {
    height: "52px",
    borderRadius: "14px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    padding: "0 16px",
    fontSize: "16px",
    outline: "none",
    background: "#fff",
  },
  button: {
    height: "52px",
    borderRadius: "999px",
    border: "none",
    background: "#b8826f",
    color: "#fff",
    fontSize: "15px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "0 22px",
  },
  secondaryButton: {
    height: "44px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
  },
  exportButton: {
    height: "44px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "none",
    background: "#b8826f",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  logoutButton: {
    height: "44px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginTop: "24px",
  },
  statBox: {
    background: "#f5ede5",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statNumber: {
    fontSize: "30px",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6c5a4f",
  },
  columns: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "24px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  guestRow: {
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#faf5ef",
    border: "1px solid rgba(120, 90, 70, 0.1)",
  },
  guestRowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  guestName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
  },
  guestMeta: {
    margin: "6px 0 0",
    color: "#7a675b",
    fontSize: "14px",
  },
  manualBadge: {
    margin: "8px 0 0",
    fontSize: "12px",
    color: "#9a7b67",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  emptyText: {
    color: "#7a675b",
    margin: 0,
  },
  error: {
    color: "#b42318",
    margin: 0,
  },
  deleteButton: {
    height: "40px",
    padding: "0 16px",
    borderRadius: "999px",
    border: "1px solid rgba(180, 35, 24, 0.18)",
    background: "#fff",
    color: "#b42318",
    cursor: "pointer",
    fontSize: "13px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    flexShrink: 0,
  },
};

export default AdminPage;