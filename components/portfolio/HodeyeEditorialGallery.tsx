import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

const base = "/assets/hodeye/editorial/";
const chapters = [
  { title: "A living identity", caption: "A custom wordmark and an illustrated world introduce hodeye before the interface takes over.", status: "Approved identity · Brand motion, not a native launch animation" },
  { title: "One mark, several scales", caption: "A three-part symbol connects the wordmark, native icon and Home navigation. Color and typography give each expression its own register.", status: "Original identity exports · Native icon export" },
  { title: "Characters in rhythm", caption: "Music, movement and everyday creative life give the pre-release brand a recognizable world of its own.", status: "AI-assisted brand illustration · Approved painted artwork" },
  { title: "Small gestures", caption: "Five discovery actions share a visual language across Default and Selected states. Their current app placement keeps the person at the center.", status: "Reusable icon states · Local UI demonstration; service actions unconnected" },
  { title: "The journal", caption: "A photographic masthead and four-image wall give the journal a quieter editorial voice around Black culture and relationships.", status: "Coming-soon editorial website study · Captured from the local website" },
  { title: "The dating website", caption: "An evergreen field, oversized wordmark and original raised-arm artwork make the product introduction playful and direct.", status: "Local website prototype · Intended platforms, not released applications" },
  { title: "Native Home", caption: "Home puts photography first. Soft image transitions, a compact identity line and five custom actions sit above native navigation.", status: "Local development build · Demonstration profile and content" },
  { title: "Conversation and context", caption: "Chat and Profile share a header, keeping profile context close to a conversation. Messaging, notifications and account actions remain unconnected to a live service.", status: "Local development build · Demonstration profile and content" },
  { title: "Product choices still taking shape", caption: "Three distinctions guide the product direction. The service, commercial system and release scope continue to be defined.", status: "Proposed product model · Not implemented" },
  { title: "Beyond the screen", caption: "The journal’s photographic treatment extends into an apparel mockup, with the image prominent and the hodeye signature restrained.", status: "Apparel mockup · Photographic brand application" },
];
const palette = [
  ["Evergreen", "#19271D"], ["Sage", "#C7D7B5"], ["Terracotta", "#D9A18F"],
  ["Warm Ivory", "#F4F0E7"], ["Mono Dark", "#252B27"], ["Mono Light", "#F5F4EF"],
];
const actions = ["Rewind", "Pass", "Emerald", "Like", "Impression"];

