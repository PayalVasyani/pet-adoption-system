import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import PetCard from "../components/pets/PetCard";

const Home = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters / controls
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);

  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchPets = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          species: species || undefined,
          breed: breed || undefined,
          age: age || undefined,
          page,
          limit
        };

        const res = await api.get("/pets", { params });

        if (!cancelled) {
          if (res.data && res.data.docs) {
            setPets(res.data.docs);
            setTotalPages(res.data.totalPages || 1);
          } else if (res.data && res.data.data && res.data.meta) {
            // API returns { data: [...], meta: { ... } }
            setPets(res.data.data);
            const meta = res.data.meta || {};
            const tp = meta.totalPages || (meta.total && meta.limit ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1);
            setTotalPages(tp);
          } else if (Array.isArray(res.data)) {
            // server returned full array; apply client-side filters and paginate
            let list = res.data;
            if (search) {
              const q = search.toLowerCase();
              list = list.filter(p => (p.name||"").toLowerCase().includes(q) || (p.breed||"").toLowerCase().includes(q));
            }
            if (species) list = list.filter(p => p.species === species);
            if (breed) list = list.filter(p => p.breed === breed);
            if (age) list = list.filter(p => String(p.age) === String(age));

            const start = (page - 1) * limit;
            const paged = list.slice(start, start + limit);
            setPets(paged);
            setTotalPages(Math.max(1, Math.ceil(list.length / limit)));
          } else {
            setPets([]);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // debounce search slightly
    const t = setTimeout(fetchPets, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [search, species, breed, age, page]);

  // derive available species and breeds from current fetched data (helps populate filters)
  const availableSpecies = useMemo(() => {
    const s = new Set();
    pets.forEach(p => p.species && s.add(p.species));
    return Array.from(s);
  }, [pets]);

  const availableBreeds = useMemo(() => {
    const s = new Set();
    pets.forEach(p => p.breed && s.add(p.breed));
    return Array.from(s);
  }, [pets]);

  const handleView = (pet) => setSelectedPet(pet);

  return (
    <div className="container">
      <div className="filters">
        <input placeholder="Search by name or breed" value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} />

        <select value={species} onChange={e=>{setSpecies(e.target.value); setPage(1);}}>
          <option value="">All species</option>
          {availableSpecies.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={breed} onChange={e=>{setBreed(e.target.value); setPage(1);}}>
          <option value="">All breeds</option>
          {availableBreeds.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {loading ? <p>Loading pets...</p> : (
        <div className="pet-grid">
          {pets.map((p) => (
            <PetCard key={p._id} pet={p} onView={handleView} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button 
          className="pagination__btn pagination__btn--prev"
          disabled={page <= 1} 
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
        >
          ← Prev
        </button>
        <span className="pagination__info">Page {page} of {totalPages}</span>
        <button 
          className="pagination__btn pagination__btn--next"
          disabled={page >= totalPages} 
          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
        >
          Next →
        </button>
      </div>

      {selectedPet && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setSelectedPet(null)}>
          <div style={{background:'white',padding:20,borderRadius:8,maxWidth:600,width:'90%'}} onClick={e=>e.stopPropagation()}>
            <h2>{selectedPet.name}</h2>
            <img src={selectedPet.image} alt={selectedPet.name} style={{width:'100%',height:300,objectFit:'cover'}} />
            <p><strong>Breed:</strong> {selectedPet.breed}</p>
            <p><strong>Species:</strong> {selectedPet.species}</p>
            <p><strong>Age:</strong> {selectedPet.age}</p>
            <p>{selectedPet.description}</p>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
              <button className="btn btn--primary" onClick={()=>{ setSelectedPet(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
