import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [pet, setPet] = useState({ name: "", breed: "", species: "", age: "", image: "", description: "" });

  // modal + controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchName, setSearchName] = useState("");

  // pagination for adoptions
  const [page, setPage] = useState(1);
  const limit = 6;

  const loadAdoptions = () => {
    api.get("/adoptions").then(res => setAdoptions(res.data || []));
  };

  useEffect(() => {
    loadAdoptions();
  }, []);

  const createPet = async () => {
    try {
      await api.post("/pets", pet);
      alert("Pet added");
      setPet({ name: "", breed: "", species: "", age: "", image: "", description: "" });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add pet");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/adoptions/${id}`, { status });
      loadAdoptions();
    } catch (err) {
      console.error(err);
    }
  };

  // filtered + paginated adoptions
  const filtered = useMemo(() => {
    if (!searchName) return adoptions;
    const q = searchName.toLowerCase();
    return adoptions.filter(a => (a.pet?.name || "").toLowerCase().includes(q));
  }, [adoptions, searchName]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);

  return (
    <div className="container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
        <h3>Adoption Requests</h3>
        <div>
          <button className="btn btn--primary" onClick={()=>setShowAddModal(true)}>Add Pet</button>
        </div>
      </div>

      <section style={{marginTop:24}}>
        <div className="table-wrapper">
          <div className="table-controls">
            <input placeholder="Search by pet name" value={searchName} onChange={e=>{setSearchName(e.target.value); setPage(1);}} />
            <div />
          </div>

          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Pet</th>
                <th>Applicant</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(a => (
                <tr key={a._id}>
                  <td style={{width:80}}>
                    <img src={a.pet?.image || '/placeholder.png'} alt={a.pet?.name} style={{width:60,height:60,objectFit:'cover',borderRadius:6}} />
                  </td>
                  <td>{a.pet?.name}</td>
                  <td>{a.user?.name || a.user?.email}</td>
                  <td>{a.status}</td>
                  <td style={{display:'flex',gap:8}}>
                    <button className="btn btn--primary" onClick={()=>updateStatus(a._id,"approved")}>Approve</button>
                    <button className="btn btn--ghost" onClick={()=>updateStatus(a._id,"rejected")}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button 
              className="pagination__btn pagination__btn--prev"
              disabled={page <= 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              ← Prev
            </button>
            <span className="pagination__info">Page {page} of {totalPages}</span>
            <button 
              className="pagination__btn pagination__btn--next"
              disabled={page >= totalPages} 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      {showAddModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:40}} onClick={()=>setShowAddModal(false)}>
          <div className="form" style={{maxWidth:600,width:'95%'}} onClick={e=>e.stopPropagation()}>
            <h3>Add Pet</h3>
            <input placeholder="Name" value={pet.name} onChange={e=>setPet({...pet,name:e.target.value})}/>
            <input placeholder="Breed" value={pet.breed} onChange={e=>setPet({...pet,breed:e.target.value})}/>
            <input placeholder="Species" value={pet.species} onChange={e=>setPet({...pet,species:e.target.value})}/>
            <input placeholder="Age" value={pet.age} onChange={e=>setPet({...pet,age:e.target.value})}/>
            <input placeholder="Image URL" value={pet.image} onChange={e=>setPet({...pet,image:e.target.value})}/>
            <textarea placeholder="Description" value={pet.description} onChange={e=>setPet({...pet,description:e.target.value})} />
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn--ghost" onClick={()=>setShowAddModal(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={createPet}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
