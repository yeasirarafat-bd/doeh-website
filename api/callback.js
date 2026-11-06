// Finishes the GitHub login and hands the token back to the admin screen.
const page = (origin, status, payload) => `<!doctype html><html><body><script>
(function () {
  var allowed = ${JSON.stringify(origin)};
  function receive(e) {
    if (e.origin !== allowed) return;
    window.opener.postMessage('authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(payload))}, e.origin);
    window.removeEventListener('message', receive, false);
    window.close();
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', allowed);
})();
</script></body></html>`;

module.exports = async (req, res) => {
  const origin = 'https://' + req.headers.host;
  const send = (code, html) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Set-Cookie', 'doeh_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0');
    res.end(html);
  };
  try {
    const url = new URL(req.url, origin);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookie = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('doeh_oauth_state='));
    const saved = cookie ? cookie.split('=')[1] : '';
    if (!code || !state || !saved || state !== saved) {
      return send(400, page(origin, 'error', { message: 'Login could not be verified. Please close this window and try again.' }));
    }
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: origin + '/api/callback'
      })
    });
    const data = await r.json();
    if (!data.access_token) {
      return send(401, page(origin, 'error', { message: 'GitHub did not accept the login.' }));
    }
    return send(200, page(origin, 'success', { token: data.access_token, provider: 'github' }));
  } catch (e) {
    return send(500, page(origin, 'error', { message: 'Login failed. Please try again.' }));
  }
};
