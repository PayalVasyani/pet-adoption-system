import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/adoptions/my").then(res => setData(res.data || []));
  }, []);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container">
      <div style={{marginBottom: 24}}>
        <h2>My Applications</h2>
        <p style={{color: '#6b7280', marginTop: 4}}>Track your pet adoption requests</p>
      </div>

      {data.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px 20px', color: '#6b7280'}}>
          <p>No applications yet. Start applying for your favorite pets!</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20}}>
          {data.map(d => (
            <div key={d._id} style={{
              background: 'white',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Pet Image */}
              <div style={{width: '100%', height: 200, overflow: 'hidden', background: '#f3f4f6'}}>
                <img src={d.pet?.image || '/placeholder.png'} alt={d.pet?.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>

              {/* Content */}
              <div style={{padding: 20, flex: 1, display: 'flex', flexDirection: 'column'}}>
                {/* Header */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12}}>
                  <div>
                    <h3 style={{margin: 0, fontSize: 18, fontWeight: 600, color: '#1f2937'}}>{d.pet?.name}</h3>
                    <p style={{margin: '4px 0 0 0', fontSize: 14, color: '#6b7280'}}>{d.pet?.breed} • {d.pet?.species}</p>
                  </div>
                  <div style={{
                    background: getStatusColor(d.status),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}>
                    {d.status?.toUpperCase()}
                  </div>
                </div>

                {/* Dates */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e5e7eb'}}>
                  <div>
                    <p style={{margin: 0, fontSize: 12, color: '#6b7280', fontWeight: 500}}>Applied</p>
                    <p style={{margin: '4px 0 0 0', fontSize: 14, color: '#1f2937', fontWeight: 600}}>{formatDate(d.createdAt)}</p>
                  </div>
                  <div>
                    <p style={{margin: 0, fontSize: 12, color: '#6b7280', fontWeight: 500}}>Decision</p>
                    <p style={{margin: '4px 0 0 0', fontSize: 14, color: '#1f2937', fontWeight: 600}}>{formatDate(d.updatedAt)}</p>
                  </div>
                </div>

                {/* Description */}
                {d.pet?.description && (
                  <p style={{margin: 0, fontSize: 13, color: '#4b5563', lineHeight: 1.5}}>
                    {d.pet.description}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div style={{padding: '0 20px 20px', borderTop: '1px solid #f3f4f6', color: '#6b7280', fontSize: 12}}>
                {d.status?.toLowerCase() === 'approved' ? (
                  <p style={{margin: 0}}>🎉 Congratulations! Your application was approved.</p>
                ) : d.status?.toLowerCase() === 'rejected' ? (
                  <p style={{margin: 0}}>Try applying for another pet!</p>
                ) : (
                  <p style={{margin: 0}}>Admin is reviewing your application...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
