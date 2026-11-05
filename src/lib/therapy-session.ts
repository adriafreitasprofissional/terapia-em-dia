import {supabase} from "@/lib/supabase";
export async function therapyAccessToken():Promise<string|null>{
 const {data,error}=await supabase.auth.getSession();
 if(error)throw new Error("Não foi possível verificar sua sessão. Tente novamente.");
 return data.session?.access_token||window.localStorage.getItem("terapia_auth_access_token");
}
export async function endTherapySession(){
 const {error}=await supabase.auth.signOut({scope:"local"});
 if(error)throw new Error("Não foi possível sair. Tente novamente.");
 for(const key of ["terapia_preview_professional_id","terapia_auth_access_token","terapia_auth_refresh_token","terapia_em_dia_access_token"])window.localStorage.removeItem(key);
}
