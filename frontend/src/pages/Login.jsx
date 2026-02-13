import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh'}}>
      <div className="form" style={{maxWidth: 450}}>
        <div style={{marginBottom: 24, textAlign: 'center'}}>
          <h1 style={{margin: '0 0 8px 0', fontSize: 28, fontWeight: 700, color: '#1f2937'}}>Welcome Back</h1>
          <p style={{margin: 0, color: '#6b7280', fontSize: 14}}>Sign in to your pet adoption account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input placeholder="Email" type="email" onChange={e=>setForm({...form,email:e.target.value})} required />
          <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})} required />
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <div style={{marginTop: 16, textAlign: 'center', paddingTop: 16, borderTop: '1px solid #e5e7eb'}}>
          <p style={{margin: 0, color: '#6b7280', fontSize: 14}}>Don't have an account? <Link to="/register" style={{color: '#2563eb', textDecoration: 'none', fontWeight: 600, cursor: 'pointer'}}>Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Login;
