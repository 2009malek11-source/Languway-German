# Language German — Part of the Languway Series

A complete German course (Pre-A1 → C2, 30 levels) as a static PWA. **No server, no build step.**
Upload all files to a GitHub repository (root) and enable *Settings → Pages → Deploy from branch*.
The `.nojekyll` file is already included.

## What is inside
- 30 levels: letters → numbers → words → sentences, split into Pre-A1, A1, A2, B1, B2, C1, C2
- 30-question placement test; later levels stay hidden/locked until the current one is passed (75 %)
- Level tests, stage exams (7), final comprehensive exam (40 questions)
- Spaced repetition (1/3/7/14/30 days), XP, streak, daily goal, daily challenge, memory game, achievements
- German ⇄ English translator/dictionary (offline) with definitions in both languages and verb forms
- AI tutor (German + English): explains grammar, explains why an answer was wrong, reminds you of neglected skills
- Certificates: 30 level certificates, 7 stage certificates (Pre-A1…C2), 1 final "Language German" certificate
  with name, date, percentage, seal, certificate ID and a signed QR code (PDF / PNG / print)
- Everything is in German except Log in / Create account (English)

## How it works without a server
- Accounts and progress live in the browser (`localStorage`). Passwords are stored only as salted PBKDF2 hashes.
- To move to another device: Settings → *Backup*, download the file, then on the new device use "Restore backup" on the login page.
- Clearing the browser data deletes accounts that were not backed up.

## AI tutor
Settings → *KI-Tutor*: paste your own Anthropic API key. It is stored only on this device and sent only to `api.anthropic.com`.
Without a key the tutor falls back to the built-in grammar notes of each level.

## Honest limits
- Certificates are signed (HMAC) so edits to name/score/date are detected by the verify page,
  but with no server the signing key is inside the JavaScript, so a determined developer could still forge one.
  Truly unforgeable certificates need a server.
- Speaking practice uses the browser's speech recognition and shows which words were recognised; it is not a pronunciation score.
- Audio needs a German voice on the device.
