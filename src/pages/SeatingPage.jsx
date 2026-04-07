import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import adminAccess from "../data/adminAccess";
import html2pdf from "html2pdf.js";
import { getDocs } from "firebase/firestore";
function SeatingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");

  const [tables, setTables] = useState([]);
  const [comingGuests, setComingGuests] = useState([]);
  const [tableGuests, setTableGuests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [tableForm, setTableForm] = useState({
    name: "",
    capacity: "8",
  });
  const [addingTable, setAddingTable] = useState(false);

  const [openAssignTableId, setOpenAssignTableId] = useState(null);
  const [selectedGuestsByTable, setSelectedGuestsByTable] = useState({});
  const [assigningGuest, setAssigningGuest] = useState(false);
  const [guestSearchByTable, setGuestSearchByTable] = useState({});

  const prevOpenAssignTableIdRef = useRef(null);

  const [editCapacityModal, setEditCapacityModal] = useState({
    isOpen: false,
    tableId: "",
    tableName: "",
    capacity: "",
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    title: "",
    text: "",
    confirmText: "",
    payload: null,
  });

  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    title: "",
    text: "",
  });

  const expectedPassword = adminAccess[slug];

  const openConfirmModal = ({ type, title, text, confirmText, payload }) => {
    setConfirmModal({
      isOpen: true,
      type,
      title,
      text,
      confirmText,
      payload,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      title: "",
      text: "",
      confirmText: "",
      payload: null,
    });
  };

  const openMessageModal = ({ title, text }) => {
    setMessageModal({
      isOpen: true,
      title,
      text,
    });
  };

  const closeMessageModal = () => {
    setMessageModal({
      isOpen: false,
      title: "",
      text: "",
    });
  };

  const openEditCapacityModal = (table) => {
    setEditCapacityModal({
      isOpen: true,
      tableId: table.id,
      tableName: table.name,
      capacity: String(table.capacity || ""),
    });
  };

  const closeEditCapacityModal = () => {
    setEditCapacityModal({
      isOpen: false,
      tableId: "",
      tableName: "",
      capacity: "",
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

    const tablesRef = collection(db, "events", slug, "tables");
    const guestsRef = collection(db, "events", slug, "rsvps");
    const tableGuestsRef = collection(db, "events", slug, "tableGuests");

    let tablesLoaded = false;
    let guestsLoaded = false;
    let tableGuestsLoaded = false;

    const stopLoadingIfReady = () => {
      if (tablesLoaded && guestsLoaded && tableGuestsLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeTables = onSnapshot(
      tablesRef,
      (snapshot) => {
        const tablesData = snapshot.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
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

            return aMs - bMs;
          });

        setTables(tablesData);
        tablesLoaded = true;
        stopLoadingIfReady();
      },
      (error) => {
        console.error("Greška pri učitavanju stolova:", error);
        openMessageModal({
          title: "Greška",
          text: "Došlo je do greške pri učitavanju stolova.",
        });
        setLoading(false);
      }
    );

    const unsubscribeGuests = onSnapshot(
      guestsRef,
      (snapshot) => {
        const guestsData = snapshot.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
          }))
          .filter((guest) => guest.attending === "da")
          .sort((a, b) => {
            const aName = (a.fullName || "").toLowerCase();
            const bName = (b.fullName || "").toLowerCase();
            return aName.localeCompare(bName, "sr");
          });

        setComingGuests(guestsData);
        guestsLoaded = true;
        stopLoadingIfReady();
      },
      (error) => {
        console.error("Greška pri učitavanju gostiju:", error);
        openMessageModal({
          title: "Greška",
          text: "Došlo je do greške pri učitavanju gostiju.",
        });
        setLoading(false);
      }
    );

    const unsubscribeTableGuests = onSnapshot(
      tableGuestsRef,
      (snapshot) => {
        const tableGuestsData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setTableGuests(tableGuestsData);
        tableGuestsLoaded = true;
        stopLoadingIfReady();
      },
      (error) => {
        console.error("Greška pri učitavanju rasporeda:", error);
        openMessageModal({
          title: "Greška",
          text: "Došlo je do greške pri učitavanju rasporeda.",
        });
        setLoading(false);
      }
    );

    return () => {
      unsubscribeTables();
      unsubscribeGuests();
      unsubscribeTableGuests();
    };
  }, [slug, isAuthorized]);
