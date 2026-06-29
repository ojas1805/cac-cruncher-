import { useState } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"

const fmt = (n) => `$${Number(n).toLocaleString()}`

export default function App() {
  const [results, setResults] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const processFile = async (file) => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResults(null)
    setSummary(null)
    setAnswer(null)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await axios.post("http://localhost:8000/api/upload", formData)
      setResults(res.data.results)
      setSummary({
        total_campaigns: res.data.total_campaigns,
        total_spend: res.data.total_spend,
        unprofitable_count: res.data.unprofitable_count,
      })
    } catch (err) {
      setError("Upload failed. Make sure the backend is running.")
    }
    setLoading(false)
  }

  const handleFile = (e) => processFile(e.target.files[0])
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]) }

  const handleAsk = async () => {
    if (!question || !results) return
    setAiLoading(true)
    setAnswer(null)
    try {
      const res = await axios.post("http://localhost:8000/api/ask", { campaigns: results, question })
      setAnswer(res.data.answer)
    } catch (err) {
      setAnswer("Error: Could not get AI response.")
    }
    setAiLoading(false)
  }

  const totalWaste = results ? results.reduce((s, r) => s + r.waste, 0) : 0
  const profitableCount = results ? results.filter(r => !r.is_unprofitable).length : 0

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f9fafb", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: "#6366f1", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 18 }}>📊</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#111" }}>CAC Cruncher</h1>
          </div>
          <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>Upload your campaign CSV to instantly find which ads are bleeding money</p>
        </div>

        {/* Upload Area */}
        {!results && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              border: `2px dashed ${dragOver ? "#6366f1" : "#d1d5db"}`,
              borderRadius: 16, padding: "3rem", textAlign: "center",
              background: dragOver ? "#eef2ff" : "white", cursor: "pointer",
              transition: "all 0.2s", marginBottom: 24
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
            <p style={{ fontWeight: 600, color: "#111", margin: "0 0 4px" }}>Drop your CSV here or click to upload</p>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Needs columns: channel, spend, new_customers, clv</p>
            <input id="fileInput" type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#6366f1", fontWeight: 500 }}>
            Analyzing your campaigns...
          </div>
        )}

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        {summary && results && (
          <>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Total Campaigns", value: summary.total_campaigns, color: "#6366f1", bg: "#eef2ff" },
                { label: "Total Spend", value: fmt(summary.total_spend), color: "#0ea5e9", bg: "#f0f9ff" },
                { label: "Unprofitable", value: summary.unprofitable_count, color: "#ef4444", bg: "#fff1f2" },
                { label: "Money Wasted", value: fmt(totalWaste), color: "#f59e0b", bg: "#fffbeb" },
              ].map((k, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid #e5e7eb" }}>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px", fontWeight: 500 }}>{k.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: k.color }}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", border: "1px solid #e5e7eb", marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 20px", color: "#111" }}>CAC vs CLV by Channel</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={results} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="channel" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val, name) => [`$${val}`, name.toUpperCase()]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Bar dataKey="cac" name="CAC" radius={[6, 6, 0, 0]}>
                    {results.map((r, i) => <Cell key={i} fill={r.is_unprofitable ? "#ef4444" : "#22c55e"} />)}
                  </Bar>
                  <Bar dataKey="clv" name="CLV" fill="#a5b4fc" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "#6b7280" }}>
                <span>🔴 Red = CAC exceeds CLV (losing money)</span>
                <span>🟢 Green = Profitable</span>
                <span>🔵 Blue bars = CLV</span>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", marginBottom: 24, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e5e7eb" }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#111" }}>Campaign Breakdown</h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Channel", "Spend", "Customers", "CAC", "CLV", "ROAS", "Wasted", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #f3f4f6", background: r.is_unprofitable ? "#fff9f9" : "white" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111" }}>{r.channel}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{fmt(r.spend)}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{r.new_customers}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: r.is_unprofitable ? "#ef4444" : "#22c55e" }}>{fmt(r.cac)}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{fmt(r.clv)}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{r.roas}x</td>
                      <td style={{ padding: "12px 16px", color: r.waste > 0 ? "#f59e0b" : "#9ca3af", fontWeight: r.waste > 0 ? 600 : 400 }}>{r.waste > 0 ? fmt(r.waste) : "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {r.is_unprofitable
                          ? <span style={{ background: "#fee2e2", color: "#dc2626", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>Bleeding money</span>
                          : <span style={{ background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>Profitable</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Panel */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e5e7eb", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 2px", color: "white" }}>AI Marketing Analyst</h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: 0 }}>Powered by Llama 3 + RAG industry benchmarks</p>
              </div>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {["Which campaign should I cut?", "Where to move my budget?", "Compare vs industry"].map(q => (
                    <button key={q} onClick={() => setQuestion(q)}
                      style={{ padding: "6px 12px", background: "#f3f4f6", border: "none", borderRadius: 20, fontSize: 12, cursor: "pointer", color: "#374151", whiteSpace: "nowrap" }}>
                      {q}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Ask anything about your campaigns..."
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAsk()}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, outline: "none" }}
                  />
                  <button onClick={handleAsk} disabled={aiLoading || !question}
                    style={{ padding: "10px 20px", background: aiLoading ? "#a5b4fc" : "#6366f1", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    {aiLoading ? "..." : "Ask"}
                  </button>
                </div>
                {answer && (
                  <div style={{ marginTop: 16, padding: "1rem", background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, lineHeight: 1.8, color: "#374151", whiteSpace: "pre-wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", display: "block", marginBottom: 8 }}>AI ANALYST</span>
                    {answer}
                  </div>
                )}
              </div>
            </div>

            {/* Reset */}
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button onClick={() => { setResults(null); setSummary(null); setAnswer(null) }}
                style={{ padding: "8px 20px", background: "white", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#6b7280" }}>
                Upload a different CSV
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
