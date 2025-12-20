const el = (id) => document.getElementById(id);

const api = (path, opts = {}) => {
  const token = el('token').value.trim();
  const headers = opts.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers }).then(async r => {
    const text = await r.text();
    try { return JSON.parse(text); } catch { return text; }
  });
};

const renderList = (containerId, items, type) => {
  const container = el(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    const left = document.createElement('div');
    left.innerText = type === 'user' ? `${item.fullname} (${item.email})` : `${item.title} — ${item.author?.username || item.author?.fullname || 'Unknown'}`;
    const right = document.createElement('div');
    const del = document.createElement('button');
    del.innerText = 'Delete';
    del.onclick = async () => {
      if (!confirm('Are you sure?')) return;
      const path = `/api/v1/admin/${type === 'user' ? 'users' : 'posts'}/${item._id}`;
      const res = await api(path, { method: 'DELETE' });
      alert(res.message || JSON.stringify(res));
      if (type === 'user') loadUsers(); else loadPosts();
    };
    right.appendChild(del);
    div.appendChild(left);
    div.appendChild(right);
    container.appendChild(div);
  });
};

const loadUsers = async () => {
  const res = await api('/api/v1/admin/users');
  if (res && res.users) renderList('usersList', res.users, 'user');
  else alert(JSON.stringify(res));
};

const loadPosts = async () => {
  const res = await api('/api/v1/admin/posts');
  if (res && res.posts) renderList('postsList', res.posts, 'post');
  else if (res && res.data) renderList('postsList', res.data, 'post');
  else alert(JSON.stringify(res));
};

el('loadUsers').addEventListener('click', loadUsers);
el('loadPosts').addEventListener('click', loadPosts);
