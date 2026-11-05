const destinations=new Set(["/terapia/admin","/terapia/admin/clientes","/terapia/admin/anamneses","/terapia/admin/disponibilidade","/terapia/admin/agenda","/terapia/admin/sessoes","/terapia/admin/financeiro"]);
const uuid="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
export function safeTherapyReturn(value:string|null|undefined):string {
 if(value&&(destinations.has(value)||new RegExp("^/terapia/acesso/preview-"+uuid+"$","i").test(value)||new RegExp("^/terapia/admin/(clientes|anamneses|sessoes)/"+uuid+"$","i").test(value)))return value;
 return "/terapia/admin";
}
export function therapyLoginPath(value:string|null|undefined){return "/terapia/admin/login?next="+encodeURIComponent(safeTherapyReturn(value));}
