import { useState, useRef, useEffect } from "react";

const LOGO_COLOR = "https://placehold.co/200x60/0F4C81/white?text=EQUIMED";
const LOGO_WHITE = "https://placehold.co/200x60/ffffff/0F4C81?text=EQUIMED";

const C = {
  primary: "#0F4C81", primaryLight: "#1a6bb5",
  accent: "#00A693", danger: "#D84040",
  warning: "#E8A020", success: "#2E7D32",
  bg: "#F0F4F8", sidebar: "#0A2540",
  white: "#ffffff",
  g100: "#F7F9FC", g200: "#EEF2F7", g300: "#D5DCE8",
  g500: "#8896A8", g700: "#4A5568", g900: "#1A2332",
};

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const FULL_MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const initClients = [
  { id:1, name:"Hospital Roosevelt", type:"Público", address:"Calzada Roosevelt Zona 11", city:"Guatemala", phone:"2321-1000", email:"compras@roosevelt.gob.gt", contact:"Dr. Luis Méndez" },
  { id:2, name:"Clínica Santa Lucía", type:"Privado", address:"10 Calle 3-47 Zona 10", city:"Guatemala", phone:"2367-4500", email:"admin@clinicasantalucia.com", contact:"Dra. María García" },
  { id:3, name:"Hospital San Juan de Dios", type:"Público", address:"1a Avenida 10-50 Zona 1", city:"Guatemala", phone:"2251-1200", email:"adquisiciones@sanjuan.gob.gt", contact:"Dr. Roberto Castillo" },
  { id:4, name:"Centro Médico Quetzaltenango", type:"Privado", address:"12 Avenida 6-23 Zona 1", city:"Quetzaltenango", phone:"7767-1234", email:"info@cmquetzal.com", contact:"Dra. Ana López" },
];

const initProducts = [
  { id:"EQ-001", name:"Ventilador Mecánico VentPro 3000", description:"Ventilador mecánico de alta gama con soporte multimodal, pantalla táctil 10\"", pricePublic:185000, pricePrivate:165000, category:"Equipo Mayor" },
  { id:"EQ-002", name:"Monitor de Signos Vitales MS-500", description:"Monitor multiparámetro ECG, SpO2, NIBP, Temp, Resp. Display 15\"", pricePublic:28500, pricePrivate:24000, category:"Monitoreo" },
  { id:"EQ-003", name:"Desfibrilador DEF-200 Bifásico", description:"Desfibrilador bifásico con DEA, pantalla LCD, 200J máximo", pricePublic:45000, pricePrivate:39500, category:"Emergencias" },
  { id:"EQ-004", name:"Bomba de Infusión BI-100", description:"Bomba de infusión volumétrica, flujo 0.1-999 ml/h, alarmas programables", pricePublic:12000, pricePrivate:10500, category:"Infusión" },
  { id:"EQ-005", name:"Ecógrafo Portátil ECHO-P1", description:"Ecógrafo portátil con sonda lineal y convexa, pantalla 12\", batería 90 min", pricePublic:95000, pricePrivate:85000, category:"Diagnóstico" },
];

const makeQuotes = (clients) => {
  const types = ["Venta","Mantenimiento","Arrendamiento","Garantía"];
  return Array.from({length:24},(_,i)=>{
    const month = Math.floor(Math.random()*12);
    const type = types[Math.floor(Math.random()*types.length)];
    const client = clients[Math.floor(Math.random()*clients.length)];
    return {
      id:i+1, correlative:`2026-${String(i+1).padStart(4,"0")}`,
      date:new Date(2026,month,Math.floor(Math.random()*28)+1),
      client, type,
      status:["Borrador","Autorizado","Finalizado"][Math.floor(Math.random()*3)],
      total:Math.floor(Math.random()*150000)+5000,
      month, items:[], category:client.type,
    };
  }).sort((a,b)=>b.date-a.date);
};

const USERS = [
  { id:1, username:"admin",     password:"equimed2026", role:"admin",    name:"Administrador General" },
  { id:2, username:"auxiliar1", password:"aux2026",     role:"auxiliar", name:"Auxiliar Comercial" },
];

const fmt  = n => new Intl.NumberFormat("es-GT",{style:"currency",currency:"GTQ",maximumFractionDigits:2}).format(n);
const fmtD = d => d ? new Date(d).toLocaleDateString("es-GT") : "";

