import { useEffect, useMemo, useRef, useState } from "react";
import LegendFantasyMoon from "./LegendFantasyMoon";
import LegendFantasyBeacons from "./LegendFantasyBeacons";
import LegendFantasyDoorSection from "./LegendFantasyDoorSection";
import { BurnSeam, Chapter, FireCanvas, Motes, Ornament } from "./LegendFantasyEffects";
import { art, galleryOf, initials, pad, safeUrl } from "./legendFantasyData";

const CHAPTERS = [
  ["Susret", "Neke priče započinju sasvim tiho, a traju čitav život.", "valley"],
  ["Naši putevi", "Dve staze, toliko svetova i jedan isti dom.", "map"],
  ["Pustolovina", "Svako je putovanje lepše kada ga delimo.", "shire"],
  ["Zauvek", "Najlepše poglavlje je ono koje tek pišemo.", "party-tree"],
];
function BookText({ page, brideName, groomName }) {
  const chapter = CHAPTERS[page % CHAPTERS.length];
  return <div className="lfp-book__text"><span className="lfp-kicker">List {pad(page + 1)}</span><Ornament tree/><h3>{chapter[0]}</h3><p>{chapter[1]}</p><span className="lfp-book__monogram">{initials(brideName)} <em>&</em> {initials(groomName)}</span></div>;
}
function BookPicture({ picture, page }) {
  const fallback = art(CHAPTERS[page % 4][2]);
  return <figure className="lfp-book__picture"><div><img src={picture?.src || fallback} alt={picture?.caption || "Ilustracija čarobnog sveta naše priče"} loading="lazy" decoding="async" onError={e => { if (!e.currentTarget.src.endsWith(fallback)) e.currentTarget.src = fallback; }}/></div><figcaption>{picture?.caption || CHAPTERS[page % 4][0]}</figcaption></figure>;
}
function StoryBook({ details, brideName, groomName }) {
  const photos = useMemo(() => galleryOf(details), [details.legendGallery, details.galleryImages, details.gallery]);
  const total = photos.length || CHAPTERS.length;
  const [page, setPage] = useState(0), [turn, setTurn] = useState(null);
  const timer = useRef(null), pointer = useRef(null), lock = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { clearTimeout(timer.current); setPage(0); setTurn(null); lock.current = false; }, [photos]);
  const go = direction => {
    const next = Math.max(0, Math.min(total - 1, page + direction));
    if (lock.current || next === page) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPage(next); return; }
    lock.current = true; setTurn({ next, direction });
    timer.current = setTimeout(() => { setPage(next); setTurn(null); lock.current = false; }, 850);
  };
  const textProps = { brideName, groomName };
  return <section className="lfp-gallery" aria-label="Galerija uspomena">
    <Chapter number="VI" label="Knjiga naše priče" title="Uspomene sa puta">Svaki list čuva jedan mali deo našeg sveta.</Chapter>
    <div className="lfp-book-wrap">
      <div className={`lfp-book ${turn ? `is-turning-${turn.direction > 0 ? "next" : "prev"}` : ""}`} role="group" aria-label="Knjiga uspomena; koristite strelice ili prevucite list" tabIndex={0}
        onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); go(e.key === "ArrowRight" ? 1 : -1); } }}
        onPointerDown={e => { pointer.current = { x: e.clientX, y: e.clientY }; }}
        onPointerCancel={() => { pointer.current = null; }}
        onPointerUp={e => { if (!pointer.current) return; const dx = e.clientX - pointer.current.x, dy = e.clientY - pointer.current.y; pointer.current = null; if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.25) go(dx < 0 ? 1 : -1); }}>
        <div className="lfp-book__page lfp-book__page--left"><BookText page={turn?.direction < 0 ? turn.next : page} {...textProps}/></div>
        <div className="lfp-book__page lfp-book__page--right"><BookPicture picture={photos[turn?.direction > 0 ? turn.next : page]} page={turn?.direction > 0 ? turn.next : page}/></div>
        <div className="lfp-book__spine" aria-hidden="true"/>
        {turn && <div className="lfp-book__turn" aria-hidden="true"><div className="lfp-book__turn-front">{turn.direction > 0 ? <BookPicture picture={photos[page]} page={page}/> : <BookText page={page} {...textProps}/>}</div><div className="lfp-book__turn-back">{turn.direction > 0 ? <BookText page={turn.next} {...textProps}/> : <BookPicture picture={photos[turn.next]} page={turn.next}/>}</div></div>}
      </div><span className="lfp-book__ribbon" aria-hidden="true"/>
    </div>
    <div className="lfp-book-nav"><button type="button" onClick={() => go(-1)} disabled={page === 0 || !!turn} aria-label="Prethodni list">←</button><div aria-live="polite"><span className="lfp-book-nav__dots" aria-hidden="true">{Array.from({ length: total }, (_, i) => <i key={i} className={i === page ? "is-current" : ""}/>)}</span><small>List {page + 1} od {total}</small></div><button type="button" onClick={() => go(1)} disabled={page === total - 1 || !!turn} aria-label="Sledeći list">→</button></div>
    <p className="lfp-gallery__hint">Prevucite list da nastavite priču.</p>
  </section>;
}

