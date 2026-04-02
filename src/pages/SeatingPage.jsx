import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import adminAccess from "../data/adminAccess";

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
  const [selectedGuestByTable, setSelectedGuestByTable] = useState({});
  const [assigningGuest, setAssigningGuest] = useState(false);
  const [guestSearchByTable, setGuestSearchByTable] = useState({});

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

  useEffect(() => {
    const savedAccess = localStorage.getItem(`admin-access-${slug}`);
    if (savedAccess === "true") {
      setIsAuthorized(true);
    }
  }, [slug]);

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

  const fetchData = async () => {
    if (!slug || !isAuthorized) return;

    try {
      setLoading(true);

      const tablesRef = collection(db, "events", slug, "tables");
      const guestsRef = collection(db, "events", slug, "rsvps");
      const tableGuestsRef = collection(db, "events", slug, "tableGuests");

      const [tablesSnap, guestsSnap, tableGuestsSnap] = await Promise.all([
        getDocs(tablesRef),
        getDocs(guestsRef),
        getDocs(tableGuestsRef),
      ]);

      const tablesData = tablesSnap.docs
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

      const guestsData = guestsSnap.docs
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

      const tableGuestsData = tableGuestsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setTables(tablesData);
      setComingGuests(guestsData);
      setTableGuests(tableGuestsData);
    } catch (error) {
      console.error("Greška pri učitavanju rasporeda:", error);
      openMessageModal({
        title: "Greška",
        text: "Došlo je do greške pri učitavanju rasporeda.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug, isAuthorized]);

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

      await fetchData();
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

  const escapeCsvValue = (value) => {
    const stringValue = value == null ? "" : String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const handleExportSeatingCSV = () => {
    if (!tables.length) {
      openMessageModal({
        title: "Nema podataka za eksport",
        text: "Nema stolova za eksport.",
      });
      return;
    }

    const headers = ["Sto", "Ime i prezime", "Broj osoba"];

    const rows = tables.flatMap((table) => {
      const assignments = getAssignmentsForTable(table.id);

      if (!assignments.length) {
        return [[table.name, "", ""]];
      }

      return assignments.map((item) => [
        table.name,
        item.fullName || "",
        Number(item.guests) || 0,
      ]);
    });

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
    link.setAttribute("download", `raspored-stolova-${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleAssignGuest = async (table) => {
    const selectedGuestId = selectedGuestByTable[table.id];

    if (!selectedGuestId) {
      openMessageModal({
        title: "Izaberi gosta",
        text: "Potrebno je da prvo izabereš gosta.",
      });
      return;
    }

    const guest = comingGuests.find((g) => g.id === selectedGuestId);

    if (!guest) {
      openMessageModal({
        title: "Gost nije pronađen",
        text: "Izabrani gost nije pronađen. Pokušaj ponovo.",
      });
      return;
    }

    const existingAssignment = getGuestAssignment(selectedGuestId);

    if (existingAssignment?.tableId === table.id) {
      openMessageModal({
        title: "Gost je već dodeljen",
        text: "Ovaj gost je već dodeljen ovom stolu.",
      });
      return;
    }

    const guestSeats = Number(guest.guests) || 0;

    try {
      if (existingAssignment) {
        const oldTableName = getTableNameById(existingAssignment.tableId);

        openConfirmModal({
          type: "moveGuest",
          title: "Premesti gosta?",
          text: `${guest.fullName} je već dodeljen stolu "${oldTableName}". Da li želiš da ga premestiš za "${table.name}"?`,
          confirmText: "Premesti gosta",
          payload: {
            guest,
            table,
            existingAssignmentId: existingAssignment.id,
          },
        });
        return;
      }

      const occupiedSeats = getOccupiedSeats(table.id);
      const freeSeats = Number(table.capacity) - occupiedSeats;

      if (guestSeats > freeSeats) {
        openMessageModal({
          title: "Nema dovoljno mesta",
          text: "Nema dovoljno mesta za ovog gosta na ovom stolu.",
        });
        return;
      }

      setAssigningGuest(true);

      await addDoc(collection(db, "events", slug, "tableGuests"), {
        tableId: table.id,
        tableName: table.name,
        guestId: guest.id,
        fullName: guest.fullName,
        guests: guestSeats,
        createdAt: serverTimestamp(),
      });

      setSelectedGuestByTable((prev) => ({
        ...prev,
        [table.id]: "",
      }));

      setGuestSearchByTable((prev) => ({
        ...prev,
        [table.id]: "",
      }));

      setOpenAssignTableId(null);

      await fetchData();
    } catch (error) {
      console.error("Greška pri dodavanju gosta za sto:", error);
      openMessageModal({
        title: "Greška",
        text: "Došlo je do greške pri dodavanju gosta.",
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

      if (type === "moveGuest") {
        const { guest, table, existingAssignmentId } = payload;

        await deleteDoc(
          doc(db, "events", slug, "tableGuests", existingAssignmentId)
        );

        const refreshedAssignments = tableGuests.filter(
          (item) => item.id !== existingAssignmentId
        );

        const occupiedSeats = refreshedAssignments
          .filter((item) => item.tableId === table.id)
          .reduce((sum, item) => sum + (Number(item.guests) || 0), 0);

        const guestSeats = Number(guest.guests) || 0;
        const freeSeats = Number(table.capacity) - occupiedSeats;

        if (guestSeats > freeSeats) {
          closeConfirmModal();
          setAssigningGuest(false);
          await fetchData();
          openMessageModal({
            title: "Nema dovoljno mesta",
            text: "Nema dovoljno mesta za ovog gosta na ovom stolu.",
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

        setSelectedGuestByTable((prev) => ({
          ...prev,
          [table.id]: "",
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
      await fetchData();
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
              onClick={handleExportSeatingCSV}
            >
              Eksport rasporeda
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
            const selectedGuestId = selectedGuestByTable[table.id] || "";
            const selectedGuest = comingGuests.find((g) => g.id === selectedGuestId);
            const selectedGuestAssignment = selectedGuestId
              ? getGuestAssignment(selectedGuestId)
              : null;
            const filteredGuests = getFilteredGuestsForTable(table.id);

            return (
              <div key={table.id} style={styles.tableCard}>
                <div style={styles.tableTop}>
                  <div>
                    <h3 style={styles.tableTitle}>{table.name}</h3>
                    <p style={styles.tableMeta}>
                      Kapacitet: {table.capacity} | Zauzeto: {occupiedSeats} | Slobodno:{" "}
                      {freeSeats}
                    </p>
                  </div>

                  <button
                    type="button"
                    style={styles.deleteButton}
                    onClick={() => handleDeleteTable(table.id)}
                  >
                    Obriši sto
                  </button>
                </div>

                <div style={styles.assignSection}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
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
                            const isSelected = selectedGuestId === guest.id;
                            const guestCount = Number(guest.guests) || 0;

                            return (
                              <button
                                key={guest.id}
                                type="button"
                                onClick={() =>
                                  setSelectedGuestByTable((prev) => ({
                                    ...prev,
                                    [table.id]: guest.id,
                                  }))
                                }
                                style={{
                                  ...styles.guestOptionCard,
                                  ...(isAssigned ? styles.guestOptionCardAssigned : {}),
                                  ...(isAssignedToCurrentTable
                                    ? styles.guestOptionCardAssignedCurrent
                                    : {}),
                                  ...(isSelected ? styles.guestOptionCardSelected : {}),
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
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>

                      {selectedGuest && (
                        <div style={styles.selectedGuestSummary}>
                          <div>
                            <p style={styles.selectedGuestTitle}>
                              Izabran gost: {selectedGuest.fullName}
                            </p>
                            <p style={styles.selectedGuestMeta}>
                              Broj osoba: {Number(selectedGuest.guests) || 0}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedGuestAssignment &&
                        selectedGuestAssignment.tableId !== table.id && (
                          <div style={styles.assignedHint}>
                            Ovaj gost je trenutno dodeljen stolu{" "}
                            <strong>
                              {getTableNameById(selectedGuestAssignment.tableId)}
                            </strong>
                            . Ako potvrdiš, biće premešten.
                          </div>
                        )}

                      {selectedGuestAssignment &&
                        selectedGuestAssignment.tableId === table.id && (
                          <div style={styles.sameTableHint}>
                            Ovaj gost je već za ovim stolom.
                          </div>
                        )}

                      <button
                        type="button"
                        style={styles.button}
                        onClick={() => handleAssignGuest(table)}
                        disabled={assigningGuest}
                      >
                        {assigningGuest ? "Dodavanje..." : "Potvrdi gosta"}
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
    maxWidth: "1100px",
    margin: "0 auto 24px",
    background: "#fffdf9",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(63, 48, 40, 0.08)",
    border: "1px solid rgba(120, 90, 70, 0.12)",
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
  deleteButton: {
    height: "40px",
    padding: "0 14px",
    borderRadius: "999px",
    border: "1px solid rgba(180, 35, 24, 0.18)",
    background: "#fff",
    color: "#b42318",
    cursor: "pointer",
    fontSize: "12px",
    textTransform: "uppercase",
    flexShrink: 0,
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
  assignedHint: {
    padding: "12px 14px",
    borderRadius: "14px",
    background: "#e8f6ea",
    border: "1px solid #b7dfbd",
    color: "#245c2f",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  sameTableHint: {
    padding: "12px 14px",
    borderRadius: "14px",
    background: "#f3efe9",
    border: "1px solid rgba(120, 90, 70, 0.12)",
    color: "#6c5a4f",
    fontSize: "14px",
    lineHeight: 1.5,
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
    height: "46px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(120, 90, 70, 0.16)",
    background: "#fff",
    color: "#6c5a4f",
    cursor: "pointer",
    fontSize: "14px",
  },
  modalConfirmButton: {
    height: "46px",
    padding: "0 20px",
    borderRadius: "999px",
    border: "none",
    background: "#b8826f",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
};

export default SeatingPage;