useEffect(() => {
  if (!slug || !isAuthorized) return;
  


  const cleanupDeletedGuests = async () => {
    const existingGuestIds = new Set(comingGuests.map((g) => g.id));

    const toDelete = tableGuests.filter(
      (assignment) => !existingGuestIds.has(assignment.guestId)
    );

    if (toDelete.length === 0) return;

    try {
     

    for (const item of toDelete) {
  await deleteDoc(doc(db, "events", slug, "tableGuests", item.id));
}
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  };

  cleanupDeletedGuests();
}, [comingGuests, tableGuests, slug, isAuthorized]);
  useEffect(() => {
    setSelectedGuestsByTable((prev) => {
      let hasChanges = false;

      const next = Object.fromEntries(
        Object.entries(prev).map(([tableId, guestIds]) => {
          const cleanedGuestIds = (guestIds || []).filter((guestId) => {
            const guestStillExists = comingGuests.some((guest) => guest.id === guestId);
            if (!guestStillExists) return false;

            const assignment = tableGuests.find((item) => item.guestId === guestId);
            return !assignment || assignment.tableId === tableId;
          });

          if (cleanedGuestIds.length !== (guestIds || []).length) {
            hasChanges = true;
          }

          return [tableId, cleanedGuestIds];
        })
      );

      return hasChanges ? next : prev;
    });
  }, [comingGuests, tableGuests]);

  useEffect(() => {
    setGuestSearchByTable((prev) => {
      let hasChanges = false;
      const validTableIds = new Set(tables.map((table) => table.id));

      const next = Object.fromEntries(
        Object.entries(prev).filter(([tableId]) => {
          const keep = validTableIds.has(tableId);
          if (!keep) hasChanges = true;
          return keep;
        })
      );

      return hasChanges ? next : prev;
    });

    setSelectedGuestsByTable((prev) => {
      let hasChanges = false;
      const validTableIds = new Set(tables.map((table) => table.id));

      const next = Object.fromEntries(
        Object.entries(prev).filter(([tableId]) => {
          const keep = validTableIds.has(tableId);
          if (!keep) hasChanges = true;
          return keep;
        })
      );

      return hasChanges ? next : prev;
    });

    if (openAssignTableId && !tables.some((table) => table.id === openAssignTableId)) {
      setOpenAssignTableId(null);
    }
  }, [tables, openAssignTableId]);

  useEffect(() => {
    const prevTableId = prevOpenAssignTableIdRef.current;

    if (prevTableId && prevTableId !== openAssignTableId) {
      setSelectedGuestsByTable((prev) => {
        if (!prev[prevTableId]?.length) return prev;
        return {
          ...prev,
          [prevTableId]: [],
        };
      });

      setGuestSearchByTable((prev) => {
        if (!prev[prevTableId]) return prev;
        return {
          ...prev,
          [prevTableId]: "",
        };
      });
    }

    prevOpenAssignTableIdRef.current = openAssignTableId;
  }, [openAssignTableId]);

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

  const handleTableInputChange = (e) => {
    const { name, value } = e.target;

    setTableForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTable = async (e) => {
    e.preventDefault();

    if (!tableForm.name.trim()) {
      openMessageModal({
        title: "Naziv stola nedostaje",
        text: "Unesi naziv stola.",
      });
      return;
    }

    const capacityCount = Number(tableForm.capacity);

    if (!tableForm.capacity || Number.isNaN(capacityCount) || capacityCount < 1) {
      openMessageModal({
        title: "Neispravan kapacitet",
        text: "Kapacitet mora biti veći od 0.",
      });
      return;
    }

    try {
      setAddingTable(true);

      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, "events", slug, "tables"), {
        name: tableForm.name.trim(),
        capacity: capacityCount,
        createdAt: serverTimestamp(),
      });

      setTableForm({
        name: "",
        capacity: "8",
      });
    } catch (error) {
      console.error("Greška pri dodavanju stola:", error);
      openMessageModal({
        title: "Greška",
        text: "Došlo je do greške pri dodavanju stola.",
      });
    } finally {
      setAddingTable(false);
    }
  };

  const getAssignmentsForTable = (tableId) => {
    return tableGuests.filter((item) => item.tableId === tableId);
  };

  const getOccupiedSeats = (tableId) => {
    return getAssignmentsForTable(tableId).reduce(
      (sum, item) => sum + (Number(item.guests) || 0),
      0
    );
  };

  const getGuestAssignment = (guestId) => {
    return tableGuests.find((item) => item.guestId === guestId);
  };

  const getTableNameById = (tableId) => {
    const table = tables.find((item) => item.id === tableId);
    return table?.name || "Nepoznat sto";
  };

  const getGuestSeatCount = (guestId) => {
    const guest = comingGuests.find((item) => item.id === guestId);
    return Number(guest?.guests) || 0;
  };

  const getSelectedSeatCountForTable = (tableId) => {
    const selectedIds = selectedGuestsByTable[tableId] || [];
    return selectedIds.reduce((sum, guestId) => {
      return sum + getGuestSeatCount(guestId);
    }, 0);
  };

  const canSelectGuestForTable = (table, guestId) => {
    const selectedIds = selectedGuestsByTable[table.id] || [];
    if (selectedIds.includes(guestId)) return true;

    const occupiedSeats = getOccupiedSeats(table.id);
    const selectedSeats = getSelectedSeatCountForTable(table.id);
    const guestSeats = getGuestSeatCount(guestId);

    return occupiedSeats + selectedSeats + guestSeats <= Number(table.capacity);
  };

  const getTableStatus = (table) => {
    const occupiedSeats = getOccupiedSeats(table.id);
    const capacity = Number(table.capacity) || 0;
    const freeSeats = capacity - occupiedSeats;

    if (freeSeats <= 0) return "full";
    if (freeSeats <= 2) return "warning";
    return "good";
  };

  const totalComingPeople = useMemo(() => {
    return comingGuests.reduce((sum, guest) => {
      return sum + (Number(guest.guests) || 0);
    }, 0);
  }, [comingGuests]);

  const unassignedGuests = useMemo(() => {
    return comingGuests.filter((guest) => !getGuestAssignment(guest.id));
  }, [comingGuests, tableGuests]);

  const unassignedGuestsCount = useMemo(() => {
    return unassignedGuests.reduce((sum, guest) => {
      return sum + (Number(guest.guests) || 0);
    }, 0);
  }, [unassignedGuests]);

