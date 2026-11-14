# Languway German — Part of the Languway Series

German course (Pre-A1 → C2, 30 levels) as a static PWA for GitHub Pages. Upload all files to the repository root
(`.nojekyll` is included) and enable *Settings → Pages → Deploy from branch*. No build step.

## Backend (Supabase, isolated)
Accounts, progress and certificates live in the Supabase project **languway-english**, but completely separated from the English app:
- own Postgres schema `german` (tables: accounts, sessions, progress, attempts, certs, secret) with RLS on and **no API access to the tables**;
- the site talks only to `public.german_*` RPC functions (security definer): signup, login (5 wrong attempts → 10 min lock), session, save, logout,
  change_password, delete_account, issue_cert, my_certs, verify;
- passwords are hashed with bcrypt inside the database; session tokens are stored only as SHA-256 hashes;
- the English app's tables (`public.progress`, `public.signup_attempts`) and `auth.users` are never touched.
The URL and the public anon key are in `app.js` (they are meant to be public).

## Features
30 levels (letters → numbers → words → sentences) · 30-question placement test (only asked when you enter the learning area) ·
level tests, 7 stage exams, final exam (pass ≥ 75 %) · spaced repetition, XP, streak, daily goal, daily challenge, memory game ·
German⇄English translator with definitions, coloured articles (der blue, die red, das green) and an interactive verb table ·
AI tutor (own API key) · 30 level + 7 stage + 1 final certificate, server-issued code, QR check page ·
settings in accordion sections (appearance, speech, learning, notifications, AI key, install, share, account, about).

## Honest limits
- Certificates are issued by the server and the code exists only in the database, so a code cannot be invented offline.
  The exams are, however, graded in the browser, so a technical user could still tamper with their own progress before requesting a certificate.
- Sign-up and login need internet. After login the app works offline and syncs when the connection returns.
- Notifications cannot be pushed to a fully closed app (no push server); they fire while the app/tab is open or in the background.
- Speaking practice uses the browser's speech recognition and shows which words were recognised; it is not a pronunciation score.
- The AI tutor needs the learner's own Anthropic API key (stored only on that device).

## Sprachen / Languages
- Oberfläche: Deutsch, English, العربية (RTL). Erklärsprache (Bedeutungen + Grammatik-Hilfe): ar, en, fr, es, tr, ru, fa, ur, zh, hi, id – automatisch aus Muttersprache und weiteren Sprachen gewählt (`i18n.js`, `lang-*.js`).
- Neue Erklärsprache: Datei `lang-xx.js` nach dem Muster von `lang-fr.js` anlegen, Code in `HELPERS` (`i18n.js`) und `SHELL` (`sw.js`) eintragen.
- Die Übersetzungen sind maschinell erstellt und nicht muttersprachlich geprüft.
