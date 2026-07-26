// Tamper-evident ledger, inspired by how blockchains chain blocks together.
//
// Every donation/expense entry gets a hash computed from:
//   (its own data) + (the hash of the entry immediately before it)
//
// That means if anyone edits an old entry after the fact, its hash changes,
// which breaks every hash that comes after it in the chain. The "Verify Ledger"
// button on the public page recomputes the whole chain and flags exactly
// where it breaks — so tampering can't stay hidden.

async function sha256(message) {
  const data = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Deterministic string form of an entry, used as input to the hash.
function entryFingerprint(entry) {
  return [
    entry.type,
    entry.amount,
    entry.date,
    entry.category ?? entry.donor ?? '',
    entry.description ?? entry.note ?? '',
  ].join('|')
}

const GENESIS_HASH = '0'.repeat(64)

// Call this when saving a NEW entry, after fetching the current last hash
// from the ledger_hash collection (see AdminPanel.jsx).
export async function computeNextHash(entry, prevHash) {
  const fingerprint = entryFingerprint(entry) + '|' + (prevHash || GENESIS_HASH)
  return sha256(fingerprint)
}

// Call this to check the ENTIRE ledger for tampering.
// entries must be sorted in the exact order they were originally created
// (i.e. sorted by created_at ascending) with their stored hash on each one.
export async function verifyChain(entries) {
  let prevHash = GENESIS_HASH
  const results = []

  for (const entry of entries) {
    const expected = await sha256(entryFingerprint(entry) + '|' + prevHash)
    const ok = expected === entry.hash
    results.push({ id: entry.id, ok, expected, stored: entry.hash })
    // Continue the chain using the stored hash so we can pinpoint the exact
    // break point rather than have one bad entry cascade into false failures.
    prevHash = entry.hash
    if (!ok) break
  }

  const brokenAt = results.find((r) => !r.ok)
  return {
    valid: !brokenAt,
    checked: results.length,
    total: entries.length,
    brokenEntryId: brokenAt?.id ?? null,
  }
}
