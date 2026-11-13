/**
 * Tab cloaking helpers.
 *
 * Cloaking only ever touches the browser tab's name. The address bar, history
 * entries, favicon and every stored link are left exactly as they are.
 */

export const DEFAULT_CLOAK_TITLE = 'Google Classroom';

const DEFAULT_DOCUMENT_TITLE = 'GameVault - Game Sites Directory';
// Icon cloaking was removed; this clears any link left behind in a live session.
const LEGACY_ICON_ATTR = 'data-gamevault-cloak-icon';

let originalTitle: string | null = null;

function captureOriginalTitle() {
  if (originalTitle === null) {
    originalTitle = document.title || DEFAULT_DOCUMENT_TITLE;
  }
}

function removeLegacyIconLink() {
  document
    .querySelectorAll<HTMLLinkElement>(`link[${LEGACY_ICON_ATTR}]`)
    .forEach((link) => link.remove());
}

/** Apply the cloaked tab name. */
export function applyCloak(title: string) {
  if (typeof document === 'undefined') return;
  captureOriginalTitle();
  removeLegacyIconLink();

  const nextTitle = (title || '').trim() || DEFAULT_CLOAK_TITLE;
  if (document.title !== nextTitle) {
    document.title = nextTitle;
  }
}

/** Put the real GameVault tab name back. */
export function clearCloak() {
  if (typeof document === 'undefined') return;
  document.title = originalTitle ?? DEFAULT_DOCUMENT_TITLE;
  removeLegacyIconLink();
}
