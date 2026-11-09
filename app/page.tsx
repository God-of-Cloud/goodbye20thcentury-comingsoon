"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight, X, Plus } from "lucide-react";
import SentinelDesktop from "../components/portfolio/SentinelDesktop";
import FilmPlayer from "../components/portfolio/FilmPlayer";
import DeviceIndicator from "../components/portfolio/DeviceIndicator";
import AppStoreLink from "../components/portfolio/AppStoreLink";
import HodeyeEditorialGallery from "../components/portfolio/HodeyeEditorialGallery";
import ProjectDestinationLink from "../components/portfolio/ProjectDestinationLink";

type Project = {
  id: string; number: string; title: string; category: string; description: string;
  note: string; images: {src: string; alt: string}[]; status: string;
};

const projects: Project[] = [
  {id:"muse",number:"001",title:"MUSE",category:"Native iOS / Product design",description:"A fragrance discovery and archive app for collectors, enthusiasts, and the curious.",note:"A personal world of scent. Muse brings discovery, collecting, and fragrance journaling into a considered native experience. An ongoing exploration of the relationship between scent, memory, and identity.",status:"Available on the App Store · 2026",images:[{src:"/assets/muse/duo.png",alt:"Muse fragrance archive on a folding device"},{src:"/assets/muse/discover.png",alt:"Muse fragrance discovery on iPhone"},{src:"/assets/muse/details.png",alt:"Muse fragrance details and note breakdown"},{src:"/assets/muse/collection.png",alt:"Muse personal fragrance collection"}]},
  {id:"hodeye",number:"002",title:"hodeye",category:"Identity, websites & native iOS product",description:"An independently developed brand and pre-release native iOS dating app centered on Black love and relationships.",note:"I’m independently developing hodeye, a native iOS dating app centered on Black love and relationships. The work brings a custom identity, expressive illustration and a quieter product interface into one evolving system. This case study documents the brand and local app build, alongside product directions still being defined.",status:"Independent project · Pre-release native iOS app · Work in progress",images:[]},
  {id:"35mm",number:"003",title:"35MM",category:"macOS / Application",description:"A minimalist video player for macOS, inspired by film, print, and the analog viewing experience.",note:"An application that gives the picture room to breathe. 35MM explores a quieter way to watch, with considered controls and a visual language borrowed from cinema and print.",status:"Available on the Mac App Store · Placeholder film",images:[]},
  {id:"sentinel",number:"004",title:"SKEEPERS SENTINEL",category:"Automation / Development",description:"An independent monitoring system that detects new Skeepers product-testing opportunities and sends real-time notifications.",note:"A small system that keeps an eye on the details. Skeepers Sentinel monitors campaign availability and delivers updates through Telegram. The desktop on this page is an interactive, scripted demonstration based on the original terminal and notification imagery.",status:"Independent software · Interactive demonstration",images:[{src:"/assets/sentinel/telegram-reference.png",alt:"The original Skeepers Drop Sentinel Telegram window"},{src:"/assets/sentinel/terminal-reference.png",alt:"The original Sentinel terminal test"}]},
  {id:"amharist",number:"005",title:"AMHARIST",category:"R&D / Early exploration",description:"An educational platform for learning Amharic, combining a structured curriculum with a modern, culturally grounded experience.",note:"Language as a way back, and a way forward. An early exploration of how thoughtful digital tools can make learning Amharic feel approachable, structured, and connected to culture. The typographic study shown here is a placeholder for the developing project.",status:"Research & early exploration · Placeholder study",images:[]},
];

