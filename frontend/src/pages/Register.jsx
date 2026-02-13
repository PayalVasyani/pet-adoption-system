import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh'}}>
      <div className="form" style={{maxWidth: 450}}>
        <div style={{marginBottom: 24, textAlign: 'center'}}>
          <h1 style={{margin: '0 0 8px 0', fontSize: 28, fontWeight: 700, color: '#1f2937'}}>Create Account</h1>
          <p style={{margin: 0, color: '#6b7280', fontSize: 14}}>Join us and start finding your perfect pet</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input placeholder="Full Name" onChange={e=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Email" type="email" onChange={e=>setForm({...form,email:e.target.value})} required />
          <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})} required />
          <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up'}</button>
        </form>

        <div style={{marginTop: 16, textAlign: 'center', paddingTop: 16, borderTop: '1px solid #e5e7eb'}}>
          <p style={{margin: 0, color: '#6b7280', fontSize: 14}}>Already have an account? <Link to="/login" style={{color: '#2563eb', textDecoration: 'none', fontWeight: 600, cursor: 'pointer'}}>Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
