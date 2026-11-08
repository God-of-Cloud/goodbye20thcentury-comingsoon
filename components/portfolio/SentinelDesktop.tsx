"use client";
import {useEffect,useRef,useState, type PointerEvent, type FormEvent, type ReactNode} from "react";
import {Send, RotateCcw, Terminal, MessageCircle, BellOff, MoreHorizontal, Check, ChevronLeft, ArrowUpRight} from "lucide-react";

type WindowName="terminal"|"telegram";
type Position={x:number;y:number};
type Line={tag:string;text:string;kind?:string};
const initial:Line[]=[{tag:"",text:"Last login: Sun Nov 8 09:26:41 on ttys000",kind:"muted"},{tag:"",text:"juan@MacBook-Pro ~ % python monitor.py"},{tag:"SENTINEL",text:"Starting campaign monitor…"},{tag:"SESSION",text:"Authenticated. Ready to listen."},{tag:"MONITOR",text:"Watching for new opportunities…"},{tag:"DETECTED",text:"Curlsmith — Volume Foam × Ulta",kind:"success"},{tag:"TELEGRAM",text:"Notification delivered in 0.52s.",kind:"success"}];
const campaigns=["Curlsmith — Volume Foam × Ulta","VORA — ORIGIN Complex","Rare Beauty — Find Comfort","T3 Micro — CeraBounce Brush"];

