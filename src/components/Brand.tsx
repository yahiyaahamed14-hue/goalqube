// Reuse the approved logo artwork; the SVG viewports select its symbol and wordmark.
const artwork = "/brand/goalqube-logo-v6.png";
export function FootballMark({ className = "" }: { className?: string }) {
 return <svg className={className} viewBox="0 0 560 335" fill="none" aria-hidden="true"><svg width="560" height="335" overflow="hidden"><image href={artwork} x="-330" y="-365" width="1254" height="1254"/></svg></svg>;
}
export function GMark({ className = "" }: { className?: string }) { return <FootballMark className={className}/>; }
export default function Brand() {
 return <span className="gq-brand gq-approved-brand"><FootballMark className="gq-logo-symbol"/><svg className="gq-logo-type" viewBox="350 710 560 130" aria-hidden="true"><image href={artwork} x="0" y="0" width="1254" height="1254"/></svg></span>;
}
