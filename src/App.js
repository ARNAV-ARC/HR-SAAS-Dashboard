import { useState } from "react";
import {
  Armchair, Users, ArrowDownRight, ArrowUpRight, Briefcase, Clock,
  Search, Bell, Sparkles, AlertTriangle, ArrowUp, Lightbulb, Target, Diamond,
} from "lucide-react";
import "./App.css";

/* ============ 1. DATA (plain arrays, easy to change) ============ */

const KPIS = [
  { Icon: Users, value: "1,470", label: "Total Employees", note: "avg age 36.9", good: true, color: "blue" },
  { Icon: ArrowDownRight, value: "16.1%", label: "Attrition Rate", note: "237 left", good: false, color: "red" },
  { Icon: Briefcase, value: "$6,503", label: "Avg Monthly Income", note: "across all roles", good: true, color: "green" },
  { Icon: Clock, value: "28%", label: "On Overtime", note: "30.5% attrition", good: false, color: "amber" },
];

const DEPARTMENTS = [
  { name: "R&D", emp: 961, left: 133, rate: 13.8, income: "$6,281", color: "#2b1a4a" },
  { name: "Sales", emp: 446, left: 92, rate: 20.6, income: "$6,959", color: "#3f6786" },
  { name: "Human Resources", emp: 63, left: 12, rate: 19, income: "$6,655", color: "#7a5a1e" },
];

// value = number of employees who left (used for bar height)
const AGE_GROUPS = [
  { label: "18–25", value: 44, rate: "33.8%" },
  { label: "26–35", value: 116, rate: "19.1%" },
  { label: "36–45", value: 41, rate: "9.2%" },
  { label: "46–55", value: 27, rate: "11.5%" },
  { label: "56+", value: 9, rate: "17%" },
];

const TENURE = [
  { label: "0–2", value: 105 },
  { label: "3–5", value: 60 },
  { label: "6–10", value: 53 },
  { label: "11–20", value: 11 },
  { label: "20+", value: 8 },
];

const ROLES = [
  { name: "SalesRepresentative", rate: 40, color: "#2f5bff" },
  { name: "Laboratory Technician", rate: 20, color: "#d4f542" },
  { name: "Human Resources", rate: 20, color: "#f7de4d" },
  { name: "Sales Executive", rate: 11, color: "#e9ecfb" },
  { name: "Research Scientist", rate: 11, color: "#f0402f" },
  { name: "ManufacturingDirector", rate: 5.5, color: "#a03cf0" },
  { name: "HealthcareRepresentative", rate: 5.5, color: "#6ff0a8" },
  { name: "Manager", rate: 2.7, color: "#6b7280" },
  { name: "Research Director", rate: 2.7, color: "#ee44dd" },
];

const SATISFACTION = [
  { label: "Low", value: 289, rate: "22.8%" },
  { label: "Medium", value: 280, rate: "16.4%" },
  { label: "High", value: 442, rate: "16.5%" },
  { label: "Very High", value: 459, rate: "11.3%" },
];

const INSIGHTS = [
  { Icon: AlertTriangle, tag: "Critical", title: "Sales Representative — 39.8% attrition", text: "33 of 83 employees left. Investigate pay and career paths." },
  { Icon: ArrowUp, tag: "Warning", title: "Overtime drives 30.5% vs 10.4% without", text: "A 2.9x multiplier — the most actionable lever." },
  { Icon: Lightbulb, tag: "Opportunity", title: "Low satisfaction tied to 22.8% attrition", text: "289 employees rate satisfaction Low. 1:1s could help." },
  { Icon: Target, tag: "Trend", title: "New hires (0–2 yrs) at 29.8% attrition", text: "Early churn suggests onboarding gaps." },
];

const NAV = ["Planning", "Attrition", "Engagement", "Analytics", "Recruiting", "Workspace", "Overview"];

// what the search bar looks through
const PAGES = [
  { name: "Attrition by Department", tab: "overview" },
  { name: "Attrition by Age Group", tab: "overview" },
  { name: "Attrition by Tenure", tab: "overview" },
  { name: "AI-Generated Insights", tab: "overview" },
  { name: "Attrition Rate by Job Role", tab: "attrition" },
  { name: "Job Satisfaction vs Attrition", tab: "attrition" },
];

/* ============ 2. SMALL REUSABLE COMPONENTS ============ */

// A white box with a title. Every chart sits inside one.
function Card({ title, sub, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {sub && <p className="card-sub">{sub}</p>}
      {children}
    </section>
  );
}

// One bar chart used 3 times (age, tenure, satisfaction).
// Bar height = value / max, shown as a percentage.
function Bars({ data, max, color }) {
  return (
    <div className="bars">
      {data.map((d) => (
        <div className="bar-col" key={d.label}>
          <div className="bar-area">
            <div className="bar" style={{ height: `${(d.value / max) * 100}%`, background: color }} />
          </div>
          <span className="bar-label">{d.label}</span>
          {d.rate && <small className="bar-rate">{d.rate}</small>}
        </div>
      ))}
    </div>
  );
}

/* ============ 3. THE TWO TABS ============ */

