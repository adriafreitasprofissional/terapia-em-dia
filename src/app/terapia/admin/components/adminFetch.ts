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
      "Sessão administrativa expirada."
    );
  }

  const previewId =
    window.localStorage.getItem(
      "terapia_preview_professional_id"
    );

  const metodo =
    String(init.method || "GET").toUpperCase();

  if (
    previewId &&
    !["GET", "HEAD", "OPTIONS"].includes(metodo)
  ) {
    throw new Error(
      "Você está apenas visualizando o aplicativo da Lilian. Nenhuma alteração pode ser feita neste modo."
    );
  }

  const headers =
    new Headers(init.headers);

  headers.set(
    "Authorization",
    `Bearer ${token}`
  );

  if (previewId) {
    headers.set(
      "x-therapy-preview-professional-id",
      previewId
    );
  }

  return fetch(input, {
    ...init,
    headers,
    cache: "no-store",
  });
}