import Link from 'next/link';
import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import { customerStatus } from '@/lib/customer-status';
import { CustomerOrders } from './customer-orders';
import { signOut } from './actions';
export const dynamic='force-dynamic';
export default async function Account({searchParams}:{searchParams:Promise<{error?:string}>}){
 const client=await serverClient();
 const {data:{user},error:authError}=await client.auth.getUser();
 if(authError||!user)redirect('/acceso');
 const {error:pageError}=await searchParams;
 const result=await customerStatus(client);
 let operator=false;
 try{const {data,error}=await client.rpc('operator_access');operator=!error&&data===true;}catch{}
 const name=typeof user.user_metadata.full_name==='string'?user.user_metadata.full_name:'cliente';
 const initial='orders' in result.body&&result.body.orders?{orders:result.body.orders,checkedAt:result.body.checkedAt!}:null;
 return <section className="account"><div className="account-heading"><div><span className="eyebrow">MI CUENTA</span><h1>Hola, {name}</h1><p>Consulta tus pedidos y su estado.</p></div><span className="badge">Sesión verificada</span></div>
 <div className="account-grid"><article className="card"><h2>Tu acceso</h2><p className="email">{user.email}</p><Link className="button" href="/chicanito">Ver menú de Chicanito</Link>{operator&&<p><Link className="button secondary" href="/admin">Mi panel</Link></p>}
 {pageError&&<p className="alert" role="alert">No se pudo completar la acción. Actualiza y vuelve a intentar.</p>}
 <form action={signOut}><button className="button secondary">Cerrar sesión</button></form></article>
 <article className="card"><h2>Tus pedidos</h2><CustomerOrders initial={initial}/></article></div></section>;
}
