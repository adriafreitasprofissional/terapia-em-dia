export async function adminFetch(
  input: string,
  init: RequestInit = {}
) {
  const token =
    window.localStorage.getItem(
      "terapia_auth_access_token"
    );

  if (!token) {
    throw new Error(
      "Sessao administrativa expirada."
    );
  }

  const headers = new Headers(init.headers);

  headers.set(
    "Authorization",
    `Bearer ${token}`
  );

  return fetch(input, {
    ...init,
    headers,
    cache: "no-store",
  });
}
