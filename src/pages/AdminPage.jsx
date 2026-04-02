import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot,
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
    guests: "1",
  });
  const [addingGuest, setAddingGuest] = useState(false);

  const [showExpenses, setShowExpenses] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [budget, setBudget] = useState(null);
  const [savingBudget, setSavingBudget] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [addingExpense, setAddingExpense] = useState(false);
  const [expenseAmountInput, setExpenseAmountInput] = useState("");
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const [guestSearch, setGuestSearch] = useState("");

  const expectedPassword = adminAccess[slug];

  const sanitizeNumberInput = (value) => {
    return value.replace(/[^\d]/g, "");
  };

  const formatNumberForDisplay = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("sr-RS").format(Number(value));
  };

  useEffect(() => {
    const savedAccess = localStorage.getItem(`admin-access-${slug}`);
    if (savedAccess === "true") {
      setIsAuthorized(true);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug || !isAuthorized) return;

    setLoading(true);
    setError("");

    const rsvpsRef = collection(db, "events", slug, "rsvps");
    const eventRef = doc(db, "events", slug);
    const expensesRef = collection(db, "events", slug, "expenses");

    let guestsLoaded = false;
    let expensesLoaded = false;

    const stopLoadingIfReady = () => {
      if (guestsLoaded && expensesLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeGuests = onSnapshot(
      rsvpsRef,
      (snapshot) => {
        const data = snapshot.docs
          .map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }))
          .sort((a, b) => {
            const aMs =
              typeof a?.createdAt?.toMillis === "function"
                ? a.createdAt.toMillis()
                : 0;
            const bMs =
              typeof b?.createdAt?.toMillis === "function"
                ? b.createdAt.toMillis()
                : 0;

            return bMs - aMs;
          });

        setGuests(data);
        guestsLoaded = true;
        stopLoadingIfReady();
      },
      (err) => {
        console.error("Greška pri realtime učitavanju gostiju:", err);
        setError("Došlo je do greške pri učitavanju odgovora.");
        setLoading(false);
      }
    );

    const unsubscribeEvent = onSnapshot(
      eventRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const eventData = snapshot.data();
          const savedBudget = eventData?.budget;

          if (typeof savedBudget === "number") {
            setBudget(savedBudget);
          } else {
            setBudget(null);
          }
        } else {
          setBudget(null);
        }
      },
      (err) => {
        console.error("Greška pri realtime učitavanju budžeta:", err);
      }
    );

    const unsubscribeExpenses = onSnapshot(
      expensesRef,
      (snapshot) => {
        const expensesData = snapshot.docs
          .map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }))
          .sort((a, b) => {
            const aMs =
              typeof a?.createdAt?.toMillis === "function"
                ? a.createdAt.toMillis()
                : 0;
            const bMs =
              typeof b?.createdAt?.toMillis === "function"
                ? b.createdAt.toMillis()
                : 0;

            return bMs - aMs;
          });

        setExpenses(expensesData);
        expensesLoaded = true;
        stopLoadingIfReady();
      },
      (err) => {
        console.error("Greška pri realtime učitavanju troškova:", err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeGuests();
      unsubscribeEvent();
      unsubscribeExpenses();
    };
  }, [slug, isAuthorized]);

  useEffect(() => {
    if (isEditingBudget) return;

    if (budget === null) {
      setBudgetInput("");
    } else {
      setBudgetInput(formatNumberForDisplay(String(budget)));
    }
  }, [budget, isEditingBudget]);

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
      [name]: value,
    }));
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();

    if (!manualGuest.fullName.trim()) {
      alert("Unesite ime i prezime gosta.");
      return;
    }

    const guestsCount = Number(manualGuest.guests);

    if (!manualGuest.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
      alert("Unesite ispravan broj osoba.");
      return;
    }

    if (!slug) {
      alert("Nedostaje slug događaja.");
      return;
    }

    try {
      setAddingGuest(true);

      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, "events", slug, "rsvps"), {
        slug,
        eventType: "manual",
        fullName: manualGuest.fullName.trim(),
        attending: "da",
        guests: guestsCount,
        source: "admin",
        createdAt: serverTimestamp(),
      });

      setManualGuest({
        fullName: "",
        guests: "1",
      });
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
      await deleteDoc(doc(db, "events", slug, "rsvps", guestId));
    } catch (err) {
      console.error("Greška pri brisanju gosta:", err);
      alert("Došlo je do greške pri brisanju gosta.");
    }
  };

  const handleSaveBudget = async () => {
    if (!slug) {
      alert("Nedostaje slug događaja.");
      return;
    }

    const rawBudgetValue = sanitizeNumberInput(budgetInput);

    if (rawBudgetValue.trim() === "") {
      try {
        setSavingBudget(true);

        await setDoc(
          doc(db, "events", slug),
          {
            budget: null,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        setIsEditingBudget(false);
        alert("Budžet je obrisan.");
      } catch (err) {
        console.error("Greška pri čuvanju budžeta:", err);
        alert("Došlo je do greške pri čuvanju budžeta.");
      } finally {
        setSavingBudget(false);
      }
      return;
    }

    const parsedBudget = Number(rawBudgetValue);

    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      alert("Unesite ispravan budžet.");
      return;
    }

    try {
      setSavingBudget(true);

      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          budget: parsedBudget,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setIsEditingBudget(false);
      alert("Budžet je sačuvan.");
    } catch (err) {
      console.error("Greška pri čuvanju budžeta:", err);
      alert("Došlo je do greške pri čuvanju budžeta.");
    } finally {
      setSavingBudget(false);
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const cleaned = sanitizeNumberInput(value);
      setExpenseAmountInput(formatNumberForDisplay(cleaned));
      setExpenseForm((prev) => ({
        ...prev,
        amount: cleaned,
      }));
      return;
    }

    setExpenseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!expenseForm.title.trim()) {
      alert("Unesite naziv troška.");
      return;
    }

    const amount = Number(expenseForm.amount);

    if (!expenseForm.amount || Number.isNaN(amount) || amount <= 0) {
      alert("Unesite ispravan iznos.");
      return;
    }

    try {
      setAddingExpense(true);

      await addDoc(collection(db, "events", slug, "expenses"), {
        title: expenseForm.title.trim(),
        amount,
        category: expenseForm.category.trim(),
        createdAt: serverTimestamp(),
      });

      setExpenseForm({
        title: "",
        amount: "",
        category: "",
      });
      setExpenseAmountInput("");
    } catch (err) {
      console.error("Greška pri dodavanju troška:", err);
      alert("Došlo je do greške pri dodavanju troška.");
    } finally {
      setAddingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId, expenseTitle) => {
    const confirmed = window.confirm(
      `Da li ste sigurni da želite da obrišete trošak "${expenseTitle}"?`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "events", slug, "expenses", expenseId));
    } catch (err) {
      console.error("Greška pri brisanju troška:", err);
      alert("Došlo je do greške pri brisanju troška.");
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };



  const normalizedSearch = guestSearch.trim().toLowerCase();

  const comingGuests = useMemo(
    () =>
      guests.filter(
        (guest) =>
          guest.attending === "da" &&
          (!normalizedSearch ||
            (guest.fullName || "").toLowerCase().includes(normalizedSearch))
      ),
    [guests, normalizedSearch]
  );

  const notComingGuests = useMemo(
    () =>
      guests.filter(
        (guest) =>
          guest.attending === "ne" &&
          (!normalizedSearch ||
            (guest.fullName || "").toLowerCase().includes(normalizedSearch))
      ),
    [guests, normalizedSearch]
  );

  const totalConfirmedPeople = useMemo(
    () =>
      guests
        .filter((guest) => guest.attending === "da")
        .reduce((sum, guest) => {
          return sum + (Number(guest.guests) || 0);
        }, 0),
    [guests]
  );

  const totalExpenses = useMemo(
    () =>
      expenses.reduce((sum, item) => {
        return sum + (Number(item.amount) || 0);
      }, 0),
    [expenses]
  );

  const remainingBudget = useMemo(() => {
    if (typeof budget !== "number") return null;
    return budget - totalExpenses;
  }, [budget, totalExpenses]);

