import { ArrowUpRight } from "lucide-react";

const apps = {
  muse: { name: "Muse", line: "A world of scent. In your pocket.", url: "https://apps.apple.com/us/app/muse-fragrance-assistant/id6786926050" },
  "35mm": { name: "35MM: Film Player", line: "Your next picture starts here.", url: "https://apps.apple.com/us/app/35mm-film-player/id6812949699" },
};

export default function AppStoreLink({ project }: { project: string }) {
  const app = apps[project as keyof typeof apps];
  if (!app) return null;
  return <a className={`app-store-link store-${project}`} href={app.url} target="_blank" rel="noopener noreferrer" aria-label={`${app.name} — Available on the App Store (opens in a new tab)`}>
    <span className="store-line">{app.line}</span>
    <span className="store-label"><span className="store-dot"/>Available on the App Store<ArrowUpRight size={15}/></span>
  </a>;
}
