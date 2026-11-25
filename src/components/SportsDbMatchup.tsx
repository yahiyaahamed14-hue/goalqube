type Props = { home: string; homeBadge?: string; away: string; awayBadge?: string };

function TeamIdentity({ name, badge }: { name: string; badge?: string }) {
  return (
    <span className="gq-event-team">
      {badge ? <img src={badge} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <b aria-hidden="true">{name.slice(0, 2).toUpperCase()}</b>}
      <strong>{name}</strong>
    </span>
  );
}

export default function SportsDbMatchup({ home, homeBadge, away, awayBadge }: Props) {
  return <div className="gq-event-matchup"><TeamIdentity name={home} badge={homeBadge} /><span className="gq-event-vs">VS</span><TeamIdentity name={away} badge={awayBadge} /></div>;
}