const handleExportPDF = () => {
  const exportGuests = guests.filter((guest) => guest.attending === "da");

  if (!exportGuests.length) {
    alert("Nema gostiju koji dolaze za eksport.");
    return;
  }

  const totalConfirmed = exportGuests.reduce((sum, guest) => {
    return sum + (Number(guest.guests) || 0);
  }, 0);

  const formattedDate = new Date().toLocaleString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const guestRows = exportGuests
    .map(
      (guest, index) => `
        <tr>
          <td class="col-index">${index + 1}.</td>
          <td class="col-name">${guest.fullName || ""}</td>
          <td class="col-count">${Number(guest.guests) || 0}</td>
          <td class="col-source">
            ${guest.source === "admin" ? "Ručno dodat" : "RSVP forma"}
          </td>
          <td class="col-date">${formatDate(guest.createdAt) || "—"}</td>
        </tr>
      `
    )
    .join("");

  const printWindow = window.open("", "_blank", "width=1200,height=900");

  if (!printWindow) {
    alert("Dozvoli popup prozor kako bi PDF/štampa radili.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="sr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Spisak dolazaka - ${slug}</title>
        <style>
          :root {
            --bg: #f7f1eb;
            --paper: #fffdf9;
            --line: #e7dbcf;
            --line-strong: #d8c7b7;
            --text: #2f241f;
            --muted: #7b675b;
            --accent: #a87361;
            --accent-soft: #f4e8e1;
          }

          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: var(--text);
            font-family: "Georgia", "Times New Roman", serif;
          }

          body {
            padding: 26px;
          }

          .sheet {
            max-width: 1100px;
            margin: 0 auto;
          }

          .hero {
            position: relative;
            overflow: hidden;
            background:
              radial-gradient(circle at top right, rgba(168,115,97,0.08), transparent 32%),
              linear-gradient(180deg, #fffdfb 0%, #fbf6f1 100%);
            border: 1px solid var(--line);
            border-radius: 28px;
            padding: 34px 34px 28px;
            margin-bottom: 22px;
          }

          .hero-topline {
            letter-spacing: 0.22em;
            text-transform: uppercase;
            font-size: 11px;
            color: var(--accent);
            margin-bottom: 14px;
          }

          .hero h1 {
            margin: 0;
            font-size: 38px;
            line-height: 1.08;
            font-weight: 700;
            color: var(--text);
          }

          .hero-subtitle {
            margin-top: 10px;
            font-size: 15px;
            color: var(--muted);
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-top: 24px;
          }

          .summary-card {
            background: rgba(255,255,255,0.78);
            border: 1px solid var(--line);
            border-radius: 20px;
            padding: 16px 18px;
          }

          .summary-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: var(--muted);
            margin-bottom: 8px;
          }

          .summary-value {
            font-size: 28px;
            font-weight: 700;
            color: var(--text);
            line-height: 1;
          }

          .summary-note {
            margin-top: 6px;
            font-size: 13px;
            color: var(--muted);
          }

          .section-title-wrap {
            display: flex;
            align-items: center;
            gap: 14px;
            margin: 28px 2px 18px;
          }

          .section-title-wrap::before,
          .section-title-wrap::after {
            content: "";
            flex: 1;
            height: 1px;
            background: var(--line-strong);
          }

          .section-title {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--accent);
            white-space: nowrap;
          }

          .table-wrap {
            background: var(--paper);
            border: 1px solid var(--line);
            border-radius: 24px;
            padding: 20px;
            box-shadow: 0 10px 28px rgba(63, 48, 40, 0.06);
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead th {
            padding: 12px 8px 14px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--muted);
            border-bottom: 1px solid var(--line);
          }

          tbody td {
            padding: 12px 8px;
            border-bottom: 1px solid #f0e7df;
            font-size: 14px;
            vertical-align: top;
          }

          tbody tr:last-child td {
            border-bottom: none;
          }

          .col-index {
            width: 54px;
            color: var(--muted);
          }

          .col-name {
            font-weight: 600;
            color: var(--text);
          }

          .col-count {
            width: 110px;
            text-align: right;
            font-weight: 700;
          }

          .col-source {
            width: 170px;
            color: var(--muted);
          }

          .col-date {
            width: 190px;
            color: var(--muted);
          }

          .footer-note {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--line);
            text-align: center;
            color: var(--muted);
            font-size: 12px;
            letter-spacing: 0.04em;
          }

          @page {
            size: A4;
            margin: 14mm;
          }

          @media print {
            body {
              padding: 0;
              background: #fff;
            }

            .sheet {
              max-width: 100%;
            }

            .hero,
            .table-wrap {
              box-shadow: none;
            }
          }

          @media (max-width: 900px) {
            .summary-grid {
              grid-template-columns: 1fr;
            }

            .col-date,
            .col-source {
              width: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <section class="hero">
            <div class="hero-topline">Wedding Guest Report</div>
            <h1>Spisak potvrđenih dolazaka</h1>
            <div class="hero-subtitle">
              Događaj: <strong>${slug}</strong><br />
              Generisano: ${formattedDate}
            </div>

            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-label">Broj prijava</div>
                <div class="summary-value">${exportGuests.length}</div>
                <div class="summary-note">Broj potvrđenih odgovora</div>
              </div>

              <div class="summary-card">
                <div class="summary-label">Ukupno osoba</div>
                <div class="summary-value">${totalConfirmed}</div>
                <div class="summary-note">Zbir svih prijavljenih gostiju</div>
              </div>

              <div class="summary-card">
                <div class="summary-label">Negativni odgovori</div>
                <div class="summary-value">
                  ${guests.filter((guest) => guest.attending === "ne").length}
                </div>
                <div class="summary-note">Gosti koji ne dolaze</div>
              </div>
            </div>
          </section>

          <div class="section-title-wrap">
            <div class="section-title">Lista gostiju</div>
          </div>

          <section class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ime i prezime</th>
                  <th style="text-align:right;">Broj osoba</th>
                  <th>Izvor</th>
                  <th>Datum odgovora</th>
                </tr>
              </thead>
              <tbody>
                ${guestRows}
              </tbody>
            </table>
          </section>

          <div class="footer-note">
            Dokument je pripremljen za štampu ili čuvanje kao PDF.
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 300);
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

            <button
              type="button"
              onClick={() => setShowExpenses((prev) => !prev)}
              style={styles.secondaryButton}
            >
              {showExpenses ? "Zatvori troškove" : "Troškovi"}
            </button>

      <button
  type="button"
  onClick={handleExportPDF}
  style={styles.exportButton}
>
  Preuzmi PDF
</button>

            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Odjavi se
            </button>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>
              {guests.filter((guest) => guest.attending === "da").length}
            </span>
            <span style={styles.statLabel}>Potvrdilo dolazak</span>
          </div>

          <div style={styles.statBox}>
            <span style={styles.statNumber}>
              {guests.filter((guest) => guest.attending === "ne").length}
            </span>
            <span style={styles.statLabel}>Ne dolazi</span>
          </div>

          <div style={styles.statBox}>
            <span style={styles.statNumber}>{totalConfirmedPeople}</span>
            <span style={styles.statLabel}>Ukupno osoba</span>
          </div>
        </div>
      </div>

      {showExpenses && (
        <div style={styles.expensesCard}>
          <div style={styles.expensesTop}>
            <div>
              <p style={styles.manualKicker}>Planiranje</p>
              <h2 style={styles.sectionTitle}>Budžet i troškovi</h2>
            </div>
          </div>

          <div style={styles.budgetBlock}>
            <div style={styles.field}>
              <label htmlFor="budget-input" style={styles.label}>
                Budžet (opciono)
              </label>
              <input
                id="budget-input"
                type="text"
                inputMode="numeric"
                value={budgetInput}
                onChange={(e) => {
                  const cleaned = sanitizeNumberInput(e.target.value);
                  setBudgetInput(formatNumberForDisplay(cleaned));
                }}
                onFocus={() => setIsEditingBudget(true)}
                onBlur={() => setIsEditingBudget(false)}
                placeholder="Na primer 500.000"
                style={styles.input}
              />
            </div>

            <button
              type="button"
              onClick={handleSaveBudget}
              style={styles.button}
              disabled={savingBudget}
            >
              {savingBudget ? "Čuvanje..." : "Sačuvaj budžet"}
            </button>
          </div>

          <div style={styles.expenseStatsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>
                {typeof budget === "number" ? formatCurrency(budget) : "—"}
              </span>
              <span style={styles.statLabel}>Budžet</span>
            </div>

            <div style={styles.statBox}>
              <span style={styles.statNumber}>
                {formatCurrency(totalExpenses)}
              </span>
              <span style={styles.statLabel}>Ukupni troškovi</span>
            </div>

            <div style={styles.statBox}>
              <span
                style={{
                  ...styles.statNumber,
                  color:
                    remainingBudget == null
                      ? "#3f3028"
                      : remainingBudget < 0
                      ? "#b42318"
                      : "#3f3028",
                }}
              >
                {remainingBudget == null ? "—" : formatCurrency(remainingBudget)}
              </span>
              <span style={styles.statLabel}>Preostalo</span>
            </div>
          </div>

          <form onSubmit={handleAddExpense} style={styles.expenseForm}>
            <div style={styles.field}>
              <label htmlFor="expense-title" style={styles.label}>
                Naziv troška
              </label>
              <input
                id="expense-title"
                type="text"
                name="title"
                value={expenseForm.title}
                onChange={handleExpenseChange}
                placeholder="Na primer restoran"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="expense-amount" style={styles.label}>
                Iznos
              </label>
              <input
                id="expense-amount"
                type="text"
                inputMode="numeric"
                name="amount"
                value={expenseAmountInput}
                onChange={handleExpenseChange}
                placeholder="Na primer 120.000"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="expense-category" style={styles.label}>
                Kategorija
              </label>
              <input
                id="expense-category"
                type="text"
                name="category"
                value={expenseForm.category}
                onChange={handleExpenseChange}
                placeholder="Na primer hrana, muzika, dekoracija"
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button} disabled={addingExpense}>
              {addingExpense ? "Dodavanje..." : "Dodaj trošak"}
            </button>
          </form>

          <div style={styles.cardInner}>
            <h3 style={styles.subTitle}>Lista troškova</h3>

            {expenses.length === 0 ? (
              <p style={styles.emptyText}>Još nema unetih troškova.</p>
            ) : (
              <div style={styles.list}>
                {expenses.map((expense) => (
                  <div key={expense.id} style={styles.guestRow}>
                    <div style={styles.guestRowTop}>
                      <div>
                        <p style={styles.guestName}>{expense.title}</p>
                        <p style={styles.guestMeta}>
                          Iznos: {formatCurrency(expense.amount)}
                        </p>
                        {expense.category && (
                          <p style={styles.guestMeta}>
                            Kategorija: {expense.category}
                          </p>
                        )}
                        <p style={styles.guestMeta}>
                          Datum: {formatDate(expense.createdAt)}
                        </p>
                      </div>

                      <button
                        type="button"
                        style={styles.deleteButton}
                        onClick={() =>
                          handleDeleteExpense(expense.id, expense.title)
                        }
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

      <div style={styles.searchCard}>
        <div style={styles.searchField}>
          <label htmlFor="guest-search" style={styles.label}>
            Pretraga gostiju
          </label>
          <input
            id="guest-search"
            type="text"
            value={guestSearch}
            onChange={(e) => setGuestSearch(e.target.value)}
            placeholder="Pretraži po imenu i prezimenu"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.columns}>
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Dolaze</h2>

          {comingGuests.length === 0 ? (
            <p style={styles.emptyText}>
              {guestSearch.trim()
                ? "Nema rezultata za ovu pretragu."
                : "Još nema potvrđenih dolazaka."}
            </p>
          ) : (
            <div style={styles.scrollList}>
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
            </div>
          )}
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Ne dolaze</h2>

          {notComingGuests.length === 0 ? (
            <p style={styles.emptyText}>
              {guestSearch.trim()
                ? "Nema rezultata za ovu pretragu."
                : "Još nema negativnih odgovora."}
            </p>
          ) : (
            <div style={styles.scrollList}>
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
  expensesCard: {
    maxWidth: "1100px",
    margin: "0 auto 24px",
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  searchCard: {
    maxWidth: "1100px",
    margin: "0 auto 24px",
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "20px 24px",
    boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  searchField: {
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cardInner: {
    marginTop: "20px",
    background: "#faf5ef",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid rgba(120, 90, 70, 0.1)",
  },
  expensesTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
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
  subTitle: {
    margin: "0 0 16px",
    fontSize: "22px",
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
  expenseForm: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    alignItems: "end",
  },
  budgetBlock: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "minmax(220px, 320px) auto",
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
  expenseStatsRow: {
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
    display: "flex",
    flexDirection: "column",
    minHeight: "560px",
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
  scrollList: {
    maxHeight: "420px",
    overflowY: "auto",
    paddingRight: "6px",
    flex: 1,
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