function Overview() {
  return (
    <>
      {/* Row 1: four KPI cards */}
      <div className="kpi-row">
        {KPIS.map(({ Icon, ...k }) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-top">
              <span className={`kpi-icon ${k.color}`}><Icon size={15} /></span>
              <span className={k.good ? "note good" : "note bad"}>
                {k.good ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {k.note}
              </span>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Row 2: department + age group */}
      <div className="row">
        <Card title="Attrition by Department" sub="% who left · avg monthly income">
          {DEPARTMENTS.map((d) => (
            <div className="dept" key={d.name}>
              <div className="dept-top">
                <span><b>{d.name}</b> {d.emp} emp.</span>
                <span>{d.left} left <b style={{ color: d.color }}>{d.rate}%</b></span>
              </div>
              <div className="track">
                <div className="fill" style={{ width: `${d.rate * 4}%`, background: d.color }} />
              </div>
            </div>
          ))}
          <div className="income">
            {DEPARTMENTS.map((d) => (
              <div key={d.name}><span>{d.name}</span><b>{d.income}</b></div>
            ))}
          </div>
        </Card>

        <Card title="Attrition by Age Group" sub="Employees who left per cohort">
          <Bars data={AGE_GROUPS} max={120} color="#2b1a4a" />
        </Card>
      </div>

      {/* Row 3: tenure + insights */}
      <div className="row">
        <Card title="Attrition by Tenure" sub="YearsAtCompany bands">
          <Bars data={TENURE} max={120} color="#b02a5b" />
        </Card>

        <Card title="AI-Generated Insights">
          <div className="insights">
            {INSIGHTS.map(({ Icon, ...i }) => (
              <div className="insight" key={i.title}>
                <span className={`tag ${i.tag.toLowerCase()}`}>{i.tag}</span>
                <h4><Icon size={13} /> {i.title}</h4>
                <p>{i.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Attrition() {
  return (
    <>
      <Card title="Attrition Rate by Job Role" sub="Ranked highest → lowest">
        <div className="roles">
          <div className="plot">
            {/* 3 vertical lines at 0%, 20%, 40% */}
            <div className="lines"><i /><i /><i /></div>

            {ROLES.map((r) => (
              <div className="role" key={r.name}>
                <span>{r.name}</span>
                <div className="role-track">
                  {/* axis goes 0 → 40%, so width = rate / 40 */}
                  <div className="role-bar" style={{ width: `${(r.rate / 40) * 100}%`, background: r.color }} />
                </div>
              </div>
            ))}

            {/* labels under the lines */}
            <div className="axis">
              <span style={{ left: "0%" }}>0%</span>
              <span style={{ left: "50%" }}>20%</span>
              <span style={{ left: "100%" }}>40%</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="row">
        <Card title="Job Satisfaction vs Attrition" sub="1 (Low) → 4 (Very High)">
          <Bars data={SATISFACTION} max={600} color="#cf3650" />
        </Card>
        <Card title="Attrition by Tenure" sub="YearsAtCompany bands">
          <Bars data={TENURE} max={120} color="#b02a5b" />
        </Card>
      </div>
    </>
  );
}

/* ============ 4. THE MAIN PAGE ============ */

export default function App() {
  // State = data that changes and re-draws the screen
  const [tab, setTab] = useState("overview"); // which tab is open
  const [nav, setNav] = useState("Planning"); // highlighted sidebar item
  const [query, setQuery] = useState("");     // text typed in search

  // Search: keep pages whose name contains what the user typed
  const matches = query
    ? PAGES.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  function openPage(page) {
    setTab(page.tab); // jump to the right tab
    setQuery("");     // clear the search box
  }

  return (
    <div className="app">
      {/* ---------- Left sidebar ---------- */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo"><Armchair size={30} /></div>
          <div>
            <h1>HR Dashboard</h1>
            <p>People Intelligence</p>
          </div>
        </div>

        <div className="side-panel">
          <p className="side-title">Workspace</p>
          <nav className="nav">
            {NAV.map((n) => (
              <button key={n} className={nav === n ? "active" : ""} onClick={() => setNav(n)}>
                {n}
              </button>
            ))}
          </nav>

          <p className="side-title">System</p>
          <nav className="nav">
            <button className={nav === "Setting" ? "active" : ""} onClick={() => setNav("Setting")}>
              Setting
            </button>
          </nav>

          <div className="dataset">
            <Diamond size={30} />
            <div>
              <h2>Dataset Loaded</h2>
              <p>1,470 records · 9 columns</p>
              <p>IBM HR Analytics</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------- Right side ---------- */}
      <main className="main">
        <header className="topbar">
          <div>
            <h2 className="title">People Intelligence Dashboard</h2>
            <p className="crumbs">IBM &nbsp; HR &nbsp; Analytics --- 1430 Employees</p>
          </div>

          {/* Overview / Attrition switch */}
          <div className="tabs">
            <button className={tab === "overview" ? "on" : ""} onClick={() => setTab("overview")}>Overview</button>
            <button className={tab === "attrition" ? "on" : ""} onClick={() => setTab("attrition")}>Attrition</button>
          </div>

          <div className="top-right">
            <div className="search-wrap">
              <label className="search">
                <Search size={18} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search......." />
              </label>
              {query && (
                <ul className="results">
                  {matches.length === 0 && <li className="empty">No match</li>}
                  {matches.map((p) => (
                    <li key={p.name}><button onClick={() => openPage(p)}>{p.name}</button></li>
                  ))}
                </ul>
              )}
            </div>
            <button className="bell"><Bell size={20} /></button>
          </div>
        </header>

        {/* Show one tab or the other */}
        <section className="content">
          {tab === "overview" ? <Overview /> : <Attrition />}
        </section>
      </main>
    </div>
  );
}