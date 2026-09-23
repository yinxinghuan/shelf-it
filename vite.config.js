import { defineConfig } from 'vite';
import path from 'path';

const GUEST_SHELL_RE =
  /\s*<script\s+src="https:\/\/images\.aiwaves\.tech\/alteru\/guest-shell\.js"[^>]*>\s*<\/script>/gi;

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
          return html
            .replace(GUEST_SHELL_RE, '')
            .replace(
              /(<script\s+src="\.\/aigram-bridge\.js"><\/script>)/,
              `$1\n${CRAZYGAMES_SESSION_GUARD}`,
            );
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
