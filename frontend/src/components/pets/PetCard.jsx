import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const PetCard = ({ pet, onView }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const applyAdoption = async () => {
    if (!user) {
      const go = window.confirm("You must be logged in to adopt. Go to login page?");
      if (go) navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/adoptions/${pet._id}`);
      alert("Adoption request sent");
    } catch (err) {
      console.error(err);
      const apiMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      alert(`Failed to send adoption request${apiMsg ? `: ${apiMsg}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pet-card">
      <img src={pet.image} alt={pet.name} />
      <h3>{pet.name}</h3>
      <p>{pet.breed}</p>
      <div style={{display: 'flex', gap: 8}}>
        <button className="btn btn--ghost" onClick={() => onView && onView(pet)}>View</button>
        <button className="btn btn--primary" onClick={applyAdoption} disabled={loading}>{loading ? 'Sending...' : 'Adopt'}</button>
      </div>
    </div>
  );
};

export default PetCard;
