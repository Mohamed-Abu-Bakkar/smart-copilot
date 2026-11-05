"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search, ShieldCheck, Sparkles, LoaderCircle } from "lucide-react";
import { useDemoWorkspace } from "@/lib/demo-workspace";

const schemes=[
 {name:"PMEGP",category:"Subsidy",department:"Ministry of MSME / KVIC",summary:"Employment generation programme information and application guidance.",url:"https://www.kviconline.gov.in/pmegpeportal/"},
 {name:"Pradhan Mantri MUDRA Yojana",category:"Credit",department:"MUDRA",summary:"Official information about micro-enterprise credit products. Loan approval and terms are determined by lending institutions.",url:"https://www.mudra.org.in/"},
 {name:"CGTMSE",category:"Credit guarantee",department:"CGTMSE",summary:"Credit guarantee programme information for eligible micro and small enterprise lending.",url:"https://www.cgtmse.in/"},
 {name:"Udyam Registration",category:"Registration",department:"Ministry of MSME",summary:"Official MSME registration portal and registration guidance.",url:"https://udyamregistration.gov.in/"},
 {name:"MSME schemes and programmes",category:"Information",department:"Ministry of MSME",summary:"Official central-government scheme notifications, guidelines and programme information.",url:"https://msme.gov.in/"},
 {name:"Tamil Nadu MSME Department",category:"Tamil Nadu",department:"Government of Tamil Nadu",summary:"State department portal for current schemes, incentives, guidelines and contacts.",url:"https://msmeonline.tn.gov.in/"},
 {name:"myScheme",category:"Discovery",department:"Government of India",summary:"Government scheme discovery portal. Check the individual scheme's official department page before applying.",url:"https://www.myscheme.gov.in/"},
];
const filters=["All","Subsidy","Credit","Registration","Tamil Nadu","Information","Discovery"];
type Match={name:string;type:string;url:string;relevance:string;reason:string;questions:string[]};
export default function SchemesPage(){
 const {profile,ready}=useDemoWorkspace();
 const [filter,setFilter]=useState("All"); const [query,setQuery]=useState("");
 const [matches,setMatches]=useState<Match[]>([]); const [intro,setIntro]=useState(""); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
 const visible=useMemo(()=>schemes.filter(s=>(filter==="All"||s.category===filter)&&(s.name+" "+s.department+" "+s.summary).toLowerCase().includes(query.toLowerCase())),[filter,query]);
 async function findMatches(){
  if(!profile)return; setLoading(true);setError("");setMatches([]);
  try{const response=await fetch("/api/schemes/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not match schemes.");setIntro(data.intro||"");setMatches(data.matches||[]);}
  catch(e){setError(e instanceof Error?e.message:"Unable to find scheme suggestions.");}
  finally{setLoading(false);}
 }
 return <div className="px-4 py-4 space-y-5 text-slate-main">
  <div><h1 className="text-xl font-bold">Government Scheme Navigator</h1><p className="text-sm text-slate-muted mt-1">Discover official programmes using your saved business profile.</p></div>
  {!ready&&<p className="rounded-xl bg-slate-100 p-3 text-xs text-slate-600">Loading your shared business profile…</p>}
  {ready&&profile&&<section className="rounded-2xl border border-teal-primary/20 bg-teal-primary/5 p-4 space-y-3">
   <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-primary"/><h2 className="text-sm font-semibold">Recommendations for {profile.businessName}</h2></div>
   <p className="text-xs text-slate-muted">{[profile.category,profile.industry,profile.location,profile.stage,profile.storeType].filter(Boolean).join(" · ")}</p>
   {profile.goals?.length>0&&<p className="text-xs text-slate-muted">Goals: {profile.goals.join(", ")}</p>}
   <button onClick={()=>void findMatches()} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-primary p-3 text-sm font-semibold text-white disabled:opacity-60">{loading?<LoaderCircle className="h-4 w-4 animate-spin"/>:<Sparkles className="h-4 w-4"/>}{loading?"Checking possible matches…":"Find schemes for my business"}</button>
   {error&&<p className="text-xs text-red-700">{error}</p>}
   {intro&&<p className="text-xs leading-relaxed text-slate-700">{intro}</p>}
   {matches.map(match=><article key={match.name} className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
    <div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-semibold">{match.name}</h3><p className="text-[11px] text-slate-muted">{match.type}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium">{match.relevance}</span></div>
    <p className="text-xs leading-relaxed text-slate-700">{match.reason}</p>
    {match.questions?.length>0&&<p className="text-[11px] text-slate-muted">To check further: {match.questions.join(" · ")}</p>}
    <a href={match.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-primary underline">Verify on official portal <ExternalLink className="h-3 w-3"/></a>
   </article>)}
   <p className="text-[10px] text-slate-muted">These are AI-assisted discovery leads, not eligibility decisions. Confirm current criteria, dates and benefits with the official department.</p>
  </section>}
  {ready&&!profile&&<section className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2"><p className="text-xs text-amber-900">Create your business profile first so the navigator can use your business type, location, stage and goals instead of giving generic suggestions.</p><Link href="/onboarding" className="text-xs font-semibold text-teal-primary underline">Build my business profile</Link></section>}
  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><strong>Important:</strong> Suggestions are not eligibility confirmations. Scheme rules, benefits and application windows can change. Verify details with the issuing department.</div>
  <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-muted"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search schemes and portals" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-teal-primary/30"/></div>
  <div className="flex gap-2 overflow-x-auto pb-1">{filters.map(f=><button key={f} onClick={()=>setFilter(f)} className={"shrink-0 rounded-full border px-3 py-2 text-xs "+(filter===f?"bg-teal-primary text-white border-teal-primary":"bg-white border-slate-200 text-slate-muted")}>{f}</button>)}</div>
  <div className="space-y-3">{visible.map(s=><article key={s.name} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2"><div className="flex justify-between gap-3"><div><span className="text-[10px] uppercase tracking-wide font-semibold text-teal-primary">{s.category}</span><h2 className="mt-1 text-sm font-semibold">{s.name}</h2><p className="text-xs text-slate-muted">{s.department}</p></div><ShieldCheck className="h-5 w-5 shrink-0 text-teal-primary"/></div><p className="text-sm leading-relaxed text-slate-muted">{s.summary}</p><a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-primary underline">Open official portal <ExternalLink className="h-3 w-3"/></a></article>)}{visible.length===0&&<p className="p-6 text-center text-sm text-slate-muted">No matching portals. Try another search.</p>}</div>
 <p className="text-[10px] text-slate-muted">The directory is a starting point. Live scheme updates and document verification are not yet configured.</p>
 </div>;
}
