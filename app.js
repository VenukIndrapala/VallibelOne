const { useState } = React;

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=Inter:wght@400;500;600&display=swap');`;

const LOGO_DATA_URI = "data:image/png;base64,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";


const BUSINESS_UNITS = [
  "Swisstek Ceylon PLC",
  "Swisstek Aluminium Limited",
  "Rocell Horana",
  "Rocell Eheliyagoda",
  "Rocell Bathware",
  "Unidil Packaging Limited",
  "Lanka Tiles PLC",
  "Lanka Walltiles PLC",
];

const UNIVERSITIES = [
  "General Sir John Kotelawala Defence University (KDU)",
  "CINEC Campus",
  "Informatics Institute of Technology (IIT)",
  "National Institute of Business Management (NIBM)",
];

// DUMMY DATA — replace once Phase 1/Phase 2 dates, venue and capacity are confirmed
const SCHEDULE = [
  { date: "Mon, 1 Sep 2026", unit: "Swisstek Ceylon PLC", slot: "9:00 AM – 12:00 PM" },
  { date: "Tue, 2 Sep 2026", unit: "Swisstek Aluminium Limited", slot: "9:00 AM – 12:00 PM" },
  { date: "Wed, 3 Sep 2026", unit: "Rocell Horana", slot: "1:00 PM – 4:00 PM" },
  { date: "Thu, 4 Sep 2026", unit: "Rocell Eheliyagoda", slot: "9:00 AM – 12:00 PM" },
  { date: "Fri, 5 Sep 2026", unit: "Rocell Bathware", slot: "1:00 PM – 4:00 PM" },
  { date: "Mon, 8 Sep 2026", unit: "Unidil Packaging Limited", slot: "9:00 AM – 12:00 PM" },
  { date: "Tue, 9 Sep 2026", unit: "Lanka Tiles PLC", slot: "9:00 AM – 12:00 PM" },
  { date: "Wed, 10 Sep 2026", unit: "Lanka Walltiles PLC", slot: "1:00 PM – 4:00 PM" },
];

const PHASE2 = {
  date: "Sat, 19 Sep 2026 (dummy — pending confirmation)",
  time: "9:00 AM – 1:00 PM",
  venue: "KDU Faculty of Graduate Studies Auditorium (subject to confirmation)",
};

const FAQS = [
  {
    q: "Who can register for this programme?",
    a: "School leavers who have completed their A/L examinations (Mathematics or Commerce streams), and university students from KDU, CINEC, IIT or NIBM studying logistics, supply chain, engineering or related programmes.",
  },
  {
    q: "Is there a registration fee?",
    a: "No. Participation is free. Transport, meals and other costs are only covered if separately approved — check the Schedule tab for confirmed logistics closer to the date.",
  },
  {
    q: "Will I receive a certificate?",
    a: "Certification is currently outside the scope of this programme. This may be revisited — check back before assuming a certificate will be issued.",
  },
  {
    q: "What should I bring on the day?",
    a: "A valid ID, closed-toe shoes, and any personal protective equipment specified for your assigned business unit. Full details are on the Safety tab.",
  },
  {
    q: "Can I choose which business unit I visit?",
    a: "Business unit assignments are coordinated centrally based on your category and availability. You'll receive your confirmed assignment after registering.",
  },
];

const emptyForm = {
  category: "",
  fullName: "",
  nic: "",
  email: "",
  phone: "",
  institution: "",
  detail: "",
  emergencyName: "",
  emergencyPhone: "",
  consentParticipation: false,
  consentPhoto: false,
  guardianConsent: false,
};

function Tag({ children }) {
  return <span className="tag">{children}</span>;
}