function ProjectCopy({project,onOpen}:{project:Project;onOpen:()=>void}) {
  return <div className={`project-copy copy-${project.id}`}>
    <div className="project-number"><span>{project.number}</span><span className="number-rule"/><span className="project-year">2026</span></div>
    <h3>{project.title === "SKEEPERS SENTINEL" ? <>SKEEPERS<br/>SENTINEL</> : project.title}</h3>
    <p className="eyebrow category">{project.category}</p>
    {project.id === "hodeye" && <p className="project-development">Independent · In development</p>}
    <p className="project-description">{project.description}</p>
    {project.id !== "sentinel" && <DeviceIndicator project={project.id}/>}
    <div className="project-actions"><button className="text-link" onClick={onOpen}>{project.id === "amharist" ? "Explore project" : "View project"}<ArrowUpRight size={16}/></button><AppStoreLink project={project.id}/>{(project.id === "muse" || project.id === "hodeye") && <div className="project-destinations">{project.id === "muse" ? <ProjectDestinationLink destination="muse"/> : <><ProjectDestinationLink destination="journal"/><ProjectDestinationLink destination="dating"/></>}</div>}</div>
  </div>;
}

function MuseGallery(){
  const [active,setActive]=useState(0);
  const images=[projects[0].images[0],projects[0].images[1],projects[0].images[3]];
  return <div className="muse-gallery project-media">
    <div className="media-topline"><span>Muse — A personal fragrance archive</span><span>iOS / 2026</span></div>
    <img key={active} className="muse-image" src={images[active].src} alt={images[active].alt} loading="eager"/>
    <div className="gallery-controls"><span className="gallery-counter">0{active+1} <span>/ 03</span></span><div className="gallery-arrows"><button aria-label="Previous Muse image" onClick={()=>setActive((active+2)%3)}><ArrowLeft size={17}/></button><button aria-label="Next Muse image" onClick={()=>setActive((active+1)%3)}><ArrowRight size={17}/></button></div></div>
  </div>;
}

function AmharistStudy(){
  const [letter,setLetter]=useState(0);
  const letters=[{char:"ሀ",sound:"hä",name:"First letter, first step."},{char:"ለ",sound:"lä",name:"A language, a little closer."},{char:"መ",sound:"mä",name:"Make room for a new beginning."}];
  return <div className="amharist-study project-media">
    <div className="study-label eyebrow">Amharic / A study in language</div>
    <div className="book-spread" aria-hidden="true"><div className="book-page page-left"><span className="book-small">ፊደል</span><span className="book-letter">{letters[letter].char}</span><span className="book-baseline">{letters[letter].sound} <span>—</span> a beginning</span></div><div className="book-page page-right"><span className="book-small">THE SHAPE OF A LANGUAGE</span><p>ሀ ሁ ሂ ሃ ሄ ህ ሆ<br/>ለ ሉ ሊ ላ ሌ ል ሎ<br/>ሐ ሑ ሒ ሓ ሔ ሕ ሖ<br/>መ ሙ ሚ ማ ሜ ም ሞ<br/>ሠ ሡ ሢ ሣ ሤ ሥ ሦ</p><span className="book-footnote">A new way to find your words.</span></div></div>
    <div className="study-footer"><span>{letters[letter].name}</span><button className="letter-next" aria-label="Explore next Amharic letter" onClick={()=>setLetter((letter+1)%letters.length)}><ArrowRight size={19}/></button></div>
  </div>;
}

