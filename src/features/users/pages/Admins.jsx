const Admins = () => {
  const admins = [
    { id: 1, name: "Super Admin", role: "Super Admin", email: "admin@salon.com", status: "Active", date: "Jan 1, 2025" },
    { id: 2, name: "Omar Farouq", role: "Admin", email: "omar@salon.com", status: "Active", date: "Mar 14, 2025" },
    { id: 3, name: "Nadia Karim", role: "Admin", email: "nadia@salon.com", status: "Active", date: "May 22, 2025" },
    { id: 4, name: "Meera Singh", role: "Admin", email: "meera@salon.com", status: "Inactive", date: "Jul 8, 2025" },
    { id: 5, name: "James Thompson", role: "Admin", email: "james@salon.com", status: "Active", date: "Sep 3, 2025" },
  ];

  return (
    <div className="page active">
      <div className="admin-page-header p-10 flex items-start justify-between border-b border-gold/10">
        <div>
          <h1 className="font-display text-4xl italic text-black-deep">All Admins</h1>
          <p className="text-secondary text-sm mt-2 font-medium">Manage admin access and permissions.</p>
        </div>
        <button className="bg-gold text-black-deep px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:shadow-luxe transition-all flex items-center gap-2 border-0 cursor-pointer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Admin
        </button>
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <strong>{admin.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge active" style={{ background: admin.role === 'Super Admin' ? '#eff6ff' : '#f3f0ff', color: admin.role === 'Super Admin' ? '#2563eb' : '#7c3aed' }}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="td-mono">{admin.email}</td>
                  <td>
                    <span className={`status-badge ${admin.status === 'Active' ? 'verified' : 'inactive'}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="td-muted">{admin.date}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
                      {admin.status === 'Active' ? (
                        <button className="admin-btn admin-btn-red admin-btn-sm">Deactivate</button>
                      ) : (
                        <button className="admin-btn admin-btn-green admin-btn-sm">Activate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <span className="page-info">Showing 1–5 of {admins.length} entries</span>
          <div className="page-btns">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admins;