function Identity() {
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => { setReduced(query.matches); if (query.matches) video.current?.pause(); };
    change(); query.addEventListener("change", change);
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.current?.pause(); });
    if (section.current) observer.observe(section.current);
    const visibility = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { query.removeEventListener("change", change); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <div ref={section} className="he-identity he-stage">
    <span className="he-corner-label">hodeye / Brand identity</span>
    {reduced ? <img className="he-motion-poster" src={base + "identity-poster.png"} alt="The approved hodeye wordmark with the Flower Market character"/> : <video ref={video} className="he-identity-video" poster={base + "identity-poster.png"} loop muted playsInline preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Approved 13.2-second Flower Market wordmark animation"><source src={base + "identity-motion.mp4"} type="video/mp4"/></video>}
    <div className="he-identity-bottom"><span>A world around connection.</span>{!reduced && <button className="he-motion-button" onClick={() => { if (!video.current) return; if (video.current.paused) void video.current.play().catch(() => setPlaying(false)); else video.current.pause(); }}>{playing ? <Pause size={13}/> : <Play size={13}/>}<span>{playing ? "Pause motion" : "Play brand motion"}</span><small>13.2 s</small></button>}</div>
  </div>;
}

function BrandSystem() {
  return <div className="he-system he-stage">
    <div className="he-system-top"><div className="he-symbol-family"><img className="he-symbol-main" src={base + "symbol-sage.svg"} alt="Hodeye’s original three-part abstract sage symbol"/><div>{["terracotta", "dark", "light"].map(color => <span key={color} className={color === "light" ? "he-dark-cell" : ""}><img src={base + `symbol-${color}.svg`} alt={`Symbol in ${color}`}/></span>)}</div></div><div className="he-wordmark-family">{["primary", "dark", "light"].map(color => <div key={color} className={color === "light" ? "he-dark-cell" : ""}><img src={base + `wordmark-${color}.svg`} alt={`Hodeye ${color} wordmark`}/><span>{color === "primary" ? "Primary" : `Mono ${color}`}</span></div>)}</div><div className="he-native-family"><img className="he-native-icon" src={base + "native-icon.png"} alt="Existing Hodeye native icon export"/><span>Native icon export</span><div className="he-home-symbols"><figure><img src={base + "home-outline.svg"} alt="Original Home outline symbol"/><figcaption>Outline</figcaption></figure><figure><img src={base + "home-filled.svg"} alt="Filled Home symbol from the native SF Symbol template"/><figcaption>Filled</figcaption></figure></div></div></div>
    <div className="he-icon-layers"><span>Icon source / Registered layers</span>{["01-stem","02-upper","03-lower"].map((name,i) => <figure key={name}><img src={base + `layer-${name}.svg`} alt={`Original registered ${["stem","upper loop","lower ribbon"][i]} icon layer`}/><figcaption>{["Stem","Upper loop","Lower ribbon"][i]}</figcaption></figure>)}</div>
    <div className="he-palette">{palette.map(([name, color]) => <div key={name}><span style={{background:color}}/><p>{name}<small>{color}</small></p></div>)}</div>
    <div className="he-type"><div><span>DM Sans / Interface & information</span><p>Made for a meaningful hello.</p></div><div><span>Instrument Serif / Editorial & expression</span><p>A little more connected.</p></div></div>
  </div>;
}

function ActionSystem() {
  return <div className="he-actions he-stage"><div className="he-action-sheet"><div className="he-action-labels"><span>Default</span><span>Selected</span></div>{actions.map(action => <div className="he-action-column" key={action}><img src={base + `${action.toLowerCase()}-default.svg`} alt={`${action} Default`}/><img src={base + `${action.toLowerCase()}-selected.svg`} alt={`${action} Selected`}/><span>{action}</span></div>)}</div><div className="he-action-placement"><div><span className="he-small-label">In the local interface</span><p>One family.<br/><i>Five gestures.</i></p></div><div className="he-action-crop"><img src={base + "home-current.png"} alt="Unretouched crop of the actual Home screen, showing Liya’s name and the five action controls"/></div></div></div>;
}

function Journal() {
  return <div className="he-journal he-stage"><div className="he-journal-captures"><picture><source media="(max-width:560px)" srcSet={base + "journal-mobile.png"}/><img src={base + "journal-desktop.png"} alt="Actual later Hodeye journal website: photographic masthead above the four-image wall"/></picture><img className="he-journal-footer" src={base + "journal-footer.png"} alt="The same journal in light appearance, with its photographic introduction and Get notified section"/></div><span className="he-source-line">Selected photography / Kamzy Nuel · Supplied Pexels photographs</span></div>;
}

function DatingWebsite() {
  return <div className="he-dating he-stage"><picture><source media="(max-width:560px)" srcSet={base + "dating-mobile.png"}/><img src={base + "dating-desktop.png"} alt="Actual Hodeye dating website prototype with evergreen background, original wordmark and illustrated raised arms"/></picture></div>;
}

function NativeScreens({ conversation = false }: { conversation?: boolean }) {
  const [active, setActive] = useState(0);
  const items = conversation ? [
    { file: "chat-current.png", title: "Chat detail", detail: "Local conversation presentation" },
    { file: "profile-current.png", title: "Profile within Chat", detail: "Shared header and first profile prompt" },
  ] : [
    { file: "home-current.png", title: "Home / Photo 01", detail: "Home selected · Local photo fixture" },
    { file: "home-photo-02.png", title: "Home / Photo 02", detail: "Same build, device and appearance" },
  ];
  return <div className="he-native he-stage"><div className="he-native-topline"><span>Native iOS / Local development build</span><span>Demonstration content</span></div><div className="he-screen-switch" aria-label="Choose app screen">{items.map((item, i) => <button key={item.file} aria-pressed={active === i} onClick={() => setActive(i)}>{item.title}</button>)}</div><div className="he-screens">{items.map((item,i) => <figure key={item.file} className={i === active ? "is-active" : ""}><img src={base + item.file} alt={`Real Hodeye local development capture — ${item.title}, using demonstration content`}/><figcaption><span>{item.title}</span><small>{item.detail}</small></figcaption></figure>)}</div></div>;
}

function ProductChoices() {
  return <div className="he-product he-stage"><span className="he-small-label">Product direction / Not implemented</span><h4>Explore freely.<br/><i>Participate intentionally.</i></h4><div className="he-choices"><div><span>01</span><h5>Explore / Participate</h5><p>Worldwide browsing would remain free. Active city placement would define where a profile participates in Home discovery, separately from physical residence.</p></div><div><span>02</span><h5>Communication / Membership</h5><p>A conversation would qualify for communication when either participant holds Premium or Emerald, subject to match and safety rules. Lurk is a separate read-only concept.</p></div><div><span>03</span><h5>Interest / Consent</h5><p>An Impression would arrive as a note-bearing request, for its recipient to accept or decline. Proposed rematches would respect recipient choice and blocking.</p></div></div><p className="he-product-note">Pricing, tier scope and release mechanics remain under development.</p></div>;
}

export default function HodeyeEditorialGallery() {
  const [index, setIndex] = useState(0);
  const gallery = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const element = gallery.current;
    const dialog = element?.closest("dialog");
    if (!element || !dialog) return;
    element.focus({ preventScroll: true });
    const bar = dialog.querySelector(".dialog-topbar")?.getBoundingClientRect().height || 60;
    const top = element.getBoundingClientRect().top - dialog.getBoundingClientRect().top + dialog.scrollTop - bar - 14;
    dialog.scrollTo({ top, behavior: "instant" });
  }, [index]);
  const chapter = chapters[index];
  const change = (direction: number) => setIndex(current => (current + direction + chapters.length) % chapters.length);
  return <section ref={gallery} className="hodeye-editorial" aria-label="Hodeye editorial project gallery" aria-roledescription="carousel" tabIndex={0} onKeyDown={event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); change(event.key === "ArrowRight" ? 1 : -1); }
    if (event.key === "Home" || event.key === "End") { event.preventDefault(); setIndex(event.key === "Home" ? 0 : chapters.length-1); }
  }}>
    <div className="he-gallery-heading"><span className="eyebrow">Identity, websites & native iOS product</span><span className="he-chapter-title" aria-live="polite">{String(index+1).padStart(2,"0")} — {chapter.title}</span></div>
    <div key={index} className={`he-frame he-frame-${index+1}`} role="group" aria-roledescription="slide" aria-label={`${index+1} of 10: ${chapter.title}`}>
      {index === 0 ? <Identity/> : index === 1 ? <BrandSystem/> : index === 2 ? <div className="he-illustration he-stage"><img src={base + "characters.png"} alt="The full approved Hodeye illustration collage, celebrating music, movement and creative life"/></div> : index === 3 ? <ActionSystem/> : index === 4 ? <Journal/> : index === 5 ? <DatingWebsite/> : index === 6 ? <NativeScreens/> : index === 7 ? <NativeScreens conversation/> : index === 8 ? <ProductChoices/> : <div className="he-apparel he-stage"><span className="he-corner-label">Beyond the screen / Apparel mockup</span><img src={base + "apparel.jpg"} alt="The full portrait apparel mockup: a sitter in a black Hodeye T-shirt with a restrained photographic print"/></div>}
    </div>
    <div className="he-caption"><span className="he-count">{String(index+1).padStart(2,"0")} / 10</span><div className="he-caption-copy"><p>{chapter.caption}</p><span>{chapter.status}</span></div><div className="gallery-arrows"><button aria-label="Previous Hodeye chapter" onClick={() => change(-1)}><ArrowLeft size={18}/></button><button aria-label="Next Hodeye chapter" onClick={() => change(1)}><ArrowRight size={18}/></button></div></div>
    <nav className="he-chapter-index" aria-label="Hodeye chapters">{chapters.map((item,i) => <button key={item.title} aria-label={`${String(i+1).padStart(2,"0")} — ${item.title}`} aria-current={i === index ? "step" : undefined} onClick={() => setIndex(i)}>{String(i+1).padStart(2,"0")}</button>)}</nav>
  </section>;
}
