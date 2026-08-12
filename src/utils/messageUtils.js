export function constructMessage(id, from, text) {
  console.log('construct message', id, from, text)
  return {
    id,
    from,
    text,
    ts: new Date().toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}