const handleExportSeatingPDF = async () => {
  if (!tables.length) {
    openMessageModal({
      title: "Nema podataka",
      text: "Nema stolova za eksport.",
    });
    return;
  }

  const totalAssignedPeople = tableGuests.reduce(
    (sum, item) => sum + (Number(item.guests) || 0),
    0
  );

  const totalCapacity = tables.reduce(
    (sum, table) => sum + (Number(table.capacity) || 0),
    0
  );

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

  // 4 je sigurnije za veće rasporede
  const tablesPerPage = 2;
  const tableChunks = chunkArray(tables, tablesPerPage);
  const totalPages = tableChunks.length;

  const pagesHtml = tableChunks
    .map((tableChunk, pageIndex) => {
      const printableTablesHtml = tableChunk
        .map((table, localIndex) => {
          const globalIndex = pageIndex * tablesPerPage + localIndex;
          const assignments = getAssignmentsForTable(table.id);
          const occupiedSeats = getOccupiedSeats(table.id);
          const capacity = Number(table.capacity) || 0;
          const freeSeats = Math.max(capacity - occupiedSeats, 0);

          const guestRows =
            assignments.length > 0
              ? assignments
                  .map(
                    (item, guestIndex) => `
                      <tr>
                        <td class="guest-index">${guestIndex + 1}.</td>
                        <td class="guest-name">${escapeHtml(item.fullName || "")}</td>
                        <td class="guest-count">${Number(item.guests) || 0}</td>
                      </tr>
                    `
                  )
                  .join("")
              : `
                  <tr>
                    <td colspan="3" class="empty-row">
                      Nema raspoređenih gostiju za ovim stolom.
                    </td>
                  </tr>
                `;

          return `
            <section class="table-card">
              <div class="table-card-top">
                <div>
                  <div class="table-number">Sto ${globalIndex + 1}</div>
                  <h2>${escapeHtml(table.name)}</h2>
                </div>

                <div class="table-badges">
                  <span class="badge">Kapacitet: ${capacity}</span>
                  <span class="badge">Zauzeto: ${occupiedSeats}</span>
                  <span class="badge ${freeSeats <= 0 ? "badge-full" : "badge-free"}">
                    Slobodno: ${freeSeats}
                  </span>
                </div>
              </div>

              <div class="table-divider"></div>

              <table>
                <thead>
                  <tr>
                    <th style="width:48px;">#</th>
                    <th>Gost</th>
                    <th style="width:110px; text-align:right;">Osoba</th>
                  </tr>
                </thead>
                <tbody>
                  ${guestRows}
                </tbody>
              </table>
            </section>
          `;
        })
        .join("");

      return `
        <section class="pdf-page ${pageIndex < totalPages - 1 ? "page-break" : ""}">
          <div class="pdf-shell">
            <section class="hero">
              <div class="hero-topline">Wedding Seating Plan</div>
              <h1>Raspored sedenja</h1>
              <div class="hero-subtitle">
                Događaj: <strong>${escapeHtml(slug)}</strong><br />
                Generisano: ${escapeHtml(formattedDate)}<br />
                Strana: <strong>${pageIndex + 1} / ${totalPages}</strong>
              </div>
            </section>

            ${
              pageIndex === 0
                ? `
              <div class="summary-grid">
                <div class="summary-card">
                  <div class="summary-label">Ukupno stolova</div>
                  <div class="summary-value">${tables.length}</div>
                  <div class="summary-note">Pripremljenih za raspored</div>
                </div>

                <div class="summary-card">
                  <div class="summary-label">Gostiju koji dolaze</div>
                  <div class="summary-value">${totalComingPeople}</div>
                  <div class="summary-note">Potvrđeni dolasci</div>
                </div>

                <div class="summary-card">
                  <div class="summary-label">Raspoređenih osoba</div>
                  <div class="summary-value">${totalAssignedPeople}</div>
                  <div class="summary-note">Već dodeljeno stolovima</div>
                </div>

                <div class="summary-card">
                  <div class="summary-label">Slobodnih mesta</div>
                  <div class="summary-value">${Math.max(
                    totalCapacity - totalAssignedPeople,
                    0
                  )}</div>
                  <div class="summary-note">Preostali kapacitet</div>
                </div>
              </div>
            `
                : ""
            }

            <div class="section-wrap">
              <div class="section-title-row">
                <div class="section-title">Pregled po stolovima</div>
              </div>

              <section class="tables-grid">
                ${printableTablesHtml}
              </section>
            </div>

            <div class="footer">
              <div class="footer-line"></div>
              Ukupno neraspoređenih osoba: <strong>${unassignedGuestsCount}</strong>
            </div>
          </div>
        </section>
      `;
    })
    .join("");

  const element = document.createElement("div");
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
          grid-template-columns: repeat(4, 1fr);
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

        .tables-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .table-card {
          background: #ffffff;
          border: 1px solid #e5d6c8;
          border-radius: 18px;
          padding: 14px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .table-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          flex-wrap: wrap;
        }

        .table-number {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #7b675b;
          margin-bottom: 6px;
        }

        .table-card h2 {
          margin: 0;
          font-size: 22px;
          line-height: 1.12;
          color: #6b5447;
        }

        .table-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
          max-width: 260px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 28px;
          padding: 5px 10px;
          border-radius: 999px;
          background: #f4e8e1;
          color: #7a5549;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid #ead6cb;
          white-space: nowrap;
        }

        .badge-free {
          background: #e6f2e8;
          color: #2e5c36;
          border-color: #cfe0d2;
        }

        .badge-full {
          background: #f8e7e5;
          color: #9d4036;
          border-color: #e7c5c1;
        }

        .table-divider {
          height: 1px;
          background: #e0d0c3;
          margin: 14px 0 12px;
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
          padding: 8px 5px 10px;
          text-align: left;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #8b7364;
          border-bottom: 1px solid #eaded3;
        }

        tbody td {
          padding: 7px 5px;
          border-bottom: 1px solid #f0e7df;
          font-size: 12px;
          vertical-align: top;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .guest-index {
          color: #9a8374;
          width: 42px;
        }

        .guest-name {
          color: #5f4b3f;
        }

        .guest-count {
          text-align: right;
          font-weight: 700;
          color: #6b5447;
        }

        .empty-row {
          padding: 14px 6px;
          color: #7b675b;
          font-style: italic;
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

  try {
    await html2pdf()
      .set({
        margin: [4, 4, 4, 4],
        filename: `raspored-sedenja-${slug}.pdf`,
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
  } catch (error) {
    console.error("Greška pri eksportu rasporeda:", error);
    openMessageModal({
      title: "Greška",
      text: "Došlo je do greške pri kreiranju PDF fajla.",
    });
  }
};
  const handleSaveCapacity = async () => {
    const newCapacity = Number(editCapacityModal.capacity);
    const occupiedSeats = getOccupiedSeats(editCapacityModal.tableId);

    if (!newCapacity || Number.isNaN(newCapacity) || newCapacity < 1) {
      openMessageModal({
        title: "Neispravan kapacitet",
        text: "Kapacitet mora biti veći od 0.",
      });
      return;
    }

    if (newCapacity < occupiedSeats) {
      openMessageModal({
        title: "Kapacitet je premali",
        text: `Ovaj sto trenutno ima ${occupiedSeats} zauzetih mesta. Novi kapacitet ne može biti manji od toga.`,
      });
      return;
    }

    try {
      await setDoc(
        doc(db, "events", slug, "tables", editCapacityModal.tableId),
        {
          capacity: newCapacity,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      closeEditCapacityModal();
    } catch (error) {
      console.error("Greška pri izmeni kapaciteta:", error);
      openMessageModal({
        title: "Greška",
        text: "Došlo je do greške pri izmeni kapaciteta.",
      });
    }
  };

  const handleAssignGuest = async (table) => {
    const selectedGuestIds = selectedGuestsByTable[table.id] || [];

    if (selectedGuestIds.length === 0) {
      openMessageModal({
        title: "Izaberi goste",
        text: "Potrebno je da prvo izabereš bar jednog gosta.",
      });
      return;
    }

    try {
      setAssigningGuest(true);

      const guestsToAdd = [];
      const guestsToMove = [];
      let simulatedAssignments = [...tableGuests];

      for (const guestId of selectedGuestIds) {
        const guest = comingGuests.find((g) => g.id === guestId);
        if (!guest) continue;

        const existingAssignment = simulatedAssignments.find(
          (item) => item.guestId === guestId
        );

        if (existingAssignment?.tableId === table.id) {
          continue;
        }

        const guestSeats = Number(guest.guests) || 0;

        if (existingAssignment) {
          const simulatedWithoutCurrent = simulatedAssignments.filter(
            (item) => item.guestId !== guestId
          );

          const occupiedSeats = simulatedWithoutCurrent
            .filter((item) => item.tableId === table.id)
            .reduce((sum, item) => sum + (Number(item.guests) || 0), 0);

          const freeSeats = Number(table.capacity) - occupiedSeats;

          if (guestSeats > freeSeats) {
            openMessageModal({
              title: "Nema dovoljno mesta",
              text: `Nema dovoljno mesta za gosta ${guest.fullName} na stolu "${table.name}".`,
            });
            setAssigningGuest(false);
            return;
          }

          guestsToMove.push({
            guest,
            existingAssignmentId: existingAssignment.id,
            oldTableName: getTableNameById(existingAssignment.tableId),
          });

          simulatedAssignments = [
            ...simulatedWithoutCurrent,
            {
              tableId: table.id,
              tableName: table.name,
              guestId: guest.id,
              fullName: guest.fullName,
              guests: guestSeats,
            },
          ];

          continue;
        }

        const occupiedSeats = simulatedAssignments
          .filter((item) => item.tableId === table.id)
          .reduce((sum, item) => sum + (Number(item.guests) || 0), 0);

        const freeSeats = Number(table.capacity) - occupiedSeats;

        if (guestSeats > freeSeats) {
          openMessageModal({
            title: "Nema dovoljno mesta",
            text: `Nema dovoljno mesta za gosta ${guest.fullName} na stolu "${table.name}".`,
          });
          setAssigningGuest(false);
          return;
        }

        guestsToAdd.push(guest);

        simulatedAssignments = [
          ...simulatedAssignments,
          {
            tableId: table.id,
            tableName: table.name,
            guestId: guest.id,
            fullName: guest.fullName,
            guests: guestSeats,
          },
        ];
      }

      if (guestsToMove.length > 0) {
        openConfirmModal({
          type: "moveGuests",
          title: "Premesti goste?",
          text: `Neki izabrani gosti su već raspoređeni za druge stolove. Ako potvrdiš, biće premešteni za "${table.name}".`,
          confirmText: "Premesti goste",
          payload: {
            table,
            guestsToMove,
            guestsToAdd,
          },
        });
        setAssigningGuest(false);
        return;
      }

      for (const guest of guestsToAdd) {
        const guestSeats = Number(guest.guests) || 0;

        await addDoc(collection(db, "events", slug, "tableGuests"), {
          tableId: table.id,
          tableName: table.name,
          guestId: guest.id,
          fullName: guest.fullName,
          guests: guestSeats,
          createdAt: serverTimestamp(),
        });
      }

      setSelectedGuestsByTable((prev) => ({
        ...prev,
        [table.id]: [],
      }));

      setGuestSearchByTable((prev) => ({
        ...prev,
        [table.id]: "",
      }));

      setOpenAssignTableId(null);
    } catch (error) {
      console.error("Greška pri dodavanju gostiju za sto:", error);
      openMessageModal({
        title: "Greška",
        text: "Došlo je do greške pri dodavanju gostiju.",
      });
    } finally {
      setAssigningGuest(false);
    }
  };

  const handleRemoveGuestFromTable = async (assignmentId) => {
    openConfirmModal({
      type: "removeGuest",
      title: "Ukloni gosta?",
      text: "Da li ste sigurni da želite da uklonite gosta sa stola?",
      confirmText: "Ukloni gosta",
      payload: { assignmentId },
    });
  };

  const handleDeleteTable = async (tableId) => {
    const assignments = getAssignmentsForTable(tableId);

    if (assignments.length > 0) {
      openMessageModal({
        title: "Brisanje nije moguće",
        text: "Ne možeš obrisati sto dok na njemu postoje gosti.",
      });
      return;
    }

    openConfirmModal({
      type: "deleteTable",
      title: "Obriši sto?",
      text: "Da li ste sigurni da želite da obrišete sto?",
      confirmText: "Obriši sto",
      payload: { tableId },
    });
  };

  const handleConfirmAction = async () => {
    const { type, payload } = confirmModal;

    try {
      setAssigningGuest(true);

      if (type === "moveGuests") {
        const { table, guestsToMove, guestsToAdd } = payload;

        let refreshedAssignments = [...tableGuests];

        for (const item of guestsToMove) {
          await deleteDoc(
            doc(db, "events", slug, "tableGuests", item.existingAssignmentId)
          );

          refreshedAssignments = refreshedAssignments.filter(
            (assignment) => assignment.id !== item.existingAssignmentId
          );

          const occupiedSeats = refreshedAssignments
            .filter((assignment) => assignment.tableId === table.id)
            .reduce((sum, assignment) => sum + (Number(assignment.guests) || 0), 0);

          const guestSeats = Number(item.guest.guests) || 0;
          const freeSeats = Number(table.capacity) - occupiedSeats;

          if (guestSeats > freeSeats) {
            closeConfirmModal();
            setAssigningGuest(false);
            openMessageModal({
              title: "Nema dovoljno mesta",
              text: `Nema dovoljno mesta za gosta ${item.guest.fullName} na stolu "${table.name}".`,
            });
            return;
          }

          await addDoc(collection(db, "events", slug, "tableGuests"), {
            tableId: table.id,
            tableName: table.name,
            guestId: item.guest.id,
            fullName: item.guest.fullName,
            guests: guestSeats,
            createdAt: serverTimestamp(),
          });

          refreshedAssignments.push({
            tableId: table.id,
            tableName: table.name,
            guestId: item.guest.id,
            fullName: item.guest.fullName,
            guests: guestSeats,
          });
        }

        for (const guest of guestsToAdd || []) {
          const occupiedSeats = refreshedAssignments
            .filter((assignment) => assignment.tableId === table.id)
            .reduce((sum, assignment) => sum + (Number(assignment.guests) || 0), 0);

          const guestSeats = Number(guest.guests) || 0;
          const freeSeats = Number(table.capacity) - occupiedSeats;

          if (guestSeats > freeSeats) {
            closeConfirmModal();
            setAssigningGuest(false);
            openMessageModal({
              title: "Nema dovoljno mesta",
              text: `Nema dovoljno mesta za gosta ${guest.fullName} na stolu "${table.name}".`,
            });
            return;
          }

          await addDoc(collection(db, "events", slug, "tableGuests"), {
            tableId: table.id,
            tableName: table.name,
            guestId: guest.id,
            fullName: guest.fullName,
            guests: guestSeats,
            createdAt: serverTimestamp(),
          });

          refreshedAssignments.push({
            tableId: table.id,
            tableName: table.name,
            guestId: guest.id,
            fullName: guest.fullName,
            guests: guestSeats,
          });
        }

        setSelectedGuestsByTable((prev) => ({
          ...prev,
          [table.id]: [],
        }));

        setGuestSearchByTable((prev) => ({
          ...prev,
          [table.id]: "",
        }));

        setOpenAssignTableId(null);
      }

      if (type === "removeGuest") {
        const { assignmentId } = payload;
        await deleteDoc(doc(db, "events", slug, "tableGuests", assignmentId));
      }

      if (type === "deleteTable") {
        const { tableId } = payload;
        await deleteDoc(doc(db, "events", slug, "tables", tableId));
      }

      closeConfirmModal();
    } catch (error) {
      console.error("Greška pri potvrdi akcije:", error);
      openMessageModal({
        title: "Greška",
        text: "Došlo je do greške pri izvršavanju akcije.",
      });
    } finally {
      setAssigningGuest(false);
    }
  };

  const getFilteredGuestsForTable = (tableId) => {
    const searchValue = (guestSearchByTable[tableId] || "").trim().toLowerCase();

    if (!searchValue) return comingGuests;

    return comingGuests.filter((guest) =>
      (guest.fullName || "").toLowerCase().includes(searchValue)
    );
  };

  if (!isAuthorized) {
    return (
      <div style={styles.page}>
        <div style={styles.loginCard}>
          <p style={styles.kicker}>Raspored sedenja</p>
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
          <h1 style={styles.title}>Raspored sedenja</h1>
          <p>Učitavanje...</p>
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
            <h1 style={styles.title}>Raspored sedenja</h1>
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
              style={styles.exportButton}
              onClick={handleExportSeatingPDF}
            >
              Preuzmi PDF
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

        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{tables.length}</span>
            <span style={styles.statLabel}>Ukupno stolova</span>
          </div>

          <div style={styles.statBox}>
            <span style={styles.statNumber}>{totalComingPeople}</span>
            <span style={styles.statLabel}>Gostiju koji dolaze</span>
          </div>

          <div style={styles.statBox}>
            <span style={styles.statNumber}>{unassignedGuestsCount}</span>
            <span style={styles.statLabel}>Još neraspoređeni</span>
          </div>
        </div>
      </div>

<div style={styles.topCardsGrid}>
  <div style={styles.addTableCard}>
    <p style={styles.kicker}>Dodavanje stolova</p>
    <h2 style={styles.sectionTitle}>Dodaj novi sto</h2>

    <form onSubmit={handleAddTable} style={styles.addTableForm}>
      <div style={styles.field}>
        <label htmlFor="table-name" style={styles.label}>
          Naziv stola
        </label>
        <input
          id="table-name"
          type="text"
          name="name"
          value={tableForm.name}
          onChange={handleTableInputChange}
          placeholder="npr. Sto 1"
          style={styles.input}
          required
        />
      </div>

      <div style={styles.field}>
        <label htmlFor="table-capacity" style={styles.label}>
          Broj mesta
        </label>
        <input
          id="table-capacity"
          type="number"
          name="capacity"
          min="1"
          value={tableForm.capacity}
          onChange={handleTableInputChange}
          style={styles.input}
          required
        />
      </div>

      <button type="submit" style={styles.button} disabled={addingTable}>
        {addingTable ? "Dodavanje..." : "Dodaj sto"}
      </button>
    </form>
  </div>

  <div style={styles.unassignedCard}>
    <div style={styles.unassignedHeader}>
      <div>
        <p style={styles.kicker}>Pregled gostiju</p>
        <h2 style={styles.sectionTitle}>Neraspoređeni gosti</h2>
      </div>

      <span style={styles.unassignedCount}>
        {unassignedGuestsCount} osoba
      </span>
    </div>

    {unassignedGuests.length === 0 ? (
      <p style={styles.emptyText}>Svi gosti su raspoređeni 🎉</p>
    ) : (
      <div style={styles.unassignedList}>
        {unassignedGuests.map((guest) => (
          <div key={guest.id} style={styles.unassignedGuestRow}>
            <div>
              <p style={styles.guestName}>{guest.fullName}</p>
              <p style={styles.guestMeta}>
                Broj osoba: {Number(guest.guests) || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

      <div style={styles.tablesGrid}>
        {tables.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>Još nema dodatih stolova.</p>
          </div>
        ) : (
          tables.map((table) => {
            const assignments = getAssignmentsForTable(table.id);
            const occupiedSeats = getOccupiedSeats(table.id);
            const freeSeats = Number(table.capacity) - occupiedSeats;
            const selectedGuestsIds = selectedGuestsByTable[table.id] || [];
            const selectedGuests = selectedGuestsIds
              .map((id) => comingGuests.find((g) => g.id === id))
              .filter(Boolean);
            const filteredGuests = getFilteredGuestsForTable(table.id);
            const selectedSeats = getSelectedSeatCountForTable(table.id);
            const freeAfterSelection =
              Number(table.capacity) - occupiedSeats - selectedSeats;
            const tableStatus = getTableStatus(table);

            return (
              <div
                key={table.id}
                style={{
                  ...styles.tableCard,
                  ...(tableStatus === "good" ? styles.tableCardGood : {}),
                  ...(tableStatus === "warning" ? styles.tableCardWarning : {}),
                  ...(tableStatus === "full" ? styles.tableCardFull : {}),
                }}
              >
                <div style={styles.tableTop}>
                  <div>
                    <h3 style={styles.tableTitle}>{table.name}</h3>
                    <p style={styles.tableMeta}>
                      Kapacitet: {table.capacity} | Zauzeto: {occupiedSeats} | Slobodno:{" "}
                      {freeSeats}
                    </p>

                    <p
                      style={{
                        ...styles.tableStatusBadge,
                        ...(tableStatus === "good" ? styles.tableStatusGood : {}),
                        ...(tableStatus === "warning" ? styles.tableStatusWarning : {}),
                        ...(tableStatus === "full" ? styles.tableStatusFull : {}),
                      }}
                    >
                      {tableStatus === "good" && "Ima mesta"}
                      {tableStatus === "warning" && "Skoro puno"}
                      {tableStatus === "full" && "Popunjeno"}
                    </p>

                    {selectedGuests.length > 0 && (
                      <p style={styles.selectionMeta}>
                        Trenutno izabrano: {selectedSeats} | Ostaće slobodno:{" "}
                        {freeAfterSelection}
                      </p>
                    )}
                  </div>

                  <div style={styles.tableActionColumn}>
                    <button
                      type="button"
                      style={styles.primarySoftButton}
                      onClick={() => openEditCapacityModal(table)}
                    >
                      Izmeni kapacitet
                    </button>

                    <button
                      type="button"
                      style={styles.dangerSoftButton}
                      onClick={() => handleDeleteTable(table.id)}
                    >
                      Obriši sto
                    </button>
                  </div>
                </div>

                <div style={styles.assignSection}>
                  <button
                    type="button"
                    style={
                      openAssignTableId === table.id
                        ? styles.primarySoftButton
                        : styles.secondaryButton
                    }
                    onClick={() =>
                      setOpenAssignTableId((prev) => (prev === table.id ? null : table.id))
                    }
                  >
                    {openAssignTableId === table.id ? "Zatvori izbor" : "Dodaj gosta"}
                  </button>

                  {openAssignTableId === table.id && (
                    <div style={styles.assignBox}>
                      <input
                        type="text"
                        value={guestSearchByTable[table.id] || ""}
                        onChange={(e) =>
                          setGuestSearchByTable((prev) => ({
                            ...prev,
                            [table.id]: e.target.value,
                          }))
                        }
                        placeholder="Pretraži gosta..."
                        style={styles.searchInput}
                      />

                      <div style={styles.guestPickerGrid}>
                        {filteredGuests.length === 0 ? (
                          <div style={styles.noSearchResults}>
                            Nema rezultata za ovu pretragu.
                          </div>
                        ) : (
                          filteredGuests.map((guest) => {
                            const assignment = getGuestAssignment(guest.id);
                            const assignedTableName = assignment
                              ? getTableNameById(assignment.tableId)
                              : null;
                            const isAssigned = Boolean(assignment);
                            const isAssignedToCurrentTable =
                              assignment?.tableId === table.id;
                            const isSelected = selectedGuestsIds.includes(guest.id);
                            const guestCount = Number(guest.guests) || 0;
                            const canSelect = canSelectGuestForTable(table, guest.id);
                            const isDisabledForCapacity = !isSelected && !canSelect;

                            return (
                              <button
                                key={guest.id}
                                type="button"
                                disabled={isDisabledForCapacity}
                                onClick={() =>
                                  setSelectedGuestsByTable((prev) => {
                                    const current = prev[table.id] || [];
                                    const exists = current.includes(guest.id);

                                    return {
                                      ...prev,
                                      [table.id]: exists
                                        ? current.filter((id) => id !== guest.id)
                                        : [...current, guest.id],
                                    };
                                  })
                                }
                                style={{
                                  ...styles.guestOptionCard,
                                  ...(isAssigned ? styles.guestOptionCardAssigned : {}),
                                  ...(isAssignedToCurrentTable
                                    ? styles.guestOptionCardAssignedCurrent
                                    : {}),
                                  ...(isSelected ? styles.guestOptionCardSelected : {}),
                                  ...(isDisabledForCapacity
                                    ? styles.guestOptionCardDisabled
                                    : {}),
                                }}
                              >
                                <div style={styles.guestOptionTop}>
                                  <span style={styles.guestOptionName}>
                                    {guest.fullName}
                                  </span>
                                  <span style={styles.guestOptionCount}>
                                    {guestCount}
                                  </span>
                                </div>

                                <div style={styles.guestOptionBottom}>
                                  {!isAssigned && (
                                    <span style={styles.guestBadgeFree}>
                                      Neraspoređen ({guestCount})
                                    </span>
                                  )}

                                  {isAssigned && !isAssignedToCurrentTable && (
                                    <span style={styles.guestBadgeAssigned}>
                                      {assignedTableName} ({guestCount})
                                    </span>
                                  )}

                                  {isAssignedToCurrentTable && (
                                    <span style={styles.guestBadgeCurrent}>
                                      Već za ovim stolom ({guestCount})
                                    </span>
                                  )}

                                  {isDisabledForCapacity && (
                                    <span style={styles.guestBadgeNoSpace}>
                                      Nema mesta
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>

                      {selectedGuests.length > 0 && (
                        <div style={styles.selectedGuestSummary}>
                          <p style={styles.selectedGuestTitle}>Izabrani gosti:</p>

                          {selectedGuests.map((guest) => (
                            <p key={guest.id} style={styles.selectedGuestMeta}>
                              {guest.fullName} ({Number(guest.guests) || 0})
                            </p>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        style={styles.button}
                        onClick={() => handleAssignGuest(table)}
                        disabled={assigningGuest}
                      >
                        {assigningGuest ? "Dodavanje..." : "Potvrdi goste"}
                      </button>
                    </div>
                  )}
                </div>

                <div style={styles.guestList}>
                  {assignments.length === 0 ? (
                    <p style={styles.emptyText}>Nema gostiju za ovim stolom.</p>
                  ) : (
                    assignments.map((item) => (
                      <div key={item.id} style={styles.guestRow}>
                        <div>
                          <p style={styles.guestName}>{item.fullName}</p>
                          <p style={styles.guestMeta}>
                            Broj osoba: {Number(item.guests) || 0}
                          </p>
                        </div>

                        <button
                          type="button"
                          style={styles.deleteButton}
                          onClick={() => handleRemoveGuestFromTable(item.id)}
                        >
                          Ukloni
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {editCapacityModal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <p style={styles.modalKicker}>Izmena kapaciteta</p>
            <h3 style={styles.modalTitle}>{editCapacityModal.tableName}</h3>
            <p style={styles.modalText}>Unesi novi kapacitet stola.</p>

            <div style={{ ...styles.field, marginTop: 18 }}>
              <label htmlFor="edit-capacity" style={styles.label}>
                Novi kapacitet
              </label>
              <input
                id="edit-capacity"
                type="number"
                min="1"
                value={editCapacityModal.capacity}
                onChange={(e) =>
                  setEditCapacityModal((prev) => ({
                    ...prev,
                    capacity: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.modalCancelButton}
                onClick={closeEditCapacityModal}
              >
                Otkaži
              </button>

              <button
                type="button"
                style={styles.modalConfirmButton}
                onClick={handleSaveCapacity}
              >
                Sačuvaj
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <p style={styles.modalKicker}>Potvrda akcije</p>
            <h3 style={styles.modalTitle}>{confirmModal.title}</h3>
            <p style={styles.modalText}>{confirmModal.text}</p>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.modalCancelButton}
                onClick={closeConfirmModal}
                disabled={assigningGuest}
              >
                Otkaži
              </button>

              <button
                type="button"
                style={styles.modalConfirmButton}
                onClick={handleConfirmAction}
                disabled={assigningGuest}
              >
                {assigningGuest ? "Sačekaj..." : confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {messageModal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.messageModalCard}>
            <p style={styles.modalKicker}>Obaveštenje</p>
            <h3 style={styles.modalTitle}>{messageModal.title}</h3>
            <p style={styles.modalText}>{messageModal.text}</p>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.modalConfirmButton}
                onClick={closeMessageModal}
              >
                U redu
              </button>
            </div>
          </div>
        </div>
      )}
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
addTableCard: {
  background: "#fffdf9",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
  border: "1px solid rgba(120, 90, 70, 0.12)",
  minWidth: 0,
},
  tablesGrid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  tableCard: {
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  tableCardGood: {
    border: "1px solid #cfe8d3",
  },
  tableCardWarning: {
    border: "1px solid #ead9a7",
    boxShadow: "0 10px 30px rgba(181, 146, 42, 0.10)",
  },
  tableCardFull: {
    border: "1px solid #e2b8b8",
    boxShadow: "0 10px 30px rgba(180, 35, 24, 0.10)",
  },
  emptyCard: {
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  tableTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  tableActionColumn: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    justifyContent: "flex-end",
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
  title: {
    margin: "10px 0 8px",
    fontSize: "36px",
    lineHeight: 1.1,
  },
  sectionTitle: {
    margin: "8px 0 0",
    fontSize: "24px",
  },
  slug: {
    margin: 0,
    color: "#7b675b",
  },
  addTableForm: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    alignItems: "end",
  },
  form: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
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
  searchInput: {
    height: "48px",
    borderRadius: "14px",
    border: "1px solid rgba(120, 90, 70, 0.18)",
    padding: "0 16px",
    fontSize: "15px",
    outline: "none",
    background: "#fff",
    width: "100%",
  },
  button: {
    minHeight: "52px",
    borderRadius: "999px",
    border: "1px solid transparent",
    background:
      "linear-gradient(135deg, #b8826f 0%, #a87361 45%, #946151 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "0 24px",
    boxShadow: "0 12px 26px rgba(184, 130, 111, 0.30)",
    transition: "all 0.2s ease",
  },
  secondaryButton: {
    minHeight: "46px",
    padding: "0 20px",
    borderRadius: "999px",
    border: "1px solid #ded2c7",
    background: "linear-gradient(180deg, #fffdfb 0%, #f7f0e8 100%)",
    color: "#5f4a3f",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 500,
    boxShadow: "0 6px 18px rgba(63, 48, 40, 0.06)",
    transition: "all 0.2s ease",
  },
  exportButton: {
    minHeight: "46px",
    padding: "0 20px",
    borderRadius: "999px",
    border: "1px solid transparent",
    background: "linear-gradient(135deg, #b8826f 0%, #9f6d5c 100%)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    boxShadow: "0 10px 24px rgba(184, 130, 111, 0.28)",
    transition: "all 0.2s ease",
  },
  logoutButton: {
    minHeight: "46px",
    padding: "0 20px",
    borderRadius: "999px",
    border: "1px solid #e5d7cc",
    background: "#fffaf5",
    color: "#7a675b",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "0 6px 18px rgba(63, 48, 40, 0.05)",
    transition: "all 0.2s ease",
  },
  assignSection: {
    marginTop: "18px",
  },
  assignBox: {
    marginTop: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  guestPickerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
    maxHeight: "320px",
    overflowY: "auto",
    paddingRight: "4px",
  },
  guestOptionCard: {
    border: "1px solid rgba(120, 90, 70, 0.14)",
    background: "#fff",
    borderRadius: "16px",
    padding: "14px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  guestOptionCardAssigned: {
    background: "#edf8ef",
    border: "1px solid #c7e7cc",
  },
  guestOptionCardAssignedCurrent: {
    background: "#e4f3e7",
    border: "1px solid #9fd0a7",
  },
  guestOptionCardSelected: {
    boxShadow: "0 0 0 2px #b8826f inset",
    transform: "translateY(-1px)",
  },
  guestOptionCardDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
    filter: "grayscale(0.1)",
  },
  guestOptionTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
  },
  guestOptionName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#3f3028",
  },
  guestOptionCount: {
    minWidth: "32px",
    height: "32px",
    borderRadius: "999px",
    background: "#f3ece5",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    color: "#6c5a4f",
    fontWeight: 600,
    flexShrink: 0,
  },
  guestOptionBottom: {
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  guestBadgeFree: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#f7f1ea",
    color: "#6c5a4f",
    fontSize: "12px",
    fontWeight: 600,
  },
  guestBadgeAssigned: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#d9efdd",
    color: "#245c2f",
    fontSize: "12px",
    fontWeight: 600,
  },
  guestBadgeCurrent: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#cae7d0",
    color: "#1f4f28",
    fontSize: "12px",
    fontWeight: 600,
  },
  guestBadgeNoSpace: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#fbeaea",
    color: "#a53030",
    fontSize: "12px",
    fontWeight: 600,
  },
  selectedGuestSummary: {
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#faf5ef",
    border: "1px solid rgba(120, 90, 70, 0.1)",
  },
  selectedGuestTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
  },
  selectedGuestMeta: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#7a675b",
  },
  selectionMeta: {
    margin: "8px 0 0",
    color: "#9a7b67",
    fontSize: "13px",
    fontWeight: 600,
  },
  tableStatusBadge: {
    margin: "10px 0 0",
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  tableStatusGood: {
    background: "#e4f3e7",
    color: "#245c2f",
  },
  tableStatusWarning: {
    background: "#fbf3d7",
    color: "#8a6a12",
  },
  tableStatusFull: {
    background: "#fbeaea",
    color: "#a53030",
  },
  noSearchResults: {
    padding: "18px",
    borderRadius: "14px",
    background: "#faf5ef",
    color: "#7a675b",
    border: "1px solid rgba(120, 90, 70, 0.1)",
  },
  guestList: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  guestRow: {
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#faf5ef",
    border: "1px solid rgba(120, 90, 70, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  tableTitle: {
    margin: 0,
    fontSize: "24px",
  },
  tableMeta: {
    margin: "8px 0 0",
    color: "#7b675b",
    fontSize: "14px",
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
  emptyText: {
    margin: 0,
    color: "#7a675b",
  },
  error: {
    color: "#b42318",
    margin: 0,
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
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(33, 25, 20, 0.38)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 9999,
  },
  modalCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#fffdf9",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 24px 70px rgba(63, 48, 40, 0.18)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  messageModalCard: {
    width: "100%",
    maxWidth: "500px",
    background: "#fffdf9",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 24px 70px rgba(63, 48, 40, 0.18)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
  },
  modalKicker: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#9a7b67",
  },
  modalTitle: {
    margin: "10px 0 12px",
    fontSize: "32px",
    lineHeight: 1.1,
    color: "#3f3028",
  },
  modalText: {
    margin: 0,
    color: "#6b584c",
    fontSize: "17px",
    lineHeight: 1.6,
  },
  modalActions: {
    marginTop: "26px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  modalCancelButton: {
    minHeight: "46px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid #ded2c7",
    background: "linear-gradient(180deg, #fffdfb 0%, #f7f0e8 100%)",
    color: "#6c5a4f",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "0 6px 18px rgba(63, 48, 40, 0.06)",
    transition: "all 0.2s ease",
  },
  modalConfirmButton: {
    minHeight: "46px",
    padding: "0 20px",
    borderRadius: "999px",
    border: "1px solid transparent",
    background: "linear-gradient(135deg, #b8826f 0%, #9f6d5c 100%)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    boxShadow: "0 10px 24px rgba(184, 130, 111, 0.28)",
    transition: "all 0.2s ease",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  primarySoftButton: {
    minHeight: "46px",
    padding: "0 20px",
    borderRadius: "999px",
    border: "1px solid rgba(184, 130, 111, 0.22)",
    background: "linear-gradient(180deg, #fdf7f3 0%, #f6ebe4 100%)",
    color: "#9b6b59",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    boxShadow: "0 8px 20px rgba(184, 130, 111, 0.10)",
    transition: "all 0.2s ease",
  },
  dangerSoftButton: {
    minHeight: "42px",
    padding: "0 16px",
    borderRadius: "999px",
    border: "1px solid rgba(196, 72, 54, 0.18)",
    background: "linear-gradient(180deg, #fff8f7 0%, #fff0ee 100%)",
    color: "#c44836",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    boxShadow: "0 6px 16px rgba(196, 72, 54, 0.08)",
    transition: "all 0.2s ease",
  },
  deleteButton: {
    minHeight: "42px",
    padding: "0 16px",
    borderRadius: "999px",
    border: "1px solid rgba(196, 72, 54, 0.18)",
    background: "linear-gradient(180deg, #fff8f7 0%, #fff0ee 100%)",
    color: "#c44836",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    boxShadow: "0 6px 16px rgba(196, 72, 54, 0.08)",
    transition: "all 0.2s ease",
  },
topCardsGrid: {
  maxWidth: "1100px",
  margin: "0 auto 24px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
},

unassignedCard: {
  background: "#fffdf9",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
  border: "1px solid rgba(120, 90, 70, 0.12)",
  minWidth: 0,
},

unassignedHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "16px",
},

unassignedCount: {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "36px",
  padding: "6px 14px",
  borderRadius: "999px",
  background: "#f3ece5",
  color: "#6c5a4f",
  fontSize: "14px",
  fontWeight: 600,
  whiteSpace: "nowrap",
},

unassignedList: {
  maxHeight: "300px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  paddingRight: "4px",
},

unassignedGuestRow: {
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#faf5ef",
  border: "1px solid rgba(120, 90, 70, 0.1)",
},
};

export default SeatingPage;