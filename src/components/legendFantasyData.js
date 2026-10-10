export const ART = "/images/legend-fantasy/premium";
export const art = name => `${ART}/${name}.webp`;
export const initials = value => Array.from(String(value || "").trim())[0]?.toUpperCase() || "✦";
export const pad = value => String(value).padStart(2, "0");
export const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const safeUrl = value => /^(https?:\/\/|\/[^/])/.test(String(value || "")) ? String(value) : "";
export function eventsOf(details = {}, weddingTime = "", venue = "") {
  const source = [details.events, details.legendEvents, details.timeline, details.schedule].find(v => Array.isArray(v) && v.length) || [];
  if (!source.length) return venue || weddingTime ? [{ title: "Naše venčanje", time: weddingTime, place: venue, note: "Ovde počinje naše novo poglavlje." }] : [];
  return source.map((e, i) => ({ ...e, title: e.label || e.title || e.name || `Poglavlje ${i + 1}`, time: e.time || e.startTime || "", place: e.place || e.location || e.venue || "", note: e.note || e.description || "" }));
}
export function placesOf(details = {}, venue = "") {
  const source = [details.legendPlaces, details.locations].find(v => Array.isArray(v) && v.length) || eventsOf(details);
  const seen = new Set();
  const places = source.map((raw, i) => {
    const e = typeof raw === "string" ? { name: raw } : raw;
    const name = e.venue || e.place || e.location || e.name || e.address || "";
    return { ...e, name, title: e.label || e.title || (i ? "Proslava" : "Naše odredište"), address: e.address || name, mapUrl: safeUrl(e.mapUrl || e.mapsUrl || e.mapLink), image: safeUrl(e.image || e.photo) };
  }).filter(e => {
    if (!e.name || seen.has(e.name.toLocaleLowerCase())) return false;
    seen.add(e.name.toLocaleLowerCase()); return true;
  });
  return places.length ? places : venue ? [{ name: venue, address: venue, title: "Mesto našeg venčanja" }] : [];
}
export function mapUrl(place) {
  return safeUrl(place.mapUrl) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address || place.name)}`;
}
export function galleryOf(details = {}) {
  const source = [details.legendGallery, details.galleryImages, details.gallery].find(Array.isArray) || [];
  return source.map((p, i) => typeof p === "string" ? { src: safeUrl(p), caption: `Uspomena ${i + 1}` } : { src: safeUrl(p.src || p.url || p.image), caption: p.caption || p.title || `Uspomena ${i + 1}` }).filter(p => p.src);
}

// Calendar and countdown use the wedding's timezone, even for guests abroad.
export function weddingMoment(weddingDate = "", weddingTime = "", details = {}) {
  const raw = String(details.dateISO || weddingDate || "").trim();
  let parts = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  let y, m, d;
  if (parts) [, y, m, d] = parts;
  else {
    parts = raw.match(/(\d{1,2})[./-]\s*(\d{1,2})[./-]\s*(\d{4})/);
    if (parts) [, d, m, y] = parts;
    else {
      const months = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
      parts = raw.toLowerCase().match(/(\d{1,2})\.?\s+([a-zčćšđž]+)\.?\s+(\d{4})/);
      if (!parts) return null;
      d = parts[1]; y = parts[3]; m = months.findIndex(month => month.startsWith(parts[2].slice(0, 3))) + 1;
    }
  }
  y = +y; m = +m; d = +d;
  const valid = new Date(Date.UTC(y, m - 1, d));
  if (valid.getUTCFullYear() !== y || valid.getUTCMonth() !== m - 1 || valid.getUTCDate() !== d) return null;
  const isoTime = raw.match(/T(\d{2}):(\d{2})/);
  const suppliedTime = String(weddingTime || details.time || "").match(/^(\d{1,2})(?::(\d{2})|\s*h)?$/);
  const hm = suppliedTime || isoTime;
  const hour = +(hm?.[1] || 0), minute = +(hm?.[2] || 0);
  if (hour > 23 || minute > 59) return null;
  let zone = details.timeZone || "Europe/Belgrade";
  try { new Intl.DateTimeFormat("en", { timeZone: zone }); } catch { zone = "Europe/Belgrade"; }
  let timestamp;
  if (isoTime && /(?:Z|[+-]\d{2}:?\d{2})$/.test(raw) && !suppliedTime) timestamp = Date.parse(raw);
  else {
    const utc = Date.UTC(y, m - 1, d, hour, minute);
    const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
    timestamp = utc;
    for (let i = 0; i < 3; i++) {
      const p = Object.fromEntries(fmt.formatToParts(new Date(timestamp)).map(x => [x.type, x.value]));
      timestamp = utc - (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - timestamp);
    }
  }
  if (!Number.isFinite(timestamp)) return null;
  const fmt = new Intl.DateTimeFormat("sr-Latn-RS", { timeZone: zone, day: "numeric", month: "long", year: "numeric", weekday: "long" });
  const display = Object.fromEntries(fmt.formatToParts(new Date(timestamp)).map(p => [p.type, p.value]));
  return { timestamp, y, m, d, hasTime: !!hm, zone, display };
}
export function calendarUrl(moment, names, venue, hours = 6) {
  if (!moment) return "";
  const duration = Number(hours) > 0 ? Number(hours) : 6;
  let dates;
  if (moment.hasTime) {
    const format = n => new Date(n).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    dates = `${format(moment.timestamp)}/${format(moment.timestamp + duration * 3600000)}`;
  } else {
    const format = date => `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
    dates = `${format(new Date(Date.UTC(moment.y, moment.m - 1, moment.d)))}/${format(new Date(Date.UTC(moment.y, moment.m - 1, moment.d + 1)))}`;
  }
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `Venčanje — ${names}`, dates, location: venue || "", ctz: moment.zone })}`;
}
