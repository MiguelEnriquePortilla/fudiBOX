import Link from 'next/link';
import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import { customerStatus } from '@/lib/customer-status';
import { CustomerOrders } from './customer-orders';
import { signOut } from './actions';
import './account.css';
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
 return <section className="account"><div className="account-heading"><div><h1>Tus pedidos</h1><p>Hola, {name}. Consulta aquí su avance.</p></div>{operator&&<Link className="button secondary" href="/admin">Mi panel</Link>}</div>
 <div className="account-grid"><article className="card account-orders"><h2>Seguimiento</h2>{pageError&&<p className="alert" role="alert">No se pudo completar la acción. Actualiza y vuelve a intentar.</p>}<CustomerOrders initial={initial}/></article><aside className="account-access"><h2>Mi cuenta</h2><p className="email">{user.email}</p><span className="badge">Sesión verificada</span><p><Link className="button" href="/chicanito">Explorar el menú</Link></p>
 <form action={signOut}><button className="button secondary">Cerrar sesión</button></form></aside></div></section>;
}
