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
  language = "sr",
}) {
  if (!dateISO) return;

  const startDate = new Date(dateISO);

  if (Number.isNaN(startDate.getTime())) return;

  const endDate = new Date(
    startDate.getTime() + durationHours * 60 * 60 * 1000
  );

  const formatICSDate = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const isEnglish = language === "en";

  const safeName = brideName || (isEnglish ? "Invitation" : "Pozivnica");

  const title =
    eventTitle ||
    (eventType === "birthday"
      ? isEnglish
        ? `${safeName} - ${age ? `${age}th birthday` : "birthday"}`
        : `${safeName} - ${age ? `${age}. rođendan` : "rođendan"}`
      : isEnglish
        ? `Wedding - ${brideName || ""} & ${groomName || ""}`
        : `Venčanje - ${brideName || ""} & ${groomName || ""}`);

  const fileName =
    eventType === "birthday"
      ? `${safeName}-rodjendan.ics`
      : `${brideName || "pozivnica"}-${groomName || "vencanje"}-vencanje.ics`;

  const prodId =
    eventType === "birthday"
      ? `-//Moja Pozivnica//Birthday Invitation//${isEnglish ? "EN" : "SR"}`
      : `-//Moja Pozivnica//Wedding Invitation//${isEnglish ? "EN" : "SR"}`;

  const description = [
    note || (isEnglish ? "We look forward to seeing you." : "Radujemo se vašem dolasku."),
    mapLink ? `${isEnglish ? "Location" : "Lokacija"}: ${mapLink}` : "",
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