export default function SentinelDesktop(){
  const stage=useRef<HTMLDivElement>(null);
  const [scale,setScale]=useState(1);
  const [positions,setPositions]=useState<Record<WindowName,Position>>({terminal:{x:28,y:62},telegram:{x:494,y:194}});
  const [visible,setVisible]=useState<Record<WindowName,boolean>>({terminal:true,telegram:true});
  const [front,setFront]=useState<WindowName>("telegram");
  const [alert,setAlert]=useState(true);
  const [running,setRunning]=useState(false);
  const [lines,setLines]=useState<Line[]>(initial);
  const [command,setCommand]=useState("");
  const [messages,setMessages]=useState([campaigns[0],campaigns[1]]);
  const [muted,setMuted]=useState(false);
  const [profile,setProfile]=useState(false);
  const [expanded,setExpanded]=useState<WindowName|null>(null);
  const [extra,setExtra]=useState(false);
  const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
  const drag=useRef<{name:WindowName;startX:number;startY:number;origin:Position}|null>(null);
  const log=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(!stage.current)return;const observer=new ResizeObserver(([entry])=>setScale(entry.contentRect.width/900));observer.observe(stage.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{log.current?.scrollTo({top:log.current.scrollHeight,behavior:"smooth"});},[lines]);
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
  function beginDrag(event:PointerEvent<HTMLDivElement>,name:WindowName){
    if((event.target as HTMLElement).closest("button"))return;
    setFront(name);if(expanded===name)return;
    drag.current={name,startX:event.clientX,startY:event.clientY,origin:positions[name]};event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event:PointerEvent<HTMLDivElement>){
    if(!drag.current)return;const d=drag.current;const width=d.name==="terminal"?600:348;
    setPositions(p=>({...p,[d.name]:{x:Math.max(0,Math.min(900-width,d.origin.x+(event.clientX-d.startX)/scale)),y:Math.max(27,Math.min(430,d.origin.y+(event.clientY-d.startY)/scale))}}));
  }
  const add=(line:Line)=>setLines(p=>[...p.slice(-18),line]);
  function run(){
    if(running)return;
    timers.current.forEach(clearTimeout);setVisible(p=>({...p,terminal:true}));setFront("terminal");setRunning(true);setAlert(false);setLines(initial.slice(0,2));
    const sequence:Line[]=[{tag:"SENTINEL",text:"Starting campaign monitor…"},{tag:"SESSION",text:"Authenticated. Ready to listen."},{tag:"MONITOR",text:"Checking available campaigns…"},{tag:"DETECTED",text:campaigns[messages.length%campaigns.length],kind:"success"},{tag:"TELEGRAM",text:"Provider accepted test in 0.52s.",kind:"success"},{tag:"MONITOR",text:"Listening. Next check in 60s…",kind:"muted"}];
    sequence.forEach((line,i)=>timers.current.push(setTimeout(()=>{add(line);if(i===4){setAlert(true);setMessages(p=>[campaigns[p.length%campaigns.length],...p].slice(0,4));}if(i===sequence.length-1)setRunning(false);},(i+1)*650)));
  }
  function submit(e:FormEvent){e.preventDefault();const input=command.trim().toLowerCase();if(!input)return;setCommand("");if(["run","start","python monitor.py","test"].includes(input)){run();return;}if(input==="clear"){setLines([]);return;}add({tag:"",text:`juan@MacBook-Pro ~ % ${command}`});if(input==="help")add({tag:"HELP",text:"run · test · status · clear · help",kind:"muted"});else if(input==="status")add({tag:"STATUS",text:"Monitor online. Telegram connected.",kind:"success"});else add({tag:"SHELL",text:`Command not found: ${input}. Try ‘help’.`,kind:"muted"});}
  function restore(){timers.current.forEach(clearTimeout);setRunning(false);setVisible({terminal:true,telegram:true});setPositions({terminal:{x:28,y:62},telegram:{x:494,y:194}});setExpanded(null);setLines(initial);setAlert(true);setFront("telegram");setProfile(false);}
  function titlebar(name:WindowName,title:string,icon:ReactNode){return <div className="mac-titlebar" onPointerDown={e=>beginDrag(e,name)} onPointerMove={moveDrag} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null} onDoubleClick={()=>setExpanded(expanded===name?null:name)}><div className="traffic-lights"><button className="light red" aria-label={`Close ${name} window`} onClick={()=>setVisible(p=>({...p,[name]:false}))}/><button className="light yellow" aria-label={`Minimize ${name} window`} onClick={()=>setVisible(p=>({...p,[name]:false}))}/><button className="light green" aria-label={`Resize ${name} window`} onClick={()=>{setFront(name);setExpanded(expanded===name?null:name);}}/></div><span>{icon}{title}</span></div>;}
  return <div className="sentinel-demo project-media"><div className="sentinel-stage" ref={stage}>
    <div className="desktop-canvas" style={{transform:`scale(${scale})`}}>
      <div className="desktop-menubar"><span><Terminal size={12}/><b>Terminal</b><span>Shell</span><span>Edit</span><span>View</span></span><span>Sun Nov 8 <span>9:41 AM</span></span></div>
      <span className="desktop-watermark" aria-hidden="true">S/S</span>
      {visible.terminal&&<div className={`mac-window terminal-window ${expanded==="terminal"?"window-expanded":""}`} style={{left:positions.terminal.x,top:positions.terminal.y,zIndex:front==="terminal"?5:3}} onPointerDown={()=>setFront("terminal")}>{titlebar("terminal","juan — sentinel monitor.py — 80×24",<Terminal size={12}/>)}<div className="terminal-body"><div className="terminal-log" ref={log} aria-live="polite" aria-relevant="additions">{lines.map((line,i)=><div className={`terminal-line ${line.kind||""}`} key={`${i}-${line.text}`}>{line.tag&&<span className="log-tag">[{line.tag}] </span>}{line.text}</div>)}</div><form onSubmit={submit} className="terminal-input"><label htmlFor="sentinel-command">~ %</label><input id="sentinel-command" aria-label="Terminal command. Type help for available commands" value={command} onChange={e=>setCommand(e.target.value)} autoComplete="off" spellCheck={false} placeholder={running?"monitoring…":"type ‘help’ or ‘run’"} disabled={running}/><span className="terminal-cursor" aria-hidden="true">▋</span></form><div className="terminal-status"><span><i/> {running?"CHECKING CAMPAIGNS":"MONITOR ONLINE"}</span><button onClick={run} disabled={running}>{running?"Scanning…":"Run test"}<ArrowUpRight size={11}/></button></div></div></div>}
      {visible.telegram&&<div className={`mac-window telegram-window ${expanded==="telegram"?"window-expanded":""}`} style={{left:positions.telegram.x,top:positions.telegram.y,zIndex:front==="telegram"?5:3}} onPointerDown={()=>setFront("telegram")}>{titlebar("telegram","Telegram @ Juan",<Send size={12}/>)}<div className="telegram-header"><button aria-label={profile?"Back to Sentinel messages":"View Sentinel bot profile"} className="telegram-back" onClick={()=>setProfile(!profile)}><ChevronLeft size={19}/></button><button className="telegram-identity" onClick={()=>setProfile(!profile)}><div className="bot-avatar"><img src="/assets/sentinel/telegram-reference.png" alt="Sentinel bot avatar" draggable="false"/></div><span><b>Skeepers Drop Sentinel</b><small>bot</small></span></button><button aria-label="Telegram options" onClick={()=>setExtra(!extra)}><MoreHorizontal size={20}/></button></div>{extra&&<div className="telegram-options"><button onClick={()=>{setMuted(!muted);setExtra(false);}}><BellOff size={14}/>{muted?"Unmute notifications":"Mute notifications"}</button><button onClick={()=>{setProfile(!profile);setExtra(false);}}><MessageCircle size={14}/>Bot information</button></div>}{profile?<div className="bot-profile"><div className="bot-avatar"><img src="/assets/sentinel/telegram-reference.png" alt="" draggable="false"/></div><b>Skeepers Drop Sentinel</b><span>@juan_skeepers_sentinel_2026_bot</span><p>A personal campaign monitor.<br/>New opportunities, straight to Telegram.</p><button onClick={()=>setProfile(false)}>Back to messages</button></div>:<div className="telegram-messages"><div className="chat-date">November 8</div>{messages.map((message,i)=><div className="chat-message" key={`${i}-${message}`}><strong><span className="campaign-dot"/>New campaign detected</strong><p>{message}</p><span className="chat-url">creator.im.skeepers.io ↗</span><small>09:4{1+i}<Check size={10}/><Check size={10}/></small></div>)}<span className="telegram-connected">{muted?<><BellOff size={11}/> Notifications muted</>:"Telegram connected · listening for updates"}</span></div>}</div>}
      {alert&&<div className="notification-wrap" style={{zIndex:8}}><button className="notification-image" aria-label="Open Sentinel notification in Telegram" onClick={()=>{setVisible(p=>({...p,telegram:true}));setFront("telegram");setAlert(false);setProfile(false);}}><img src="/assets/sentinel/notification.png" alt="Skeepers Drop Sentinel — Sentinel test. Check your iPhone sound, Lock Screen and Focus settings." draggable="false"/></button><button className="notification-dismiss" aria-label="Dismiss Sentinel notification" onClick={()=>setAlert(false)}>×</button></div>}
      <div className="desktop-dock"><button className={`dock-icon dock-terminal ${visible.terminal?"is-open":""}`} aria-label="Open Terminal" onClick={()=>{setVisible(p=>({...p,terminal:true}));setFront("terminal");}}><Terminal size={23}/></button><button className={`dock-icon dock-telegram ${visible.telegram?"is-open":""}`} aria-label="Open Telegram" onClick={()=>{setVisible(p=>({...p,telegram:true}));setFront("telegram");}}><Send size={24} fill="white" strokeWidth={1.5}/></button><span className="dock-divider"/><button className="dock-icon dock-reset" aria-label="Reset desktop demonstration" onClick={restore}><RotateCcw size={21}/></button></div>
      <div className="desktop-caption"><span><span className="live-dot"/>SCRIPTED DEMO</span><span>Drag the windows. Try the terminal.</span></div>
    </div></div><div className="sentinel-mobile-tools"><button onClick={run} disabled={running}>{running?"Running demo…":"Run test sequence"}<ArrowUpRight size={13}/></button><span>Scripted desktop study</span><button aria-label="Restore Sentinel desktop" onClick={restore}><RotateCcw size={14}/></button></div>
  </div>;
}
