export function addToCalendar({
  brideName,
  groomName,
  dateISO,
  venue,
  mapLink,
  note,
  eventType = "wedding",
  age,
  eventTitle,
  durationHours = 6,
}) {
  if (!dateISO) return;

  const startDate = new Date(dateISO);

  if (Number.isNaN(startDate.getTime())) return;

  const endDate = new Date(
    startDate.getTime() + durationHours * 60 * 60 * 1000
  );

  const formatICSDate = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const safeName = brideName || "Pozivnica";

  const title =
    eventTitle ||
    (eventType === "birthday"
      ? `${safeName} - ${age ? `${age}. rođendan` : "rođendan"}`
      : `Venčanje - ${brideName || ""} & ${groomName || ""}`);

  const fileName =
    eventType === "birthday"
      ? `${safeName}-rodjendan.ics`
      : `${brideName || "pozivnica"}-${groomName || "vencanje"}-vencanje.ics`;

  const prodId =
    eventType === "birthday"
      ? "-//Moja Pozivnica//Birthday Invitation//SR"
      : "-//Moja Pozivnica//Wedding Invitation//SR";

  const description = [
    note || "Radujemo se vašem dolasku.",
    mapLink ? `Lokacija: ${mapLink}` : "",
  ]
    .filter(Boolean)
    .join("\\n");

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:${prodId}
BEGIN:VEVENT
UID:${Date.now()}-${safeName}-${eventType}@mojapozivnica.app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${title}
LOCATION:${venue || ""}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}