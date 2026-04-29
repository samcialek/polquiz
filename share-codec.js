// Pass B encoding utility — share user's respondent state via URL fragment.
// Used by results-live.html (encode for share link) and predict.html /
// results-live.html?compare=1 (decode the friend's view of the user).
//
// Format: base64-url-encoded JSON, no compression. Typical payload encodes to
// ~700-900 chars; URLs are ugly but workable for copy-paste sharing. If URLs
// become a UX problem, add LZString or pako compression here without changing
// callers.
//
// Versioned (v: 1). Decoder rejects unknown versions to allow forward changes.
(function () {
  'use strict';

  const VERSION = 1;
  const CONTINUOUS_NODES = ['MAT', 'CD', 'CU', 'MOR', 'PRO', 'COM', 'ZS', 'ONT_H', 'ONT_S', 'PF', 'TRB', 'ENG'];
  const CATEGORICAL_NODES = ['EPS', 'AES'];

  function utf8ToB64Url(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function b64UrlToUtf8(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) s += '='.repeat(4 - pad);
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  const round4 = x => Math.round(x * 10000) / 10000;

  function encodeUserState(respondentState, archetypeId, displayName) {
    const c = {};
    if (respondentState && respondentState.continuous) {
      for (const n of CONTINUOUS_NODES) {
        const node = respondentState.continuous[n];
        if (!node || !Array.isArray(node.posDist)) continue;
        c[n] = [round4(node.expectedPos), round4(node.salience), ...node.posDist.map(round4)];
      }
    }
    const cat = {};
    if (respondentState && respondentState.categorical) {
      for (const n of CATEGORICAL_NODES) {
        const node = respondentState.categorical[n];
        if (!node || !Array.isArray(node.catDist)) continue;
        cat[n] = [round4(node.salience), ...node.catDist.map(round4)];
      }
    }
    const payload = {
      v: VERSION,
      a: String(archetypeId || ''),
      n: displayName || '',
      c: c,
      cat: cat,
    };
    return utf8ToB64Url(JSON.stringify(payload));
  }

  function decodeUserState(encoded) {
    if (!encoded || typeof encoded !== 'string') return null;
    let payload;
    try {
      payload = JSON.parse(b64UrlToUtf8(encoded));
    } catch (e) {
      return null;
    }
    if (!payload || typeof payload !== 'object' || payload.v !== VERSION) return null;
    const continuous = {};
    for (const [n, arr] of Object.entries(payload.c || {})) {
      if (!Array.isArray(arr) || arr.length !== 7) continue;
      continuous[n] = {
        expectedPos: arr[0],
        salience: arr[1],
        touches: 0,
        posDist: arr.slice(2),
      };
    }
    const categorical = {};
    for (const [n, arr] of Object.entries(payload.cat || {})) {
      if (!Array.isArray(arr) || arr.length !== 7) continue;
      categorical[n] = {
        salience: arr[0],
        touches: 0,
        catDist: arr.slice(1),
      };
    }
    return {
      archetypeId: payload.a,
      displayName: payload.n || '',
      respondentState: { continuous, categorical },
    };
  }

  window.PrismShareCodec = {
    encode: encodeUserState,
    decode: decodeUserState,
    VERSION: VERSION,
  };
})();
