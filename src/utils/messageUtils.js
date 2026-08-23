export function constructMessage(id, role, text) {
  return {
    id,
    role,
    text,
    ts: new Date().toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
