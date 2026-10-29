import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── COLORHUNT PALETTE ────────────────────────────────────────────────────────

const P = {
  dark:    "#5A3E36",  // brown tone
  darkAlt: "#3E2723",
  green:   "#A3B18A",
  gold:    "#D4A373",
  goldL:   "#FAEDCD",
  cream:   "#FEFAE0",
  creamD:  "#E9EDC9",
  white:   "#FFFFFF",
  text:    "#3E2723",
  textSub: "#7F5539",
};

const WHATSAPP    = "919322636399";
const BACKEND     = "https://paintmywalls-backend.onrender.com";
const PROMO_VIDEO = "/videos/Video_6.mp4"; 

// Hero slideshow — replace with your own images
const HERO_SLIDES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1920&q=85",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=85",
  "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1920&q=85",
];

// ─── GALLERY CATEGORIES ───────────────────────────────────────────────────────
// Each category has its OWN set of images
// Replace src values with your own: "/images/interior1.jpg"
const GALLERY_CATS = [
  {
    id:"interior", label:"Interior", icon:"🏠",
    cover:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    images:[
      { src:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", caption:"Modern Living Room" },
      { src:"https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800", caption:"Elegant Hall" },
      { src:"https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800", caption:"Accent Wall" },
      { src:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=800", caption:"Luxury Interior" },
      { src:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", caption:"Cozy Living Room" },
      { src:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption:"Bright Interior" },
      { src:"/images/work1.jpg", caption:"Living Room - Nashik" },
    ]
  },
  {
    id:"bedroom", label:"Bedroom", icon:"🛏️",
    cover:"https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600",
    images:[
      { src:"https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",  caption:"Master Bedroom" },
      { src:"https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800", caption:"Kids Bedroom" },
      { src:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800", caption:"Cozy Bedroom" },
      { src:"https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800", caption:"Modern Bedroom" },
    ]
  },
  {
    id:"dining", label:"Dining Room", icon:"🍽️",
    cover:"/images/dinning.jpg",
    images:[
      { src:"https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800", caption:"Modern Dining Room" },
      { src:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", caption:"Open Dining Area" },
      { src:"/images/fomaldining.jpg" },
    ]
  },
  {
    id:"kitchen", label:"Kitchen", icon:"🍳",
    cover:"https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600",
    images:[
      { src:"https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800", caption:"Modern Kitchen" },
      { src:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800", caption:"Elegant Kitchen" },
      { src:"https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800", caption:"Bright Kitchen" },
    ]
  },
  {
    id:"bathroom", label:"Bathroom", icon:"🚿",
    cover:"https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600",
    images:[
      { src:"https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",  caption:"Modern Bathroom" },
      { src:"https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800", caption:"Elegant Bath" },
      { src:"/images/LuxuryBathroom.jpg" },
    ]
  },
  {
    id:"exterior", label:"Exterior", icon:"🏡",
    cover:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
    images:[
      { src:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", caption:"Villa Exterior" },
      { src:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", caption:"House Exterior" },
      { src:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",  caption:"Bungalow Exterior" },
      { src:"/images/work2.jpg", caption:"Parksyde - Nashik" },
    ]
  },
  {
    id:"commercial", label:"Commercial", icon:"🏢",
    cover:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
    images:[
      { src:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", caption:"Office Space" },
      { src:"https://images.unsplash.com/photo-1497366754035-f200968a7db1?w=800", caption:"Showroom" },
      { src:"https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800", caption:"Commercial Building" },
    ]
  },
];

const SERVICES = [
  { icon:"🏠", title:"Interior Painting",   desc:"Premium emulsions for living rooms, bedrooms & more. Matte, satin & sheen finishes." },
  { icon:"🏗️", title:"Exterior Painting",   desc:"Weather-resistant coatings with UV protection and anti-algae properties." },
  { icon:"🎨", title:"Designer Walls",      desc:"Stencils, textures, 3D effects & custom murals to make your walls truly unique." },
  { icon:"💧", title:"Waterproofing",       desc:"Nano-technology waterproofing for roofs, walls, bathrooms & terraces." },
  { icon:"🏢", title:"Commercial Painting", desc:"Large-scale projects for offices, showrooms and commercial spaces." },
  { icon:"✨", title:"Texture & Polish",    desc:"Italian polish, Asian Royale, and luxury finishes for premium spaces." },
];

const PRICING = [
  { type:"Tractor Emulsion", fresh:"₹21/sqft", repaint:"₹11.2/sqft", badge:"Budget",  popular:false },
  { type:"Premium Emulsion", fresh:"₹28/sqft", repaint:"₹16/sqft",   badge:"Popular", popular:true  },
  { type:"Royale Luxury",    fresh:"₹42/sqft", repaint:"₹28/sqft",   badge:"Premium", popular:false },
];

const TESTIMONIALS = [
  { name:"Ravi K.",  city:"Nashik", text:"Excellent work! The team was professional and completed everything on time. Highly recommend!", stars:5 },
  { name:"Priya M.", city:"Nashik", text:"Amazing transformation of our home. The designer walls look absolutely stunning!", stars:5 },
  { name:"Arjun S.", city:"Pune",   text:"Great quality, fair pricing, and the project manager kept us updated throughout.", stars:5 },
];

const WHY_US = [
  { icon:"🏅", t:"10+ Years Experience",   d:"Over a decade transforming homes across Nashik with precision craftsmanship." },
  { icon:"🎨", t:"Asian Paints Authorised", d:"We use only genuine Asian Paints — Royale, Premium & Tractor ranges." },
  { icon:"🛡️", t:"2-Year Warranty",         d:"Every project backed by a full 2-year workmanship warranty." },
  { icon:"💰", t:"Transparent Pricing",     d:"No hidden charges. Detailed quote before we start — zero surprises." },
  { icon:"👷", t:"Expert Team",             d:"Trained, background-verified painters who treat your home with care." },
  { icon:"⚡", t:"On-Time Delivery",        d:"We commit to deadlines. Your project completed on the agreed date." },
];

const PROCESS = [
  { n:"01", t:"Free Site Visit",   d:"Expert visits your home and takes measurements." },
  { n:"02", t:"Detailed Quote",    d:"Transparent itemised quote within 24 hours." },
  { n:"03", t:"Color Selection",   d:"We help choose perfect colors for your space." },
  { n:"04", t:"Professional Work", d:"Trained team completes work neatly, on time." },
  { n:"05", t:"Final Inspection",  d:"Full quality check before the job is done." },
];

const BRANDS = ["Asian Paints Royale","Asian Paints Premium","Tractor Emulsion","Berger Paints","Nerolac","Dulux"];

const COLOR_CATS = [
  { cat:"Whites & Neutrals", cols:[
    { name:"Ivory White", hex:"#f5f0e8", brand:"Tractor" },{ name:"Soft Cream", hex:"#f0e6d3", brand:"Premium" },
    { name:"Warm Beige",  hex:"#d4b896", brand:"Royale"  },{ name:"Pale Sand",  hex:"#e8dcc8", brand:"Tractor" },
  ]},
  { cat:"Blues & Teals", cols:[
    { name:"Sky Blue",   hex:"#a8d4e6", brand:"Royale"  },{ name:"Dusty Blue", hex:"#7ba7bc", brand:"Premium" },
    { name:"Teal Calm",  hex:"#2a9d8f", brand:"Royale"  },{ name:"Navy Depth", hex:"#264653", brand:"Premium" },
  ]},
  { cat:"Greens", cols:[
    { name:"Calm Sage",  hex:"#87a878", brand:"Royale"   },{ name:"Mint Fresh", hex:"#98d4b0", brand:"Premium"  },
    { name:"Forest",     hex:"#3d6b4f", brand:"Royale"   },{ name:"Lime Soft",  hex:"#c8e6a0", brand:"Tractor"  },
  ]},
  { cat:"Warm Tones", cols:[
    { name:"Terracotta", hex:"#c17f5a", brand:"Exterior" },{ name:"Coral Pop",  hex:"#e76f51", brand:"Premium"  },
    { name:"Peach",      hex:"#f4c09a", brand:"Royale"   },{ name:"Gold",       hex:"#e9c46a", brand:"Premium"  },
  ]},
  { cat:"Greys", cols:[
    { name:"Charcoal",   hex:"#6b7280", brand:"Premium" },{ name:"Slate Grey", hex:"#8d99ae", brand:"Royale"  },
    { name:"Stone",      hex:"#b0b8c1", brand:"Tractor" },{ name:"Graphite",   hex:"#3d3d3d", brand:"Premium" },
  ]},
  { cat:"Pinks", cols:[
    { name:"Blush Rose", hex:"#f2a7b0", brand:"Royale"  },{ name:"Dusty Mauve",hex:"#c49aad", brand:"Premium" },
    { name:"Lavender",   hex:"#c3aed6", brand:"Royale"  },{ name:"Berry",      hex:"#9b3a6b", brand:"Exterior"},
  ]},
];

const WALLPAPERS = [
  { name:"Brick",       id:"brick",    bg:"#c17f5a", css:"repeating-linear-gradient(transparent 0px,transparent 18px,#0003 18px,#0003 20px)" },
  { name:"Herringbone", id:"herring",  bg:"#4A7C59", css:"repeating-linear-gradient(45deg,#fff2 0px,#fff2 2px,transparent 2px,transparent 12px)" },
  { name:"Stripes",     id:"stripes",  bg:"#2C3E2D", css:"repeating-linear-gradient(0deg,#fff2 0px,#fff2 2px,transparent 2px,transparent 24px)" },
  { name:"Diamonds",    id:"diamonds", bg:"#D4A843", css:"repeating-linear-gradient(45deg,#fff2 0,#fff2 1px,transparent 0,transparent 50%)" },
  { name:"Dots",        id:"dots",     bg:"#3d6b4f", css:"radial-gradient(circle,#fff3 2px,transparent 2px)" },
  { name:"Chevron",     id:"chevron",  bg:"#8d99ae", css:"repeating-linear-gradient(120deg,#fff2 0,#fff2 1px,transparent 0,transparent 50%)" },
];

function sendWA(f){
  const m=`🎨 *New Painting Enquiry*\n\n👤 Name: ${f.name}\n📞 Phone: ${f.phone}\n🏙️ City: ${f.city}\n🖌️ Service: ${f.service}\n\n_Sent from Paintrest_`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(m)}`,"_blank");
}

// ─── GSAP SCROLL ANIMATION HOOK ───────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = gsap.utils.toArray(ref.current.querySelectorAll(".reveal"));
    els.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.85, delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 87%", toggleActions: "play none none none" }
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);
  return ref;
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ onClose, children, wide }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"white",borderRadius:16,maxWidth:wide?980:580,width:"100%",maxHeight:"92vh",overflowY:"auto",position:"relative",boxShadow:"0 40px 100px rgba(0,0,0,0.35)" }}>
        <button onClick={onClose} style={{ position:"absolute",top:12,right:12,background:P.creamD,border:"none",borderRadius:"50%",width:34,height:34,fontSize:16,cursor:"pointer",zIndex:10,lineHeight:1,color:P.dark }}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ img, onClose, onPrev, onNext }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  if (!img) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:99999,background:"rgba(0,0,0,0.96)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <button onClick={onClose} style={{ position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:"50%",width:44,height:44,fontSize:22,cursor:"pointer" }}>✕</button>
      <button onClick={e=>{e.stopPropagation();onPrev();}} style={{ position:"absolute",left:12,background:"rgba(255,255,255,0.12)",border:"none",color:"white",borderRadius:"50%",width:52,height:52,fontSize:30,cursor:"pointer" }}>‹</button>
      <div onClick={e=>e.stopPropagation()} style={{ textAlign:"center",maxWidth:960,width:"100%" }}>
        <img src={img.src} alt={img.caption} style={{ maxWidth:"100%",maxHeight:"82vh",borderRadius:10,objectFit:"contain",boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}/>
        {img.caption && <p style={{ color:"rgba(255,255,255,0.85)",marginTop:14,fontSize:16,fontFamily:"'Playfair Display',serif" }}>{img.caption}</p>}
      </div>
      <button onClick={e=>{e.stopPropagation();onNext();}} style={{ position:"absolute",right:12,background:"rgba(255,255,255,0.12)",border:"none",color:"white",borderRadius:"50%",width:52,height:52,fontSize:30,cursor:"pointer" }}>›</button>
    </div>
  );
}

// ─── QUOTE MODAL ──────────────────────────────────────────────────────────────
function QuoteModal({ onClose }) {
  const [form, setForm] = useState({ name:"",phone:"",city:"",service:"" });
  const [sent, setSent] = useState(false);
  const inp = { width:"100%",padding:"12px 16px",border:`1.5px solid ${P.creamD}`,borderRadius:8,fontSize:14,outline:"none",fontFamily:"'Lato',sans-serif",background:"white",transition:"border 0.2s" };
  const submit = e => { e.preventDefault(); sendWA(form); setSent(true); };
  if (sent) return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:"center",padding:"56px 40px" }}>
        <div style={{ fontSize:60,marginBottom:12 }}>💬</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:P.dark,marginBottom:8 }}>Opening WhatsApp!</h2>
        <p style={{ color:P.textSub,marginBottom:24 }}>Your enquiry is being sent to the owner.</p>
        <button onClick={()=>sendWA(form)} style={{ background:"#25D366",color:"white",border:"none",padding:"12px 28px",borderRadius:10,fontSize:14,cursor:"pointer",fontWeight:700 }}>💬 Open WhatsApp</button>
        <br/><button onClick={onClose} style={{ background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:13,marginTop:12 }}>Close</button>
      </div>
    </Modal>
  );
  return (
    <Modal onClose={onClose}>
      <div style={{ padding:"40px 36px" }}>
        <p style={{ fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.gold,fontWeight:700,marginBottom:4 }}>Free Consultation</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,color:P.dark,marginBottom:4 }}>Get Your Free Estimate</h2>
        <div style={{ width:48,height:3,background:`linear-gradient(90deg,${P.gold},${P.goldL})`,borderRadius:2,marginBottom:20 }}/>
        <form onSubmit={submit} style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            {[["Full Name","name","Your name","text"],["Phone","phone","+91 98765 43210","tel"]].map(([l,f,p,t])=>(
              <div key={f}>
                <label style={{ fontSize:11,letterSpacing:2,textTransform:"uppercase",color:P.dark,fontWeight:700,display:"block",marginBottom:6 }}>{l}</label>
                <input required type={t} placeholder={p} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} style={inp}
                  onFocus={e=>e.target.style.borderColor=P.gold} onBlur={e=>e.target.style.borderColor=P.creamD}/>
              </div>
            ))}
          </div>
          <div>
            <label style={{ fontSize:11,letterSpacing:2,textTransform:"uppercase",color:P.dark,fontWeight:700,display:"block",marginBottom:6 }}>City</label>
            <input required placeholder="Your city" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} style={inp}
              onFocus={e=>e.target.style.borderColor=P.gold} onBlur={e=>e.target.style.borderColor=P.creamD}/>
          </div>
          <div>
            <label style={{ fontSize:11,letterSpacing:2,textTransform:"uppercase",color:P.dark,fontWeight:700,display:"block",marginBottom:6 }}>Service Required</label>
            <select required value={form.service} onChange={e=>setForm({...form,service:e.target.value})} style={{ ...inp,background:"white" }}>
              <option value="">Select a service...</option>
              {SERVICES.map(s=><option key={s.title}>{s.title}</option>)}
            </select>
          </div>
          <button type="submit" style={{ background:"#25D366",color:"white",border:"none",padding:"14px",borderRadius:10,fontSize:14,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            💬 Send via WhatsApp
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ─── TRY WALLS MODAL ──────────────────────────────────────────────────────────
function TryWallsModal({ onClose }) {
  const [image, setImage] = useState(null);
  const [b64, setB64] = useState(null);
  const [mode, setMode] = useState("color");
  const [selColor, setSelColor] = useState(null);
  const [selWall, setSelWall] = useState(null);
  const [catIdx, setCatIdx] = useState(0);
  const [custom, setCustom] = useState("#D4A843");
  const [tol, setTol] = useState(25);
  const [opa, setOpa] = useState(65);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [backendOk, setBackendOk] = useState(null);
  const [step, setStep] = useState(1);
  const inputRef = useRef(); const prevRef = useRef();

  useEffect(()=>{ fetch(`${BACKEND}/health`).then(r=>r.json()).then(()=>setBackendOk(true)).catch(()=>setBackendOk(false)); },[]);

  const upload = e => {
    const file = e.target.files[0]; if(!file) return;
    setImage(URL.createObjectURL(file)); setResult(null); setHistory([]); setSelColor(null); setStep(2);
    const rd = new FileReader(); rd.onload = ev => setB64(ev.target.result.split(",")[1]); rd.readAsDataURL(file);
  };

  const clickWall = async e => {
    if(step!==3||loading) return;
    const ac = mode==="color" ? selColor : WALLPAPERS.find(w=>w.id===selWall)?.bg;
    if(!ac){alert("Select a color first!");return;}
    const rect = prevRef.current.getBoundingClientRect();
    const nx = Math.min(Math.max((e.clientX-rect.left)/rect.width,0.01),0.99);
    const ny = Math.min(Math.max((e.clientY-rect.top)/rect.height,0.01),0.99);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/apply-color`,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({image:b64,x:nx,y:ny,color:ac,tolerance:tol,opacity:opa/100})});
      const data = await res.json();
      if(data.success){ setHistory(h=>[...h.slice(-9),b64]); setResult(`data:image/jpeg;base64,${data.image}`); setB64(data.image); }
      else alert("Error: "+(data.error||"Failed"));
    } catch { alert("❌ Backend not running!\n\nRun: python app.py"); }
    setLoading(false);
  };

  const undo = () => { if(!history.length)return; const p=history[history.length-1]; setB64(p); setResult(history.length===1?null:`data:image/jpeg;base64,${p}`); setHistory(h=>h.slice(0,-1)); };
  const allCols = COLOR_CATS.flatMap(c=>c.cols);

  return (
    <Modal onClose={onClose} wide>
      <div style={{ padding:"32px 28px" }}>
        <p style={{ fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.gold,fontWeight:700,marginBottom:4 }}>Wall Visualizer</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:24,color:P.dark,marginBottom:4 }}>Try Colors On Your Walls</h2>
        <div style={{ width:48,height:3,background:`linear-gradient(90deg,${P.gold},${P.goldL})`,borderRadius:2,marginBottom:14 }}/>
        {backendOk===false&&<div style={{ background:"#fffbeb",border:"1px solid #f59e0b",borderRadius:8,padding:"9px 14px",marginBottom:12,fontSize:12,color:"#92400e" }}>⚠️ Backend not running. Run: <code style={{ background:"#fef3c7",padding:"1px 5px",borderRadius:3 }}>python app.py</code></div>}
        {backendOk===true&&<div style={{ background:"#f0fdf4",border:"1px solid #22c55e",borderRadius:8,padding:"8px 14px",marginBottom:12,fontSize:12,color:"#15803d" }}>✅ AI wall detection ready!</div>}
        {/* Steps */}
        <div style={{ display:"flex",alignItems:"center",gap:4,marginBottom:18 }}>
          {[{n:1,l:"Upload"},{n:2,l:"Pick Color"},{n:3,l:"Click Wall"}].map((s,i)=>(
            <div key={s.n} style={{ display:"flex",alignItems:"center" }}>
              <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                <div style={{ width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:step>=s.n?`linear-gradient(135deg,${P.gold},${P.goldL})`:"#f0ede8",color:step>=s.n?P.dark:"#aaa" }}>{s.n}</div>
                <span style={{ fontSize:11,fontWeight:700,color:step>=s.n?P.dark:"#aaa" }}>{s.l}</span>
              </div>
              {i<2&&<div style={{ width:20,height:2,background:step>s.n?P.gold:"#e0ddd6",margin:"0 5px" }}/>}
            </div>
          ))}
        </div>
        {!image ? (
          <div onClick={()=>inputRef.current.click()} style={{ border:`2px dashed ${P.creamD}`,borderRadius:12,padding:"48px 40px",textAlign:"center",cursor:"pointer",background:P.cream,transition:"border-color 0.2s" }}
            onMouseOver={e=>e.currentTarget.style.borderColor=P.gold} onMouseOut={e=>e.currentTarget.style.borderColor=P.creamD}>
            <div style={{ fontSize:44,marginBottom:10 }}>📷</div>
            <p style={{ fontFamily:"'Playfair Display',serif",fontSize:19,color:P.dark,marginBottom:5 }}>Upload Your Room Photo</p>
            <p style={{ color:"#999",fontSize:13,marginBottom:16 }}>JPG, PNG supported</p>
            <span style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,padding:"10px 26px",borderRadius:8,fontSize:13,fontWeight:700 }}>Choose Photo</span>
            <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={upload}/>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:20 }}>
            <div>
              <div style={{ display:"flex",gap:6,marginBottom:8,flexWrap:"wrap" }}>
                {[["📷",()=>{setImage(null);setResult(null);setB64(null);setStep(1);}],["↩",undo],["🔄",()=>{setResult(null);setHistory([]);}]].map(([l,fn],i)=>(
                  <button key={i} onClick={fn} style={{ padding:"5px 10px",background:P.cream,border:`1px solid ${P.creamD}`,borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",color:P.dark }}>{l}</button>
                ))}
                {result&&<button onClick={()=>{const a=document.createElement("a");a.download="wall.jpg";a.href=result;a.click();}} style={{ padding:"5px 10px",background:P.dark,color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer" }}>⬇</button>}
              </div>
              <div style={{ marginBottom:8,fontSize:11,padding:"7px 11px",borderRadius:7,background:step===3?"#f0fdf4":"#f8f8f8",border:step===3?"1.5px solid #22c55e":"1.5px solid #f0ede8",color:step===3?"#15803d":"#888" }}>
                {step===2&&"👉 Select a color from the panel →"}
                {step===3&&!loading&&"👆 Click on your wall — AI fills it!"}
                {loading&&"🤖 Detecting wall... please wait"}
              </div>
              <div style={{ position:"relative",borderRadius:10,overflow:"hidden",border:`2px solid ${P.creamD}` }}>
                <img ref={prevRef} src={result||image} alt="room" onClick={clickWall} style={{ width:"100%",display:"block",maxHeight:280,objectFit:"contain",cursor:step===3?"crosshair":"default" }}/>
                {loading&&<div style={{ position:"absolute",inset:0,background:"rgba(44,62,45,0.7)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8 }}>
                  <div style={{ fontSize:36 }}>🤖</div><p style={{ color:"white",fontWeight:700,fontSize:14 }}>Detecting wall...</p>
                </div>}
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10 }}>
                {[["Tolerance",tol,setTol,10,70],["Intensity %",opa,setOpa,20,90]].map(([l,v,s,mn,mx])=>(
                  <div key={l}>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#666",marginBottom:3 }}><span>{l}</span><span style={{ fontWeight:700,color:P.dark }}>{v}</span></div>
                    <input type="range" min={mn} max={mx} value={v} onChange={e=>s(Number(e.target.value))} style={{ width:"100%",accentColor:P.gold }}/>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ overflowY:"auto",maxHeight:440 }}>
              <div style={{ display:"flex",marginBottom:10,border:`1.5px solid ${P.creamD}`,borderRadius:8,overflow:"hidden" }}>
                {["color","wallpaper"].map(m=>(
                  <button key={m} onClick={()=>setMode(m)} style={{ flex:1,padding:"8px",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:mode===m?`linear-gradient(135deg,${P.gold},${P.goldL})`:"white",color:mode===m?P.dark:"#666" }}>
                    {m==="color"?"🎨 Colors":"🖼 Wallpapers"}
                  </button>
                ))}
              </div>
              {mode==="color" ? (
                <>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:10 }}>
                    {COLOR_CATS.map((c,i)=>(
                      <button key={i} onClick={()=>setCatIdx(i)} style={{ padding:"3px 9px",borderRadius:16,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,background:catIdx===i?P.dark:"#f0ede8",color:catIdx===i?"white":"#666" }}>{c.cat}</button>
                    ))}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:12 }}>
                    {COLOR_CATS[catIdx].cols.map((c,i)=>(
                      <div key={i} onClick={()=>{setSelColor(c.hex);setStep(3);}} style={{ display:"flex",alignItems:"center",gap:9,padding:"7px 9px",borderRadius:8,border:selColor===c.hex?`2px solid ${P.gold}`:"2px solid #f0ede8",cursor:"pointer",background:selColor===c.hex?"#fffbeb":"white" }}>
                        <div style={{ width:34,height:34,borderRadius:6,background:c.hex,flexShrink:0,boxShadow:"0 2px 6px rgba(0,0,0,0.15)" }}/>
                        <div style={{ flex:1 }}>
                          <p style={{ fontWeight:700,color:P.dark,fontSize:11,margin:0 }}>{c.name}</p>
                          <p style={{ color:P.gold,fontSize:10,margin:0,fontWeight:700 }}>Asian Paints {c.brand}</p>
                        </div>
                        {selColor===c.hex&&<span style={{ color:P.gold,fontSize:14 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop:`1px solid ${P.creamD}`,paddingTop:10 }}>
                    <p style={{ fontSize:10,fontWeight:700,color:P.dark,letterSpacing:1,textTransform:"uppercase",marginBottom:7 }}>Custom Color</p>
                    <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                      <input type="color" value={custom} onChange={e=>setCustom(e.target.value)} style={{ width:42,height:42,borderRadius:8,border:`2px solid ${P.creamD}`,cursor:"pointer",padding:2 }}/>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:11,color:"#555",margin:0 }}>Pick any color</p>
                        <p style={{ fontSize:10,color:"#aaa",fontFamily:"monospace",margin:0 }}>{custom}</p>
                      </div>
                      <button onClick={()=>{setSelColor(custom);setStep(3);}} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",padding:"7px 11px",borderRadius:6,fontSize:10,cursor:"pointer",fontWeight:700 }}>Select</button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
                  {WALLPAPERS.map(wp=>(
                    <div key={wp.id} onClick={()=>{setSelWall(wp.id);setStep(3);}} style={{ borderRadius:8,overflow:"hidden",cursor:"pointer",border:selWall===wp.id?`3px solid ${P.gold}`:"2px solid #e0ddd6" }}>
                      <div style={{ height:52,background:wp.bg,backgroundImage:wp.css,backgroundSize:"20px 20px" }}/>
                      <div style={{ padding:"5px 8px",background:"white" }}>
                        <p style={{ fontSize:11,fontWeight:700,color:P.dark,margin:0 }}>{wp.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ onQuote, onTryWalls }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const active = p => loc.pathname === p;
  const lStyle = p => ({
    textDecoration:"none", color:active(p)?P.gold:"rgba(255,255,255,0.88)",
    fontSize:12, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:700,
    borderBottom:active(p)?`2px solid ${P.gold}`:"2px solid transparent", paddingBottom:2, transition:"color 0.2s"
  });
  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:1000,height:68,
        background:scrolled?`${P.darkAlt}fb`:`${P.darkAlt}e0`,
        backdropFilter:"blur(14px)",
        boxShadow:scrolled?"0 4px 24px rgba(0,0,0,0.35)":"none",
        transition:"all 0.35s",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 5%"
      }}>
        <Link to="/" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:11 }}>
          <div style={{ width:40,height:40,background:`linear-gradient(135deg,${P.gold},${P.goldL})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>🎨</div>
          <div>
            <p style={{ fontFamily:"'Playfair Display',serif",color:"white",fontSize:21,fontWeight:700,margin:0,lineHeight:1.1 }}>Paintrest</p>
            <p style={{ color:P.gold,fontSize:9,letterSpacing:"3px",textTransform:"uppercase",margin:0 }}>Premium Painting · Nashik</p>
          </div>
        </Link>
        {/* Desktop */}
        <div style={{ display:"flex",gap:28,alignItems:"center" }} className="desk-nav">
          {[["Home","/"],["Gallery","/gallery"],["Pricing","/pricing"],["Contact","/contact"]].map(([l,p])=>(
            <Link key={l} to={p} style={lStyle(p)}
              onMouseOver={e=>e.currentTarget.style.color=P.gold}
              onMouseOut={e=>e.currentTarget.style.color=active(p)?P.gold:"rgba(255,255,255,0.88)"}>{l}</Link>
          ))}
          <button onClick={onTryWalls} style={{ background:`rgba(212,168,67,0.14)`,color:P.gold,border:`1.5px solid ${P.gold}`,padding:"8px 17px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:1 }}>🎨 Try Walls</button>
          <button onClick={onQuote} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",padding:"10px 22px",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",letterSpacing:1,boxShadow:`0 4px 14px rgba(212,168,67,0.4)` }}>Get Free Quote</button>
        </div>
        {/* Mobile hamburger */}
        <button onClick={()=>setOpen(true)} style={{ display:"none",background:"none",border:"none",color:"white",fontSize:28,cursor:"pointer" }} className="mob-nav">☰</button>
      </nav>
      {open && (
        <div style={{ position:"fixed",inset:0,zIndex:9998,background:P.darkAlt,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:26 }}>
          <button onClick={()=>setOpen(false)} style={{ position:"absolute",top:18,right:18,background:"none",border:"none",color:"white",fontSize:30,cursor:"pointer" }}>✕</button>
          {[["Home","/"],["Gallery","/gallery"],["Pricing","/pricing"],["Contact","/contact"]].map(([l,p])=>(
            <Link key={l} to={p} onClick={()=>setOpen(false)} style={{ color:"white",fontSize:24,fontFamily:"'Playfair Display',serif",textDecoration:"none" }}>{l}</Link>
          ))}
          <button onClick={()=>{onTryWalls();setOpen(false);}} style={{ background:`rgba(212,168,67,0.14)`,color:P.gold,border:`1.5px solid ${P.gold}`,padding:"12px 30px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer" }}>🎨 Try on Walls</button>
          <button onClick={()=>{onQuote();setOpen(false);}} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",padding:"13px 34px",borderRadius:8,fontSize:15,fontWeight:800,cursor:"pointer" }}>Get Free Quote</button>
        </div>
      )}
    </>
  );
}

// ─── FLOATING BTNS ────────────────────────────────────────────────────────────
function FloatingBtns({ onTryWalls }) {
  return (
    <div style={{ position:"fixed",bottom:24,right:20,zIndex:500,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10 }}>
      <a href="tel:+919322636399" title="Call" style={{ background:"#16A34A",color:"white",borderRadius:"50%",width:50,height:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 4px 16px rgba(0,0,0,0.3)",textDecoration:"none" }}>📞</a>
      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" title="WhatsApp"
      style={{ background:"#25D366",color:"white",borderRadius:"50%",width:50,height:50,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(37,211,102,0.4)",textDecoration:"none" }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.774L0 32l8.463-2.018A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.784-1.858l-.486-.29-5.026 1.198 1.22-4.897-.317-.502A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.95c-.398-.199-2.354-1.162-2.718-1.295-.365-.133-.63-.199-.896.199-.265.398-1.029 1.295-1.261 1.561-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.203-1.977-1.184-1.057-1.983-2.362-2.215-2.76-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.696-.1-.2-.896-2.16-1.228-2.957-.323-.776-.651-.671-.896-.683l-.763-.013c-.265 0-.696.1-1.061.497-.365.398-1.394 1.362-1.394 3.322s1.427 3.853 1.626 4.118c.199.265 2.808 4.287 6.802 6.015.951.41 1.692.655 2.271.839.954.304 1.823.261 2.51.158.765-.114 2.354-.962 2.686-1.891.332-.93.332-1.727.232-1.891-.099-.166-.365-.265-.763-.464z"/>
      </svg>
      </a>      <button onClick={onTryWalls} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",borderRadius:28,padding:"12px 18px",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 20px rgba(212,168,67,0.45)`,whiteSpace:"nowrap" }}>🎨 Try Walls</button>
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SH({ label, title, sub, light }) {
  return (
    <div className="reveal" style={{ textAlign:"center",marginBottom:60 }}>
      <p style={{ fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.gold,fontWeight:700,marginBottom:10 }}>{label}</p>
      <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:light?"white":P.dark,lineHeight:1.2,marginBottom:14 }}>{title}</h2>
      <div style={{ width:56,height:3,background:`linear-gradient(90deg,${P.gold},${P.goldL})`,margin:"0 auto 14px",borderRadius:2 }}/>
      {sub && <p style={{ fontSize:16,maxWidth:560,margin:"0 auto",lineHeight:1.75,color:light?"rgba(255,255,255,0.72)":P.textSub }}>{sub}</p>}
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background:P.darkAlt,color:"rgba(255,255,255,0.65)",padding:"60px 5% 28px" }}>
      <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:44 }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:38,height:38,background:`linear-gradient(135deg,${P.gold},${P.goldL})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🎨</div>
            <p style={{ fontFamily:"'Playfair Display',serif",color:"white",fontSize:20,fontWeight:700,margin:0 }}>Paintrest</p>
          </div>
          <p style={{ fontSize:14,lineHeight:1.8,maxWidth:270,marginBottom:16 }}>Premium painting services in Nashik & nearby areas. Quality work, honest pricing.</p>
          <div style={{ display:"flex",flexDirection:"column",gap:5,fontSize:14 }}>
            <span>📞 +91 93226 36399</span>
            <span>📍 Nashik, Maharashtra</span>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{ color:"#4ade80",textDecoration:"none" }}>💬 Chat on WhatsApp</a>
          </div>
        </div>
        {[
          ["Services",["Interior","Exterior","Designer Walls","Waterproofing","Commercial","Texture & Polish"].map(s=>[s,null])],
          ["Quick Links",[["Home","/"],["Gallery","/gallery"],["Pricing","/pricing"],["Contact","/contact"]]],
          ["Service Areas",["Nashik","Pune","Mumbai","Aurangabad","Kolhapur","Satara"].map(s=>[s,null])],
        ].map(([title,items])=>(
          <div key={title}>
            <p style={{ color:"white",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16 }}>{title}</p>
            {items.map(([label,path])=>(
              path
                ? <Link key={label} to={path} style={{ display:"block",color:"rgba(255,255,255,0.6)",textDecoration:"none",marginBottom:9,fontSize:14,transition:"color 0.2s" }}
                    onMouseOver={e=>e.target.style.color=P.gold} onMouseOut={e=>e.target.style.color="rgba(255,255,255,0.6)"}>{label}</Link>
                : <p key={label} style={{ marginBottom:9,fontSize:14,cursor:"default" }}>{label}</p>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,fontSize:12 }}>
        <span>© 2025 Paintrest. All Rights Reserved.</span>
        <span>Made with 🎨 in Nashik, Maharashtra</span>
      </div>
    </footer>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({ onQuote }) {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const s2 = useReveal(); const s3 = useReveal(); const s4 = useReveal();
  const s5 = useReveal(); const s6 = useReveal(); const s7 = useReveal();
  const s8 = useReveal(); const s9 = useReveal(); const s10 = useReveal();

  // Auto-slide
  useEffect(() => {
    const t = setInterval(() => setSlide(i => (i+1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // GSAP hero entrance
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.timeline({ delay:0.3 })
      .fromTo(".h-badge", { opacity:0, y:24 }, { opacity:1, y:0, duration:0.7, ease:"power3.out" })
      .fromTo(".h-title", { opacity:0, y:55 }, { opacity:1, y:0, duration:1,   ease:"power3.out" }, "-=0.35")
      .fromTo(".h-sub",   { opacity:0, y:30 }, { opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.45")
      .fromTo(".h-btns",  { opacity:0, y:22 }, { opacity:1, y:0, duration:0.6, ease:"power3.out" }, "-=0.35")
      .fromTo(".h-stats", { opacity:0, scale:0.92 }, { opacity:1, scale:1, duration:0.6, ease:"back.out(1.3)" }, "-=0.25");
  }, []);

  const sp = { padding:"96px 5%" };

  return (
    <>
      {/* ── HERO ── */}
      <section ref={heroRef} style={{ height:"100vh",minHeight:640,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
        {HERO_SLIDES.map((src,i)=>(
          <div key={i} style={{ position:"absolute",inset:0,backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center",transition:"opacity 1.6s ease",opacity:i===slide?1:0,zIndex:0 }}/>
        ))}
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(30,46,31,0.52) 0%, rgba(30,46,31,0.18) 45%, rgba(30,46,31,0.68) 100%)",zIndex:1 }}/>
        {/* Slide dots */}
        <div style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,zIndex:3 }}>
          {HERO_SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?30:8,height:8,borderRadius:4,background:i===slide?P.gold:"rgba(255,255,255,0.4)",border:"none",cursor:"pointer",transition:"all 0.4s",padding:0 }}/>
          ))}
        </div>
        <div style={{ position:"relative",zIndex:2,textAlign:"center",padding:"0 5%",width:"100%",maxWidth:920,margin:"0 auto" }}>
          <div className="h-badge" style={{ display:"inline-block",background:`rgba(212,168,67,0.22)`,border:`1px solid rgba(212,168,67,0.55)`,borderRadius:30,padding:"8px 22px",fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.goldL,fontWeight:700,marginBottom:22 }}>
            Nashik's #1 Painting Service
          </div>
          <h1 className="h-title" style={{ fontFamily:"'Playfair Display',serif",fontWeight:900,color:"white",lineHeight:1.08,marginBottom:22,fontSize:"clamp(38px,6.5vw,86px)",textShadow:"0 3px 20px rgba(0,0,0,0.45)" }}>
            Transform Your <span style={{ color:P.gold }}>Walls</span><br/>Into Masterpieces
          </h1>
          <p className="h-sub" style={{ color:"rgba(255,255,255,0.9)",fontSize:18,lineHeight:1.8,maxWidth:580,margin:"0 auto 38px",textShadow:"0 1px 8px rgba(0,0,0,0.4)" }}>
            Professional painting using Asian Paints products. Interior, exterior, designer walls & waterproofing — backed by a 2-year warranty.
          </p>
          <div className="h-btns" style={{ display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center",marginBottom:50 }}>
            <button onClick={onQuote} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",padding:"16px 40px",borderRadius:8,fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 8px 28px rgba(212,168,67,0.55)`,transition:"all 0.3s" }}
              onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 14px 36px rgba(212,168,67,0.7)`;}}
              onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 8px 28px rgba(212,168,67,0.55)`;}} >
              🎨 Get Free Estimate
            </button>
            <button onClick={()=>navigate("/gallery")} style={{ background:"rgba(255,255,255,0.13)",color:"white",border:"2px solid rgba(255,255,255,0.65)",padding:"14px 34px",borderRadius:8,fontSize:15,fontWeight:700,cursor:"pointer",backdropFilter:"blur(4px)",transition:"all 0.2s" }}
              onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.24)"}
              onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,0.13)"}>
              View Our Work →
            </button>
          </div>
          <div className="h-stats" style={{ display:"inline-flex",background:"rgba(30,46,31,0.72)",backdropFilter:"blur(14px)",borderRadius:16,border:"1px solid rgba(255,255,255,0.14)",overflow:"hidden" }}>
            {[["500+","Happy Clients"],["10+","Years Exp."],["₹21","/sqft starts"]].map(([n,l],i)=>(
              <div key={l} style={{ textAlign:"center",padding:"16px 30px",borderRight:i<2?"1px solid rgba(255,255,255,0.14)":"none" }}>
                <p style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:P.gold,margin:0 }}>{n}</p>
                <p style={{ color:"rgba(255,255,255,0.68)",fontSize:12,margin:0,marginTop:2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background:P.dark,padding:"0" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)" }}>
          {[["500+","Happy Clients","😊"],["10+","Years Experience","🏆"],["2 Yr","Warranty","🛡️"],["100%","Satisfaction","⭐"]].map(([n,l,e],i)=>(
            <div key={l} style={{ padding:"34px 20px",textAlign:"center",borderRight:i<3?"1px solid rgba(255,255,255,0.08)":"none" }}>
              <p style={{ fontSize:28,margin:"0 0 5px" }}>{e}</p>
              <p style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:P.gold,margin:0 }}>{n}</p>
              <p style={{ color:"rgba(255,255,255,0.56)",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",margin:"3px 0 0" }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section ref={s2} style={{ ...sp,background:P.cream }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center" }}>
          <div className="reveal">
            <p style={{ fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.gold,fontWeight:700,marginBottom:10 }}>About Paintrest</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3.5vw,40px)",fontWeight:700,color:P.dark,lineHeight:1.25,marginBottom:12 }}>We Don't Just Paint —<br/><span style={{ color:P.green }}>We Create Experiences</span></h2>
            <div style={{ width:52,height:3,background:`linear-gradient(90deg,${P.gold},${P.goldL})`,borderRadius:2,marginBottom:22 }}/>
            <p style={{ color:P.textSub,fontSize:15,lineHeight:1.9,marginBottom:14 }}>With over 10 years of experience in Nashik, Paintrest has transformed thousands of homes and commercial spaces. Every brushstroke is an opportunity to elevate your space.</p>
            <p style={{ color:P.textSub,fontSize:15,lineHeight:1.9,marginBottom:30 }}>Our skilled painters use only the finest Asian Paints products — ensuring colors that last, finishes that impress, and results you'll love.</p>
            <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
              <button onClick={onQuote} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:800,cursor:"pointer" }}>Get Free Quote</button>
              <button onClick={()=>navigate("/gallery")} style={{ background:"transparent",color:P.dark,border:`2px solid ${P.dark}`,padding:"10px 24px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer" }}>See Our Work</button>
            </div>
          </div>
          <div className="reveal" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            {GALLERY_CATS.slice(0,4).map((cat,i)=>(
              <div key={i} style={{ borderRadius:12,overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,0.12)",transform:i%2===1?"translateY(20px)":"none",transition:"transform 0.3s" }}
                onMouseOver={e=>e.currentTarget.style.transform=i%2===1?"translateY(14px) scale(1.03)":"translateY(-6px) scale(1.03)"}
                onMouseOut={e=>e.currentTarget.style.transform=i%2===1?"translateY(20px)":"none"}>
                <img src={cat.cover} alt={cat.label} style={{ width:"100%",height:180,objectFit:"cover",display:"block" }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section ref={s3} style={{ ...sp,background:"white" }}>
        <SH label="What We Offer" title="Our Services" sub="From simple repainting to luxury designer walls — every painting need handled with care."/>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22 }}>
          {SERVICES.map(s=>(
            <div key={s.title} className="reveal" style={{ background:P.cream,borderRadius:12,padding:"30px 24px",borderTop:`3px solid transparent`,transition:"all 0.3s" }}
              onMouseOver={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.borderTopColor=P.gold;e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,0.1)";}}
              onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderTopColor="transparent";e.currentTarget.style.boxShadow="none";}}>
              <div style={{ width:54,height:54,background:`rgba(212,168,67,0.12)`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:16 }}>{s.icon}</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:P.dark,marginBottom:8 }}>{s.title}</h3>
              <p style={{ color:P.textSub,fontSize:14,lineHeight:1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO ── */}
      <section style={{ position:"relative",overflow:"hidden",minHeight:500,display:"flex",alignItems:"center",justifyContent:"center" }}>
        <video autoPlay muted loop playsInline src={PROMO_VIDEO} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0 }}
          onError={e=>{e.currentTarget.parentElement.style.background=P.darkAlt;e.currentTarget.style.display="none";}}/>
        <div style={{ position:"absolute",inset:0,background:"rgba(30,46,31,0.74)",zIndex:1 }}/>
        <div style={{ position:"relative",zIndex:2,textAlign:"center",padding:"80px 5%",maxWidth:760,margin:"0 auto" }}>
          <p style={{ fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.gold,fontWeight:700,marginBottom:12 }}>See Our Work in Action</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,4.5vw,50px)",fontWeight:700,color:"white",lineHeight:1.2,marginBottom:18 }}>Crafting Beautiful <span style={{ color:P.gold }}>Spaces</span> Every Day</h2>
          <p style={{ color:"rgba(255,255,255,0.82)",fontSize:17,lineHeight:1.85,marginBottom:34 }}>Watch our team transform ordinary walls into stunning masterpieces — with dedication and passion.</p>
          <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
            <button onClick={()=>navigate("/gallery")} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",padding:"14px 30px",borderRadius:8,fontSize:15,fontWeight:800,cursor:"pointer" }}>View Full Gallery →</button>
            <button onClick={onQuote} style={{ background:"rgba(255,255,255,0.12)",color:"white",border:"2px solid rgba(255,255,255,0.55)",padding:"12px 26px",borderRadius:8,fontSize:15,fontWeight:700,cursor:"pointer" }}>Book Now</button>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section ref={s5} style={{ ...sp,background:P.cream }}>
        <SH label="Our Process" title="How We Work" sub="A simple 5-step process designed to make your painting experience completely stress-free."/>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute",top:38,left:"9%",right:"9%",height:2,background:`linear-gradient(90deg,${P.gold},${P.goldL})`,zIndex:0 }}/>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:18,position:"relative",zIndex:1 }}>
            {PROCESS.map(p=>(
              <div key={p.n} className="reveal" style={{ textAlign:"center" }}>
                <div style={{ width:76,height:76,borderRadius:"50%",background:`linear-gradient(135deg,${P.gold},${P.goldL})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:`0 8px 22px rgba(212,168,67,0.45)` }}>
                  <span style={{ color:P.dark,fontSize:18,fontWeight:900,fontFamily:"'Playfair Display',serif" }}>{p.n}</span>
                </div>
                <h4 style={{ fontFamily:"'Playfair Display',serif",fontSize:15,color:P.dark,marginBottom:6,fontWeight:700 }}>{p.t}</h4>
                <p style={{ color:P.textSub,fontSize:12,lineHeight:1.6 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"center",marginTop:50 }}>
          <button onClick={onQuote} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",padding:"14px 42px",borderRadius:8,fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 20px rgba(212,168,67,0.4)` }}>Start Your Project Today →</button>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section ref={s6} style={{ ...sp,background:P.dark }}>
        <SH label="Why Paintrest" title="Why Choose Us?" sub="We're not just painters — we're your trusted home transformation partners." light/>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
          {WHY_US.map(w=>(
            <div key={w.t} className="reveal" style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"26px 22px",transition:"all 0.3s" }}
              onMouseOver={e=>{e.currentTarget.style.background=`rgba(212,168,67,0.1)`;e.currentTarget.style.borderColor=`rgba(212,168,67,0.35)`;e.currentTarget.style.transform="translateY(-4px)";}}
              onMouseOut={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.transform="none";}}>
              <p style={{ fontSize:34,marginBottom:12 }}>{w.icon}</p>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:17,color:"white",marginBottom:8 }}>{w.t}</h3>
              <p style={{ color:"rgba(255,255,255,0.6)",fontSize:13,lineHeight:1.75 }}>{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section ref={s7} style={{ ...sp,background:P.creamD }}>
        <SH label="Our Portfolio" title="Recent Work" sub="A glimpse of beautiful spaces we've created across Nashik."/>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:36 }}>
          {GALLERY_CATS.slice(0,7).map((cat,i)=>(
            <div key={i} className="reveal" onClick={()=>navigate("/gallery")}
              style={{ borderRadius:12,overflow:"hidden",cursor:"pointer",position:"relative",gridColumn:i===0?"span 2":"span 1",boxShadow:"0 4px 16px rgba(0,0,0,0.1)",transition:"all 0.3s" }}
              onMouseOver={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.querySelector(".gc").style.opacity="1";}}
              onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.querySelector(".gc").style.opacity="0";}}>
              <img src={cat.cover} alt={cat.label} style={{ width:"100%",height:i===0?310:150,objectFit:"cover",display:"block" }}/>
              <div className="gc" style={{ position:"absolute",inset:0,background:"rgba(44,62,45,0.6)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.25s",gap:6 }}>
                <span style={{ fontSize:28 }}>{cat.icon}</span>
                <span style={{ color:"white",fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700 }}>{cat.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center" }}>
          <button onClick={()=>navigate("/gallery")} style={{ background:"transparent",color:P.dark,border:`2px solid ${P.dark}`,padding:"12px 42px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:"1.5px",textTransform:"uppercase",transition:"all 0.2s" }}
            onMouseOver={e=>{e.currentTarget.style.background=P.dark;e.currentTarget.style.color="white";}}
            onMouseOut={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=P.dark;}}>
            See Full Gallery →
          </button>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section ref={s8} style={{ padding:"52px 5%",background:"white",borderTop:`1px solid ${P.creamD}` }}>
        <p className="reveal" style={{ textAlign:"center",fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:"#aaa",fontWeight:700,marginBottom:22 }}>Paints & Brands We Use</p>
        <div className="reveal" style={{ display:"flex",flexWrap:"wrap",justifyContent:"center",gap:12 }}>
          {BRANDS.map(b=>(
            <span key={b} style={{ background:P.cream,border:`1.5px solid ${P.creamD}`,borderRadius:8,padding:"11px 24px",fontSize:14,fontWeight:700,color:P.dark,cursor:"default",transition:"all 0.2s" }}
              onMouseOver={e=>{e.currentTarget.style.borderColor=P.gold;e.currentTarget.style.background="#fffbeb";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=P.creamD;e.currentTarget.style.background=P.cream;}}>
              🎨 {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section ref={s9} style={{ ...sp,background:P.cream }}>
        <SH label="What Clients Say" title="Happy Customers" sub="Don't just take our word for it — hear from homeowners we've worked with."/>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22 }}>
          {TESTIMONIALS.map(t=>(
            <div key={t.name} className="reveal" style={{ background:"white",borderRadius:12,padding:28,boxShadow:"0 2px 18px rgba(0,0,0,0.07)",borderLeft:`4px solid ${P.gold}`,transition:"all 0.3s" }}
              onMouseOver={e=>e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,0.12)"}
              onMouseOut={e=>e.currentTarget.style.boxShadow="0 2px 18px rgba(0,0,0,0.07)"}>
              <p style={{ color:P.gold,fontSize:19,letterSpacing:2 }}>{"★".repeat(t.stars)}</p>
              <p style={{ color:"#555",fontSize:14,lineHeight:1.8,margin:"12px 0",fontStyle:"italic" }}>"{t.text}"</p>
              <div style={{ display:"flex",alignItems:"center",gap:11 }}>
                <div style={{ width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${P.gold},${P.goldL})`,display:"flex",alignItems:"center",justifyContent:"center",color:P.dark,fontWeight:700,fontSize:17 }}>{t.name[0]}</div>
                <div>
                  <p style={{ fontWeight:700,color:P.dark,fontSize:13,margin:0 }}>{t.name}</p>
                  <p style={{ color:"#aaa",fontSize:11,margin:0 }}>📍 {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={s10} style={{ padding:"80px 5%",background:`linear-gradient(135deg,${P.dark} 0%,${P.darkAlt} 100%)`,textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",width:380,height:380,borderRadius:"50%",background:`rgba(212,168,67,0.08)`,top:-100,right:-60,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,0.04)",bottom:-70,left:-50,pointerEvents:"none" }}/>
        <div className="reveal" style={{ position:"relative",zIndex:1,maxWidth:680,margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,4vw,46px)",fontWeight:700,color:"white",marginBottom:14 }}>Ready to Transform Your Home?</h2>
          <p style={{ color:"rgba(255,255,255,0.76)",fontSize:17,marginBottom:34,lineHeight:1.75 }}>Get a free estimate today. Our team will visit, understand your vision, and give you the best quote in Nashik.</p>
          <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
            <button onClick={onQuote} style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,border:"none",padding:"14px 36px",borderRadius:8,fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 24px rgba(212,168,67,0.45)` }}>💬 Get Free Quote on WhatsApp</button>
            <a href="tel:+919322636399" style={{ background:"transparent",color:"white",border:"2px solid rgba(255,255,255,0.55)",padding:"12px 28px",borderRadius:8,fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8 }}>📞 Call Now</a>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── GALLERY PAGE ─────────────────────────────────────────────────────────────
function Gallery() {
  const [activeCat, setActiveCat] = useState(null); // null = show category cards
  const [tab, setTab] = useState("images");
  const [lb, setLb] = useState(null);
  const [lbIdx, setLbIdx] = useState(0);
  const gridRef = useRef(null);

  const cat = activeCat ? GALLERY_CATS.find(c=>c.id===activeCat) : null;

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.querySelectorAll(".gi"),
      { opacity:0, y:40, scale:0.96 },
      { opacity:1, y:0, scale:1, duration:0.55, stagger:0.07, ease:"power3.out" }
    );
  }, [activeCat, tab]);

  const openLb = (imgs, i) => { setLbIdx(i); setLb(imgs[i]); };
  const prev = imgs => { const i=(lbIdx-1+imgs.length)%imgs.length; setLbIdx(i); setLb(imgs[i]); };
  const next = imgs => { const i=(lbIdx+1)%imgs.length; setLbIdx(i); setLb(imgs[i]); };

  return (
    <>
      <div style={{ paddingTop:68,minHeight:"100vh",background:P.cream }}>
        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${P.dark},${P.darkAlt})`,padding:"60px 5%",textAlign:"center" }}>
          <p style={{ fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.gold,fontWeight:700,marginBottom:8 }}>Our Portfolio</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,50px)",fontWeight:700,color:"white",marginBottom:12 }}>Work Done By Us</h1>
          <div style={{ width:52,height:3,background:`linear-gradient(90deg,${P.gold},${P.goldL})`,margin:"0 auto 12px",borderRadius:2 }}/>
          <p style={{ color:"rgba(255,255,255,0.65)",fontSize:15,maxWidth:420,margin:"0 auto" }}>Browse our completed projects — real homes, real transformations.</p>
        </div>

        <div style={{ padding:"52px 5%" }}>
          {/* Tabs */}
          <div style={{ display:"flex",justifyContent:"center",marginBottom:36 }}>
            <div style={{ display:"flex",border:`1.5px solid ${P.creamD}`,borderRadius:12,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.07)" }}>
              {["images","videos"].map(t=>(
                <button key={t} onClick={()=>{setTab(t);setActiveCat(null);}} style={{ padding:"11px 42px",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",transition:"all 0.22s",background:tab===t?`linear-gradient(135deg,${P.gold},${P.goldL})`:P.cream,color:tab===t?P.dark:"#666" }}>
                  {t==="images"?"📷 Images":"🎬 Videos"}
                </button>
              ))}
            </div>
          </div>

          {tab==="images" && (
            <>
              {!activeCat ? (
                /* Category cards — click to enter */
                <>
                  <p style={{ textAlign:"center",color:P.textSub,fontSize:14,marginBottom:30 }}>👆 Click a category to see the photos</p>
                  <div ref={gridRef} style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20 }}>
                    {GALLERY_CATS.map(c=>(
                      <div key={c.id} className="gi" onClick={()=>setActiveCat(c.id)}
                        style={{ borderRadius:14,overflow:"hidden",cursor:"pointer",position:"relative",boxShadow:"0 4px 18px rgba(0,0,0,0.1)",transition:"all 0.3s" }}
                        onMouseOver={e=>{e.currentTarget.style.transform="translateY(-7px)";e.currentTarget.style.boxShadow="0 18px 44px rgba(0,0,0,0.18)";}}
                        onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.1)";}}>
                        <img src={c.cover} alt={c.label} style={{ width:"100%",height:210,objectFit:"cover",display:"block" }}/>
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(30,46,31,0.85) 0%,rgba(30,46,31,0.08) 55%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:18 }}>
                          <span style={{ fontSize:30,marginBottom:6 }}>{c.icon}</span>
                          <span style={{ color:"white",fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700 }}>{c.label}</span>
                          <span style={{ color:P.gold,fontSize:12,marginTop:3,fontWeight:600 }}>{c.images.length} photos →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Images inside selected category */
                <>
                  <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28,flexWrap:"wrap" }}>
                    <button onClick={()=>setActiveCat(null)} style={{ background:P.cream,border:`1.5px solid ${P.creamD}`,borderRadius:8,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer",color:P.dark,display:"flex",alignItems:"center",gap:6 }}>
                      ← All Categories
                    </button>
                    <span style={{ fontSize:26 }}>{cat.icon}</span>
                    <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:P.dark,margin:0 }}>{cat.label}</h2>
                    <span style={{ background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20 }}>{cat.images.length} photos</span>
                  </div>
                  <div ref={gridRef} style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18 }}>
                    {cat.images.map((img,i)=>(
                      <div key={i} className="gi" onClick={()=>openLb(cat.images,i)}
                        style={{ borderRadius:12,overflow:"hidden",cursor:"pointer",position:"relative",boxShadow:"0 4px 14px rgba(0,0,0,0.1)",transition:"all 0.3s" }}
                        onMouseOver={e=>{e.currentTarget.style.transform="scale(1.03)";e.currentTarget.querySelector(".ov").style.opacity="1";}}
                        onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.querySelector(".ov").style.opacity="0";}}>
                        <img src={img.src} alt={img.caption} style={{ width:"100%",height:240,objectFit:"cover",display:"block" }}/>
                        <div className="ov" style={{ position:"absolute",inset:0,background:"rgba(44,62,45,0.58)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.22s",gap:8 }}>
                          <span style={{ fontSize:30 }}>🔍</span>
                          <span style={{ color:"white",fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700 }}>{img.caption}</span>
                        </div>
                        <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"20px 12px 10px",background:"linear-gradient(to top,rgba(0,0,0,0.58),transparent)" }}>
                          <span style={{ color:"white",fontSize:12,fontWeight:700 }}>{img.caption}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {tab==="videos" && (
            <div ref={gridRef} style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20 }}>
              {["/videos/video1.mp4","/videos/video2.mp4","/videos/video3.mp4"].map((src,i)=>(
                <div key={i} className="gi" style={{ borderRadius:12,overflow:"hidden",aspectRatio:"16/9",background:"#111",boxShadow:"0 4px 16px rgba(0,0,0,0.14)" }}>
                  <video src={src} controls style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {lb && cat && <Lightbox img={lb} onClose={()=>setLb(null)} onPrev={()=>prev(cat.images)} onNext={()=>next(cat.images)}/>}
    </>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function Pricing({ onQuote }) {
  const ref = useReveal();
  return (
    <div style={{ paddingTop:68,minHeight:"100vh",background:P.cream }}>
      <div style={{ background:`linear-gradient(135deg,${P.dark},${P.darkAlt})`,padding:"60px 5%",textAlign:"center" }}>
        <p style={{ fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.gold,fontWeight:700,marginBottom:8 }}>Transparent Pricing</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,50px)",fontWeight:700,color:"white",marginBottom:12 }}>Our Rates</h1>
        <div style={{ width:52,height:3,background:`linear-gradient(90deg,${P.gold},${P.goldL})`,margin:"0 auto 12px",borderRadius:2 }}/>
        <p style={{ color:"rgba(255,255,255,0.65)",fontSize:15 }}>All prices include putty, primer & paint. No hidden charges.</p>
      </div>
      <div ref={ref} style={{ padding:"56px 5%" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:26,marginBottom:50 }}>
          {PRICING.map(p=>(
            <div key={p.type} className="reveal" style={{ background:"white",borderRadius:16,padding:"34px 26px",textAlign:"center",position:"relative",boxShadow:p.popular?`0 8px 36px rgba(212,168,67,0.22)`:"0 2px 14px rgba(0,0,0,0.07)",border:p.popular?`2px solid ${P.gold}`:"2px solid transparent",transition:"all 0.3s" }}
              onMouseOver={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 16px 42px rgba(0,0,0,0.12)`;}}
              onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=p.popular?`0 8px 36px rgba(212,168,67,0.22)`:"0 2px 14px rgba(0,0,0,0.07)";}}>
              {p.popular&&<div style={{ position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${P.gold},${P.goldL})`,color:P.dark,fontSize:10,fontWeight:800,letterSpacing:"1.5px",textTransform:"uppercase",padding:"4px 16px",borderRadius:30 }}>Most Popular</div>}
              <span style={{ display:"inline-block",background:P.dark,color:"white",fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"3px 11px",borderRadius:30,margin:"8px 0 18px" }}>{p.badge}</span>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,color:P.dark,marginBottom:22 }}>{p.type}</h3>
              <p style={{ fontSize:10,color:"#aaa",letterSpacing:1,marginBottom:3,textTransform:"uppercase" }}>Fresh Painting</p>
              <p style={{ fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:P.gold,margin:"0 0 14px" }}>{p.fresh}</p>
              <div style={{ borderTop:`1px solid ${P.creamD}`,paddingTop:14 }}>
                <p style={{ fontSize:10,color:"#aaa",letterSpacing:1,marginBottom:3,textTransform:"uppercase" }}>Repainting</p>
                <p style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:P.green,margin:0 }}>{p.repaint}</p>
              </div>
              <button onClick={onQuote} style={{ width:"100%",marginTop:22,background:"#25D366",color:"white",border:"none",padding:"11px",borderRadius:10,fontSize:13,cursor:"pointer",fontWeight:700 }}>💬 Book via WhatsApp</button>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ background:"white",borderRadius:16,padding:"36px",boxShadow:"0 2px 14px rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:24,color:P.dark,marginBottom:22,textAlign:"center" }}>What's Included in Every Package</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
            {[["✅ Putty & Primer","Included at no extra cost"],["✅ 2-Year Warranty","On all painting work"],["✅ Free Estimate","No-obligation site visit"],["✅ Project Manager","Dedicated contact throughout"],["✅ Quality Paints","Only Asian Paints used"],["✅ Clean Completion","Full cleanup after project"]].map(([t,d])=>(
              <div key={t} style={{ background:P.cream,borderRadius:10,padding:"14px 16px" }}>
                <p style={{ fontWeight:700,color:P.dark,fontSize:13,marginBottom:3 }}>{t}</p>
                <p style={{ color:P.textSub,fontSize:12 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({name:"",phone:"",city:"",service:""});
  const [sent, setSent] = useState(false);
  const ref = useReveal();
  const inp = { width:"100%",padding:"11px 15px",border:`1.5px solid ${P.creamD}`,borderRadius:8,fontSize:14,outline:"none",fontFamily:"'Lato',sans-serif",background:"white",transition:"border 0.2s" };
  const submit = e => { e.preventDefault(); sendWA(form); setSent(true); setTimeout(()=>setSent(false),4000); setForm({name:"",phone:"",city:"",service:""}); };
  return (
    <div style={{ paddingTop:68,minHeight:"100vh",background:P.cream }}>
      <div style={{ background:`linear-gradient(135deg,${P.dark},${P.darkAlt})`,padding:"60px 5%",textAlign:"center" }}>
        <p style={{ fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:P.gold,fontWeight:700,marginBottom:8 }}>Get In Touch</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,50px)",fontWeight:700,color:"white",marginBottom:12 }}>Contact Us</h1>
        <div style={{ width:52,height:3,background:`linear-gradient(90deg,${P.gold},${P.goldL})`,margin:"0 auto 12px",borderRadius:2 }}/>
        <p style={{ color:"rgba(255,255,255,0.65)",fontSize:15 }}>Your enquiry goes directly to the owner via WhatsApp 💬</p>
      </div>
      <div ref={ref} style={{ padding:"56px 5%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48 }}>
        <div className="reveal">
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,color:P.dark,marginBottom:22 }}>Send an Enquiry</h2>
          {sent ? (
            <div style={{ textAlign:"center",padding:"48px 24px",background:"white",borderRadius:14,boxShadow:"0 2px 22px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize:50,marginBottom:12 }}>💬</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,color:P.dark }}>Sent to WhatsApp!</h3>
              <p style={{ color:P.textSub,marginTop:6 }}>The owner will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background:"white",borderRadius:14,padding:"34px",boxShadow:"0 4px 26px rgba(0,0,0,0.08)",display:"flex",flexDirection:"column",gap:16 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                {[["Full Name","name","Your name","text"],["Phone","phone","+91 98765 43210","tel"]].map(([l,f,p,t])=>(
                  <div key={f}>
                    <label style={{ fontSize:10,letterSpacing:2,textTransform:"uppercase",color:P.dark,fontWeight:700,display:"block",marginBottom:6 }}>{l}</label>
                    <input required type={t} placeholder={p} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} style={inp}
                      onFocus={e=>e.target.style.borderColor=P.gold} onBlur={e=>e.target.style.borderColor=P.creamD}/>
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize:10,letterSpacing:2,textTransform:"uppercase",color:P.dark,fontWeight:700,display:"block",marginBottom:6 }}>City</label>
                <input required placeholder="Your city" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} style={inp}
                  onFocus={e=>e.target.style.borderColor=P.gold} onBlur={e=>e.target.style.borderColor=P.creamD}/>
              </div>
              <div>
                <label style={{ fontSize:10,letterSpacing:2,textTransform:"uppercase",color:P.dark,fontWeight:700,display:"block",marginBottom:6 }}>Service Required</label>
                <select required value={form.service} onChange={e=>setForm({...form,service:e.target.value})} style={{ ...inp,background:"white" }}>
                  <option value="">Select a service...</option>
                  {SERVICES.map(s=><option key={s.title}>{s.title}</option>)}
                </select>
              </div>
              <button type="submit" style={{ background:"#25D366",color:"white",border:"none",padding:"13px",borderRadius:10,fontSize:14,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                💬 Send Enquiry via WhatsApp
              </button>
            </form>
          )}
        </div>
        <div className="reveal">
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,color:P.dark,marginBottom:22 }}>Get in Touch</h2>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {[["📞","Call Us","+91 93226 36399","tel:+919322636399"],["💬","WhatsApp","Chat with owner directly",`https://wa.me/${WHATSAPP}`],["📍","Location","Nashik, Maharashtra, India",null],["🕐","Working Hours","Mon–Sat: 9 AM – 7 PM",null]].map(([icon,label,val,href])=>(
              <div key={label} style={{ display:"flex",gap:14,alignItems:"flex-start",padding:"16px 18px",background:"white",borderRadius:12,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",transition:"box-shadow 0.2s" }}
                onMouseOver={e=>e.currentTarget.style.boxShadow="0 6px 22px rgba(0,0,0,0.11)"}
                onMouseOut={e=>e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.06)"}>
                <span style={{ fontSize:24,flexShrink:0 }}>{icon}</span>
                <div>
                  <p style={{ fontWeight:700,color:P.dark,fontSize:13,marginBottom:3 }}>{label}</p>
                  {href?<a href={href} target="_blank" rel="noreferrer" style={{ color:P.gold,textDecoration:"none",fontSize:14 }}>{val}</a>
                       :<p style={{ color:P.textSub,fontSize:14 }}>{val}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function AppInner() {
  const [showQuote, setShowQuote] = useState(false);
  const [showTry, setShowTry] = useState(false);
  return (
    <>
      <Navbar onQuote={()=>setShowQuote(true)} onTryWalls={()=>setShowTry(true)}/>
      <FloatingBtns onTryWalls={()=>setShowTry(true)}/>
      {showQuote && <QuoteModal onClose={()=>setShowQuote(false)}/>}
      {showTry   && <TryWallsModal onClose={()=>setShowTry(false)}/>}
      <Routes>
        <Route path="/"        element={<Home onQuote={()=>setShowQuote(true)}/>}/>
        <Route path="/gallery" element={<Gallery/>}/>
        <Route path="/pricing" element={<Pricing onQuote={()=>setShowQuote(true)}/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>
      <AppInner/>
    </BrowserRouter>
  );
}
