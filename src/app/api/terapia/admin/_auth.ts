import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ROLES_PERMITIDAS = new Set([
  "admin",
  "terapeuta",
  "therapist",
  "profissional",
]);

export async function getTherapyAdmin(
  request: NextRequest
) {
  const authorization =
    request.headers.get("authorization") || "";

  const token =
    authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim()
      : "";

  if (!token) return null;

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user?.email) {
    return null;
  }

  const {
    data: cliente,
    error: clienteError,
  } = await supabaseAdmin
    .from("club_clients")
    .select("id, nome, nome_referencia, email, role")
    .ilike("email", user.email)
    .maybeSingle();

  if (clienteError || !cliente) {
    return null;
  }

  const role = String(cliente.role || "")
    .toLowerCase()
    .trim();

  if (role === "admin") {
    const previewId =
      request.headers.get(
        "x-therapy-preview-professional-id"
      );

    if (previewId) {
      if (
        !["GET", "HEAD", "OPTIONS"].includes(
          request.method.toUpperCase()
        )
      ) {
        return null;
      }

      const {
        data: profissional,
        error: profissionalError,
      } = await supabaseAdmin
        .from("therapy_professionals")
        .select(
  "id, name, slug, email, active, plan, subscription_status, trial_started_at, trial_ends_at"
)
        .eq("id", previewId)
        .eq("active", true)
        .maybeSingle();

      if (
        profissionalError ||
        !profissional
      ) {
        return null;
      }

      const {
        data: cadastroProfissional,
      } = await supabaseAdmin
        .from("club_clients")
        .select(
          "id, nome, nome_referencia, email"
        )
        .eq("id", profissional.id)
        .maybeSingle();

      const nomeProfissional =
        profissional.name ||
        cadastroProfissional?.nome ||
        cadastroProfissional?.nome_referencia ||
        "Profissional";

      return {
        id: profissional.id,
        nome:
          cadastroProfissional?.nome_referencia ||
          cadastroProfissional?.nome ||
          nomeProfissional,
        nome_completo:
          nomeProfissional,
        email:
          profissional.email ||
          cadastroProfissional?.email ||
          "",
        role: "profissional",
        professional:
          nomeProfissional,
              central_access: false,
      preview_mode: true,
      plan: profissional.plan || "fundador",
      subscription_status:
        profissional.subscription_status || "active",
      trial_started_at:
        profissional.trial_started_at || null,
      trial_ends_at:
        profissional.trial_ends_at || null,
    };

    }

  }
if (role === "admin") {
  const nomeCompleto =
    cliente.nome ||
    cliente.nome_referencia ||
    "Admin";

  return {
    id: cliente.id,
    nome:
      cliente.nome_referencia ||
      cliente.nome ||
      "Admin",
    nome_completo: nomeCompleto,
    email:
      cliente.email ||
      user.email,
    role,
    professional: nomeCompleto,
    central_access: true,
    preview_mode: false,
  };
}

if (ROLES_PERMITIDAS.has(role)) {
  const {
    data: profissionalRole,
    error: profissionalRoleError,
  } = await supabaseAdmin
    .from("therapy_professionals")
    .select(
      "id, name, slug, email, active, plan, subscription_status, trial_started_at, trial_ends_at"
    )
    .eq("id", cliente.id)
    .eq("active", true)
    .maybeSingle();

  if (
    profissionalRoleError ||
    !profissionalRole
  ) {
    return null;
  }

  const nomeCompleto =
    profissionalRole.name ||
    cliente.nome ||
    cliente.nome_referencia ||
    "Profissional";

  return {
    id: cliente.id,
    nome:
      cliente.nome_referencia ||
      cliente.nome ||
      nomeCompleto,
    nome_completo: nomeCompleto,
    email:
      profissionalRole.email ||
      cliente.email ||
      user.email,
    role,
    professional: nomeCompleto,
    central_access: false,
    preview_mode: false,
    plan:
      profissionalRole.plan || "fundador",
    subscription_status:
      profissionalRole.subscription_status ||
      "active",
    trial_started_at:
      profissionalRole.trial_started_at || null,
    trial_ends_at:
      profissionalRole.trial_ends_at || null,
  };
}
 

  const {
    data: profissionalTerapia,
    error: profissionalTerapiaError,
  } = await supabaseAdmin
    .from("therapy_professionals")
    .select(
  "id, name, slug, email, active, plan, subscription_status, trial_started_at, trial_ends_at"
)
    .eq("id", cliente.id)
    .eq("active", true)
    .maybeSingle();

  if (
    profissionalTerapiaError ||
    !profissionalTerapia
  ) {
    return null;
  }

  const nomeProfissional =
    profissionalTerapia.name ||
    cliente.nome ||
    cliente.nome_referencia ||
    "Profissional";

  return {
    id: cliente.id,
    nome:
      cliente.nome_referencia ||
      cliente.nome ||
      nomeProfissional,
    nome_completo:
      nomeProfissional,
    email:
      profissionalTerapia.email ||
      cliente.email ||
      user.email,
    role: "profissional",
    professional:
      nomeProfissional,
    central_access: false,
    preview_mode: true,
  };
}