function RSVP({ brideName, groomName, details, onRsvpSubmit }) {
  const [name, setName] = useState(""), [attending, setAttending] = useState("yes"), [guests, setGuests] = useState("1"), [note, setNote] = useState("");
  const [busy, setBusy] = useState(false), [status, setStatus] = useState(""), [success, setSuccess] = useState(false);
  const pending = useRef(false);
  const endpoint = safeUrl(details.legendRsvpEndpoint || details.rsvpEndpoint);
  const external = safeUrl(details.legendRsvpUrl || details.rsvpUrl);
  const connected = typeof onRsvpSubmit === "function" || !!endpoint;
  const submit = async e => {
    e.preventDefault();
    if (pending.current || success || !connected) return;
    if (!name.trim()) { setStatus("Molimo unesite ime i prezime."); return; }
    const payload = { name: name.trim(), attending: attending === "yes", guestCount: attending === "yes" ? Number(guests) : 0, note: note.trim() };
    pending.current = true; setBusy(true); setStatus("");
    try {
      let result;
      if (typeof onRsvpSubmit === "function") result = await onRsvpSubmit(payload);
      else {
        const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error("send-failed");
        result = await response.json().catch(() => null);
      }
      if (result === false || result?.success === false || result?.ok === false || result?.error) throw new Error("send-failed");
      setSuccess(true); setStatus(attending === "yes" ? "Vaš odgovor je zapečaćen. Radujemo se susretu!" : "Vaš odgovor je zapečaćen. Hvala što ste nam javili.");
    } catch { setStatus("Odgovor nije poslat. Pokušajte ponovo ili kontaktirajte mladence."); }
    finally { pending.current = false; setBusy(false); }
  };
  const maxGuests = Math.max(1, Math.min(30, Number(details.maxGuests) || 10));
  return <section className="lfp-rsvp" id="lfp-rsvp" aria-label="Potvrda dolaska">
    <div className="lfp-scroll"><span className="lfp-scroll__rod" aria-hidden="true"/><div className="lfp-scroll__body">
      <Chapter number="VII" label="Potvrda dolaska" title="Pridružite se družini">Ovim svitkom potvrdite da ćete biti deo naše priče.</Chapter>
      {(details.rsvpDeadline || details.confirmationDeadline) && <p className="lfp-rsvp__deadline">Molimo odgovor do {details.rsvpDeadline || details.confirmationDeadline}</p>}
      {external && !connected ? <a className="lfp-button" href={external} target="_blank" rel="noopener noreferrer">Potvrdite dolazak ↗</a> : <form onSubmit={submit} className={success ? "is-sealed" : ""}>
        <fieldset disabled={busy || success}><legend className="lfp-sr-only">Vaš odgovor</legend>
          <label htmlFor="lfp-name">Ime i prezime</label><input id="lfp-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} maxLength={140} required placeholder="Vaše ime i prezime"/>
          <fieldset className="lfp-rsvp__attendance"><legend>Da li dolazite?</legend><div className="lfp-rsvp__choices"><label className={attending === "yes" ? "is-selected" : ""}><input type="radio" name="lfp-attending" checked={attending === "yes"} onChange={() => setAttending("yes")}/><span aria-hidden="true">✦</span>Dolazim</label><label className={attending === "no" ? "is-selected" : ""}><input type="radio" name="lfp-attending" checked={attending === "no"} onChange={() => setAttending("no")}/><span aria-hidden="true">✧</span>Nažalost ne</label></div></fieldset>
          {attending === "yes" && <><label htmlFor="lfp-guests">Koliko vas ukupno dolazi?</label><select id="lfp-guests" value={guests} onChange={e => setGuests(e.target.value)}>{Array.from({ length: maxGuests }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></>}
          <label htmlFor="lfp-note">Poruka mladencima <span>(opciono)</span></label><textarea id="lfp-note" value={note} onChange={e => setNote(e.target.value)} maxLength={1000} rows={4} placeholder="Napišite nam nekoliko lepih reči…"/>
        </fieldset>
        <button className="lfp-seal" type="submit" disabled={busy || success || !connected} aria-label="Pošalji potvrdu dolaska"><span>{success ? "✓" : <>{initials(brideName)}<em>&</em>{initials(groomName)}</>}</span></button>
        <span className="lfp-rsvp__send-label">{busy ? "Šaljemo odgovor…" : success ? "Odgovor je zapečaćen" : connected ? "Zapečati odgovor" : "Potvrdu dolaska uskoro otvaramo"}</span>
        <p className="lfp-rsvp__status" role="status">{status}</p>
      </form>}
    </div><span className="lfp-scroll__rod" aria-hidden="true"/></div>
  </section>;
}

function Finale({ brideName, groomName, details }) {
  const [burst, setBurst] = useState(0);
  return <section className="lfp-finale" aria-label="Završna poruka i vatromet"><BurnSeam/>
    <div className="lfp-finale__world"><img src={art("party-tree")} alt="Drvo proslave u Okrugu, osvetljeno stotinama lampiona" width="1024" height="1536" loading="lazy" decoding="async"/><FireCanvas mode="fireworks" burst={burst} letters={`${initials(brideName)} & ${initials(groomName)}`}/><Motes count={25}/>
      <div className="lfp-finale__copy"><span className="lfp-kicker">I priča se nastavlja…</span><h2>Najlepše tek dolazi.</h2><p>{details.finalMessage || "Hvala što ste deo našeg sveta. Jedva čekamo da ovu noć podelimo sa vama."}</p><strong>{brideName} <em>&</em> {groomName}</strong><Ornament/></div>
      <button type="button" className="lfp-finale__touch" onClick={() => setBurst(v => v + 1)}>Dodirnite i zapalite nebo <span aria-hidden="true">✧</span></button>
    </div>
  </section>;
}

export default function LegendFantasyWorld({ brideName = "Ana", groomName = "Luka", weddingDate = "", weddingTime = "", venue = "", details = {}, onRsvpSubmit }) {
  const props = { brideName, groomName, weddingDate, weddingTime, venue, details, onRsvpSubmit };
  return <div className="lfp-world"><div className="lfp-night"><BurnSeam/><LegendFantasyMoon {...props}/><LegendFantasyBeacons {...props}/><BurnSeam reverse/></div><LegendFantasyDoorSection {...props}/><StoryBook {...props}/><RSVP {...props}/><Finale {...props}/></div>;
}
