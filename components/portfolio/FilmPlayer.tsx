"use client";
import {useRef, useState} from "react";
import {Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Expand, Film} from "lucide-react";

export default function FilmPlayer(){
  const video=useRef<HTMLVideoElement>(null);
  const [playing,setPlaying]=useState(false);
  const [time,setTime]=useState(0);
  const [duration,setDuration]=useState(10.46);
  const [muted,setMuted]=useState(true);
  const [closed,setClosed]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const toggle=async()=>{if(!video.current)return;if(video.current.paused){try{await video.current.play();}catch{setPlaying(false);}}else video.current.pause();};
  const format=(n:number)=>`${Math.floor(n/60).toString().padStart(2,"0")}:${Math.floor(n%60).toString().padStart(2,"0")}`;
  return <div className={`film-stage project-media ${expanded?"film-expanded":""}`}>
    <div className="film-stage-caption eyebrow"><span>A quieter way to watch.</span><span>35MM / macOS</span></div>
    {closed?<button className="reopen-player" onClick={()=>setClosed(false)}><Film size={34}/><span>Open 35MM</span></button>:<div className="film-window">
      <div className="film-titlebar"><div className="traffic-lights"><button className="light red" aria-label="Close 35MM player" onClick={()=>{video.current?.pause();setClosed(true);}}/><button className="light yellow" aria-label="Minimize 35MM player" onClick={()=>{video.current?.pause();setClosed(true);}}/><button className="light green" aria-label={expanded?"Restore 35MM player":"Expand 35MM player"} onClick={()=>setExpanded(!expanded)}/></div><span>35MM</span><Film size={13}/></div>
      <div className="film-picture"><video ref={video} src="/assets/35mm/film-web.mp4#t=0.1" muted={muted} playsInline preload="metadata" loop onLoadedMetadata={()=>{if(video.current)setDuration(video.current.duration);}} onTimeUpdate={()=>setTime(video.current?.currentTime||0)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onClick={toggle} aria-label="Warm film study, sunlight through curtains"/><button className={`film-play-overlay ${playing?"is-playing":""}`} onClick={toggle} aria-label={playing?"Pause film":"Play film"}><Play size={26} fill="currentColor" strokeWidth={1}/></button><span className="film-frame-marker">01 — LIGHT STUDY</span></div>
      <div className="film-controls"><div className="film-timeline"><span>{format(time)}</span><input aria-label="Film playback position" type="range" min="0" max={duration} step="0.1" value={time} onChange={e=>{if(video.current)video.current.currentTime=Number(e.target.value);setTime(Number(e.target.value));}} style={{"--progress":`${time/duration*100}%`} as React.CSSProperties}/><span>{format(duration)}</span></div><div className="film-buttons"><button aria-label={muted?"Unmute film":"Mute film"} onClick={()=>setMuted(!muted)}>{muted?<VolumeX size={15}/>:<Volume2 size={15}/>}</button><div className="transport"><button aria-label="Restart film" onClick={()=>{if(video.current)video.current.currentTime=0;}}><SkipBack size={17} fill="currentColor"/></button><button className="film-play" onClick={toggle} aria-label={playing?"Pause film":"Play film"}>{playing?<Pause size={17} fill="currentColor"/>:<Play size={17} fill="currentColor"/>}</button><button aria-label="Skip forward five seconds" onClick={()=>{if(video.current)video.current.currentTime=Math.min(duration,video.current.currentTime+5);}}><SkipForward size={17} fill="currentColor"/></button></div><button aria-label={expanded?"Restore player":"Expand player"} onClick={()=>setExpanded(!expanded)}><Expand size={15}/></button></div></div>
    </div>}
    <div className="film-shelf" aria-hidden="true"/><span className="film-caption eyebrow">Film, uninterrupted.</span><div className="film-strip" aria-hidden="true"><span>35</span><i/><i/><i/><i/><i/><i/><i/></div>
  </div>;
}