function OverviewTab() {
  return (
    <div className="panel">
      <div className="hero">
        <h1>Industry Exposure &amp;<br />Knowledge Sharing Programme</h1>
        <p className="hero-sub">
          Vallibel One PLC · Supply Chain &amp; Business Excellence Department · 12th Intern Batch
        </p>
        <div className="stat-row">
          <div className="stat">
            <span className="stat-num">8</span>
            <span className="stat-label">Business units</span>
          </div>
          <div className="stat">
            <span className="stat-num">2</span>
            <span className="stat-label">Programme phases</span>
          </div>
          <div className="stat">
            <span className="stat-num">2</span>
            <span className="stat-label">Participant tracks</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Phase 1 — Business Unit Visits</h3>
          <p>
            Guided visits across eight Vallibel One business units, giving participants
            direct exposure to production, logistics, engineering and operational practice.
          </p>
          <Tag>Tentative: first two weeks of Sept 2026</Tag>
        </div>
        <div className="card">
          <h3>Phase 2 — Knowledge Sharing Session</h3>
          <p>
            A structured session covering industry operations, technology, sustainability
            and career pathways, led by Vallibel One managers and subject-matter experts.
          </p>
          <Tag>Pending confirmation</Tag>
        </div>
      </div>

      <h3 className="section-label">Participating business units</h3>
      <ul className="unit-list">
        {BUSINESS_UNITS.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>

      <h3 className="section-label">Who this is for</h3>
      <div className="grid-2">
        <div className="card quiet">
          <h4>School leavers</h4>
          <p>Completed A/L examinations, Mathematics or Commerce streams. Focus: career and study pathway guidance.</p>
        </div>
        <div className="card quiet">
          <h4>University students</h4>
          <p>From KDU, CINEC, IIT or NIBM. Focus: applied exposure to logistics, supply chain, engineering and operations.</p>
        </div>
      </div>
    </div>
  );
}

// Paste your deployed Google Apps Script Web App URL here.
// Extensions > Apps Script > Deploy > New deployment > Web app > copy the URL.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyr_0EphryVGD4301LFCVGtjvbtk2pk730tHsTzBywr9xc87YV9l-6hX_0io4g1CztI8g/exec";

function RegisterTab() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [today] = useState(() =>
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  );
  const [refNo] = useState(() => `REG-${Date.now().toString().slice(-6)}`);

  const isUni = form.category === "university";
  const isSchool = form.category === "school";

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.category || !form.fullName || !form.nic || !form.email || !form.phone || !form.institution) {
      setError("Please complete all required fields before submitting.");
      return;
    }
    if (!form.consentParticipation) {
      setError("Participation consent is required to register.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const body = new FormData();
      Object.keys(form).forEach((key) => body.append(key, form[key]));

      // mode: "no-cors" is required because Apps Script Web Apps don't send
      // CORS headers. This means we can't read the response back (it's
      // "opaque"), so we treat a fetch that doesn't throw as a success.
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body,
      });

      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      setError("Couldn't reach the registration server. Check your connection and try again.");
    }
  }

  if (submitted) {
    return (
      <div className="panel">
        <div className="confirm-box">
          <span className="confirm-mark">✓</span>
          <h3>Registration recorded</h3>
          <p>
            Thanks, {form.fullName.split(" ")[0]}. Your details have been submitted. You'll be
            contacted with your confirmed visit date and assignment closer to the programme.
          </p>
          <button className="btn-ghost" onClick={() => { setForm(emptyForm); setSubmitted(false); }}>
            Register another participant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="reg-sheet">
        <div className="reg-header-row">
          <div className="reg-banner">
            <h2>REGISTRATION <span>FORM</span></h2>
          </div>
          <img src={LOGO_DATA_URI} alt="Vallibel One" className="reg-logo" />
        </div>

        <div className="reg-meta-row">
          <div className="reg-meta">
            <span className="reg-meta-label">Date</span>
            <span className="reg-meta-value">{today}</span>
          </div>
          <div className="reg-meta">
            <span className="reg-meta-label">Reference No.</span>
            <span className="reg-meta-value">{refNo}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="reg-section-title">Category</div>
          <div className="reg-check-row">
            <label className="reg-check">
              <input
                type="checkbox"
                checked={isSchool}
                onChange={() => update("category", isSchool ? "" : "school")}
              />
              School leaver <span className="reg-check-sub">(A/L Math or Commerce)</span>
            </label>
            <label className="reg-check">
              <input
                type="checkbox"
                checked={isUni}
                onChange={() => update("category", isUni ? "" : "university")}
              />
              University student
            </label>
          </div>

          <div className="reg-section-title">Personal Information</div>
          <div className="reg-grid">
            <div className="reg-field">
              <label>Full Name *</label>
              <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="As per NIC" />
            </div>
            <div className="reg-field">
              <label>NIC / ID Number *</label>
              <input value={form.nic} onChange={(e) => update("nic", e.target.value)} placeholder="200012345678" />
            </div>
            <div className="reg-field">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="reg-field">
              <label>Phone *</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="07X XXX XXXX" />
            </div>

            {isUni && (
              <>
                <div className="reg-field">
                  <label>University *</label>
                  <select value={form.institution} onChange={(e) => update("institution", e.target.value)}>
                    <option value="">Select university</option>
                    {UNIVERSITIES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="reg-field">
                  <label>Degree Programme &amp; Year</label>
                  <input value={form.detail} onChange={(e) => update("detail", e.target.value)} placeholder="e.g. BSc Logistics, Year 3" />
                </div>
              </>
            )}

            {isSchool && (
              <>
                <div className="reg-field">
                  <label>School Name *</label>
                  <input value={form.institution} onChange={(e) => update("institution", e.target.value)} placeholder="School name" />
                </div>
                <div className="reg-field">
                  <label>A/L Stream</label>
                  <select value={form.detail} onChange={(e) => update("detail", e.target.value)}>
                    <option value="">Select stream</option>
                    <option value="maths">Mathematics</option>
                    <option value="commerce">Commerce</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="reg-section-title">Emergency Contact</div>
          <div className="reg-grid">
            <div className="reg-field">
              <label>Contact Name</label>
              <input value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} />
            </div>
            <div className="reg-field">
              <label>Contact Phone</label>
              <input value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} />
            </div>
          </div>

          <div className="reg-section-title">Consent</div>
          <div className="reg-consent">
            <label className="reg-check">
              <input type="checkbox" checked={form.consentParticipation} onChange={(e) => update("consentParticipation", e.target.checked)} />
              I consent to participate and agree to follow site safety and conduct guidelines. *
            </label>
            <label className="reg-check">
              <input type="checkbox" checked={form.consentPhoto} onChange={(e) => update("consentPhoto", e.target.checked)} />
              I consent to being photographed for programme documentation. <Tag>Wording pending legal confirmation</Tag>
            </label>
            {isSchool && (
              <label className="reg-check">
                <input type="checkbox" checked={form.guardianConsent} onChange={(e) => update("guardianConsent", e.target.checked)} />
                I confirm parental/guardian consent has been obtained (required if under 18). <Tag>Pending confirmation</Tag>
              </label>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit registration"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ScheduleTab() {
  return (
    <div className="panel">
      <h2>Schedule</h2>
      <p className="lede">
        <Tag>All dates below are placeholder values</Tag> — final visit sequence is still under discussion with each business unit.
      </p>

      <h3 className="section-label">Phase 1 — Business unit visits</h3>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Business unit</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {SCHEDULE.map((row) => (
            <tr key={row.unit}>
              <td>{row.date}</td>
              <td>{row.unit}</td>
              <td>{row.slot}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="section-label">Phase 2 — Knowledge sharing session</h3>
      <div className="card quiet">
        <p><strong>Date:</strong> {PHASE2.date}</p>
        <p><strong>Time:</strong> {PHASE2.time}</p>
        <p><strong>Venue:</strong> {PHASE2.venue}</p>
      </div>

      <h3 className="section-label">Visit day flow</h3>
      <ol className="flow-list">
        <li>Registration, welcome and safety briefing</li>
        <li>Introduction to Vallibel One PLC and the host business unit</li>
        <li>Guided operational tour through approved areas</li>
        <li>Focused explanation based on participant category</li>
        <li>Question-and-answer session with host representatives</li>
        <li>Feedback collection and closing remarks</li>
      </ol>
    </div>
  );
}

function SafetyTab() {
  return (
    <div className="panel">
      <h2>Safety &amp; conduct</h2>
      <p className="lede">Read this before your visit. Site access depends on following these guidelines.</p>

      <div className="grid-2">
        <div className="card">
          <h4>What to wear</h4>
          <ul>
            <li>Closed-toe covered shoes — no sandals or slippers</li>
            <li>Full-length trousers recommended</li>
            <li>Avoid loose jewellery, scarves or accessories near machinery</li>
          </ul>
        </div>
        <div className="card">
          <h4>What to bring</h4>
          <ul>
            <li>Valid NIC or student ID</li>
            <li>Any PPE specified for your assigned business unit <Tag>confirmed per site</Tag></li>
            <li>A notebook or device for the knowledge sharing session</li>
          </ul>
        </div>
      </div>

      <h3 className="section-label">On-site conduct</h3>
      <ul className="unit-list">
        <li>Stay with your assigned group and guide at all times</li>
        <li>Do not enter unsupervised or restricted areas</li>
        <li>Follow all instructions from host business unit representatives</li>
        <li>Photography only where explicitly permitted by your host</li>
        <li>No confidential, operational or commercially sensitive information will be shared or should be requested</li>
      </ul>

      <div className="card quiet">
        <p>
          <strong>Note:</strong> unsupervised access to production areas, machinery, warehouses
          or restricted locations is not permitted under any circumstances.
        </p>
      </div>
    </div>
  );
}

function FaqTab() {
  const [open, setOpen] = useState(null);
  return (
    <div className="panel">
      <h2>Frequently asked questions</h2>
      <div className="faq-list">
        {FAQS.map((item, i) => (
          <div className={`faq-item ${open === i ? "open" : ""}`} key={item.q}>
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {item.q}
              <span className="faq-icon">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="faq-a">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { id: "overview", label: "Overview", render: OverviewTab },
  { id: "register", label: "Register", render: RegisterTab },
  { id: "schedule", label: "Schedule", render: ScheduleTab },
  { id: "safety", label: "Safety", render: SafetyTab },
  { id: "faq", label: "FAQ", render: FaqTab },
];

function App() {
  const [active, setActive] = useState("overview");
  const ActiveComponent = TABS.find((t) => t.id === active).render;

  return (
    <div className="app-root">
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        .app-root {
          font-family: 'Inter', sans-serif;
          background: #EDEAE3;
          color: #2B2B28;
          min-height: 100%;
          padding: 0;
        }
        h1, h2, h3, h4, legend { font-family: 'Archivo', sans-serif; }

        .topbar {
          background: #2B2B28;
          color: #EDEAE3;
          padding: 18px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 3px solid #B5502E;
        }
        .brand {
          font-family: 'Archivo', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.02em;
        }
        .brand span { color: #B5502E; }
        .nav {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .nav button {
          background: transparent;
          border: none;
          color: #C9C4B8;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 3px;
          cursor: pointer;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .nav button:hover { color: #EDEAE3; background: rgba(255,255,255,0.06); }
        .nav button.active { color: #EDEAE3; background: #B5502E; }

        .panel {
          max-width: 860px;
          margin: 0 auto;
          padding: 40px 28px 64px;
        }

        .hero h1 {
          font-size: 36px;
          font-weight: 800;
          line-height: 1.15;
          margin: 0 0 10px;
          max-width: 640px;
        }
        .hero-sub {
          color: #5C5A50;
          font-size: 15px;
          margin: 0 0 28px;
        }
        .stat-row { display: flex; gap: 36px; margin-bottom: 40px; }
        .stat { display: flex; flex-direction: column; }
        .stat-num {
          font-family: 'Archivo', sans-serif;
          font-weight: 800;
          font-size: 32px;
          color: #B5502E;
          line-height: 1;
        }
        .stat-label { font-size: 13px; color: #5C5A50; margin-top: 4px; }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 28px;
        }
        @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } }

        .card {
          background: #F7F5F0;
          border: 1px solid #DAD5C8;
          border-left: 3px solid #3A5A78;
          padding: 18px 20px;
        }
        .card.quiet { border-left-color: #DAD5C8; }
        .card h3, .card h4 { margin: 0 0 8px; font-size: 16px; }
        .card p { margin: 0 0 10px; font-size: 14px; color: #423F38; line-height: 1.5; }
        .card ul { margin: 0; padding-left: 18px; font-size: 14px; color: #423F38; line-height: 1.7; }

        .section-label {
          font-size: 13px;
          font-weight: 700;
          text-transform: none;
          letter-spacing: 0.01em;
          color: #2B2B28;
          border-top: 1px solid #DAD5C8;
          padding-top: 24px;
          margin: 32px 0 14px;
        }

        .unit-list {
          list-style: none;
          padding: 0;
          margin: 0 0 28px;
          columns: 2;
          gap: 8px;
        }
        .unit-list li {
          font-size: 14px;
          padding: 8px 0;
          border-bottom: 1px solid #DAD5C8;
          break-inside: avoid;
        }

        .tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: #8A4022;
          background: #F0DCCF;
          padding: 2px 8px;
          border-radius: 2px;
          margin-left: 4px;
        }

        .lede { color: #5C5A50; font-size: 14px; margin: 0 0 24px; }

        .form { display: flex; flex-direction: column; gap: 20px; }
        .field-group {
          border: 1px solid #DAD5C8;
          padding: 16px 18px;
          background: #F7F5F0;
        }
        .field-group legend {
          font-size: 13px;
          font-weight: 700;
          padding: 0 6px;
        }
        .radio-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .radio-card {
          flex: 1;
          min-width: 220px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          padding: 12px 14px;
          border: 1px solid #DAD5C8;
          background: #EDEAE3;
          cursor: pointer;
        }
        .radio-card.active { border-color: #B5502E; background: #F0DCCF; }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #423F38;
        }
        .field input, .field select {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 400;
          padding: 10px 12px;
          border: 1px solid #C6C0B2;
          background: #FFFFFF;
          color: #2B2B28;
        }
        .field input:focus, .field select:focus {
          outline: 2px solid #3A5A78;
          outline-offset: 1px;
        }

        .consent-group { display: flex; flex-direction: column; gap: 12px; }
        .checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.4;
        }
        .checkbox-row input { margin-top: 3px; }

        .error-text { color: #B5502E; font-size: 13px; font-weight: 600; }

        .btn-primary {
          align-self: flex-start;
          background: #2B2B28;
          color: #EDEAE3;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 26px;
          cursor: pointer;
        }
        .btn-primary:hover { background: #B5502E; }
        .btn-ghost {
          background: transparent;
          border: 1px solid #2B2B28;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .confirm-box {
          border: 1px solid #DAD5C8;
          border-left: 3px solid #5C7A5E;
          background: #F7F5F0;
          padding: 32px;
          text-align: left;
        }
        .confirm-mark {
          display: inline-block;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #5C7A5E;
          color: #fff;
          text-align: center;
          line-height: 32px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 28px;
          font-size: 14px;
        }
        .schedule-table th {
          text-align: left;
          font-family: 'Archivo', sans-serif;
          font-weight: 700;
          font-size: 12px;
          padding: 10px 12px;
          border-bottom: 2px solid #2B2B28;
        }
        .schedule-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #DAD5C8;
        }

        .flow-list {
          padding-left: 20px;
          font-size: 14px;
          line-height: 2;
          color: #423F38;
        }

        .faq-list { display: flex; flex-direction: column; }
        .faq-item { border-bottom: 1px solid #DAD5C8; }
        .faq-q {
          width: 100%;
          background: transparent;
          border: none;
          text-align: left;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          padding: 16px 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          color: #2B2B28;
        }
        .faq-icon { color: #B5502E; font-size: 18px; font-weight: 700; }
        .faq-a { font-size: 14px; color: #423F38; line-height: 1.6; padding: 0 4px 18px; margin: 0; }

        /* --- Registration sheet (document-style form) --- */
        @keyframes regSlideInUp {
          from { transform: translateY(90px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .reg-sheet {
          position: relative;
          background: #FFFFFF;
          border: 1px solid #DAD5C8;
          padding: 36px 40px 40px;
          box-shadow: 10px 0 24px -6px rgba(43, 43, 40, 0.28);
          animation: regSlideInUp 1.1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reg-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .reg-banner {
          background: #F0B93A;
          padding: 10px 22px;
          flex: 1;
          min-width: 220px;
        }
        .reg-banner h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: 0.04em;
          color: #2B2B28;
        }
        .reg-banner h2 span { font-weight: 500; }
        .reg-logo { height: 26px; width: auto; }

        .reg-meta-row {
          display: flex;
          gap: 40px;
          border-bottom: 2px solid #2B2B28;
          padding-bottom: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .reg-meta { display: flex; flex-direction: column; gap: 4px; }
        .reg-meta-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #8A8577; }
        .reg-meta-value { font-size: 14px; font-weight: 600; color: #2B2B28; }

        .reg-section-title {
          background: #F0B93A;
          color: #2B2B28;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          padding: 7px 14px;
          margin: 28px 0 18px;
        }
        .reg-sheet form > .reg-section-title:first-of-type { margin-top: 0; }

        .reg-check-row { display: flex; gap: 28px; flex-wrap: wrap; }
        .reg-check {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #2B2B28;
          cursor: pointer;
        }
        .reg-check input { width: 16px; height: 16px; accent-color: #B5502E; cursor: pointer; }
        .reg-check-sub { font-weight: 400; color: #5C5A50; }

        .reg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 40px;
        }
        @media (max-width: 640px) { .reg-grid { grid-template-columns: 1fr; } }

        .reg-field { display: flex; flex-direction: column; gap: 6px; }
        .reg-field label { font-size: 12px; font-weight: 700; color: #5C5A50; text-transform: uppercase; letter-spacing: 0.02em; }
        .reg-field input, .reg-field select {
          border: none;
          border-bottom: 1.5px dotted #B3AC9C;
          background: transparent;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #2B2B28;
          padding: 4px 2px 8px;
        }
        .reg-field input:focus, .reg-field select:focus {
          outline: none;
          border-bottom: 1.5px solid #B5502E;
        }
        .reg-field input::placeholder { color: #B3AC9C; }

        .reg-consent { display: flex; flex-direction: column; gap: 14px; }
        .reg-consent .reg-check { font-weight: 400; align-items: flex-start; }
        .reg-consent .reg-check input { margin-top: 3px; flex-shrink: 0; }

        .reg-sheet .btn-primary { margin-top: 32px; }
      `}</style>

      <div className="topbar">
        <div className="brand">VALLIBEL ONE <span>· Student Programme</span></div>
        <nav className="nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={active === t.id ? "active" : ""}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <ActiveComponent />
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
