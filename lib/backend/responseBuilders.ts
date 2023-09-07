export function errorResponseBuilder(error: string) {
  return new Response(JSON.stringify({ error }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
export function successResponseBuilder(success: string) {
  return new Response(JSON.stringify({ success }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
