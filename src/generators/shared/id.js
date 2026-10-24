// crypto.randomUUID só existe em contexto seguro (https ou localhost). No
// teste pelo celular via IP na rede local (http://192.168.x.x), o contexto é
// inseguro e o método some — por isso o fallback abaixo.
export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
