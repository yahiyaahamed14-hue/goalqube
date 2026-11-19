import type { Team } from "@/app/services/matchCentre";

export default function MatchClub({ team }: { team?: Team }) {
  const logo = team?.logo || team?.logos?.[0]?.href;
  const name = team?.displayName || "Team to be confirmed";

  return (
    <span className="md-match-club">
      {logo ? (
        // ESPN provides the crest URL with each team.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" width={36} height={36} loading="lazy" />
      ) : (
        <span className="md-match-club-initials" aria-hidden="true">{team?.abbreviation || name.slice(0, 2).toUpperCase()}</span>
      )}
      <span>{name}</span>
    </span>
  );
}