const Icon = ({ name, size=16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {name==="dashboard"&&<><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>}
    {name==="quote"&&<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>}
    {name==="maintenance"&&<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>}
    {name==="rental"&&<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
    {name==="warranty"&&<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
    {name==="training"&&<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>}
    {name==="unops"&&<><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>}
    {name==="database"&&<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>}
    {name==="plus"&&<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
    {name==="search"&&<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}
    {name==="edit"&&<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>}
    {name==="download"&&<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>}
    {name==="print"&&<><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>}
    {name==="check"&&<polyline points="20 6 9 17 4 12"/>}
    {name==="x"&&<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
    {name==="chevron-down"&&<polyline points="6 9 12 15 18 9"/>}
    {name==="chevron-right"&&<polyline points="9 18 15 12 9 6"/>}
    {name==="calendar"&&<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
    {name==="alert"&&<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
    {name==="copy"&&<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>}
    {name==="upload"&&<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>}
    {name==="mail"&&<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}
    {name==="google-cal"&&<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></>}
    {name==="package"&&<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}
    {name==="user-check"&&<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></>}
    {name==="users"&&<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
    {name==="file"&&<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
    {name==="trash"&&<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>}
    {name==="eye"&&<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
    {name==="lock"&&<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
  </svg>
);

const StatusBadge = ({ status }) => {
  const m = { Borrador:{bg:"#EEF2F7",color:"#4A5568"}, Autorizado:{bg:"#E8F5E9",color:"#2E7D32"}, Finalizado:{bg:"#E3F2FD",color:"#1565C0"} };
  const s = m[status]||m.Borrador;
  return <span style={{background:s.bg,color:s.color,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,whiteSpace:"nowrap"}}>{status}</span>;
};

const TypeBadge = ({ type }) => {
  const m = { Venta:{bg:"#E8F5E9",color:"#1B5E20"}, Mantenimiento:{bg:"#FFF3E0",color:"#E65100"}, Arrendamiento:{bg:"#F3E5F5",color:"#6A1B9A"}, Garantía:{bg:"#E1F5FE",color:"#01579B"} };
  const s = m[type]||{bg:"#EEF2F7",color:"#4A5568"};
  return <span style={{background:s.bg,color:s.color,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,whiteSpace:"nowrap"}}>{type}</span>;
};

const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{display:"flex",gap:3,alignItems:"flex-end",height:48}}>
      {data.map((v,i)=>(
        <div key={i} title={`${MONTHS[i]}: ${v}`} style={{flex:1,background:v>0?color:C.g200,borderRadius:"3px 3px 0 0",height:`${(v/max)*100}%`,minHeight:v>0?3:0,transition:"height 0.3s"}}/>
      ))}
    </div>
  );
};

const ClientSearch = ({ value, onChange, onSelectFromDB, clients }) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleChange = (val) => {
    onChange(val);
    if (val.length >= 2) {
      const found = clients.filter(c => c.name.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(found);
      setOpen(found.length > 0);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} style={{position:"relative"}}>
      <input
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        placeholder="Escribe el nombre para buscar o ingresar cliente nuevo..."
        style={{width:"100%",padding:"8px 12px",border:`1px solid ${C.g300}`,borderRadius:8,fontSize:13,boxSizing:"border-box"}}
      />
      {open && suggestions.length > 0 && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"white",border:`1px solid ${C.g300}`,borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",zIndex:200,maxHeight:220,overflowY:"auto",marginTop:4}}>
          <div style={{padding:"6px 12px 4px",fontSize:11,color:C.g500,fontWeight:600,borderBottom:`1px solid ${C.g200}`,textTransform:"uppercase",letterSpacing:"0.4px"}}>
            Clientes en base de datos
          </div>
          {suggestions.map(c => (
            <button
              key={c.id}
              onClick={() => { onSelectFromDB(c); setOpen(false); setSuggestions([]); }}
              style={{width:"100%",textAlign:"left",padding:"10px 12px",border:"none",background:"none",cursor:"pointer",borderBottom:`1px solid ${C.g100}`,display:"block"}}
              onMouseEnter={e => e.currentTarget.style.background = C.g100}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <div style={{fontWeight:600,fontSize:13,color:C.g900}}>{c.name}</div>
              <div style={{fontSize:11,color:C.g500,marginTop:2}}>
                <span style={{background:c.type==="Público"?"#E3F2FD":"#F3E5F5",color:c.type==="Público"?"#1565C0":"#6A1B9A",padding:"1px 6px",borderRadius:10,fontSize:10,fontWeight:600,marginRight:6}}>{c.type}</span>
                {c.city} · {c.contact}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const login = () => {
    setLoading(true); setErr("");
    setTimeout(() => {
      const found = USERS.find(u => u.username === user && u.password === pass);
      if (found) onLogin(found);
      else { setErr("Usuario o contraseña incorrectos"); setLoading(false); }
    }, 500);
  };

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg, ${C.sidebar} 0%, ${C.primary} 55%, ${C.accent} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{width:420,background:"white",borderRadius:20,padding:48,boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src={LOGO_COLOR} alt="EQUIMED" style={{height:56,objectFit:"contain",marginBottom:10}}/>
          <p style={{color:C.g500,margin:0,fontSize:13}}>Sistema de Gestión Médica</p>
        </div>
        <h2 style={{textAlign:"center",color:C.g900,margin:"0 0 28px",fontSize:19,fontWeight:600}}>Iniciar Sesión</h2>
        <div style={{marginBottom:18}}>
          <label style={{fontSize:11,fontWeight:700,color:C.g700,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.5px"}}>Usuario</label>
          <input value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Ingresa tu usuario" style={{width:"100%",padding:"11px 13px",border:`1.5px solid ${C.g300}`,borderRadius:9,fontSize:14,boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:24,position:"relative"}}>
          <label style={{fontSize:11,fontWeight:700,color:C.g700,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.5px"}}>Contraseña</label>
          <input type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Ingresa tu contraseña" style={{width:"100%",padding:"11px 40px 11px 13px",border:`1.5px solid ${C.g300}`,borderRadius:9,fontSize:14,boxSizing:"border-box"}}/>
          <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:12,top:34,background:"none",border:"none",cursor:"pointer",color:C.g500,padding:4}}>
            <Icon name="eye" size={16} color={C.g500}/>
          </button>
        </div>
        {err && (
          <div style={{background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:8,padding:"9px 13px",marginBottom:18,fontSize:13,color:"#DC2626",display:"flex",alignItems:"center",gap:8}}>
            <Icon name="alert" size={15} color="#DC2626"/> {err}
          </div>
        )}
        <button onClick={login} disabled={loading||!user||!pass} style={{width:"100%",padding:13,borderRadius:9,border:"none",background:(!user||!pass)?C.g300:C.primary,color:"white",fontSize:14,fontWeight:600,cursor:(!user||!pass)?"not-allowed":"pointer"}}>
          {loading?"Verificando...":"Ingresar"}
        </button>
        <div style={{marginTop:24,padding:14,background:C.g100,borderRadius:9,fontSize:12,color:C.g500}}>
          <p style={{margin:"0 0 5px",fontWeight:700,color:C.g700}}>Accesos disponibles:</p>
          <p style={{margin:"0 0 3px"}}>Administrador: <b>admin</b> / <b>equimed2026</b></p>
          <p style={{margin:0}}>Auxiliar: <b>auxiliar1</b> / <b>aux2026</b></p>
        </div>
        <p style={{textAlign:"center",marginTop:20,color:C.g500,fontSize:10}}>Mejorando el cuidado de la salud con tecnología avanzada.</p>
      </div>
    </div>
  );
};

const Dashboard = ({ quotes }) => {
  const [yr, setYr] = useState("2026");
  const [mo, setMo] = useState("all");
  const fil = quotes.filter(q => q.date.getFullYear().toString()===yr && (mo==="all"||q.date.getMonth()===parseInt(mo)));
  const byType = t => fil.filter(q=>q.type===t).length;
  const monthly = t => MONTHS.map((_,i)=>quotes.filter(q=>q.type===t&&q.date.getFullYear().toString()===yr&&q.date.getMonth()===i).length);
  const yearly  = t => [2024,2025,2026].map(y=>quotes.filter(q=>q.type===t&&q.date.getFullYear()===y).length);
  const cards = [
    {label:"Mantenimientos",type:"Mantenimiento",color:"#E65100",light:"#FFF3E0",icon:"maintenance"},
    {label:"Arrendamientos",type:"Arrendamiento",color:"#6A1B9A",light:"#F3E5F5",icon:"rental"},
    {label:"Garantías",type:"Garantía",color:"#01579B",light:"#E1F5FE",icon:"warranty"},
    {label:"Ventas",type:"Venta",color:"#1B5E20",light:"#E8F5E9",icon:"package"},
  ];
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:700,color:C.g900,margin:0}}>Dashboard General</h2>
          <p style={{color:C.g500,margin:"4px 0 0",fontSize:14}}>Resumen ejecutivo de operaciones</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <select value={yr} onChange={e=>setYr(e.target.value)} style={{padding:"8px 12px",border:`1px solid ${C.g300}`,borderRadius:8,fontSize:13,background:"white",cursor:"pointer"}}>
            <option>2024</option><option>2025</option><option>2026</option>
          </select>
          <select value={mo} onChange={e=>setMo(e.target.value)} style={{padding:"8px 12px",border:`1px solid ${C.g300}`,borderRadius:8,fontSize:13,background:"white",cursor:"pointer"}}>
            <option value="all">Todos los meses</option>
            {FULL_MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
        <div style={{background:C.primary,borderRadius:12,padding:"20px 24px",color:"white"}}>
          <p style={{margin:"0 0 6px",fontSize:13,opacity:.8}}>Total Cotizaciones</p>
          <p style={{margin:0,fontSize:36,fontWeight:700}}>{fil.length}</p>
        </div>
        <div style={{background:C.accent,borderRadius:12,padding:"20px 24px",color:"white"}}>
          <p style={{margin:"0 0 6px",fontSize:13,opacity:.8}}>Ingresos Totales</p>
          <p style={{margin:0,fontSize:28,fontWeight:700}}>{fmt(fil.reduce((s,q)=>s+q.total,0))}</p>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
        {cards.map(card=>(
          <div key={card.type} style={{background:"white",borderRadius:12,padding:20,border:`1px solid ${C.g200}`,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <p style={{margin:"0 0 4px",fontSize:11,color:C.g500,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>{card.label}</p>
                <p style={{margin:0,fontSize:32,fontWeight:700,color:C.g900}}>{byType(card.type)}</p>
              </div>
              <div style={{background:card.light,width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name={card.icon} size={20} color={card.color}/>
              </div>
            </div>
            <MiniBarChart data={monthly(card.type)} color={card.color}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              {MONTHS.slice(0,6).map((m,i)=><span key={i} style={{fontSize:9,color:C.g500}}>{m}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"white",borderRadius:12,padding:24,border:`1px solid ${C.g200}`,marginBottom:24}}>
        <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:600,color:C.g900}}>Resumen por Mes — {yr}</h3>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${C.g200}`}}>
                <th style={{textAlign:"left",padding:"8px 12px",color:C.g500,fontWeight:600}}>Mes</th>
                {cards.map(c=><th key={c.type} style={{textAlign:"center",padding:"8px 12px",color:c.color,fontWeight:600}}>{c.label}</th>)}
                <th style={{textAlign:"center",padding:"8px 12px",color:C.g500,fontWeight:600}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {FULL_MONTHS.map((month,i)=>{
                const row = cards.map(c=>quotes.filter(q=>q.type===c.type&&q.date.getFullYear().toString()===yr&&q.date.getMonth()===i).length);
                const tot = row.reduce((a,b)=>a+b,0);
                return (
                  <tr key={i} style={{borderBottom:`1px solid ${C.g200}`,background:i%2===0?C.g100:"white"}}>
                    <td style={{padding:"8px 12px",fontWeight:500,color:C.g900}}>{month}</td>
                    {row.map((v,j)=><td key={j} style={{textAlign:"center",padding:"8px 12px",color:v>0?cards[j].color:C.g300,fontWeight:v>0?600:400}}>{v}</td>)}
                    <td style={{textAlign:"center",padding:"8px 12px",fontWeight:700,color:tot>0?C.g900:C.g300}}>{tot}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{background:"white",borderRadius:12,padding:24,border:`1px solid ${C.g200}`}}>
        <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:600,color:C.g900}}>Comparativo Anual por Tipo</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {cards.map(c=>{
            const data=yearly(c.type); const max=Math.max(...data,1);
            return (
              <div key={c.type}>
                <p style={{margin:"0 0 12px",fontSize:12,fontWeight:600,color:C.g700}}>{c.label}</p>
                {[2024,2025,2026].map((y,i)=>(
                  <div key={y} style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,color:C.g500}}>{y}</span>
                      <span style={{fontSize:12,fontWeight:600,color:C.g900}}>{data[i]}</span>
                    </div>
                    <div style={{height:6,background:C.g200,borderRadius:3}}>
                      <div style={{height:"100%",width:`${(data[i]/max)*100}%`,background:c.color,borderRadius:3,transition:"width 0.5s"}}/>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const QuoteForm = ({ onSave, onCancel, editQuote, clients, products, onAddClient, nextCorrelative }) => {
  const blank = {
    correlative:nextCorrelative, date:new Date().toISOString().split("T")[0],
    clientId:null, clientName:"", clientAddress:"", deliveryAddress:"",
    deliveryType:"Ciudad", type:"Venta", category:"Privado",
    items:[{productId:"",description:"",qty:1,unitPrice:0}],
    discount:0, hasDiscount:false, observations:"", signerName:"", status:"Borrador",
  };
  const [form, setForm] = useState(editQuote||blank);
  const [clientSaved, setClientSaved] = useState(!!editQuote?.clientId);
  const [showNewFields, setShowNewFields] = useState(false);
  const [newCD, setNewCD] = useState({phone:"",email:"",contact:""});
  const [copied, setCopied] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const subTotal = form.items.reduce((s,it)=>s+(it.qty*it.unitPrice),0);
  const discAmt  = form.hasDiscount?(subTotal*form.discount/100):0;
  const total    = subTotal-discAmt;

  const addItem    = () => setForm(f=>({...f,items:[...f.items,{productId:"",description:"",qty:1,unitPrice:0}]}));
  const removeItem = i  => setForm(f=>({...f,items:f.items.filter((_,j)=>j!==i)}));
  const updItem    = (i,k,v) => setForm(f=>({...f,items:f.items.map((it,j)=>j===i?{...it,[k]:v}:it)}));

  const handleSelectFromDB = (c) => {
    setForm(f=>({...f,clientId:c.id,clientName:c.name,clientAddress:c.address,category:c.type}));
    setClientSaved(true); setShowNewFields(false);
  };

  const handleNameChange = (val) => {
    setForm(f=>({...f,clientName:val,clientId:null}));
    setClientSaved(false);
    if (val.length>3) {
      const exact = clients.find(c=>c.name.toLowerCase()===val.toLowerCase());
      setShowNewFields(!exact);
    } else { setShowNewFields(false); }
  };

  const saveNewClient = () => {
    const nc = {id:Date.now(),name:form.clientName,type:form.category,address:form.clientAddress,city:"",phone:newCD.phone,email:newCD.email,contact:newCD.contact};
    onAddClient(nc);
    setForm(f=>({...f,clientId:nc.id}));
    setClientSaved(true); setShowNewFields(false);
  };

  const selectProduct = (i,pid) => {
    const p=products.find(p=>p.id===pid);
    if(p){
      const price=form.category==="Público"?p.pricePublic:p.pricePrivate;
      updItem(i,"productId",pid); updItem(i,"description",p.description); updItem(i,"unitPrice",price);
    }
  };

  const emailText=`Estimado/a ${form.clientName||"[Cliente]"},\n\nNos complace enviarle la siguiente cotización:\n\n📋 Cotización No. ${form.correlative}\n📅 Fecha: ${fmtD(new Date(form.date))}\n🏥 Para: ${form.clientName||"[Cliente]"}\n📦 Tipo: ${form.type}\n\nDETALLE:\n${form.items.map(it=>`• ${it.description||"[Producto]"} — Cant: ${it.qty} — ${fmt(it.unitPrice)}`).join("\n")}\n\n${form.hasDiscount&&form.discount>0?`Descuento: ${form.discount}%\n`:""}TOTAL: ${fmt(total)}\n\n${form.observations?`Observaciones: ${form.observations}\n`:""}\nAtentamente,\nEquipo Comercial EQUIMED\n_________________________\nMejorando el cuidado de la salud con tecnología avanzada.`;

  const inp = {width:"100%",padding:"8px 12px",border:`1px solid ${C.g300}`,borderRadius:8,fontSize:13,boxSizing:"border-box"};
  const lbl = {fontSize:12,color:C.g500,display:"block",marginBottom:4};

  return (
    <div style={{padding:24,maxWidth:920,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src={LOGO_COLOR} alt="EQUIMED" style={{height:42,objectFit:"contain"}}/>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.g900}}>{editQuote?`Editar ${form.correlative}`:"Nueva Cotización"}</h2>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onCancel} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.g300}`,background:"white",cursor:"pointer",color:C.g700,fontSize:13}}>Cancelar</button>
          <button onClick={()=>onSave({...form,total})} style={{padding:"8px 16px",borderRadius:8,border:"none",background:C.primary,cursor:"pointer",color:"white",fontSize:13,fontWeight:600}}>Guardar Cotización</button>
        </div>
      </div>

      <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,padding:24,marginBottom:16}}>
        <h3 style={{margin:"0 0 16px",fontSize:13,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:"0.5px"}}>Encabezado</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          <div>
            <label style={lbl}>Correlativo</label>
            <input value={form.correlative} readOnly style={{...inp,background:C.g100,fontFamily:"monospace"}}/>
          </div>
          <div>
            <label style={lbl}>Fecha</label>
            <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={inp}/>
          </div>
          <div>
            <label style={lbl}>Tipo de Operación</label>
            <select value={form.type} onChange={e=>set("type",e.target.value)} style={inp}>
              <option>Venta</option><option>Mantenimiento</option><option>Arrendamiento</option><option>Garantía</option>
            </select>
          </div>
        </div>

        <div style={{marginTop:20,background:C.g100,borderRadius:10,padding:16,border:`1px solid ${C.g200}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{margin:0,fontSize:13,fontWeight:700,color:C.g700}}>Cliente / Hospital / Clínica / Doctor</p>
            {clientSaved && (
              <span style={{background:"#E8F5E9",color:"#2E7D32",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
                <Icon name="user-check" size={12} color="#2E7D32"/> En base de datos
              </span>
            )}
            {!clientSaved && form.clientName.length>2 && (
              <span style={{background:"#FFF3E0",color:"#E65100",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20}}>
                Cliente nuevo
              </span>
            )}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <label style={lbl}>Nombre del Hospital / Clínica / Doctor</label>
              <ClientSearch
                value={form.clientName}
                onChange={handleNameChange}
                onSelectFromDB={handleSelectFromDB}
                clients={clients}
              />
              <p style={{margin:"5px 0 0",fontSize:11,color:C.g500}}>
                Si ya existe en la BD, aparecerá para seleccionarlo. Si es nuevo, completa los datos adicionales.
              </p>
            </div>
            <div>
              <label style={lbl}>Categoría del Cliente</label>
              <select value={form.category} onChange={e=>set("category",e.target.value)} style={inp}>
                <option value="Privado">Privado</option>
                <option value="Público">Público (Entidad Gubernamental)</option>
              </select>
            </div>
          </div>

          {showNewFields && !clientSaved && form.clientName.length>2 && (
            <div style={{marginTop:14,padding:14,background:"white",border:`1.5px dashed ${C.accent}`,borderRadius:8}}>
              <p style={{margin:"0 0 10px",fontSize:12,fontWeight:700,color:C.accent}}>
                Cliente nuevo — completa los datos para guardarlo en la base de datos
              </p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[["phone","Teléfono","Ej: 2345-6789"],["email","Correo","correo@ejemplo.com"],["contact","Persona de contacto","Nombre del contacto"]].map(([k,label,ph])=>(
                  <div key={k}>
                    <label style={lbl}>{label}</label>
                    <input value={newCD[k]} onChange={e=>setNewCD(d=>({...d,[k]:e.target.value}))} placeholder={ph} style={inp}/>
                  </div>
                ))}
              </div>
              <button onClick={saveNewClient} style={{marginTop:10,padding:"7px 16px",borderRadius:8,border:"none",background:C.accent,color:"white",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                <Icon name="user-check" size={13} color="white"/> Guardar cliente en base de datos
              </button>
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:14}}>
            <div>
              <label style={lbl}>Dirección de la institución</label>
              <input value={form.clientAddress} onChange={e=>set("clientAddress",e.target.value)} placeholder="Dirección principal" style={inp}/>
            </div>
            <div>
              <label style={lbl}>Firmante / Responsable</label>
              <input value={form.signerName} onChange={e=>set("signerName",e.target.value)} placeholder="Nombre del firmante" style={inp}/>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"end",marginTop:14}}>
            <div>
              <label style={lbl}>Dirección de Entrega</label>
              <input value={form.deliveryAddress} onChange={e=>set("deliveryAddress",e.target.value)} placeholder="Dirección de entrega del equipo" style={inp}/>
            </div>
            <div style={{display:"flex",gap:16,paddingBottom:8}}>
              {["Ciudad","Departamental"].map(t=>(
                <label key={t} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:13}}>
                  <input type="radio" name="delType" value={t} checked={form.deliveryType===t} onChange={()=>set("deliveryType",t)}/> {t}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,padding:24,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{margin:0,fontSize:13,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:"0.5px"}}>Detalle de Productos / Servicios</h3>
          <button onClick={addItem} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,border:`1px solid ${C.primary}`,background:"white",color:C.primary,cursor:"pointer",fontSize:12,fontWeight:600}}>
            <Icon name="plus" size={14} color={C.primary}/> Agregar ítem
          </button>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{borderBottom:`2px solid ${C.g200}`}}>
              {["Producto (BD)","Descripción","Cant.","Precio Unit.","Subtotal",""].map((h,i)=>(
                <th key={i} style={{textAlign:i>1?"center":"left",padding:"8px",color:C.g500,fontWeight:600}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.items.map((it,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.g200}`}}>
                <td style={{padding:8}}>
                  <select value={it.productId} onChange={e=>selectProduct(i,e.target.value)} style={{width:"100%",padding:"6px 8px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:12,boxSizing:"border-box"}}>
                    <option value="">— Seleccionar —</option>
                    {products.map(p=><option key={p.id} value={p.id}>{p.id} — {p.name.substring(0,28)}…</option>)}
                  </select>
                </td>
                <td style={{padding:8}}>
                  <input value={it.description} onChange={e=>updItem(i,"description",e.target.value)} placeholder="Descripción" style={{width:"100%",padding:"6px 8px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:12,boxSizing:"border-box"}}/>
                </td>
                <td style={{padding:8}}>
                  <input type="number" min="1" value={it.qty} onChange={e=>updItem(i,"qty",parseInt(e.target.value)||1)} style={{width:"100%",padding:"6px 8px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:12,textAlign:"center",boxSizing:"border-box"}}/>
                </td>
                <td style={{padding:8}}>
                  <input type="number" value={it.unitPrice} onChange={e=>updItem(i,"unitPrice",parseFloat(e.target.value)||0)} style={{width:"100%",padding:"6px 8px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:12,textAlign:"right",boxSizing:"border-box"}}/>
                </td>
                <td style={{padding:8,textAlign:"right",fontWeight:600,color:C.g900}}>{fmt(it.qty*it.unitPrice)}</td>
                <td style={{padding:8}}>
                  {form.items.length>1&&<button onClick={()=>removeItem(i)} style={{background:"none",border:"none",cursor:"pointer",padding:2}}><Icon name="trash" size={14} color={C.danger}/></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
          <div style={{minWidth:280}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13}}>
              <span style={{color:C.g500}}>Subtotal:</span><span style={{fontWeight:600}}>{fmt(subTotal)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",fontSize:13}}>
              <label style={{display:"flex",alignItems:"center",gap:8,color:C.g500,cursor:"pointer"}}>
                <input type="checkbox" checked={form.hasDiscount} onChange={e=>set("hasDiscount",e.target.checked)}/> Descuento (%):
              </label>
              {form.hasDiscount&&<input type="number" min="0" max="100" value={form.discount} onChange={e=>set("discount",parseFloat(e.target.value)||0)} style={{width:70,padding:"4px 8px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:13,textAlign:"right"}}/>}
            </div>
            {form.hasDiscount&&form.discount>0&&(
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.danger,padding:"4px 0"}}>
                <span>— Descuento ({form.discount}%):</span><span>— {fmt(discAmt)}</span>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:16,borderTop:`2px solid ${C.g200}`,marginTop:4}}>
              <span style={{fontWeight:700,color:C.g900}}>TOTAL:</span>
              <span style={{fontWeight:700,color:C.primary}}>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,padding:24,marginBottom:16}}>
        <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:"0.5px"}}>Observaciones y Firma</h3>
        <textarea value={form.observations} onChange={e=>set("observations",e.target.value)} rows={3} placeholder="Notas adicionales, condiciones especiales, etc." style={{width:"100%",padding:"8px 12px",border:`1px solid ${C.g300}`,borderRadius:8,fontSize:13,resize:"vertical",boxSizing:"border-box"}}/>
      </div>

      <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{margin:0,fontSize:13,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:"0.5px"}}>Texto para Correo Electrónico</h3>
          <button onClick={()=>{navigator.clipboard?.writeText(emailText);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,border:`1px solid ${C.accent}`,background:"white",color:C.accent,cursor:"pointer",fontSize:12,fontWeight:600}}>
            <Icon name="copy" size={14} color={C.accent}/> {copied?"¡Copiado!":"Copiar Texto"}
          </button>
        </div>
        <pre style={{background:C.g100,border:`1px solid ${C.g200}`,borderRadius:8,padding:16,fontSize:12,color:C.g700,whiteSpace:"pre-wrap",margin:0,fontFamily:"monospace"}}>{emailText}</pre>
      </div>
    </div>
  );
};

const QuotesList = ({ quotes, onNew, onEdit, category }) => {
  const [search, setSearch] = useState("");
  const [fType, setFType] = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [fMonth, setFMonth] = useState("all");
  const fil = quotes
    .filter(q=>category==="all"||q.category===category)
    .filter(q=>!search||q.client.name.toLowerCase().includes(search.toLowerCase())||q.correlative.includes(search))
    .filter(q=>fType==="all"||q.type===fType)
    .filter(q=>fStatus==="all"||q.status===fStatus)
    .filter(q=>fMonth==="all"||q.date.getMonth()===parseInt(fMonth));
  const sel = {padding:"9px 12px",border:`1px solid ${C.g300}`,borderRadius:8,fontSize:13,background:"white",cursor:"pointer"};
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.g900}}>Cotizaciones{category!=="all"?` — ${category}`:""}</h2>
          <p style={{color:C.g500,margin:"4px 0 0",fontSize:14}}>{fil.length} registros</p>
        </div>
        <button onClick={onNew} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:8,border:"none",background:C.primary,color:"white",cursor:"pointer",fontSize:13,fontWeight:600}}>
          <Icon name="plus" size={16} color="white"/> Nueva Cotización
        </button>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Icon name="search" size={14} color={C.g500}/></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por cliente o correlativo…" style={{width:"100%",paddingLeft:36,padding:"9px 12px 9px 36px",border:`1px solid ${C.g300}`,borderRadius:8,fontSize:13,boxSizing:"border-box"}}/>
        </div>
        <select value={fType} onChange={e=>setFType(e.target.value)} style={sel}>
          <option value="all">Todos los tipos</option><option>Venta</option><option>Mantenimiento</option><option>Arrendamiento</option><option>Garantía</option>
        </select>
        <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={sel}>
          <option value="all">Todos los estados</option><option>Borrador</option><option>Autorizado</option><option>Finalizado</option>
        </select>
        <select value={fMonth} onChange={e=>setFMonth(e.target.value)} style={sel}>
          <option value="all">Todos los meses</option>
          {FULL_MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
        </select>
      </div>
      <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:C.g100,borderBottom:`2px solid ${C.g200}`}}>
              {["Correlativo","Cliente","Fecha","Tipo","Total","Estado","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"12px 16px",color:C.g700,fontWeight:600}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fil.map((q,i)=>(
              <tr key={q.id} style={{borderBottom:`1px solid ${C.g200}`,background:i%2===0?"white":C.g100}}>
                <td style={{padding:"12px 16px",fontWeight:600,color:C.primary,fontFamily:"monospace"}}>{q.correlative}</td>
                <td style={{padding:"12px 16px"}}>
                  <div style={{fontWeight:500,color:C.g900}}>{q.client.name}</div>
                  <div style={{fontSize:11,color:C.g500}}>{q.client.city}</div>
                </td>
                <td style={{padding:"12px 16px",color:C.g700}}>{fmtD(q.date)}</td>
                <td style={{padding:"12px 16px"}}><TypeBadge type={q.type}/></td>
                <td style={{padding:"12px 16px",fontWeight:600,color:C.g900}}>{fmt(q.total)}</td>
                <td style={{padding:"12px 16px"}}><StatusBadge status={q.status}/></td>
                <td style={{padding:"12px 16px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>onEdit(q)} title="Editar" style={{background:"none",border:`1px solid ${C.g300}`,borderRadius:6,padding:"4px 8px",cursor:"pointer"}}><Icon name="edit" size={13} color={C.g700}/></button>
                    <button title="PDF" style={{background:"none",border:`1px solid ${C.g300}`,borderRadius:6,padding:"4px 8px",cursor:"pointer"}}><Icon name="download" size={13} color={C.g700}/></button>
                    <button title="Imprimir" style={{background:"none",border:`1px solid ${C.g300}`,borderRadius:6,padding:"4px 8px",cursor:"pointer"}}><Icon name="print" size={13} color={C.g700}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {fil.length===0&&<div style={{padding:40,textAlign:"center",color:C.g500}}><Icon name="search" size={32} color={C.g300}/><p style={{margin:"12px 0 0"}}>No se encontraron cotizaciones</p></div>}
      </div>
    </div>
  );
};

const ClientsDB = ({ clients, onAddClient, user }) => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nc, setNc] = useState({name:"",type:"Privado",address:"",city:"Guatemala",phone:"",email:"",contact:""});
  const fil = clients.filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase()));
  const isAdmin = user?.role==="admin";
  const exportCSV = () => {
    const rows=[["ID","Nombre","Tipo","Ciudad","Teléfono","Correo","Contacto"],...clients.map(c=>[c.id,c.name,c.type,c.city,c.phone,c.email,c.contact])];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download="clientes_equimed.csv"; a.click();
  };
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.g900}}>Base de Datos — Clientes</h2>
        <div style={{display:"flex",gap:8}}>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:`1px solid ${C.g300}`,background:"white",color:C.g700,cursor:"pointer",fontSize:12}}>
            <Icon name="upload" size={14} color={C.g700}/> Importar Excel
          </button>
          {isAdmin&&(
            <button onClick={exportCSV} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:`1px solid ${C.success}`,background:"white",color:C.success,cursor:"pointer",fontSize:12,fontWeight:600}}>
              <Icon name="download" size={14} color={C.success}/> Exportar Excel
            </button>
          )}
          <button onClick={()=>setShowForm(s=>!s)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:"none",background:C.primary,color:"white",cursor:"pointer",fontSize:12,fontWeight:600}}>
            <Icon name="plus" size={14} color="white"/> Nuevo Cliente
          </button>
        </div>
      </div>
      {showForm&&(
        <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,padding:20,marginBottom:20}}>
          <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:C.g900}}>Agregar Nuevo Cliente</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[["name","Nombre"],["type","Tipo","select"],["address","Dirección"],["city","Ciudad"],["phone","Teléfono"],["email","Correo"],["contact","Contacto"]].map(([k,label,type])=>(
              <div key={k}>
                <label style={{fontSize:11,color:C.g500,display:"block",marginBottom:3}}>{label}</label>
                {type==="select"
                  ?<select value={nc[k]} onChange={e=>setNc(f=>({...f,[k]:e.target.value}))} style={{width:"100%",padding:"7px 10px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:12,boxSizing:"border-box"}}><option>Privado</option><option>Público</option></select>
                  :<input value={nc[k]} onChange={e=>setNc(f=>({...f,[k]:e.target.value}))} style={{width:"100%",padding:"7px 10px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:12,boxSizing:"border-box"}}/>
                }
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={()=>{if(nc.name){onAddClient({...nc,id:Date.now()});setShowForm(false);setNc({name:"",type:"Privado",address:"",city:"Guatemala",phone:"",email:"",contact:""});}}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:C.primary,color:"white",cursor:"pointer",fontSize:12,fontWeight:600}}>Guardar</button>
            <button onClick={()=>setShowForm(false)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.g300}`,background:"white",cursor:"pointer",fontSize:12}}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={{position:"relative",marginBottom:16}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Icon name="search" size={14} color={C.g500}/></div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente…" style={{width:"100%",paddingLeft:36,padding:"9px 12px 9px 36px",border:`1px solid ${C.g300}`,borderRadius:8,fontSize:13,boxSizing:"border-box"}}/>
      </div>
      <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:C.g100,borderBottom:`2px solid ${C.g200}`}}>
              {["Nombre / Institución","Tipo","Ciudad","Teléfono","Correo","Contacto",""].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"12px 16px",color:C.g700,fontWeight:600}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fil.map((c,i)=>(
              <tr key={c.id} style={{borderBottom:`1px solid ${C.g200}`,background:i%2===0?"white":C.g100}}>
                <td style={{padding:"12px 16px",fontWeight:600,color:C.g900}}>{c.name}</td>
                <td style={{padding:"12px 16px"}}><span style={{background:c.type==="Público"?"#E3F2FD":"#F3E5F5",color:c.type==="Público"?"#1565C0":"#6A1B9A",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20}}>{c.type}</span></td>
                <td style={{padding:"12px 16px",color:C.g700}}>{c.city}</td>
                <td style={{padding:"12px 16px",color:C.g700}}>{c.phone}</td>
                <td style={{padding:"12px 16px",color:C.primary}}>{c.email}</td>
                <td style={{padding:"12px 16px",color:C.g700}}>{c.contact}</td>
                <td style={{padding:"12px 16px"}}><button style={{background:"none",border:`1px solid ${C.g300}`,borderRadius:6,padding:"4px 8px",cursor:"pointer"}}><Icon name="edit" size={13} color={C.g700}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductsDB = ({ products, onAddProduct, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [np, setNp] = useState({id:"",name:"",description:"",pricePublic:0,pricePrivate:0,category:""});
  const isAdmin = user?.role==="admin";
  const exportCSV = () => {
    const rows=[["Código","Nombre","Descripción","P. Público","P. Privado","Categoría"],...products.map(p=>[p.id,p.name,p.description,p.pricePublic,p.pricePrivate,p.category])];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download="productos_equimed.csv"; a.click();
  };
  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.g900}}>Base de Datos — Productos y Equipos</h2>
        <div style={{display:"flex",gap:8}}>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:`1px solid ${C.g300}`,background:"white",color:C.g700,cursor:"pointer",fontSize:12}}>
            <Icon name="upload" size={14} color={C.g700}/> Importar Excel
          </button>
          {isAdmin&&(
            <button onClick={exportCSV} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:`1px solid ${C.success}`,background:"white",color:C.success,cursor:"pointer",fontSize:12,fontWeight:600}}>
              <Icon name="download" size={14} color={C.success}/> Exportar Excel
            </button>
          )}
          <button onClick={()=>setShowForm(s=>!s)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:"none",background:C.primary,color:"white",cursor:"pointer",fontSize:12,fontWeight:600}}>
            <Icon name="plus" size={14} color="white"/> Nuevo Producto
          </button>
        </div>
      </div>
      {showForm&&(
        <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,padding:20,marginBottom:20}}>
          <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:C.g900}}>Agregar Nuevo Producto</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["id","Código"],["name","Nombre"],["pricePublic","Precio Público","number"],["pricePrivate","Precio Privado","number"],["category","Categoría"]].map(([k,label,type])=>(
              <div key={k}>
                <label style={{fontSize:11,color:C.g500,display:"block",marginBottom:3}}>{label}</label>
                <input type={type==="number"?"number":"text"} value={np[k]} onChange={e=>setNp(f=>({...f,[k]:type==="number"?parseFloat(e.target.value):e.target.value}))} style={{width:"100%",padding:"7px 10px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:12,boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:11,color:C.g500,display:"block",marginBottom:3}}>Descripción</label>
              <textarea value={np.description} onChange={e=>setNp(f=>({...f,description:e.target.value}))} rows={2} style={{width:"100%",padding:"7px 10px",border:`1px solid ${C.g300}`,borderRadius:6,fontSize:12,resize:"vertical",boxSizing:"border-box"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={()=>{if(np.id&&np.name){onAddProduct(np);setShowForm(false);setNp({id:"",name:"",description:"",pricePublic:0,pricePrivate:0,category:""});}}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:C.primary,color:"white",cursor:"pointer",fontSize:12,fontWeight:600}}>Guardar</button>
            <button onClick={()=>setShowForm(false)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.g300}`,background:"white",cursor:"pointer",fontSize:12}}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        {products.map(p=>(
          <div key={p.id} style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`}}>
            <div style={{background:C.g100,height:90,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"12px 12px 0 0"}}>
              <Icon name="package" size={36} color={C.g300}/>
            </div>
            <div style={{padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{background:C.g200,color:C.g700,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,fontFamily:"monospace"}}>{p.id}</span>
                <span style={{fontSize:11,color:C.g500}}>{p.category}</span>
              </div>
              <p style={{margin:"0 0 6px",fontWeight:600,fontSize:13,color:C.g900}}>{p.name}</p>
              <p style={{margin:"0 0 12px",fontSize:11,color:C.g500,lineHeight:1.4}}>{p.description}</p>
              <div style={{borderTop:`1px solid ${C.g200}`,paddingTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div><p style={{margin:0,fontSize:10,color:C.g500}}>Público</p><p style={{margin:0,fontSize:13,fontWeight:700,color:"#1565C0"}}>{fmt(p.pricePublic)}</p></div>
                <div><p style={{margin:0,fontSize:10,color:C.g500}}>Privado</p><p style={{margin:0,fontSize:13,fontWeight:700,color:"#6A1B9A"}}>{fmt(p.pricePrivate)}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GenericSection = ({ title, quotes, type, showCalendar }) => {
  const [subtab, setSubtab] = useState("lista");
  const filtered = quotes.filter(q=>q.type===type);
  return (
    <div style={{padding:24}}>
      <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:700,color:C.g900}}>{title}</h2>
      {showCalendar&&(
        <div style={{display:"flex",gap:4,marginBottom:24,borderBottom:`2px solid ${C.g200}`}}>
          {[{id:"lista",label:"Listado"},{id:"seguimiento",label:"Seguimiento"}].map(t=>(
            <button key={t.id} onClick={()=>setSubtab(t.id)} style={{padding:"10px 18px",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:subtab===t.id?600:400,color:subtab===t.id?C.primary:C.g500,borderBottom:subtab===t.id?`2px solid ${C.primary}`:"2px solid transparent",marginBottom:-2}}>
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:C.g100,borderBottom:`2px solid ${C.g200}`}}>
              {["Correlativo","Cliente","Fecha","Total","Estado","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"12px 16px",color:C.g700,fontWeight:600}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0,12).map((q,i)=>(
              <tr key={q.id} style={{borderBottom:`1px solid ${C.g200}`,background:i%2===0?"white":C.g100}}>
                <td style={{padding:"12px 16px",fontWeight:600,color:C.primary,fontFamily:"monospace"}}>{q.correlative}</td>
                <td style={{padding:"12px 16px",fontWeight:500,color:C.g900}}>{q.client.name}</td>
                <td style={{padding:"12px 16px",color:C.g700}}>{fmtD(q.date)}</td>
                <td style={{padding:"12px 16px",fontWeight:600}}>{fmt(q.total)}</td>
                <td style={{padding:"12px 16px"}}><StatusBadge status={q.status}/></td>
                <td style={{padding:"12px 16px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{background:"none",border:`1px solid ${C.g300}`,borderRadius:6,padding:"4px 8px",cursor:"pointer"}}><Icon name="edit" size={13} color={C.g700}/></button>
                    {(type==="Mantenimiento"||type==="Arrendamiento")&&(
                      <button title="Google Calendar" style={{background:"none",border:`1px solid ${C.g300}`,borderRadius:6,padding:"4px 8px",cursor:"pointer"}}><Icon name="google-cal" size={13} color="#4285F4"/></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:32,textAlign:"center",color:C.g500}}>No hay registros de tipo {type}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UnopsSection = () => {
  const [tab, setTab] = useState("ordenes");
  const tabs=[{id:"ordenes",label:"Órdenes de Compra"},{id:"facturacion",label:"Facturación"},{id:"entregas",label:"Entregas"},{id:"garantias",label:"Garantías"}];
  return (
    <div style={{padding:24}}>
      <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:700,color:C.g900}}>UNOPS</h2>
      <div style={{display:"flex",gap:4,marginBottom:24,borderBottom:`2px solid ${C.g200}`}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 18px",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?600:400,color:tab===t.id?C.primary:C.g500,borderBottom:tab===t.id?`2px solid ${C.primary}`:"2px solid transparent",marginBottom:-2}}>{t.label}</button>
        ))}
      </div>
      <div style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,padding:32,textAlign:"center",color:C.g500}}>
        <Icon name="file" size={40} color={C.g300}/>
        <p style={{margin:"12px 0 0",fontWeight:600,color:C.g700}}>Sección: {tabs.find(t=>t.id===tab)?.label}</p>
        <p style={{margin:"6px 0 0",fontSize:13}}>Aquí se gestiona la documentación UNOPS correspondiente.</p>
      </div>
    </div>
  );
};

const TrainingSection = () => (
  <div style={{padding:24}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.g900}}>Capacitaciones</h2>
      <button style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:"none",background:C.primary,color:"white",cursor:"pointer",fontSize:12,fontWeight:600}}><Icon name="plus" size={14} color="white"/> Nueva Capacitación</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
      {[{title:"Capacitación Ventiladores",client:"Hospital Roosevelt",date:"2026-05-20",region:"Ciudad"},
        {title:"Uso Monitor MS-500",client:"Clínica Santa Lucía",date:"2026-05-28",region:"Ciudad"},
        {title:"Mantenimiento Preventivo",client:"Centro Médico Quetzal.",date:"2026-06-05",region:"Departamental"}].map((c,i)=>(
        <div key={i} style={{background:"white",borderRadius:12,border:`1px solid ${C.g200}`,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <span style={{background:c.region==="Ciudad"?"#E3F2FD":"#F3E5F5",color:c.region==="Ciudad"?"#1565C0":"#6A1B9A",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:20}}>{c.region}</span>
            <StatusBadge status="Borrador"/>
          </div>
          <h3 style={{margin:"0 0 6px",fontSize:14,fontWeight:600,color:C.g900}}>{c.title}</h3>
          <p style={{margin:"0 0 12px",fontSize:12,color:C.g500}}>{c.client}</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,color:C.g700}}>{c.date}</span>
            <button style={{display:"flex",alignItems:"center",gap:4,padding:"5px 8px",borderRadius:6,border:`1px solid ${C.g300}`,background:"white",cursor:"pointer",fontSize:11}}><Icon name="google-cal" size={12} color="#4285F4"/> Agendar</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [clients, setClients] = useState(initClients);
  const [products, setProducts] = useState(initProducts);
  const [quotes, setQuotes] = useState(()=>makeQuotes(initClients));
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSub, setActiveSub] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({cotizaciones:true});

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser}/>;

  const nextCorrelative = `2026-${String(quotes.length+1).padStart(4,"0")}`;
  const handleAddClient = (c) => setClients(cs=>[...cs,c]);

  const handleSaveQuote = (form) => {
    const clientObj = clients.find(c=>c.id===form.clientId)||{name:form.clientName,city:"—",type:form.category};
    if (editingQuote) {
      setQuotes(qs=>qs.map(q=>q.id===editingQuote.id?{...q,...form,date:new Date(form.date),client:clientObj}:q));
    } else {
      setQuotes(qs=>[{...form,id:qs.length+1,date:new Date(form.date),month:new Date(form.date).getMonth(),client:clientObj,category:form.category},...qs]);
    }
    setShowQuoteForm(false); setEditingQuote(null);
  };

  const nav = (section, sub=null) => { setActiveSection(section); setActiveSub(sub); setShowQuoteForm(false); setEditingQuote(null); };
  const toggleMenu = id => setExpandedMenus(m=>({...m,[id]:!m[id]}));

  const menuItems = [
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"cotizaciones",label:"Cotizaciones",icon:"quote",subs:[{id:"cot-publico",label:"Público"},{id:"cot-privado",label:"Privado"},{id:"cot-todas",label:"Todas"}]},
    {id:"mantenimientos",label:"Mantenimientos",icon:"maintenance"},
    {id:"arrendamientos",label:"Arrendamientos",icon:"rental"},
    {id:"garantias",label:"Garantías",icon:"warranty"},
    {id:"capacitaciones",label:"Capacitaciones",icon:"training"},
    {id:"unops",label:"UNOPS",icon:"unops"},
    {id:"base-datos",label:"Base de Datos",icon:"database",subs:[{id:"bd-clientes",label:"Clientes"},{id:"bd-productos",label:"Productos"}]},
  ];

  const renderContent = () => {
    if (showQuoteForm||editingQuote) return (
      <QuoteForm onSave={handleSaveQuote} onCancel={()=>{setShowQuoteForm(false);setEditingQuote(null);}}
        editQuote={editingQuote} clients={clients} products={products}
        onAddClient={handleAddClient} nextCorrelative={nextCorrelative}/>
    );
    switch(activeSection){
      case "dashboard":      return <Dashboard quotes={quotes}/>;
      case "cotizaciones":   return <QuotesList quotes={quotes} onNew={()=>setShowQuoteForm(true)} onEdit={q=>setEditingQuote(q)} category={activeSub==="cot-publico"?"Público":activeSub==="cot-privado"?"Privado":"all"}/>;
      case "mantenimientos": return <GenericSection title="Mantenimientos" quotes={quotes} type="Mantenimiento" showCalendar/>;
      case "arrendamientos": return <GenericSection title="Arrendamientos" quotes={quotes} type="Arrendamiento" showCalendar/>;
      case "garantias":      return <GenericSection title="Garantías" quotes={quotes} type="Garantía" showCalendar={false}/>;
      case "capacitaciones": return <TrainingSection/>;
      case "unops":          return <UnopsSection/>;
      case "base-datos":
        if(activeSub==="bd-productos") return <ProductsDB products={products} onAddProduct={p=>setProducts(ps=>[...ps,p])} user={currentUser}/>;
        return <ClientsDB clients={clients} onAddClient={handleAddClient} user={currentUser}/>;
      default: return <Dashboard quotes={quotes}/>;
    }
  };

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,overflow:"hidden"}}>
      <div style={{width:240,background:C.sidebar,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"22px 20px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <img src={LOGO_WHITE} alt="EQUIMED" style={{width:160,objectFit:"contain"}}/>
            <p style={{margin:0,color:"rgba(255,255,255,0.4)",fontSize:10}}>Sistema de Gestión</p>
          </div>
        </div>
        <nav style={{padding:"10px 0",flex:1}}>
          {menuItems.map(item=>{
            const isActive=activeSection===item.id;
            const isExp=expandedMenus[item.id];
            return (
              <div key={item.id}>
                <button
                  onClick={()=>{ if(item.subs){ toggleMenu(item.id); nav(item.id,item.subs[0].id); } else nav(item.id); }}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 20px",border:"none",background:isActive?"rgba(255,255,255,0.1)":"transparent",color:isActive?"white":"rgba(255,255,255,0.65)",cursor:"pointer",fontSize:13,fontWeight:isActive?600:400,textAlign:"left",borderLeft:isActive?`3px solid ${C.accent}`:"3px solid transparent"}}
                >
                  <Icon name={item.icon} size={16} color={isActive?"white":"rgba(255,255,255,0.5)"}/>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.subs&&<Icon name={isExp?"chevron-down":"chevron-right"} size={12} color="rgba(255,255,255,0.3)"/>}
                </button>
                {item.subs&&isExp&&(
                  <div style={{background:"rgba(0,0,0,0.15)"}}>
                    {item.subs.map(sub=>(
                      <button key={sub.id} onClick={()=>nav(item.id,sub.id)} style={{width:"100%",display:"flex",alignItems:"center",padding:"8px 20px 8px 46px",border:"none",background:activeSub===sub.id?"rgba(255,255,255,0.08)":"transparent",color:activeSub===sub.id?"white":"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:12,textAlign:"left"}}>
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{padding:"14px 20px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <p style={{margin:0,color:"rgba(255,255,255,0.3)",fontSize:9,textAlign:"center",lineHeight:1.6}}>Mejorando el cuidado de la salud<br/>con tecnología avanzada.</p>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",background:C.bg}}>
        <div style={{background:"white",borderBottom:`1px solid ${C.g200}`,padding:"11px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <span style={{color:C.g500,fontSize:13}}>
            {menuItems.find(m=>m.id===activeSection)?.label}
            {activeSub&&` › ${menuItems.find(m=>m.id===activeSection)?.subs?.find(s=>s.id===activeSub)?.label}`}
          </span>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{textAlign:"right"}}>
              <p style={{margin:0,fontSize:13,fontWeight:600,color:C.g900}}>{currentUser.name}</p>
              <p style={{margin:0,fontSize:11,color:currentUser.role==="admin"?C.primary:C.accent}}>{currentUser.role==="admin"?"Administrador General":"Auxiliar"}</p>
            </div>
            <div style={{width:36,height:36,background:currentUser.role==="admin"?C.primary:C.accent,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:14,fontWeight:700}}>
              {currentUser.name[0]}
            </div>
            <button onClick={()=>setCurrentUser(null)} style={{background:"none",border:`1px solid ${C.g300}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",color:C.g500,fontSize:11,display:"flex",alignItems:"center",gap:4}}>
              <Icon name="x" size={12} color={C.g500}/> Salir
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
