import { defineConfig } from 'vite';
import path from 'path';

// Any script hosted on the AlterU guest shell (banner, login, coupon).
// The default build keeps guest-shell.js; only --mode crazygames strips it.
const ALTERU_SHELL_SCRIPT_RE =
  /\s*<script\b[^>]*\bsrc=["'][^"']*(?:images\.aiwaves\.tech\/alteru|alteru\.app)[^"']*["'][^>]*>\s*<\/script>/gi;

// Runs immediately after aigram-bridge.js. Crazy Games query params must not
// become an Aigram session; the default build does not include this script.
const CRAZYGAMES_SESSION_GUARD = `<script>
(function () {
  var A = window.Aigram;
  if (!A) return;
  A.apiOrigin = null;
  A.telegramId = null;
  A.isInAigram = false;
  A.canRank = false;
})();
</script>`;

// Guest-shell mounts these hosts (banner, email login, coupon claim). Hide them
// even if a script is injected after the static tag was removed. Not in the
// default build.
const CRAZYGAMES_CHROME_HIDE = `<style id="cg-guest-chrome">
#alteru-guest-banner,
#alteru-guest-login,
#alteru-guest-coupon,
#alteru-guest-coupon-claim { display: none !important; }
</style>
<script>
(function () {
  var ids = ['alteru-guest-banner', 'alteru-guest-login', 'alteru-guest-coupon', 'alteru-guest-coupon-claim'];
  function strip() {
    var i, el, scripts, src;
    for (i = 0; i < ids.length; i++) {
      el = document.getElementById(ids[i]);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }
    scripts = document.getElementsByTagName('script');
    for (i = scripts.length - 1; i >= 0; i--) {
      src = scripts[i].src || '';
      if (src.indexOf('guest-shell') !== -1 || src.indexOf('images.aiwaves.tech/alteru') !== -1) {
        if (scripts[i].parentNode) scripts[i].parentNode.removeChild(scripts[i]);
      }
    }
  }
  strip();
  var obs = new MutationObserver(strip);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); }, 12000);
})();
</script>`;

export default defineConfig(({ mode }) => ({
  // Relative base so the bundle loads inside a Crazy Games (or Pages) iframe
  // regardless of the host path.
  base: './',
  plugins: [
    {
      name: 'crazygames-guest-shell',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          if (mode !== 'crazygames') return html;
          let out = html
            .replace(ALTERU_SHELL_SCRIPT_RE, '')
            .replace(/<html\b[^>]*>/i, '<html lang="en" class="cg-guest">')
            .replace(/<title>[\s\S]*?<\/title>/i, '<title>Shelf It</title>');
          if (!out.includes('A.isInAigram = false')) {
            out = out.replace(
              /(<script\s+src="\.\/aigram-bridge\.js"><\/script>)/,
              `$1\n${CRAZYGAMES_SESSION_GUARD}`,
            );
          }
          if (!out.includes('id="cg-guest-chrome"')) {
            out = out.replace('</head>', `${CRAZYGAMES_CHROME_HIDE}\n</head>`);
          }
          return out;
        },
      },
    },
  ],
  resolve: {
    alias: { 'three/addons/': path.resolve(__dirname, 'node_modules/three/examples/jsm/') },
  },
  build: {
    outDir: mode === 'crazygames' ? 'dist-crazygames' : 'dist',
    emptyOutDir: true,
  },
  preview: { host: '0.0.0.0', allowedHosts: true },
  server: { host: '0.0.0.0', allowedHosts: true },
}));
