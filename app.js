const { useState, useRef, useEffect, useCallback } = React;

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`;

// ⚠️ ONLY LINE YOU NEED TO RESTORE ⚠️
// Paste your original one-line HERO_BG_DATA_URI value back in here.
// Everything else in this file is ready to use as-is.
const HERO_BG_DATA_URI = "PASTE_YOUR_EXISTING_DATA_URI_HERE";

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

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "register", label: "Register" },
  { id: "schedule", label: "Schedule" },
  { id: "safety", label: "Safety" },
  { id: "faq", label: "FAQ" },
];

function Tag({ children }) {
  return <span className="tag">{children}</span>;
}

// Returns className + style for the staggered slide-in effect.
// Usage: <div {...reveal(3)}>...</div> — i is the position in the
// reveal sequence for that page; every tab remounts on switch, so the
// animation replays each time the user navigates to it.
function reveal(i, extraClass) {
  return {
    className: extraClass ? `reveal ${extraClass}` : "reveal",
    style: { "--i": i },
  };
}

/* ============================================================
   DOCK MAGNIFICATION — shared by every clickable control
   ============================================================
   Attach to any container. Every descendant carrying [data-mag]
   scales up based on how close the pointer is to its centre,
   following a macOS-dock falloff curve. Applied by mutating
   style.transform directly rather than through React state,
   because mousemove fires far too often to re-render on.

   axis: "x"  — horizontal distance only (rows: the nav, hero CTAs)
         "y"  — vertical distance only (stacks: the FAQ list)
         "xy" — true radial distance
   ============================================================ */
function useDockMagnify(containerRef, options) {
  const { maxScale = 1.2, radius = 95, axis = "x" } = options || {};

  const onMouseMove = useCallback(
    (e) => {
      const container = containerRef.current;
      if (!container) return;
      const px = e.clientX;
      const py = e.clientY;
      container.querySelectorAll("[data-mag]").forEach((btn) => {
        const b = btn.getBoundingClientRect();
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height / 2;
        let dist;
        if (axis === "x") dist = Math.abs(px - cx);
        else if (axis === "y") dist = Math.abs(py - cy);
        else dist = Math.hypot(px - cx, py - cy);

        const t = Math.max(0, 1 - dist / radius);
        const eased = t * t * (3 - 2 * t); // smoothstep — softer shoulders than linear
        const scale = 1 + (maxScale - 1) * eased;
        btn.style.transform = `scale(${scale.toFixed(3)})`;
      });
    },
    [containerRef, maxScale, radius, axis]
  );

  const onMouseLeave = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.querySelectorAll("[data-mag]").forEach((btn) => {
      btn.style.transform = "";
    });
  }, [containerRef]);

  return { onMouseMove, onMouseLeave };
}

// Wraps any cluster of buttons so they magnify as a group.
// Children that should react must carry data-mag and className "mag".
function MagGroup({ className, children, maxScale, radius, axis, ...rest }) {
  const ref = useRef(null);
  const handlers = useDockMagnify(ref, { maxScale, radius, axis });
  return (
    <div ref={ref} className={className} {...handlers} {...rest}>
      {children}
    </div>
  );
}

// Click feedback: a quick pop. This is the only magnify signal that
// works on touch devices, where there is no pointer to track.
function popButton(el) {
  if (!el) return;
  el.classList.remove("pop");
  void el.offsetWidth; // force reflow so the animation restarts on repeat clicks
  el.classList.add("pop");
}

/* ============================================================
   NAV — traveling glass lens
   ============================================================
   The lens is a frosted capsule, taller than the bar, that glides
   to whichever tab the pointer is nearest and parks on the active
   tab when the pointer leaves.

   Why the module-level variable: PillNav lives inside Hero, which
   lives inside each tab component, and TAB_RENDERERS swaps that
   whole component on every tab change. So PillNav unmounts and a
   brand-new one mounts — a CSS transition cannot animate from a
   position that never existed in the new instance, which is why
   the old indicator teleported. Remembering the last geometry
   outside the component lets the fresh mount render at the OLD
   position first, then travel to the new one on the next frame.
   ============================================================ */
let lastLensGeo = null;

function applyLensGeo(lens, geo) {
  lens.style.transform = `translateX(${geo.left}px)`;
  lens.style.width = `${geo.width}px`;
}

function PillNav({ active, setActive }) {
  const containerRef = useRef(null);
  const btnRefs = useRef({});
  const lensRef = useRef(null);
  const isFirstPaint = useRef(true);

  const [hovered, setHovered] = useState(null);
  const target = hovered || active;

  const magnify = useDockMagnify(containerRef, { maxScale: 1.22, radius: 90, axis: "x" });

  const measure = useCallback((id) => {
    const container = containerRef.current;
    const btn = btnRefs.current[id];
    if (!container || !btn) return null;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    return { left: bRect.left - cRect.left, width: bRect.width };
  }, []);

  useEffect(() => {
    const lens = lensRef.current;
    if (!lens) return;
    const geo = measure(target);
    if (!geo) return;

    if (isFirstPaint.current) {
      isFirstPaint.current = false;
      if (lastLensGeo) {
        // Remount after a tab switch — start where the lens visually
        // was, then travel, so the movement is actually seen.
        lens.style.transition = "none";
        applyLensGeo(lens, lastLensGeo);
        void lens.offsetWidth;
        lens.style.transition = "";
        requestAnimationFrame(() => applyLensGeo(lens, geo));
      } else {
        // Very first load — settle in place, nothing to travel from.
        lens.style.transition = "none";
        applyLensGeo(lens, geo);
        void lens.offsetWidth;
        lens.style.transition = "";
      }
    } else {
      applyLensGeo(lens, geo);
    }

    lastLensGeo = geo;
  }, [target, measure]);

  // Keep the lens aligned if the bar reflows (resize, font load, mobile scroll)
  useEffect(() => {
    function realign() {
      const lens = lensRef.current;
      const geo = measure(target);
      if (!lens || !geo) return;
      lens.style.transition = "none";
      applyLensGeo(lens, geo);
      void lens.offsetWidth;
      lens.style.transition = "";
      lastLensGeo = geo;
    }
    window.addEventListener("resize", realign);
    return () => window.removeEventListener("resize", realign);
  }, [target, measure]);

  // One handler drives both effects: dock scaling, and snapping the
  // lens to the nearest tab centre (matching the reference motion,
  // where the glass slides between items rather than only appearing
  // once the pointer is strictly inside one).
  function handlePointerMove(e) {
    magnify.onMouseMove(e);
    const container = containerRef.current;
    if (!container) return;
    let nearestId = null;
    let nearestDist = Infinity;
    TABS.forEach((t) => {
      const btn = btnRefs.current[t.id];
      if (!btn) return;
      const b = btn.getBoundingClientRect();
      const d = Math.abs(e.clientX - (b.left + b.width / 2));
      if (d < nearestDist) {
        nearestDist = d;
        nearestId = t.id;
      }
    });
    if (nearestId && nearestId !== hovered) setHovered(nearestId);
  }

  function handlePointerLeave(e) {
    magnify.onMouseLeave(e);
    setHovered(null); // lens glides back and parks on the active tab
  }

  function handleSelect(id) {
    popButton(btnRefs.current[id]);
    setActive(id);
  }

  return (
    <div
      className="pill-nav"
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <span className="pill-lens" ref={lensRef} aria-hidden="true" />
      {TABS.map((t) => (
        <button
          key={t.id}
          data-mag
          ref={(el) => (btnRefs.current[t.id] = el)}
          className={`pill-link ${active === t.id ? "active" : ""}`}
          onClick={() => handleSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Shared hero + nav, used on every tab ---------- */
function Hero({ active, setActive, tall, eyebrow, title, subtitle, primaryCta, secondaryCta }) {
  return (
    <header className={`hero ${tall ? "hero-tall" : "hero-short"}`}>
      <MagGroup className="hero-nav" maxScale={1.1} radius={70} axis="x">
        <button
          data-mag
          className="brand mag"
          onClick={(e) => {
            popButton(e.currentTarget);
            setActive("overview");
          }}
        >
          Vallibel One
        </button>
        <PillNav active={active} setActive={setActive} />
        <button
          data-mag
          className="btn-black mag"
          onClick={(e) => {
            popButton(e.currentTarget);
            setActive("register");
          }}
        >
          Register <span className="btn-arrow">→</span>
        </button>
      </MagGroup>

      <div className="hero-body">
        {eyebrow && <p {...reveal(0)}>{eyebrow}</p>}
        <h1 {...reveal(eyebrow ? 1 : 0)}>{title}</h1>
        {subtitle && <p {...reveal(eyebrow ? 2 : 1, "hero-subtitle")}>{subtitle}</p>}
        {(primaryCta || secondaryCta) && (
          <MagGroup
            {...reveal(eyebrow ? 3 : 2, "hero-ctas")}
            maxScale={1.13}
            radius={130}
            axis="x"
          >
            {primaryCta}
            {secondaryCta}
          </MagGroup>
        )}
      </div>
    </header>
  );
}

/* ---------- Overview ---------- */
function OverviewTab({ active, setActive }) {
  return (
    <div>
      <Hero
        active={active}
        setActive={setActive}
        tall
        title={<>Step into industry.<br />Build your future.</>}
        subtitle="A guided programme across eight Vallibel One business units, closing with a knowledge sharing session — built for school leavers and university students exploring supply chain, engineering and operations."
        primaryCta={
          <button
            data-mag
            className="btn-white mag"
            onClick={(e) => {
              popButton(e.currentTarget);
              setActive("register");
            }}
          >
            Register now <span className="btn-arrow">→</span>
          </button>
        }
        secondaryCta={
          <button
            data-mag
            className="btn-ghost-dark mag"
            onClick={(e) => {
              popButton(e.currentTarget);
              setActive("schedule");
            }}
          >
            View schedule
          </button>
        }
      />

      <div className="page">
        <div {...reveal(3, "stat-row")}>
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

        <div className="grid-2">
          <div {...reveal(4, "card")}>
            <h3>Phase 1 — Business unit visits</h3>
            <p>
              Guided visits across eight Vallibel One business units, giving participants
              direct exposure to production, logistics, engineering and operational practice.
            </p>
            <Tag>Tentative: first two weeks of Sept 2026</Tag>
          </div>
          <div {...reveal(5, "card")}>
            <h3>Phase 2 — Knowledge sharing session</h3>
            <p>
              A structured session covering industry operations, technology, sustainability
              and career pathways, led by Vallibel One managers and subject-matter experts.
            </p>
            <Tag>Pending confirmation</Tag>
          </div>
        </div>

        <h3 {...reveal(6, "section-label")}>Participating business units</h3>
        <ul className="unit-list">
          {BUSINESS_UNITS.map((u, i) => (
            <li key={u} {...reveal(7 + i)}>{u}</li>
          ))}
        </ul>

        <h3 {...reveal(16, "section-label")}>Who this is for</h3>
        <div className="grid-2">
          <div {...reveal(17, "card quiet")}>
            <h4>School leavers</h4>
            <p>Completed A/L examinations, Mathematics or Commerce streams. Focus: career and study pathway guidance.</p>
          </div>
          <div {...reveal(18, "card quiet")}>
            <h4>University students</h4>
            <p>From KDU, CINEC, IIT or NIBM. Focus: applied exposure to logistics, supply chain, engineering and operations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Paste your deployed Google Apps Script Web App URL here.
// Extensions > Apps Script > Deploy > New deployment > Web app > copy the URL.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyr_0EphryVGD4301LFCVGtjvbtk2pk730tHsTzBywr9xc87YV9l-6hX_0io4g1CztI8g/exec";

/* ---------- Register ---------- */
function RegisterTab({ active, setActive }) {
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

  return (
    <div>
      <Hero
        active={active}
        setActive={setActive}
        title="Register for the programme"
        subtitle="Takes about two minutes. You'll receive your confirmed visit date and assignment by email."
      />

      <div className="page page-narrow">
        {submitted ? (
          <div className="confirm-box">
            <span className="confirm-mark">✓</span>
            <h3>Registration recorded</h3>
            <p>
              Thanks, {form.fullName.split(" ")[0]}. Your details have been submitted. You'll be
              contacted with your confirmed visit date and assignment closer to the programme.
            </p>
            <button
              className="btn-ghost mag mag-solo"
              onClick={(e) => {
                popButton(e.currentTarget);
                setForm(emptyForm);
                setSubmitted(false);
              }}
            >
              Register another participant
            </button>
          </div>
        ) : (
          <div className="reg-sheet">
            <div {...reveal(2, "reg-header-row")}>
              <div className="reg-banner">
                <h2>REGISTRATION <span>FORM</span></h2>
              </div>
              <div className="reg-wordmark">Vallibel One</div>
            </div>

            <div {...reveal(3, "reg-meta-row")}>
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
              <div {...reveal(4, "reg-section-title")}>Category</div>
              <MagGroup {...reveal(4, "reg-check-row")} maxScale={1.06} radius={110} axis="x">
                <label className="reg-check mag" data-mag>
                  <input
                    type="checkbox"
                    checked={isSchool}
                    onChange={() => update("category", isSchool ? "" : "school")}
                  />
                  School leaver <span className="reg-check-sub">(A/L Math or Commerce)</span>
                </label>
                <label className="reg-check mag" data-mag>
                  <input
                    type="checkbox"
                    checked={isUni}
                    onChange={() => update("category", isUni ? "" : "university")}
                  />
                  University student
                </label>
              </MagGroup>

              <div {...reveal(5, "reg-section-title")}>Personal Information</div>
              <div {...reveal(5, "reg-grid")}>
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

              <div {...reveal(6, "reg-section-title")}>Emergency Contact</div>
              <div {...reveal(6, "reg-grid")}>
                <div className="reg-field">
                  <label>Contact Name</label>
                  <input value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} />
                </div>
                <div className="reg-field">
                  <label>Contact Phone</label>
                  <input value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} />
                </div>
              </div>

              <div {...reveal(7, "reg-section-title")}>Consent</div>
              <MagGroup {...reveal(7, "reg-consent")} maxScale={1.035} radius={70} axis="y">
                <label className="reg-check mag" data-mag>
                  <input type="checkbox" checked={form.consentParticipation} onChange={(e) => update("consentParticipation", e.target.checked)} />
                  I consent to participate and agree to follow site safety and conduct guidelines. *
                </label>
                <label className="reg-check mag" data-mag>
                  <input type="checkbox" checked={form.consentPhoto} onChange={(e) => update("consentPhoto", e.target.checked)} />
                  I consent to being photographed for programme documentation. <Tag>Wording pending legal confirmation</Tag>
                </label>
                {isSchool && (
                  <label className="reg-check mag" data-mag>
                    <input type="checkbox" checked={form.guardianConsent} onChange={(e) => update("guardianConsent", e.target.checked)} />
                    I confirm parental/guardian consent has been obtained (required if under 18). <Tag>Pending confirmation</Tag>
                  </label>
                )}
              </MagGroup>

              {error && <p className="error-text">{error}</p>}

              <button
                type="submit"
                {...reveal(8, "btn-primary mag mag-solo")}
                disabled={submitting}
                onClick={(e) => popButton(e.currentTarget)}
              >
                {submitting ? "Submitting…" : "Submit registration"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Schedule ---------- */
function ScheduleTab({ active, setActive }) {
  return (
    <div>
      <Hero
        active={active}
        setActive={setActive}
        title="Schedule"
        subtitle="Phase 1 visit sequence and the Phase 2 knowledge sharing session."
      />

      <div className="page">
        <p {...reveal(2, "lede")}>
          <Tag>All dates below are placeholder values</Tag> — final visit sequence is still under discussion with each business unit.
        </p>

        <h3 {...reveal(3, "section-label")}>Phase 1 — Business unit visits</h3>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Business unit</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((row, i) => (
              <tr key={row.unit} {...reveal(4 + i)}>
                <td>{row.date}</td>
                <td>{row.unit}</td>
                <td>{row.slot}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 {...reveal(13, "section-label")}>Phase 2 — Knowledge sharing session</h3>
        <div {...reveal(14, "card quiet")}>
          <p><strong>Date:</strong> {PHASE2.date}</p>
          <p><strong>Time:</strong> {PHASE2.time}</p>
          <p><strong>Venue:</strong> {PHASE2.venue}</p>
        </div>

        <h3 {...reveal(15, "section-label")}>Visit day flow</h3>
        <ol className="flow-list">
          <li {...reveal(16)}>Registration, welcome and safety briefing</li>
          <li {...reveal(17)}>Introduction to Vallibel One PLC and the host business unit</li>
          <li {...reveal(18)}>Guided operational tour through approved areas</li>
          <li {...reveal(19)}>Focused explanation based on participant category</li>
          <li {...reveal(20)}>Question-and-answer session with host representatives</li>
          <li {...reveal(21)}>Feedback collection and closing remarks</li>
        </ol>
      </div>
    </div>
  );
}

/* ---------- Safety ---------- */
function SafetyTab({ active, setActive }) {
  return (
    <div>
      <Hero
        active={active}
        setActive={setActive}
        title="Safety & conduct"
        subtitle="Read this before your visit. Site access depends on following these guidelines."
      />

      <div className="page">
        <div className="grid-2">
          <div {...reveal(2, "card")}>
            <h4>What to wear</h4>
            <ul>
              <li>Closed-toe covered shoes — no sandals or slippers</li>
              <li>Full-length trousers recommended</li>
              <li>Avoid loose jewellery, scarves or accessories near machinery</li>
            </ul>
          </div>
          <div {...reveal(3, "card")}>
            <h4>What to bring</h4>
            <ul>
              <li>Valid NIC or student ID</li>
              <li>Any PPE specified for your assigned business unit <Tag>confirmed per site</Tag></li>
              <li>A notebook or device for the knowledge sharing session</li>
            </ul>
          </div>
        </div>

        <h3 {...reveal(4, "section-label")}>On-site conduct</h3>
        <ul className="unit-list">
          <li {...reveal(5)}>Stay with your assigned group and guide at all times</li>
          <li {...reveal(6)}>Do not enter unsupervised or restricted areas</li>
          <li {...reveal(7)}>Follow all instructions from host business unit representatives</li>
          <li {...reveal(8)}>Photography only where explicitly permitted by your host</li>
          <li {...reveal(9)}>No confidential, operational or commercially sensitive information will be shared or should be requested</li>
        </ul>

        <div {...reveal(10, "card quiet")}>
          <p>
            <strong>Note:</strong> unsupervised access to production areas, machinery, warehouses
            or restricted locations is not permitted under any circumstances.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- FAQ ---------- */
function FaqTab({ active, setActive }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <Hero
        active={active}
        setActive={setActive}
        title="Frequently asked questions"
      />

      <div className="page page-narrow">
        <MagGroup className="faq-list" maxScale={1.028} radius={64} axis="y">
          {FAQS.map((item, i) => (
            <div className={`faq-item reveal ${open === i ? "open" : ""}`} style={{ "--i": 2 + i }} key={item.q}>
              <button
                data-mag
                className="faq-q mag"
                onClick={(e) => {
                  popButton(e.currentTarget);
                  setOpen(open === i ? null : i);
                }}
              >
                {item.q}
                <span className="faq-icon">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <p className="faq-a">{item.a}</p>}
            </div>
          ))}
        </MagGroup>
      </div>
    </div>
  );
}

const TAB_RENDERERS = {
  overview: OverviewTab,
  register: RegisterTab,
  schedule: ScheduleTab,
  safety: SafetyTab,
  faq: FaqTab,
};

function App() {
  const [active, setActive] = useState("overview");
  const ActiveComponent = TAB_RENDERERS[active];

  return (
    <div className="app-root">
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        .app-root {
          font-family: 'Inter', sans-serif;
          background: #150C08;
          color: #F5EEE4;
          min-height: 100%;
        }
        h1, h2, h3, h4 { font-family: 'Inter', sans-serif; }

        /* ---------- Staggered slide-in for page content ---------- */
        /* Every tab is a fresh component instance on switch (see TAB_RENDERERS),
           so these animations replay automatically each time the user navigates. */
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal {
          animation: revealUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: calc(var(--i, 0) * 65ms);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal { animation: none; }
        }

        /* ============================================================
           MAGNIFY — shared by every clickable control
           ============================================================
           .mag        — frosted lens sheen on hover, smooth transform
           .mag-solo   — adds a CSS hover scale, for buttons that sit
                         alone with no neighbours to magnify against
           [data-mag]  — opts the element into JS dock scaling; the
                         inline transform written by useDockMagnify
                         takes precedence over .mag-solo's CSS scale,
                         so the two never fight
           .pop        — click feedback, and the only magnify signal
                         that reaches touch devices
           ============================================================ */
        .mag {
          position: relative;
          transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s ease;
          will-change: transform;
        }
        .mag::after {
          content: '';
          position: absolute;
          inset: -7px -5px;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transform: scale(0.8);
          background:
            linear-gradient(180deg,
              rgba(255,255,255,0.34) 0%,
              rgba(255,255,255,0.10) 45%,
              rgba(255,255,255,0.26) 100%);
          border: 1px solid rgba(255,255,255,0.42);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.65),
            inset 0 -9px 14px -9px rgba(255,255,255,0.5),
            0 10px 24px -10px rgba(0,0,0,0.5);
          backdrop-filter: blur(1.5px) brightness(1.1);
          -webkit-backdrop-filter: blur(1.5px) brightness(1.1);
          transition:
            opacity 0.26s ease,
            transform 0.42s cubic-bezier(0.34, 1.45, 0.64, 1);
        }
        .mag:hover::after { opacity: 1; transform: scale(1); }
        .mag-solo:hover { transform: scale(1.07); }
        .mag:disabled::after { display: none; }
        .mag:disabled:hover { transform: none; }

        @keyframes magPop {
          0% { transform: scale(1); }
          45% { transform: scale(1.26); }
          100% { transform: scale(1); }
        }
        .pop { animation: magPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

        /* Touch devices: no pointer to track, so drop the hover lens
           and leave the click pop as the only feedback. */
        @media (hover: none) {
          .mag::after { display: none; }
          .mag-solo:hover { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mag, .mag::after { transition: none; }
          .mag-solo:hover { transform: none; }
          .pop { animation: none; }
        }

        /* ---------- Hero + nav (every tab) ---------- */
        .hero {
          position: relative;
          background-image:
            linear-gradient(180deg, rgba(10,6,4,0.15) 0%, rgba(10,6,4,0.55) 60%, #150C08 100%),
            linear-gradient(115deg, #B94A16 0%, #D9691F 32%, #9C3E14 62%, #150C08 92%),
            url('${HERO_BG_DATA_URI}');
          background-size: cover, cover, cover;
          background-position: center, center, center 30%;
          background-blend-mode: normal, multiply, normal;
          padding: 22px 28px 56px;
          display: flex;
          flex-direction: column;
        }
        .hero-tall { min-height: 620px; justify-content: space-between; }
        .hero-short { min-height: 230px; justify-content: space-between; padding-bottom: 34px; }

        .hero-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .brand {
          background: none;
          border: none;
          color: #F5EEE4;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.01em;
          cursor: pointer;
          padding: 0;
          border-radius: 6px;
        }

        .pill-nav {
          position: relative;
          display: flex;
          gap: 2px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 999px;
          padding: 4px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        /* The traveling glass lens. Sits ABOVE the labels (z-index 2)
           so the glass reads as being on top of the tab it magnifies,
           and overhangs the bar vertically, as in the reference. */
        .pill-lens {
          position: absolute;
          top: -9px;
          bottom: -9px;
          left: 0;
          width: 0;
          border-radius: 999px;
          pointer-events: none;
          z-index: 2;
          background:
            linear-gradient(180deg,
              rgba(255,255,255,0.40) 0%,
              rgba(255,255,255,0.13) 42%,
              rgba(255,255,255,0.08) 62%,
              rgba(255,255,255,0.32) 100%);
          border: 1px solid rgba(255,255,255,0.48);
          backdrop-filter: blur(2px) saturate(1.35) brightness(1.18);
          -webkit-backdrop-filter: blur(2px) saturate(1.35) brightness(1.18);
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.8),
            inset 0 -12px 16px -12px rgba(255,255,255,0.6),
            inset 0 0 18px rgba(255,255,255,0.18),
            0 10px 24px -8px rgba(0,0,0,0.5),
            0 0 26px 6px rgba(225,103,31,0.32);
          transition:
            transform 0.52s cubic-bezier(0.22, 1, 0.36, 1),
            width 0.6s cubic-bezier(0.34, 1.45, 0.64, 1);
        }
        /* Specular highlight running down the glass */
        .pill-lens::before {
          content: '';
          position: absolute;
          left: 14%;
          right: 14%;
          top: 6%;
          height: 34%;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0));
          pointer-events: none;
        }

        .pill-link {
          position: relative;
          z-index: 1;
          background: transparent;
          border: none;
          color: rgba(245,238,228,0.82);
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          transform-origin: center bottom;
          transition: color 0.15s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .pill-link:hover { color: #F5EEE4; }
        .pill-link.active { color: #F5EEE4; font-weight: 700; }
        /* Accent halo marking the active tab, independent of the lens */
        .pill-link.active::before {
          content: '';
          position: absolute;
          inset: -3px -7px;
          border-radius: 999px;
          background: radial-gradient(closest-side, rgba(225,103,31,0.55), rgba(225,103,31,0));
          filter: blur(4px);
          z-index: -1;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .pill-link { transition: color 0.15s ease; }
          .pill-lens { transition: none; }
        }

        .btn-black {
          background: #0E0B09;
          color: #F5EEE4;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 10px 18px;
          border-radius: 999px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: rgba(255,255,255,0.16);
          font-size: 11px;
        }

        .hero-body { max-width: 620px; margin-top: 40px; }
        .hero-eyebrow { font-size: 13px; color: rgba(245,238,228,0.7); margin: 0 0 10px; }
        .hero-tall h1 {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.12;
          margin: 0 0 18px;
        }
        .hero-short h1 {
          font-size: 30px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0 0 8px;
        }
        .hero-subtitle {
          font-size: 15px;
          color: rgba(245,238,228,0.78);
          line-height: 1.55;
          margin: 0;
          max-width: 520px;
        }
        .hero-ctas { display: flex; gap: 10px; margin-top: 26px; flex-wrap: wrap; }
        .btn-white {
          background: #F5EEE4;
          color: #150C08;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 20px;
          border-radius: 999px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-white .btn-arrow { background: rgba(21,12,8,0.12); color: #150C08; }
        /* Lens sheen reads as grime on a light button — tone it down */
        .btn-white.mag::after {
          background: linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.05));
          border-color: rgba(255,255,255,0.7);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .btn-ghost-dark {
          background: rgba(255,255,255,0.12);
          color: #F5EEE4;
          border: 1px solid rgba(255,255,255,0.22);
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 20px;
          border-radius: 999px;
          cursor: pointer;
        }

        /* ---------- Page content (below hero) ---------- */
        .page {
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 28px 72px;
        }
        .page-narrow { max-width: 640px; }

        .stat-row { display: flex; gap: 36px; margin-bottom: 40px; flex-wrap: wrap; }
        .stat { display: flex; flex-direction: column; }
        .stat-num {
          font-weight: 800;
          font-size: 32px;
          color: #E1671F;
          line-height: 1;
        }
        .stat-label { font-size: 13px; color: rgba(245,238,228,0.62); margin-top: 4px; }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 28px;
        }
        @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } }

        .card {
          background: #1C120B;
          border: 1px solid rgba(245,238,228,0.12);
          border-left: 3px solid #E1671F;
          padding: 18px 20px;
          border-radius: 4px;
        }
        .card.quiet { border-left-color: rgba(245,238,228,0.12); }
        .card h3, .card h4 { margin: 0 0 8px; font-size: 16px; color: #F5EEE4; }
        .card p { margin: 0 0 10px; font-size: 14px; color: rgba(245,238,228,0.72); line-height: 1.5; }
        .card ul { margin: 0; padding-left: 18px; font-size: 14px; color: rgba(245,238,228,0.72); line-height: 1.7; }

        .section-label {
          font-size: 13px;
          font-weight: 700;
          color: #F5EEE4;
          border-top: 1px solid rgba(245,238,228,0.14);
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
          border-bottom: 1px solid rgba(245,238,228,0.12);
          break-inside: avoid;
          color: rgba(245,238,228,0.86);
        }

        .tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: #F3D8A9;
          background: rgba(225,103,31,0.18);
          padding: 2px 8px;
          border-radius: 2px;
          margin-left: 4px;
        }

        .lede { color: rgba(245,238,228,0.62); font-size: 14px; margin: 0 0 24px; }

        .error-text { color: #E1671F; font-size: 13px; font-weight: 600; }

        .btn-primary {
          align-self: flex-start;
          background: #E1671F;
          color: #150C08;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 26px;
          border-radius: 999px;
          cursor: pointer;
          margin-top: 32px;
        }
        .btn-primary:hover { background: #F2801F; }
        .btn-primary:disabled { opacity: 0.6; cursor: default; }
        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(245,238,228,0.3);
          color: #F5EEE4;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .confirm-box {
          border: 1px solid rgba(245,238,228,0.12);
          border-left: 3px solid #5C9A6E;
          background: #1C120B;
          padding: 32px;
          text-align: left;
          border-radius: 4px;
        }
        .confirm-mark {
          display: inline-block;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #5C9A6E;
          color: #150C08;
          text-align: center;
          line-height: 32px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .confirm-box p { color: rgba(245,238,228,0.75); line-height: 1.55; }

        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 28px;
          font-size: 14px;
        }
        .schedule-table th {
          text-align: left;
          font-weight: 700;
          font-size: 12px;
          padding: 10px 12px;
          border-bottom: 2px solid rgba(245,238,228,0.35);
          color: #F5EEE4;
        }
        .schedule-table td {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(245,238,228,0.12);
          color: rgba(245,238,228,0.82);
        }

        .flow-list {
          padding-left: 20px;
          font-size: 14px;
          line-height: 2;
          color: rgba(245,238,228,0.8);
        }

        .faq-list { display: flex; flex-direction: column; }
        .faq-item { border-bottom: 1px solid rgba(245,238,228,0.14); }
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
          color: #F5EEE4;
          border-radius: 8px;
          /* Scale from the left so a full-width row grows inward
             instead of bleeding past the column edge */
          transform-origin: left center;
        }
        .faq-q.mag::after { inset: -2px -8px; }
        .faq-icon { color: #E1671F; font-size: 18px; font-weight: 700; }
        .faq-a { font-size: 14px; color: rgba(245,238,228,0.75); line-height: 1.6; padding: 0 4px 18px; margin: 0; }

        /* --- Registration sheet (light paper card on dark page) --- */
        @keyframes regSlideInUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .reg-sheet {
          position: relative;
          background: #FFFFFF;
          border: 1px solid #E4DDD0;
          padding: 36px 40px 40px;
          box-shadow: 0 24px 60px -20px rgba(0,0,0,0.55);
          animation: regSlideInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 6px;
          color: #221812;
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
          color: #221812;
        }
        .reg-banner h2 span { font-weight: 500; }
        .reg-wordmark { font-weight: 700; font-size: 15px; color: #221812; }

        .reg-meta-row {
          display: flex;
          gap: 40px;
          border-bottom: 2px solid #221812;
          padding-bottom: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .reg-meta { display: flex; flex-direction: column; gap: 4px; }
        .reg-meta-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #8A8577; }
        .reg-meta-value { font-size: 14px; font-weight: 600; color: #221812; }

        .reg-section-title {
          background: #F0B93A;
          color: #221812;
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
          color: #221812;
          cursor: pointer;
          border-radius: 6px;
          transform-origin: left center;
        }
        /* Dark-glass sheen would be invisible on white paper — use a
           warm accent wash for the controls inside the form sheet */
        .reg-check.mag::after {
          inset: -5px -9px;
          background: rgba(225,103,31,0.08);
          border-color: rgba(225,103,31,0.28);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          box-shadow: 0 6px 16px -10px rgba(34,24,18,0.4);
        }
        .reg-check input { width: 16px; height: 16px; accent-color: #E1671F; cursor: pointer; }
        .reg-check-sub { font-weight: 400; color: #6B6558; }

        .reg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 40px;
        }
        @media (max-width: 640px) { .reg-grid { grid-template-columns: 1fr; } }

        .reg-field { display: flex; flex-direction: column; gap: 6px; }
        .reg-field label { font-size: 12px; font-weight: 700; color: #6B6558; text-transform: uppercase; letter-spacing: 0.02em; }
        .reg-field input, .reg-field select {
          border: none;
          border-bottom: 1.5px dotted #B3AC9C;
          background: transparent;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #221812;
          padding: 4px 2px 8px;
        }
        .reg-field input:focus, .reg-field select:focus {
          outline: none;
          border-bottom: 1.5px solid #E1671F;
        }
        .reg-field input::placeholder { color: #B3AC9C; }

        .reg-consent { display: flex; flex-direction: column; gap: 14px; }
        .reg-consent .reg-check { font-weight: 400; align-items: flex-start; }
        .reg-consent .reg-check input { margin-top: 3px; flex-shrink: 0; }

        @media (max-width: 640px) {
          .hero-tall h1 { font-size: 32px; }
          .hero { padding: 18px 18px 40px; }
          .reg-sheet { padding: 26px 20px 30px; }
          .hero-nav { row-gap: 10px; }
          .brand { order: 1; }
          .btn-black { order: 2; }
          .pill-nav {
            order: 3;
            flex-basis: 100%;
            justify-content: flex-start;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .pill-nav::-webkit-scrollbar { display: none; }
          .pill-link { white-space: nowrap; }
          /* The lens can't track a horizontally scrolled bar reliably
             on touch, so it stays parked on the active tab there */
          .pill-lens { top: -5px; bottom: -5px; }
        }
      `}</style>

      <ActiveComponent active={active} setActive={setActive} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
