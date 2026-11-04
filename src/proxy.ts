import { NextResponse } from "next/server";

// A home pública já possui os três acessos oficiais do Terapia em Dia.
// Não reescrever "/" para "/terapia-vitrine": isso escondia a home
// verde aprovada e mostrava a vitrine antiga com fotografia.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
