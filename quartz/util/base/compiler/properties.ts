const simpleIdentifierPattern = /^[A-Za-z_][A-Za-z0-9_]*$/

export function buildPropertyExpressionSource(property: string): string | null {
  const trimmed = property.trim()
  if (!trimmed) return null
  if (trimmed.includes('(') || trimmed.includes('[') || trimmed.includes(']')) {
    return trimmed
  }
  const parts = trimmed.split('.')
  const root = parts[0]
  const rest = parts.slice(1)
  const buildAccess = (base: string, segments: string[]) => {
    let source = base
    for (const segment of segments) {
      if (simpleIdentifierPattern.test(segment)) {
        source = `${source}.${segment}`
      } else {
        source = `${source}[${JSON.stringify(segment)}]`
      }
    }
    return source
  }
  if (root === 'file' || root === 'note' || root === 'formula' || root === 'this') {
    return buildAccess(root, rest)
  }
  return buildAccess('note', parts)
}
