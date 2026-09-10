/**
 * Offline language alert.
 * Every supported language now works fully offline:
 *  - en / hi / bn: bundled offline audio.
 *  - as / mni / brx: bundled offline audio.
 *  - kha / grt / lus: offline text content (no TTS exists for these languages
 *    even online, so there is no internet-dependent voice path to warn about).
 *
 * The former "Internet Required" banner is therefore obsolete and removed.
 */
function OfflineLangAlert() {
  return null;
}

export default OfflineLangAlert;