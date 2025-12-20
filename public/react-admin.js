const { useState, useEffect } = React;

function apiFetch(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('admin_token') || '';
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  return fetch(path, { method, headers, body }).then(async r => {
    const text = await r.text();
    try { return JSON.parse(text); } catch { return text; }
  });
}

function TokenInput({ onChange }) {
  const [value, setValue] = useState(localStorage.getItem('admin_token') || '');
  useEffect(() => { onChange && onChange(value); }, [value]);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input type="text" placeholder="Paste admin JWT token" value={value}
        onChange={e => { setValue(e.target.value); localStorage.setItem('admin_token', e.target.value); }} />
      <button className="secondary" onClick={() => { setValue(''); localStorage.removeItem('admin_token'); }}>Clear</button>
    </div>
  );
}

function List({ title, items, renderItem }) {
  return (
    <div className="card">
      <h3>{title} <span className="muted">({items.length})</span></h3>
      <div>
        {items.length === 0 && <div className="muted">No items</div>}
        {items.map(i => (
          <div key={i._id} className="list-item">
            <div style={{flex:1}}>{renderItem(i)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminApp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const res = await apiFetch('/api/v1/admin/users');
    setLoading(false);
    if (res && res.users) setUsers(res.users);
    else alert(JSON.stringify(res));
  };

  const loadPosts = async () => {
    setLoading(true);
    const res = await apiFetch('/api/v1/admin/posts');
    setLoading(false);
    if (res && res.posts) setPosts(res.posts);
    else if (res && res.data) setPosts(res.data);
    else alert(JSON.stringify(res));
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete user and their posts?')) return;
    const res = await apiFetch(`/api/v1/admin/users/${id}`, { method: 'DELETE' });
    alert(res.message || JSON.stringify(res));
    loadUsers();
  };

  const deletePost = async (id) => {
    if (!confirm('Delete post?')) return;
    const res = await apiFetch(`/api/v1/admin/posts/${id}`, { method: 'DELETE' });
    alert(res.message || JSON.stringify(res));
    loadPosts();
  };

  useEffect(() => { /* nothing on mount until token provided */ }, []);

  return (
    <div>
      <header style={{display:'flex',alignItems:'center'}}>
        <h2>Admin Dashboard</h2>
        <div style={{marginLeft:'auto',width:420}}>
          <TokenInput />
        </div>
      </header>

      <div style={{marginTop:16}}>
        <button onClick={loadUsers} style={{marginRight:8}}>Load Users</button>
        <button onClick={loadPosts}>Load Posts</button>
        {loading && <span style={{marginLeft:12}}>Loading…</span>}
      </div>

      <div className="grid">
        <List title="Users" items={users} renderItem={u => (
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div><strong>{u.fullname}</strong> <span className="muted">@{u.username}</span></div>
              <div className="muted">{u.email} · role: {u.role}</div>
            </div>
            <div>
              <button onClick={() => deleteUser(u._id)}>Delete</button>
            </div>
          </div>
        )} />

        <List title="Posts" items={posts} renderItem={p => (
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div><strong>{p.title}</strong></div>
              <div className="muted">by {p.author?.username || p.author?.fullname || 'Unknown'}</div>
            </div>
            <div>
              <button onClick={() => deletePost(p._id)}>Delete</button>
            </div>
          </div>
        )} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
