const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://api.closet.wtwr.verymad.net'
  : 'http://localhost:3001';

function getToken() {
  return localStorage.getItem("jwt");
}

function authHeaders(withJson = true) {
  const headers = {};
  if (withJson) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function getItems() {
  return fetch(`${baseUrl}/items/`, { headers: authHeaders(false) }).then((res) => {
    return res.ok
      ? res.json()
      : Promise.reject(`Error: ${res.status}`);
  });
}

function addItem({ name, imageUrl, weather }, token) {
  const _id = Date.now();
  const body = { _id, name, imageUrl, weather };
  /* eslint-disable-next-line no-console */
  console.log('addItem sending body:', body);
  /* eslint-disable-next-line no-console */
  // allow overriding token for testing: authHeaders will pick up localStorage by default
  console.log('addItem headers:', authHeaders(true));

  return fetch(`${baseUrl}/items/`, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.ok) return res.json();
    // try to parse error body for better messages
    return res.text().then((text) => {
      try {
        const json = JSON.parse(text || '{}');
        return Promise.reject(json);
      } catch (e) {
        return Promise.reject(`Error: ${res.status} ${text}`);
      }
    });
  });
}

function deleteItem(id, token) {
  return fetch(`${baseUrl}/items/${id}`, {
    method: 'DELETE',
    headers: authHeaders(true),
  }).then((res) => {
    return res.ok
      ? res.json()
      : Promise.reject(`Error: ${res.status}`);
  });
}

// Likes
function addCardLike(id) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: 'PUT',
    headers: authHeaders(true),
  }).then((res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)));
}

function removeCardLike(id) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: 'DELETE',
    headers: authHeaders(true),
  }).then((res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)));
}

// Auth helpers
function login({ email, password }) {
  return fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)))
    .then((data) => {
      if (data.token) localStorage.setItem('jwt', data.token);
      return data;
    });
}

function signup({ name, email, password }) {
  return fetch(`${baseUrl}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  }).then((res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)));
}

export { getItems, addItem, deleteItem, addCardLike, removeCardLike, login, signup };