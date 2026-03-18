import { useState } from "react";

function RSVPForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    attending: "yes",
    guestsCount: "1",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Unesite ime i prezime.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Unesite broj telefona.");
      return;
    }

    setSubmitted(true);

    console.log("RSVP PODACI:", formData);
  };

  if (submitted) {
    return (
      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-box success-box">
          <p className="rsvp-eyebrow">Hvala</p>
          <h2>Uspešno ste poslali potvrdu</h2>
          <p>
            Vaš odgovor je zabeležen. Radujemo se što ćemo ovaj poseban dan
            podeliti sa vama.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rsvp-section" id="rsvp">
      <div className="rsvp-box">
        <p className="rsvp-eyebrow">RSVP</p>
        <h2 className="rsvp-title">Potvrdite dolazak</h2>
        <p className="rsvp-text">
          Molimo vas da popunite formu kako bismo lakše organizovali naš dan.
        </p>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Ime i prezime</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Unesite ime i prezime"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Broj telefona</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Unesite broj telefona"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attending">Dolazak</label>
            <select
              id="attending"
              name="attending"
              value={formData.attending}
              onChange={handleChange}
            >
              <option value="yes">Dolazim</option>
              <option value="no">Ne dolazim</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="guestsCount">Broj osoba</label>
            <input
              id="guestsCount"
              name="guestsCount"
              type="number"
              min="1"
              value={formData.guestsCount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Poruka mladencima</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Opciono"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="submit-button">
            Pošalji potvrdu
          </button>
        </form>
      </div>
    </section>
  );
}

export default RSVPForm;