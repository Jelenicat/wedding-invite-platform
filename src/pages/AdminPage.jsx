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
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import adminAccess from "../data/adminAccess";
import demoWedding from "../data/demoWedding";
import html2pdf from "html2pdf.js";

function AdminPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [manualGuest, setManualGuest] = useState({
    fullName: "",
    guests: "1",
    fasting: "",
  });

  const [addingGuest, setAddingGuest] = useState(false);

  const [showExpenses, setShowExpenses] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [budget, setBudget] = useState(null);
  const [savingBudget, setSavingBudget] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [addingExpense, setAddingExpense] = useState(false);
  const [expenseAmountInput, setExpenseAmountInput] = useState("");
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const [guestSearch, setGuestSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    title: "",
    text: "",
    variant: "default",
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    text: "",
    confirmText: "Potvrdi",
    variant: "danger",
    actionType: "",
    payload: null,
    loading: false,
  });

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(guestSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [guestSearch]);

  const expectedPassword = adminAccess[slug];

  const invitation = useMemo(() => {
    return demoWedding.find((item) => item.slug === slug);
  }, [slug]);

  const rsvpOptions = invitation?.details?.rsvpOptions || {};
  const hasFastingOption = Boolean(rsvpOptions.fasting);

  const hasGuestPreferencesPage =
    Boolean(rsvpOptions.foodPreferences) ||
    Boolean(rsvpOptions.musicWish) ||
    hasFastingOption;

  const sanitizeNumberInput = (value) => {
    return value.replace(/[^\d]/g, "");
  };

  const formatNumberForDisplay = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("sr-RS").format(Number(value));
  };

  const getFastingLabel = (value) => {
    if (value === "posti") return "Posti";
    if (value === "ne_posti") return "Ne posti";
    return "";
  };

  const openMessageModal = ({ title, text, variant = "default" }) => {
    setMessageModal({
      isOpen: true,
      title,
      text,
      variant,
    });
  };

  const closeMessageModal = () => {
    setMessageModal({
      isOpen: false,
      title: "",
      text: "",
      variant: "default",
    });
  };

  const openConfirmModal = ({
    title,
    text,
    confirmText = "Potvrdi",
    variant = "danger",
    actionType,
    payload = null,
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      text,
      confirmText,
      variant,
      actionType,
      payload,
      loading: false,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      text: "",
      confirmText: "Potvrdi",
      variant: "danger",
      actionType: "",
      payload: null,
      loading: false,
    });
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
    let budgetLoaded = false;

    const stopLoadingIfReady = () => {
      if (guestsLoaded && expensesLoaded && budgetLoaded) {
        setLoading(false);
      }
    };

    const getTimestampMs = (item) => {
      if (typeof item?.createdAt?.toMillis === "function") {
        return item.createdAt.toMillis();
      }

      if (typeof item?.updatedAt?.toMillis === "function") {
        return item.updatedAt.toMillis();
      }

      return 0;
    };

    const unsubscribeGuests = onSnapshot(
      rsvpsRef,
      (snapshot) => {
        const data = snapshot.docs
          .map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }))
          .sort((a, b) => getTimestampMs(b) - getTimestampMs(a));

        setGuests(data);
        guestsLoaded = true;
        stopLoadingIfReady();
      },
      (err) => {
        console.error("Greška pri realtime učitavanju gostiju:", err);
        setError("Došlo je do greške pri učitavanju odgovora.");
        guestsLoaded = true;
        stopLoadingIfReady();
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

        budgetLoaded = true;
        stopLoadingIfReady();
      },
      (err) => {
        console.error("Greška pri realtime učitavanju budžeta:", err);
        budgetLoaded = true;
        stopLoadingIfReady();
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
          .sort((a, b) => getTimestampMs(b) - getTimestampMs(a));

        setExpenses(expensesData);
        expensesLoaded = true;
        stopLoadingIfReady();
      },
      (err) => {
        console.error("Greška pri realtime učitavanju troškova:", err);
        expensesLoaded = true;
        stopLoadingIfReady();
      }
    );

    return () => {
      unsubscribeGuests();
      unsubscribeEvent();
      unsubscribeExpenses();
    };
  }, [slug, isAuthorized]);

  useEffect(() => {
    if (budget === null) {
      setBudgetInput("");
    } else {
      setBudgetInput(formatNumberForDisplay(String(budget)));
    }
  }, [budget]);

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
      openMessageModal({
        title: "Nedostaje ime gosta",
        text: "Unesi ime i prezime gosta pre čuvanja.",
        variant: "warning",
      });
      return;
    }

    const guestsCount = Number(manualGuest.guests);

    if (!manualGuest.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
      openMessageModal({
        title: "Neispravan broj osoba",
        text: "Broj osoba mora biti veći od 0.",
        variant: "warning",
      });
      return;
    }

    if (hasFastingOption && !manualGuest.fasting) {
      openMessageModal({
        title: "Nedostaje informacija za post",
        text: "Izaberi da li gost posti ili ne posti.",
        variant: "warning",
      });
      return;
    }

    if (!slug) {
      openMessageModal({
        title: "Nedostaje događaj",
        text: "Slug događaja nije pronađen.",
        variant: "danger",
      });
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
        fasting: hasFastingOption ? manualGuest.fasting : "",
        source: "admin",
        createdAt: serverTimestamp(),
      });

      setManualGuest({
        fullName: "",
        guests: "1",
        fasting: "",
      });

      openMessageModal({
        title: "Gost je dodat",
        text: "Gost je uspešno dodat u listu dolazaka.",
        variant: "success",
      });
    } catch (err) {
      console.error("Greška pri ručnom dodavanju gosta:", err);
      openMessageModal({
        title: "Dodavanje nije uspelo",
        text: "Došlo je do greške pri dodavanju gosta.",
        variant: "danger",
      });
    } finally {
      setAddingGuest(false);
    }
  };

  const requestDeleteGuest = (guestId, guestName) => {
    openConfirmModal({
      title: "Obriši gosta?",
      text: `Gost "${guestName}" biće trajno uklonjen iz odgovora za ovaj događaj.`,
      confirmText: "Obriši gosta",
      variant: "danger",
      actionType: "deleteGuest",
      payload: { guestId },
    });
  };

  const handleSaveBudget = async () => {
    if (!slug) {
      openMessageModal({
        title: "Nedostaje događaj",
        text: "Slug događaja nije pronađen.",
        variant: "danger",
      });
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

        setBudget(null);
        setBudgetInput("");

        openMessageModal({
          title: "Budžet je obrisan",
          text: "Budžet više nije postavljen za ovaj događaj.",
          variant: "success",
        });
      } catch (err) {
        console.error("Greška pri čuvanju budžeta:", err);
        openMessageModal({
          title: "Čuvanje nije uspelo",
          text: "Došlo je do greške pri čuvanju budžeta.",
          variant: "danger",
        });
      } finally {
        setSavingBudget(false);
      }
      return;
    }

    const parsedBudget = Number(rawBudgetValue);

    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      openMessageModal({
        title: "Neispravan budžet",
        text: "Unesi ispravan iznos budžeta.",
        variant: "warning",
      });
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

      setBudget(parsedBudget);
      setBudgetInput(formatNumberForDisplay(String(parsedBudget)));

      openMessageModal({
        title: "Budžet je sačuvan",
        text: `Novi budžet je ${formatCurrency(parsedBudget)}.`,
        variant: "success",
      });
    } catch (err) {
      console.error("Greška pri čuvanju budžeta:", err);
      openMessageModal({
        title: "Čuvanje nije uspelo",
        text: "Došlo je do greške pri čuvanju budžeta.",
        variant: "danger",
      });
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
      openMessageModal({
        title: "Nedostaje naziv troška",
        text: "Unesi naziv troška pre čuvanja.",
        variant: "warning",
      });
      return;
    }

    const amount = Number(expenseForm.amount);

    if (!expenseForm.amount || Number.isNaN(amount) || amount <= 0) {
      openMessageModal({
        title: "Neispravan iznos",
        text: "Iznos troška mora biti veći od 0.",
        variant: "warning",
      });
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

      openMessageModal({
        title: "Trošak je dodat",
        text: `${expenseForm.title.trim()} je uspešno dodat u listu troškova.`,
        variant: "success",
      });
    } catch (err) {
      console.error("Greška pri dodavanju troška:", err);
      openMessageModal({
        title: "Dodavanje nije uspelo",
        text: "Došlo je do greške pri dodavanju troška.",
        variant: "danger",
      });
    } finally {
      setAddingExpense(false);
    }
  };

  const requestDeleteExpense = (expenseId, expenseTitle) => {
    openConfirmModal({
      title: "Obriši trošak?",
      text: `Trošak "${expenseTitle}" biće trajno uklonjen iz liste troškova.`,
      confirmText: "Obriši trošak",
      variant: "danger",
      actionType: "deleteExpense",
      payload: { expenseId },
    });
  };

  const handleConfirmAction = async () => {
    const { actionType, payload } = confirmModal;

    try {
      setConfirmModal((prev) => ({ ...prev, loading: true }));

      if (actionType === "deleteGuest") {
        const guestId = payload.guestId;

        await deleteDoc(doc(db, "events", slug, "rsvps", guestId));

        const tableGuestsRef = collection(db, "events", slug, "tableGuests");
        const snapshot = await getDocs(tableGuestsRef);

        for (const docItem of snapshot.docs) {
          if (docItem.data().guestId === guestId) {
            await deleteDoc(doc(db, "events", slug, "tableGuests", docItem.id));
          }
        }

        closeConfirmModal();
        openMessageModal({
          title: "Gost je obrisan",
          text: "Gost je uklonjen i iz rasporeda sedenja.",
          variant: "success",
        });

        return;
      }

      if (actionType === "deleteExpense") {
        await deleteDoc(doc(db, "events", slug, "expenses", payload.expenseId));

        closeConfirmModal();
        openMessageModal({
          title: "Trošak je obrisan",
          text: "Izabrani trošak je uspešno uklonjen.",
          variant: "success",
        });
        return;
      }

      closeConfirmModal();
    } catch (err) {
      console.error("Greška pri potvrdi akcije:", err);
      closeConfirmModal();
      openMessageModal({
        title: "Akcija nije uspela",
        text: "Došlo je do greške pri izvršavanju izabrane akcije.",
        variant: "danger",
      });
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

  const normalizedSearch = debouncedSearch.trim().toLowerCase();

  const comingGuests = useMemo(
    () =>
      guests.filter((guest) => {
        if (guest.attending !== "da") return false;

        if (!normalizedSearch) return true;

        const nameMatch = (guest.fullName || "")
          .toLowerCase()
          .includes(normalizedSearch);

        const fastingMatch = getFastingLabel(guest.fasting)
          .toLowerCase()
          .includes(normalizedSearch);

        return nameMatch || fastingMatch;
      }),
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

  const budgetUsagePercent = useMemo(() => {
    if (typeof budget !== "number" || budget <= 0) return 0;
    return Math.min((totalExpenses / budget) * 100, 100);
  }, [budget, totalExpenses]);

  const handleExportPDF = async () => {
    if (isExportingPdf) return;

    const exportGuests = guests.filter((guest) => guest.attending === "da");

    if (!exportGuests.length) {
      openMessageModal({
        title: "Nema podataka za eksport",
        text: "Trenutno nema gostiju koji dolaze.",
        variant: "warning",
      });
      return;
    }

    setIsExportingPdf(true);

    const element = document.createElement("div");

    try {
      const totalConfirmed = exportGuests.reduce((sum, guest) => {
        return sum + (Number(guest.guests) || 0);
      }, 0);

      const totalDeclined = guests.filter(
        (guest) => guest.attending === "ne"
      ).length;

      const formattedDate = new Date().toLocaleString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const escapeHtml = (value = "") =>
        String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");

      const chunkArray = (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size));
        }
        return chunks;
      };

      const guestsPerPage = 20;
      const guestChunks = chunkArray(exportGuests, guestsPerPage);
      const totalPages = guestChunks.length;

      const pagesHtml = guestChunks
        .map((guestChunk, pageIndex) => {
          const guestRows = guestChunk
            .map(
              (guest, rowIndex) => `
                <tr>
                  <td class="col-index">
                    ${pageIndex * guestsPerPage + rowIndex + 1}.
                  </td>

                  <td class="col-name">
                    ${escapeHtml(guest.fullName || "")}
                  </td>

             <td class="col-count">
  ${Number(guest.guests) || 0}
</td>

${
  hasFastingOption
    ? `
      <td class="col-fasting">
        ${escapeHtml(getFastingLabel(guest.fasting) || "—")}
      </td>
    `
    : ""
}

<td class="col-source">
                    ${guest.source === "admin" ? "Ručno dodat" : "RSVP forma"}
                  </td>

                  <td class="col-date">
                    ${escapeHtml(formatDate(guest.createdAt) || "—")}
                  </td>
                </tr>
              `
            )
            .join("");

          return `
            <section class="pdf-page ${
              pageIndex < totalPages - 1 ? "page-break" : ""
            }">
              <div class="pdf-shell">
                <div class="hero">
                  <div class="topline">Wedding admin export</div>
                  <h1 class="title">Spisak potvrđenih gostiju</h1>
                  <p class="subtitle">
                    Događaj: <strong>${escapeHtml(slug)}</strong><br />
                    Generisano: ${escapeHtml(formattedDate)}<br />
                    Strana: <strong>${pageIndex + 1} / ${totalPages}</strong>
                  </p>
                </div>

                ${
                  pageIndex === 0
                    ? `
                  <div class="summary-grid">
                    <div class="summary-card">
                      <p class="summary-label">Potvrđeni odgovori</p>
                      <p class="summary-value">${exportGuests.length}</p>
                    </div>

                    <div class="summary-card">
                      <p class="summary-label">Ukupno osoba</p>
                      <p class="summary-value">${totalConfirmed}</p>
                    </div>

                    <div class="summary-card">
                      <p class="summary-label">Ne dolaze</p>
                      <p class="summary-value">${totalDeclined}</p>
                    </div>
                  </div>
                `
                    : ""
                }

                <div class="section-wrap">
                  <div class="section-title-row">
                    <div class="section-title">Lista gostiju</div>
                  </div>

                  <div class="table-card">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Ime i prezime</th>
                  <th style="text-align:right;">Broj osoba</th>
${hasFastingOption ? `<th>Post</th>` : ""}
<th>Izvor</th>
                          <th>Datum odgovora</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${guestRows}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="footer">
                  <div class="footer-line"></div>
                  Dokument generisan iz admin panela
                </div>
              </div>
            </section>
          `;
        })
        .join("");

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

            .topline {
              font-size: 10px;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: #a1775f;
              margin-bottom: 12px;
            }

            .title {
              margin: 0;
              font-size: 28px;
              line-height: 1.1;
              font-weight: 700;
              color: #6b5447;
            }

            .subtitle {
              margin: 10px 0 0;
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
            }

            .table-card {
              background: #ffffff;
              border: 1px solid #e5d6c8;
              border-radius: 18px;
              padding: 12px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            thead {
              display: table-header-group;
            }

            tr,
            td,
            th,
            tbody tr {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            thead th {
              text-align: left;
              padding: 8px 5px 10px;
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #8b7364;
              border-bottom: 1px solid #eaded3;
            }

            tbody td {
              padding: 7px 5px;
              font-size: 11px;
              border-bottom: 1px solid #f1e8e0;
              vertical-align: top;
            }

            tbody tr:last-child td {
              border-bottom: none;
            }

            .col-index {
              width: 34px;
              color: #9a8374;
            }

            .col-name {
              font-weight: 700;
              color: #6b5447;
            }

            .col-count {
              width: 62px;
              text-align: right;
              font-weight: 700;
            }

            .col-fasting {
              width: 72px;
              color: #7a675b;
            }

            .col-source {
              width: 92px;
              color: #7a675b;
            }

            .col-date {
              width: 120px;
              color: #7a675b;
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
          filename: `spisak-gostiju-${slug}.pdf`,
          image: { type: "jpeg", quality: 0.9 },
          html2canvas: {
            scale: 1,
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
    } catch (error) {
      console.error("PDF export failed:", error);

      try {
        const htmlDocument = `
          <!DOCTYPE html>
          <html lang="sr">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Spisak gostiju - ${slug}</title>
            </head>
            <body style="margin:0; background:#f6efe8;">
              ${element.innerHTML}
            </body>
          </html>
        `;

        const blob = new Blob([htmlDocument], {
          type: "text/html;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `spisak-gostiju-${slug}.html`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);

        openMessageModal({
          title: "PDF nije uspeo",
          text: "Preuzet je HTML fajl koji možete otvoriti i sačuvati ili odštampati kao PDF.",
          variant: "warning",
        });
      } catch (fallbackError) {
        console.error("Fallback export failed:", fallbackError);

        openMessageModal({
          title: "Eksport nije uspeo",
          text: "Došlo je do greške pri eksportu. Pokušajte ponovo.",
          variant: "danger",
        });
      }
    } finally {
      element.remove();
      setIsExportingPdf(false);
    }
  };

  const getModalAccentStyle = (variant) => {
    if (variant === "success") {
      return {
        badgeBg: "#e7f5ec",
        badgeColor: "#287a4b",
        buttonBg: "#287a4b",
      };
    }

    if (variant === "warning") {
      return {
        badgeBg: "#fbf3d7",
        badgeColor: "#8a6a12",
        buttonBg: "#8a6a12",
      };
    }

    if (variant === "danger") {
      return {
        badgeBg: "#fbeaea",
        badgeColor: "#a53030",
        buttonBg: "#b42318",
      };
    }

    return {
      badgeBg: "#f3ece5",
      badgeColor: "#9a7b67",
      buttonBg: "#b8826f",
    };
  };

  const messageAccent = getModalAccentStyle(messageModal.variant);
  const confirmAccent = getModalAccentStyle(confirmModal.variant);

  const getPressableProps = (baseStyle, extraStyle = {}) => ({
    style: {
      ...baseStyle,
      ...extraStyle,
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = "translateY(1px) scale(0.98)";
    },
    onMouseUp: (e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
    },
    onTouchStart: (e) => {
      e.currentTarget.style.transform = "translateY(1px) scale(0.985)";
    },
    onTouchEnd: (e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
    },
  });

  if (!isAuthorized) {
    return (
      <div style={{ ...styles.page, ...(isMobile ? styles.pageMobile : {}) }}>
        <div
          style={{
            ...styles.loginCard,
            ...(isMobile ? styles.sectionCardMobile : {}),
          }}
        >
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

            <button type="submit" {...getPressableProps(styles.button)}>
              Uloguj se
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ ...styles.page, ...(isMobile ? styles.pageMobile : {}) }}>
        <div
          style={{
            ...styles.headerCard,
            ...(isMobile ? styles.sectionCardMobile : {}),
          }}
        >
          <h1 style={styles.title}>Admin panel</h1>
          <p>Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.page, ...(isMobile ? styles.pageMobile : {}) }}>
        <div
          style={{
            ...styles.headerCard,
            ...(isMobile ? styles.sectionCardMobile : {}),
          }}
        >
          <h1 style={styles.title}>Admin panel</h1>
          <p style={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ ...styles.page, ...(isMobile ? styles.pageMobile : {}) }}>
        <div
          style={{
            ...styles.headerCard,
            ...(isMobile ? styles.sectionCardMobile : {}),
          }}
        >
          <div
            style={{
              ...styles.headerTop,
              ...(isMobile ? styles.headerTopMobile : {}),
            }}
          >
            <div>
              <p style={styles.kicker}>Admin panel</p>
              <h1 style={styles.title}>Pregled odgovora</h1>
              <p style={styles.slug}>Događaj: {slug}</p>
            </div>

            <div
              style={{
                ...styles.actions,
                ...(isMobile ? styles.actionsMobile : {}),
              }}
            >
              <button
                type="button"
                onClick={() => navigate(`/admin/${slug}/seating`)}
                {...getPressableProps(
                  styles.secondaryButton,
                  isMobile ? styles.topButtonMobile : {}
                )}
              >
                Napravi raspored
              </button>

              {hasGuestPreferencesPage && (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/${slug}/preferences`)}
                  {...getPressableProps(
                    styles.secondaryButton,
                    isMobile ? styles.topButtonMobile : {}
                  )}
                >
                  RSVP želje gostiju
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowExpenses((prev) => !prev)}
                {...getPressableProps(
                  styles.secondaryButton,
                  isMobile ? styles.topButtonMobile : {}
                )}
              >
                {showExpenses ? "Zatvori troškove" : "Troškovi"}
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExportingPdf}
                {...getPressableProps(
                  {
                    ...styles.exportButton,
                    ...(isExportingPdf ? styles.exportButtonDisabled : {}),
                  },
                  isMobile ? styles.topButtonMobile : {}
                )}
              >
                {isExportingPdf ? "Priprema PDF..." : "Preuzmi PDF"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                {...getPressableProps(
                  styles.logoutButton,
                  isMobile ? styles.topButtonMobile : {}
                )}
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
              <span
                style={{
                  ...styles.statNumber,
                  fontSize: isMobile ? "32px" : "38px",
                  color: "#2f241f",
                }}
              >
                {totalConfirmedPeople}
              </span>
              <span style={styles.statLabel}>Ukupno osoba</span>
            </div>
          </div>
        </div>

        {showExpenses && (
          <div
            style={{
              ...styles.expensesCard,
              ...(isMobile ? styles.sectionCardMobile : {}),
            }}
          >
            <div style={styles.expensesTop}>
              <div>
                <p style={styles.manualKicker}>Planiranje</p>
                <h2 style={styles.sectionTitle}>Budžet i troškovi</h2>
              </div>
            </div>

            <div
              style={{
                ...styles.budgetBlock,
                ...(isMobile ? styles.budgetBlockMobile : {}),
              }}
            >
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
                  placeholder="Na primer 500.000"
                  style={styles.input}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveBudget}
                {...getPressableProps(
                  styles.button,
                  isMobile ? styles.fullWidthButton : {}
                )}
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
                    fontSize: isMobile ? "28px" : "34px",
                    color:
                      remainingBudget == null
                        ? "#3f3028"
                        : remainingBudget < 0
                        ? "#b42318"
                        : "#2f241f",
                  }}
                >
                  {remainingBudget == null
                    ? "—"
                    : formatCurrency(remainingBudget)}
                </span>
                <span style={styles.statLabel}>Preostalo</span>
              </div>
            </div>

            <div style={styles.budgetProgressCard}>
              <div style={styles.budgetProgressTop}>
                <div>
                  <p style={styles.progressKicker}>Praćenje budžeta</p>
                  <h3 style={styles.progressTitle}>
                    Potrošnja u odnosu na plan
                  </h3>
                </div>

                <div
                  style={{
                    ...styles.progressBadge,
                    ...(typeof budget !== "number"
                      ? styles.progressBadgeNeutral
                      : remainingBudget < 0
                      ? styles.progressBadgeDanger
                      : budgetUsagePercent >= 80
                      ? styles.progressBadgeWarning
                      : styles.progressBadgeSuccess),
                  }}
                >
                  {typeof budget !== "number"
                    ? "Dodaj budžet"
                    : remainingBudget < 0
                    ? "Prekoračeno"
                    : `${Math.round(budgetUsagePercent)}% iskorišćeno`}
                </div>
              </div>

              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width:
                      typeof budget !== "number"
                        ? "0%"
                        : `${budgetUsagePercent}%`,
                    background:
                      typeof budget !== "number"
                        ? "linear-gradient(135deg, #d8c7b7, #ceb8a6)"
                        : remainingBudget < 0
                        ? "linear-gradient(135deg, #d95c51, #b42318)"
                        : budgetUsagePercent >= 80
                        ? "linear-gradient(135deg, #d2a04a, #b98118)"
                        : "linear-gradient(135deg, #b8826f, #a06a57)",
                  }}
                />
              </div>

              <p style={styles.progressNote}>
                {typeof budget !== "number"
                  ? "Postavi budžet da bi odmah videla koliko je već potrošeno i koliko je ostalo."
                  : remainingBudget < 0
                  ? `Troškovi su premašili plan za ${formatCurrency(
                      Math.abs(remainingBudget)
                    )}.`
                  : `Do sada je potrošeno ${formatCurrency(
                      totalExpenses
                    )}, a ostalo je još ${formatCurrency(remainingBudget)}.`}
              </p>
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

              <button
                type="submit"
                {...getPressableProps(
                  styles.button,
                  isMobile ? styles.fullWidthButton : {}
                )}
                disabled={addingExpense}
              >
                {addingExpense ? "Dodavanje..." : "Dodaj trošak"}
              </button>
            </form>

            <div style={styles.cardInner}>
              <h3 style={styles.subTitle}>Lista troškova</h3>

              {expenses.length === 0 ? (
                <p style={styles.emptyText}>
                  Još nema unetih troškova.
                  <br />
                  Dodaj prvi trošak da odmah vidiš kako se menja budžet.
                </p>
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
                            requestDeleteExpense(expense.id, expense.title)
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

        <div
          style={{
            ...styles.manualCard,
            ...(isMobile ? styles.sectionCardMobile : {}),
          }}
        >
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

            {hasFastingOption && (
              <div style={styles.field}>
                <label htmlFor="manual-fasting" style={styles.label}>
                  Da li posti?
                </label>

                <select
                  id="manual-fasting"
                  name="fasting"
                  value={manualGuest.fasting}
                  onChange={handleManualGuestChange}
                  style={styles.input}
                  required
                >
                  <option value="">Izaberi opciju</option>
                  <option value="posti">Posti</option>
                  <option value="ne_posti">Ne posti</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              {...getPressableProps(
                styles.button,
                isMobile ? styles.fullWidthButton : {}
              )}
              disabled={addingGuest}
            >
              {addingGuest ? "Dodavanje..." : "Dodaj gosta"}
            </button>
          </form>
        </div>

        <div
          style={{
            ...styles.searchCard,
            ...(isMobile ? styles.sectionCardMobile : {}),
          }}
        >
          <div style={styles.searchField}>
            <label htmlFor="guest-search" style={styles.label}>
              Pretraga gostiju
            </label>
            <input
              id="guest-search"
              type="text"
              value={guestSearch}
              onChange={(e) => setGuestSearch(e.target.value)}
             placeholder={
  hasFastingOption
    ? "Pretraži po imenu, prezimenu ili postu"
    : "Pretraži po imenu i prezimenu"
}
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
                  : "Još nema potvrđenih dolazaka. Kada gosti krenu da potvrđuju prisustvo, ovde ćeš ih videti."}
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

                       {hasFastingOption && guest.fasting && (
  <p style={styles.guestMeta}>
    Post: {getFastingLabel(guest.fasting)}
  </p>
)}

                          {guest.source === "admin" && (
                            <p style={styles.manualBadge}>Ručno dodat</p>
                          )}
                        </div>

                        <button
                          type="button"
                          style={styles.deleteButton}
                          onClick={() =>
                            requestDeleteGuest(guest.id, guest.fullName)
                          }
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
                  : "Još nema negativnih odgovora. Ako neko odbije poziv, pojaviće se ovde."}
              </p>
            ) : (
              <div style={styles.scrollList}>
                <div style={styles.list}>
                  {notComingGuests.map((guest) => (
                    <div key={guest.id} style={styles.guestRow}>
                      <div style={styles.guestRowTop}>
                        <div>
                          <p style={styles.guestName}>{guest.fullName}</p>
                          <p style={styles.guestMeta}>
                            Nije u mogućnosti da dođe
                          </p>
                        </div>

                        <button
                          type="button"
                          style={styles.deleteButton}
                          onClick={() =>
                            requestDeleteGuest(guest.id, guest.fullName)
                          }
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

      {messageModal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div
              style={{
                ...styles.modalBadge,
                background: messageAccent.badgeBg,
                color: messageAccent.badgeColor,
              }}
            >
              {messageModal.variant === "success" && "Uspešno"}
              {messageModal.variant === "warning" && "Pažnja"}
              {messageModal.variant === "danger" && "Greška"}
              {messageModal.variant === "default" && "Obaveštenje"}
            </div>

            <h3 style={styles.modalTitle}>{messageModal.title}</h3>
            <p style={styles.modalText}>{messageModal.text}</p>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={closeMessageModal}
                style={{
                  ...styles.modalPrimaryButton,
                  background: messageAccent.buttonBg,
                }}
              >
                U redu
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div
              style={{
                ...styles.modalBadge,
                background: confirmAccent.badgeBg,
                color: confirmAccent.badgeColor,
              }}
            >
              Potvrda
            </div>

            <h3 style={styles.modalTitle}>{confirmModal.title}</h3>
            <p style={styles.modalText}>{confirmModal.text}</p>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={closeConfirmModal}
                style={styles.modalSecondaryButton}
                disabled={confirmModal.loading}
              >
                Otkaži
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                style={{
                  ...styles.modalPrimaryButton,
                  background: confirmAccent.buttonBg,
                }}
                disabled={confirmModal.loading}
              >
                {confirmModal.loading
                  ? "Sačekaj..."
                  : confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
  pageMobile: {
    padding: "24px 14px",
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
  exportButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    boxShadow: "none",
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
  sectionCardMobile: {
    borderRadius: "20px",
    padding: "18px",
    marginBottom: "18px",
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
  headerTopMobile: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  actionsMobile: {
    width: "100%",
    flexDirection: "column",
    gap: "10px",
  },
  topButtonMobile: {
    width: "100%",
    minWidth: "100%",
    justifyContent: "center",
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
  budgetBlockMobile: {
    gridTemplateColumns: "1fr",
    alignItems: "stretch",
  },
  fullWidthButton: {
    width: "100%",
    minWidth: "100%",
    padding: "0 18px",
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
    background: "linear-gradient(135deg, #b8826f, #a06a57)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "0 22px",
    whiteSpace: "normal",
    textAlign: "center",
    boxShadow: "0 8px 18px rgba(184,130,111,0.25)",
    transition:
      "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    height: "44px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    display: "inline-flex",
    alignItems: "center",
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
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    height: "44px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
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
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },
  budgetProgressCard: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #fffdfb 0%, #fbf6f1 100%)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  budgetProgressTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  progressKicker: {
    margin: 0,
    fontSize: "11px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#9a7b67",
  },
  progressTitle: {
    margin: "6px 0 0",
    fontSize: "20px",
    lineHeight: 1.2,
    color: "#2f241f",
  },
  progressBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  },
  progressBadgeSuccess: {
    background: "#efe7dd",
    color: "#8d5f50",
  },
  progressBadgeWarning: {
    background: "#fbf3d7",
    color: "#8a6a12",
  },
  progressBadgeDanger: {
    background: "#fbeaea",
    color: "#b42318",
  },
  progressBadgeNeutral: {
    background: "#f3ece5",
    color: "#8d7364",
  },
  progressTrack: {
    marginTop: "16px",
    width: "100%",
    height: "12px",
    borderRadius: "999px",
    background: "#efe4da",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.35s ease",
    boxShadow: "0 8px 18px rgba(184,130,111,0.18)",
  },
  progressNote: {
    margin: "12px 0 0",
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#6c5a4f",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(34, 27, 22, 0.38)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 9999,
  },
  modalCard: {
    width: "100%",
    maxWidth: "480px",
    background: "#fffdf9",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 24px 70px rgba(63, 48, 40, 0.18)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  modalBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "14px",
  },
  modalTitle: {
    margin: "0 0 10px",
    fontSize: "30px",
    lineHeight: 1.1,
    color: "#3f3028",
  },
  modalText: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.6,
    color: "#6b584c",
  },
  modalActions: {
    marginTop: "26px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  modalPrimaryButton: {
    height: "46px",
    padding: "0 20px",
    borderRadius: "999px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },
  modalSecondaryButton: {
    height: "46px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(120, 90, 70, 0.16)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
    fontSize: "14px",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },
};

export default AdminPage;