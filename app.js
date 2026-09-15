const { useState } = React;

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=Inter:wght@400;500;600&display=swap');`;

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
const SCRIPT_URL = https://script.google.com/macros/s/AKfycbyr_0EphryVGD4301LFCVGtjvbtk2pk730tHsTzBywr9xc87YV9l-6hX_0io4g1CztI8g/exec;

function RegisterTab() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      <h2>Register to participate</h2>
      <p className="lede">Fields marked * are required. Registration is individual — no institution nomination needed.</p>

      <form onSubmit={handleSubmit} className="form">
        <fieldset className="field-group">
          <legend>Category *</legend>
          <div className="radio-row">
            <label className={`radio-card ${isSchool ? "active" : ""}`}>
              <input
                type="radio"
                name="category"
                checked={isSchool}
                onChange={() => update("category", "school")}
              />
              School leaver (A/L Math or Commerce)
            </label>
            <label className={`radio-card ${isUni ? "active" : ""}`}>
              <input
                type="radio"
                name="category"
                checked={isUni}
                onChange={() => update("category", "university")}
              />
              University student
            </label>
          </div>
        </fieldset>

        <div className="grid-2">
          <label className="field">
            Full name *
            <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="As per NIC" />
          </label>
          <label className="field">
            NIC / ID number *
            <input value={form.nic} onChange={(e) => update("nic", e.target.value)} placeholder="200012345678" />
          </label>
        </div>

        <div className="grid-2">
          <label className="field">
            Email *
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="field">
            Phone *
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="07X XXX XXXX" />
          </label>
        </div>

        {isUni && (
          <div className="grid-2">
            <label className="field">
              University *
              <select value={form.institution} onChange={(e) => update("institution", e.target.value)}>
                <option value="">Select university</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Degree programme &amp; year
              <input value={form.detail} onChange={(e) => update("detail", e.target.value)} placeholder="e.g. BSc Logistics, Year 3" />
            </label>
          </div>
        )}

        {isSchool && (
          <div className="grid-2">
            <label className="field">
              School name *
              <input value={form.institution} onChange={(e) => update("institution", e.target.value)} placeholder="School name" />
            </label>
            <label className="field">
              A/L stream
              <select value={form.detail} onChange={(e) => update("detail", e.target.value)}>
                <option value="">Select stream</option>
                <option value="maths">Mathematics</option>
                <option value="commerce">Commerce</option>
              </select>
            </label>
          </div>
        )}

        <div className="grid-2">
          <label className="field">
            Emergency contact name
            <input value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} />
          </label>
          <label className="field">
            Emergency contact phone
            <input value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} />
          </label>
        </div>

        <div className="field-group consent-group">
          <label className="checkbox-row">
            <input type="checkbox" checked={form.consentParticipation} onChange={(e) => update("consentParticipation", e.target.checked)} />
            I consent to participate and agree to follow site safety and conduct guidelines. *
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={form.consentPhoto} onChange={(e) => update("consentPhoto", e.target.checked)} />
            I consent to being photographed for programme documentation. <Tag>Wording pending legal confirmation</Tag>
          </label>
          {isSchool && (
            <label className="checkbox-row">
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
