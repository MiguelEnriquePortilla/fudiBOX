import { serverClient } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };
export async function GET() {
 try {
  const client = await serverClient();
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) return Response.json({ error: 'Acceso requerido.' }, { status: 401, headers });
  const { data: allowed, error: accessError } = await client.rpc('operator_access');
  if (accessError || allowed !== true) return Response.json({ error: 'Acceso denegado.' }, { status: 403, headers });
  const { data, error } = await client.from('orders').select('id').eq('status', 'requested');
  if (error) throw error;
  return Response.json({ ids: (data || []).map(order => order.id), checkedAt: new Date().toISOString() }, { headers });
 } catch {
  return Response.json({ error: 'No se pudieron revisar los pedidos.' }, { status: 503, headers });
 }
}
