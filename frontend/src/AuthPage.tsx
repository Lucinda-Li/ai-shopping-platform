import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");  

  const handleSubmit = (e: React.FormEvent) => {
  // replace onLogin() with:

    e.preventDefault();
    if (mode === "signup") {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Account created successfully!");
    setMode("login");
    console.log({ mode, username, password });
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    return;  // stop here, don't go to homepage
    }
    navigate("/home");
    // TODO: connect to FastAPI backend
  };


  return (
    <div style={styles.root}>
      <div style={styles.card}>

        {/* Brand */}
        <h1 style={styles.brand}>ShopAI.</h1>
        <p style={styles.tagline}>Find your style, powered by AI</p>

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
    color: "#1A5F8A",
    letterSpacing: "-1px",
    lineHeight: "1",
    marginBottom: "10px",
    fontWeight: 400,
  },
  tagline: {
    fontSize: "16px",
    color: "#3A99E8",
    fontWeight: 400,
    marginBottom: "2.5rem",
    letterSpacing: "0.2px",
  },
  tabRow: {
    display: "flex",
    width: "100%",
    borderBottom: "1.5px solid #E8F4FF",
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
    color: "#b8d8ee",
    cursor: "pointer",
    fontWeight: 400,
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#1A5F8A",
    borderBottom: "2.5px solid #9CD5FF",
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
    color: "#3A99E8",
    marginBottom: "5px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    border: "1px solid #C8E8FF",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1A5F8A",
    outline: "none",
    background: "#FAFCFF",
    boxSizing: "border-box",
  },
  btnMain: {
    width: "100%",
    background: "#9CD5FF",
    color: "#1A5F8A",
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
    color: "#C8E8FF",
    margin: "1rem 0",
  },
  btnGhost: {
    width: "100%",
    background: "white",
    color: "#3A99E8",
    border: "1px solid #C8E8FF",
    borderRadius: "10px",
    padding: "11px",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    fontSize: "12px",
    color: "#b8d8ee",
    marginTop: "1.25rem",
  },
  link: {
    color: "#3A99E8",
    cursor: "pointer",
  },
};
