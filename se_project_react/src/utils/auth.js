const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://api.closet.wtwr.verymad.net'
  : 'http://localhost:3001';

function _parseErrorResponse(res) {
  // Clone the response so we can attempt to read JSON first, then text.
  const cloned = res.clone();
  return cloned.json()
    .then((json) => Promise.reject(json))
    .catch(() => {
      // If JSON parsing failed, try text
      return res.text().then((text) => Promise.reject({ message: text || `Error ${res.status}` }));
    });
}

function signup({ name, avatar, email, password }) {
  return fetch(`${baseUrl}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, avatar, email, password }),
  }).then((res) => (res.ok ? res.json() : _parseErrorResponse(res)));
}

function signin({ email, password }) {
  return fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then((res) => (res.ok ? res.json() : _parseErrorResponse(res)));
}

function checkToken(token) {
  return fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : Promise.reject(res.status)));
}

export { signup, signin, checkToken };
