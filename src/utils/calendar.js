export function addToCalendar({
  brideName,
  groomName,
  dateISO,
  venue,
  mapLink,
  note,
}) {
  if (!dateISO) return;

  const startDate = new Date(dateISO);
  const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

  const formatICSDate = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const title = `Venčanje - ${brideName} & ${groomName}`;
  const description = [
    note || "Radujemo se vašem dolasku.",
    mapLink ? `Lokacija: ${mapLink}` : "",
  ]
    .filter(Boolean)
    .join("\\n");

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Moja Pozivnica//Wedding Invitation//SR
BEGIN:VEVENT
UID:${Date.now()}-${brideName}-${groomName}@mojapozivnica.app
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
  link.download = `${brideName}-${groomName}-vencanje.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}