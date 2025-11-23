import { EXPO_PUBLIC_FOOTBALL_DATA_API_KEY } from '@env';
import { useEffect, useState } from 'react';

const FOOTBALL_DATA_API_KEY: string | undefined = EXPO_PUBLIC_FOOTBALL_DATA_API_KEY;

type Match = {
    homeTeam: string;
    awayTeam: string;
    homeScore: number | null;
    awayScore: number | null;
    minute: number | null;
};
type MatchesByLeague = Record<string, Match[]>;

export default function useLiveMatches() {
    const [matchesByLeague, setMatchesByLeague] = useState<MatchesByLeague>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveMatches = async () => {
            const headers: HeadersInit = FOOTBALL_DATA_API_KEY
                ? { 'X-Auth-Token': FOOTBALL_DATA_API_KEY }
                : {};

            const response = await fetch(
                `https://api.football-data.org/v4/matches?status=IN_PLAY`,
                { headers }
            );

            if (!response.ok) {
                console.error('Failed to fetch live matches', response.status);
                setMatchesByLeague({});
                setLoading(false);
                return;
            }

            const data = await response.json();
            const matches = data.matches || [];
            const grouped = matches.reduce((acc: MatchesByLeague, m: any) => {
                const league = m.competition?.name ?? 'Unknown';
                if (!acc[league]) acc[league] = [];
                acc[league].push({
                    homeTeam: m.homeTeam?.name ?? '',
                    awayTeam: m.awayTeam?.name ?? '',
                    homeScore: m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? 0,
                    awayScore: m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? 0,
                    minute: m.minute ?? null,
                });
                return acc;
            }, {} as MatchesByLeague);

            setMatchesByLeague(grouped);
            setLoading(false);
        };

        fetchLiveMatches();
        const interval = setInterval(fetchLiveMatches, 30000);

        return () => clearInterval(interval);
    }, []);

    return { matchesByLeague, loading };
}
