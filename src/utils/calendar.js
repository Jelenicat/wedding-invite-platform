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

  // NOVO
  allDay = false,
}) {
  if (!dateISO) return;

  const isEnglish = language === "en";

  const safeName =
    brideName ||
    (isEnglish ? "Invitation" : "Pozivnica");

  const title =
    eventTitle ||
    (eventType === "birthday"
      ? isEnglish
        ? `${safeName} - ${
            age ? `${age}th birthday` : "birthday"
          }`
        : `${safeName} - ${
            age ? `${age}. rođendan` : "rođendan"
          }`
      : isEnglish
        ? `Wedding - ${brideName || ""} & ${groomName || ""}`
        : `Venčanje - ${brideName || ""} & ${groomName || ""}`);

  const fileName =
    eventType === "birthday"
      ? `${safeName}-rodjendan.ics`
      : `${brideName || "pozivnica"}-${
          groomName || "vencanje"
        }-vencanje.ics`;

  const prodId =
    eventType === "birthday"
      ? `-//Moja Pozivnica//Birthday Invitation//${
          isEnglish ? "EN" : "SR"
        }`
      : `-//Moja Pozivnica//Wedding Invitation//${
          isEnglish ? "EN" : "SR"
        }`;

  const description = [
    note ||
      (isEnglish
        ? "We look forward to seeing you."
        : "Radujemo se vašem dolasku."),

    mapLink
      ? `${isEnglish ? "Location" : "Lokacija"}: ${mapLink}`
      : "",
  ]
    .filter(Boolean)
    .join("\\n");

  const formatTimedICSDate = (date) =>
    date
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";

  /* =========================================
     ALL-DAY EVENT
  ========================================= */

  let dtStart;
  let dtEnd;

  if (allDay) {
    /*
      Uzimamo samo datum iz:
      2027-06-19T00:00:00+02:00

      => 20270619

      Na taj način timezone NE MOŽE
      da pomeri datum.
    */

    const match = String(dateISO).match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (!match) return;

    const [, year, month, day] = match;

    const startDateOnly =
      `${year}${month}${day}`;

    /*
      Kod iCalendar all-day događaja
      DTEND je EKSKLUZIVAN.

      Ako je venčanje 19.06.,
      kraj mora biti 20.06.
    */

    const nextDay = new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day) + 1
      )
    );

    const nextYear =
      nextDay.getUTCFullYear();

    const nextMonth =
      String(
        nextDay.getUTCMonth() + 1
      ).padStart(2, "0");

    const nextDate =
      String(
        nextDay.getUTCDate()
      ).padStart(2, "0");

    const endDateOnly =
      `${nextYear}${nextMonth}${nextDate}`;

    dtStart =
      `DTSTART;VALUE=DATE:${startDateOnly}`;

    dtEnd =
      `DTEND;VALUE=DATE:${endDateOnly}`;
  } else {
    /* =========================================
       POSTOJEĆE POZIVNICE — SA VREMENOM
    ========================================= */

    const startDate =
      new Date(dateISO);

    if (
      Number.isNaN(
        startDate.getTime()
      )
    ) {
      return;
    }

    const endDate =
      new Date(
        startDate.getTime() +
          durationHours *
            60 *
            60 *
            1000
      );

    dtStart =
      `DTSTART:${formatTimedICSDate(startDate)}`;

    dtEnd =
      `DTEND:${formatTimedICSDate(endDate)}`;
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:${prodId}
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${Date.now()}-${safeName}-${eventType}@mojapozivnica.app
DTSTAMP:${formatTimedICSDate(new Date())}
${dtStart}
${dtEnd}
SUMMARY:${title}
LOCATION:${venue || ""}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob(
    [icsContent],
    {
      type:
        "text/calendar;charset=utf-8",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}