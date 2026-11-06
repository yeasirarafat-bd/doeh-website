// Starts the GitHub login for the DOEH admin screen (/admin).
// Needs two settings in Vercel: OAUTH_GITHUB_CLIENT_ID and OAUTH_GITHUB_CLIENT_SECRET.
const crypto = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Login is not set up yet: OAUTH_GITHUB_CLIENT_ID is missing in Vercel.');
  }
  const url = new URL(req.url, 'https://' + req.headers.host);
  const asked = url.searchParams.get('scope') || '';
  const scope = ['public_repo', 'repo'].includes(asked) ? asked : 'public_repo';
  const state = crypto.randomBytes(16).toString('hex');
  const redirect = 'https://' + req.headers.host + '/api/callback';
  res.setHeader('Set-Cookie', 'doeh_oauth_state=' + state + '; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600');
  res.statusCode = 302;
  res.setHeader('Location', 'https://github.com/login/oauth/authorize?' + new URLSearchParams({
    client_id: clientId, redirect_uri: redirect, scope: scope, state: state
  }).toString());
  res.end();
};
