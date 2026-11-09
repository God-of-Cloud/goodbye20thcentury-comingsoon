import { ArrowUpRight } from "lucide-react";

const destinations = {
  muse: { name: "Muse end-to-end product case study", line: "From idea to experience.", label: "Read the full case study", url: "https://portfolio-8jg.pages.dev/work/muse" },
  journal: { name: "Hodeye editorial website", line: "Culture, in good company.", label: "Enter the journal", url: "https://hodeye.com" },
  dating: { name: "Hodeye dating website", line: "A little more connected.", label: "Visit the dating website", url: "https://dating.hodeye.com" },
};

export default function ProjectDestinationLink({ destination }: { destination: keyof typeof destinations }) {
  const link = destinations[destination];
  return <a className={`destination-link destination-${destination}`} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.name} (opens in a new tab)`}>
    <span className="destination-line">{link.line}</span>
    <span className="destination-label">{link.label}<ArrowUpRight size={15}/></span>
  </a>;
}
