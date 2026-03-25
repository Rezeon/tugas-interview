export function Login({handleLogin, setLoginData, loginData}) {
  return (
    <div className="login-page">
  <div className="login-card">
    <form onSubmit={handleLogin} className="login-form">
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username (admin)"
          required
          onChange={(e) =>
            setLoginData({ ...loginData, username: e.target.value })
          }
        />
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          required
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
      </div>
      
      <button type="submit" className="btn-login">
        Sign In
      </button>
    </form>
    
    <footer className="login-footer">
      <p>Default access: <strong>admin / password123</strong></p>
    </footer>
  </div>
</div>
  );
}