export default function Home(){
  const [selected,setSelected]=useState<Project|null>(null);
  const [about,setAbout]=useState(false);
  const [imageIndex,setImageIndex]=useState(0);
  const [menu,setMenu]=useState(false);
  const dialogRef=useRef<HTMLDialogElement>(null);
  const closeButtonRef=useRef<HTMLButtonElement>(null);
  const [time,setTime]=useState("DETROIT, MI");
  useEffect(()=>{
    const update=()=>setTime(new Intl.DateTimeFormat("en-US",{timeZone:"America/Detroit",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date())+" — DETROIT, MI");
    update();const timer=setInterval(update,60000);return()=>clearInterval(timer);
  },[]);
  useEffect(()=>{
    if(selected||about){dialogRef.current?.showModal();document.body.style.overflow="hidden";closeButtonRef.current?.focus();}
    else{dialogRef.current?.close();document.body.style.overflow="";}
    return()=>{document.body.style.overflow="";};
  },[selected,about]);
  const close=()=>{setSelected(null);setAbout(false);};
  const open=(project:Project)=>{setImageIndex(0);setSelected(project);};
  return <>
    <a className="skip-link" href="#work">Skip to selected work</a>
    <div className="site-shell" id="top">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Goodbye 20th Century home"><img src="/assets/identity/logo-transparent.svg" alt="Goodbye 20th Century" width="106" height="49"/><span className="brand-divider"/><span className="eyebrow">GB20C / STUDIO INDEX</span></a>
        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={23}/>:<Plus size={23}/>}</button>
        <nav aria-label="Main navigation" className={menu?"nav-open":""}>
          <a href="#work" onClick={()=>setMenu(false)}>Work<span>05</span></a>
          <button onClick={()=>{setAbout(true);setMenu(false);}}>About</button>
          <a href="#sentinel" onClick={()=>setMenu(false)}>Experiments</a>
          <a href="mailto:hello@goodbye20thcentury.com">Contact<ArrowUpRight size={14}/></a>
        </nav>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-art"><img className="hero-logo" src="/assets/identity/logo-transparent.svg" alt="" width="1000" height="456" fetchPriority="high"/><span className="hero-side-note eyebrow">Always a work<br/>in progress.</span></div>
          <h1 id="hero-title">Goodbye, 20th Century!</h1>
          <div className="hero-bottom"><p className="eyebrow hero-est">Est. 2026 <span>•</span> Digital / Physical</p><p className="hero-intro">Independent design, software, and other things<br className="desktop-break"/> by DaJuan Brown. Detroit, MI.</p><a className="scroll-cue" href="#work" aria-label="Scroll to selected work"><ArrowDown size={24}/></a></div>
        </section>
        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading"><h2 id="work-title">SELECTED WORK<span>(01—05)</span></h2><div className="section-heading-right"><span className="eyebrow">An ongoing collection</span><span className="lime-marker" aria-hidden="true"/></div></div>
          <article className="project-row project-muse" id="muse"><MuseGallery/><ProjectCopy project={projects[0]} onOpen={()=>open(projects[0])}/></article>
          <article className="project-row project-hodeye" id="hodeye"><ProjectCopy project={projects[1]} onOpen={()=>open(projects[1])}/><button className="hodeye-composition hodeye-brand-card project-media" aria-label="View Hodeye editorial case study" onClick={()=>open(projects[1])}><span className="hodeye-card-label">hodeye / A world around connection</span><img className="hodeye-card-wordmark" src="/assets/hodeye/editorial/wordmark-primary.svg" alt="The approved primary Hodeye wordmark" loading="lazy"/><img className="hodeye-card-figure" src="/assets/hodeye/editorial/flower-market.png" alt="The approved Flower Market brand illustration" loading="lazy"/><span className="hodeye-card-line">Culture.<br/>Connection.<br/>Community.</span></button></article>
          <article className="project-row project-film" id="35mm"><FilmPlayer/><ProjectCopy project={projects[2]} onOpen={()=>open(projects[2])}/></article>
          <article className="project-row project-sentinel" id="sentinel"><ProjectCopy project={projects[3]} onOpen={()=>open(projects[3])}/><SentinelDesktop/></article>
          <article className="project-row project-amharist" id="amharist"><AmharistStudy/><ProjectCopy project={projects[4]} onOpen={()=>open(projects[4])}/></article>
        </section>
        <section className="contact-strip" id="contact"><span className="eyebrow">Have something in mind?</span><a href="mailto:hello@goodbye20thcentury.com">Let’s make something.<ArrowUpRight aria-hidden="true"/></a><span className="contact-star" aria-hidden="true">✳</span></section>
      </main>
      <footer className="site-footer"><span>Goodbye 20th Century / An independent practice by DaJuan Brown</span><span className="footer-time">{time}</span><a href="mailto:hello@goodbye20thcentury.com">Say hello<ArrowUpRight size={13}/></a><a href="#top" className="back-top" aria-label="Back to top">↑</a></footer>
    </div>
    <dialog ref={dialogRef} className={`project-dialog ${selected?`dialog-${selected.id}`:"dialog-about"}`} onCancel={close} onClick={e=>{if(e.target===e.currentTarget)close();}} onClose={close} aria-labelledby="dialog-title">
      <div className="dialog-content"><div className="dialog-topbar"><span className="eyebrow">GB20C / {about?"About the practice":`${selected?.number} — Project notes`}</span><button ref={closeButtonRef} className="dialog-close" onClick={close} aria-label="Close project notes"><X size={23}/></button></div>
        {about?<div className="about-content"><img src="/assets/identity/logo-transparent.svg" alt="" width="220" height="100"/><p className="eyebrow">Independent by design.</p><h2 id="dialog-title">A practice<br/>in <i>making things.</i></h2><p>I’m DaJuan Brown, a designer and developer based in Detroit, Michigan. Goodbye 20th Century is my independent practice across digital products, visual identity, software, and the occasional physical thing.</p><p>This is an evolving collection of the things I’m building, learning, and figuring out along the way.</p><a className="text-link" href="mailto:hello@goodbye20thcentury.com">Get in touch<ArrowUpRight size={17}/></a></div>:selected&&<>
          <div className="dialog-project-intro"><div><p className="eyebrow">{selected.category}</p><h2 id="dialog-title">{selected.id === "35mm" ? <>35MM<span className="film-subtitle">Film Player</span></> : selected.title}</h2>{selected.id === "hodeye" && <><p className="he-project-line">A world around connection.</p><span className="eyebrow dialog-status">{selected.status}</span><div className="he-intro-device"><DeviceIndicator project="hodeye"/></div></>}</div><div><p>{selected.note}</p>{selected.id !== "hodeye" && <span className="eyebrow dialog-status">{selected.status}</span>}{selected.id === "hodeye" && <><div className="he-roles"><span>Brand direction</span><span>Product design</span><span>Native iOS development</span></div><p className="he-rationale">Music, movement and creative life give the brand its expressive side. Typography, space and native controls keep the product focused on the person.</p></>}{(selected.id === "muse" || selected.id === "hodeye") && <div className="project-destinations dialog-destinations">{selected.id === "muse" ? <ProjectDestinationLink destination="muse"/> : <><ProjectDestinationLink destination="journal"/><ProjectDestinationLink destination="dating"/></>}</div>}</div></div>
          {selected.id !== "sentinel" && selected.id !== "hodeye" && <div className="dialog-device-bar"><DeviceIndicator key={selected.id} project={selected.id}/><AppStoreLink project={selected.id}/><span className="device-edition eyebrow">{selected.id === "35mm" ? "A little space for cinema." : selected.id === "amharist" ? "A language, a little closer." : "Designed to go with you."}</span></div>}
          {selected.id === "hodeye" ? <HodeyeEditorialGallery/> : selected.images.length>0?<div className="dialog-gallery"><div className="dialog-image-wrap"><img src={selected.images[imageIndex].src} alt={selected.images[imageIndex].alt}/></div><div className="dialog-gallery-nav"><span className="eyebrow">0{imageIndex+1} / 0{selected.images.length}</span><p>{selected.images[imageIndex].alt}</p><div className="gallery-arrows"><button aria-label="Previous project image" onClick={()=>setImageIndex((imageIndex-1+selected.images.length)%selected.images.length)}><ArrowLeft size={18}/></button><button aria-label="Next project image" onClick={()=>setImageIndex((imageIndex+1)%selected.images.length)}><ArrowRight size={18}/></button></div></div></div>:selected.id==="35mm"?<FilmPlayer/>:<AmharistStudy/>}
          {selected.id === "hodeye" && <p className="he-closing-note">Brand and local UI shown as of November 2026. Product and service development continue.</p>}
          <div className="dialog-bottom"><span className="eyebrow">{selected.id === "hodeye" ? "Independent project · In development" : "More of the story, in time."}</span><button className="text-link" onClick={()=>{close();setTimeout(()=>document.getElementById(projects[(projects.indexOf(selected)+1)%projects.length].id)?.scrollIntoView({behavior:"smooth",block:"center"}),100);}}>Next project<ArrowRight size={16}/></button></div>
        </>}
      </div>
    </dialog>
  </>;
}
