import { useEffect, useRef, useState } from "react";
import { MoveHorizontal, RotateCcw } from "lucide-react";

export default function DeviceIndicator({ project }: { project: string }) {
  const host = useRef<HTMLDivElement>(null);
  const reset = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const laptop = project === "35mm";
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let dispose: (() => void) | undefined;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || dispose || disposed) return;
      observer.disconnect();
      try {
        const { mountDevices } = await import("./device-scene");
        if (disposed) return;
        const scene = await mountDevices(element, project);
        if (disposed) { scene.dispose(); return; }
        dispose = scene.dispose;
        reset.current = scene.reset;
        setStatus("ready");
      } catch {
        if (!disposed) setStatus("unavailable");
      }
    }, { rootMargin: "150px" });
    observer.observe(element);
    return () => { disposed = true; observer.disconnect(); dispose?.(); reset.current = null; };
  }, [project]);
  return <div className={`device-indicator ${laptop ? "device-laptop" : "device-phones"}`}>
    <div ref={host} className="device-viewport" role="group" aria-label={laptop ? "Interactive 3D MacBook Pro. Drag or use arrow keys to rotate." : `Interactive 3D iPhone 18 Pro and closed iPhone Duo${project === "amharist" ? "" : ` showing the real ${project === "muse" ? "Muse" : "Hodeye"} interface`}. Drag or use arrow keys to rotate.`} tabIndex={0}>
      {status !== "ready" && <span className="device-loading">{status === "loading" ? "Loading devices…" : laptop ? "Made for Mac" : "Made for iPhone"}</span>}
    </div>
    <div className="device-caption"><span>{laptop ? "MacBook Pro / macOS" : "18 Pro + Duo / iOS"}</span>{status === "ready" && <><span className="device-hint"><MoveHorizontal size={11}/>Drag to turn</span><button onClick={() => reset.current?.()} aria-label="Reset device view" title="Reset device view"><RotateCcw size={11}/></button></>}</div>
  </div>;
}
