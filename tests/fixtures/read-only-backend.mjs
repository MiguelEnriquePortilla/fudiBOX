// Loopback-only HTTP fixture for candidate rendering tests. Never connects to a real service.
// This simulates Supabase transport, not hosted authentication/RLS verification.
import http from 'node:http';
const business={id:'10000000-0000-4000-8000-000000000001',name:'Chicken Chicanito',slug:'chicken-chicanito',status:'approved',address:'TEST punto de recogida',map_url:null,logo_path:null,accepting_orders:false,pickup_enabled:true,delivery_enabled:false};
const product={id:'20000000-0000-4000-8000-000000000001',business_id:business.id,name:'Producto de prueba',description:'Sólo fixture local',price_cents:8500,category:'Prueba',sort_order:0,available:true,option_groups:[],image_path:null};
const customers={customer:'30000000-0000-4000-8000-000000000001',operator:'30000000-0000-4000-8000-000000000002'};
const user=id=>({id,aud:'authenticated',role:'authenticated',email:'fixture@example.invalid',email_confirmed_at:'2026-10-21T00:00:00Z',created_at:'2026-10-21T00:00:00Z',app_metadata:{provider:'google'},user_metadata:{full_name:'Cliente de prueba'},identities:[]});
const order=id=>({id:'40000000-0000-4000-8000-000000000001',business_id:business.id,customer_id:id,status:'requested',created_at:'2026-10-21T18:00:00Z',subtotal_cents:8500,platform_fee_cents:1000,shipping_cents:0,total_cents:9500,delivery_method:'pickup',pickup_address:business.address,preparation_minutes:20,customer_name:'Cliente de prueba',customer_phone:'TEST',notes:'',delivery_address:null,completed_at:null,businesses:{name:business.name},order_items:[{product_name:product.name,quantity:1,selections:[]}]});
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/fixture/session'){
  const role=url.searchParams.get('role');
  if(!Object.hasOwn(customers,role)){res.writeHead(400);return res.end('Choose customer or operator fixture');}
  const expires=Math.floor(Date.now()/1000)+3600;
  const token=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({sub:customers[role],aud:'authenticated',role:'authenticated',exp:expires,iat:expires-3600})).toString('base64url')+'.fixture';
  const session={access_token:token,refresh_token:'local-fixture-only',expires_in:3600,expires_at:expires,token_type:'bearer',user:user(customers[role])};
  const cookie='base64-'+Buffer.from(JSON.stringify(session)).toString('base64url');
  res.writeHead(302,{'Set-Cookie':`sb-localhost-auth-token=${cookie}; Path=/; SameSite=Lax; Max-Age=3600`,'Location':'http://localhost:3011/cuenta'});
  return res.end();
 }
 let uid=null;try{const token=req.headers.authorization?.replace(/^Bearer /,'');const payload=JSON.parse(Buffer.from(token?.split('.')[1]||'','base64url'));if(Object.values(customers).includes(payload.sub))uid=payload.sub;}catch{}
 const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 if(url.pathname==='/auth/v1/user')return uid?send(200,user(uid)):send(401,{message:'Fixture authentication required',code:'bad_jwt'});
 if(url.pathname.startsWith('/auth/'))return send(400,{message:'No OAuth flow in fixture',code:'bad_code'});
 if(url.pathname==='/rest/v1/rpc/operator_access')return send(200,uid===customers.operator);
 if(url.pathname==='/rest/v1/rpc/my_pickup_pilot')return send(200,false);
 if(req.method!=='GET')return send(405,{message:'Fixture is read only'});
 if(url.pathname==='/rest/v1/businesses'){
  const match=!url.searchParams.has('slug')||url.searchParams.get('slug')==='eq.'+business.slug;
  if((req.headers.accept||'').includes('vnd.pgrst.object'))return match?send(200,business):send(406,{code:'PGRST116'});
  return send(200,match?[business]:[]);
 }
 if(url.pathname==='/rest/v1/products')return send(200,[product]);
 if(url.pathname==='/rest/v1/orders')return send(200,uid?[order(uid)]:[]);
 if(url.pathname==='/rest/v1/drivers')return send(200,[]);
 return send(404,{message:'Unknown fixture endpoint'});
}).listen(54329,'127.0.0.1',()=>console.log('Read-only fixture on http://localhost:54329'));
