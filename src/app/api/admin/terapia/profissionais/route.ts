import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "@/app/api/terapia/admin/_auth";

export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const admin = await getTherapyAdmin(req);
  if (!admin || admin.central_access !== true || admin.preview_mode) {
    return NextResponse.json({ error: "Acesso restrito à administração central." }, { status: 403 });
  }
  const {data,error} = await supabaseAdmin.from("therapy_professionals")
    .select("id,name,slug,active,plan,subscription_status")
    .order("name",{ascending:true});
  if (error) return NextResponse.json({error:"Não foi possível consultar as profissionais."},{status:503});
  return NextResponse.json({profissionais:data || []},{headers:{"Cache-Control":"private, no-store"}});
}
