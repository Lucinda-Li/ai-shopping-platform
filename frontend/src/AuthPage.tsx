import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      alert("Account created successfully!");
      setMode("login");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    navigate("/home");
  };

  return (
    <div style={styles.root}>
      <div style={styles.card}>

        {/* Brand */}
        <h1 style={styles.brand}>AuraFit.</h1>
        <p style={styles.tagline}>Take a trip. Find your fit.</p>

        {/* Tabs */}
        <div style={styles.tabRow}>
          <button
            style={{ ...styles.tab, ...(mode === "login" ? styles.tabActive : {}) }}
            onClick={() => setMode("login")}
          >
            Log in
          </button>
          <button
            style={{ ...styles.tab, ...(mode === "signup" ? styles.tabActive : {}) }}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === "signup" && (
            <div style={styles.field}>
              <label style={styles.label}>Confirm password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Enter password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" style={styles.btnMain}>
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <div style={styles.divider}>or</div>

        <button style={styles.btnGhost} onClick={() => navigate("/home")}>
          Continue as guest
        </button>

        <p style={styles.footer}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span style={styles.link} onClick={() => setMode("signup")}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={styles.link} onClick={() => setMode("login")}>
                Log in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "3rem 1rem",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  brand: {
    fontFamily: "serif",
    fontSize: "56px",
    letterSpacing: "-1px",
    lineHeight: "1",
    marginBottom: "10px",
    fontWeight: 400,
    background: "linear-gradient(135deg, #D78FEE, #5BC8C8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    fontSize: "25px",
    color: "#C9A0DC",
    fontWeight: 300,
    fontStyle: "italic",
    fontFamily: "'Cormorant Garamond', serif",
    marginBottom: "2.5rem",
    letterSpacing: "0.5px",
  },
  tabRow: {
    display: "flex",
    width: "100%",
    borderBottom: "1.5px solid #F0D5FA",
    marginBottom: "1.75rem",
  },
  tab: {
    flex: 1,
    background: "none",
    border: "none",
    borderBottom: "2.5px solid transparent",
    marginBottom: "-1.5px",
    padding: "0.5rem 0",
    fontSize: "14px",
    color: "#C9A0DC",
    cursor: "pointer",
    fontWeight: 400,
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#6B4E8A",
    borderBottom: "2.5px solid #D78FEE",
    fontWeight: 500,
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  field: {
    width: "100%",
    marginBottom: "1rem",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "12px",
    color: "#D78FEE",
    marginBottom: "5px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    border: "1px solid #F0D5FA",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#6B4E8A",
    outline: "none",
    background: "#FAF0FF",
    boxSizing: "border-box",
  },
  btnMain: {
    width: "100%",
    background: "linear-gradient(135deg, #D78FEE, #A8E6CF)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "0.25rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  divider: {
    fontSize: "12px",
    color: "#C9A0DC",
    margin: "1rem 0",
  },
  btnGhost: {
    width: "100%",
    background: "white",
    color: "#D78FEE",
    border: "1px solid #F0D5FA",
    borderRadius: "10px",
    padding: "11px",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    fontSize: "12px",
    color: "#C9A0DC",
    marginTop: "1.25rem",
  },
  link: {
    color: "#D78FEE",
    cursor: "pointer",
  },
};
