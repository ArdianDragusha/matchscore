import { useEffect, useState } from 'react';

// Try to read API key safely from globalThis or process.env
const FOOTBALL_DATA_API_KEY: string | undefined =
    (globalThis as any).FOOTBALL_DATA_API_KEY ??
    (typeof process !== 'undefined' ? process.env.FOOTBALL_DATA_API_KEY : undefined);

type Match = {
    homeTeam: string;
    awayTeam: string;
    time: string;
};

type MatchesByLeague = Record<string, Match[]>;

export default function useMatches() {
    const [matchesByLeague, setMatchesByLeague] = useState<MatchesByLeague>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            if (!FOOTBALL_DATA_API_KEY) {
                console.error("⚠️ Missing API key! Make sure FOOTBALL_DATA_API_KEY is set.");
            }

            // Use local date (not UTC) to avoid skipping matches
            const today = new Date();
            const dateFrom = today.toLocaleDateString('en-CA'); // YYYY-MM-DD format in local time

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const dateTo = tomorrow.toLocaleDateString('en-CA');

            const headers: HeadersInit = FOOTBALL_DATA_API_KEY
                ? { 'X-Auth-Token': FOOTBALL_DATA_API_KEY }
                : {};

            try {
                const url = `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
                console.log('📡 Fetching:', url);
                const response = await fetch(url, { headers });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    console.error('❌ Failed to fetch matches', response.status);
                    setMatchesByLeague({});
                    return;
                }

                const data = await response.json();
                const matches = data.matches || [];
                console.log(`✅ Found ${matches.length} matches`);

                const grouped = matches.reduce((acc: MatchesByLeague, m: any) => {
                    const league = m.competition?.name ?? 'Unknown';
                    if (!acc[league]) acc[league] = [];
                    acc[league].push({
                        homeTeam: m.homeTeam?.name ?? '',
                        awayTeam: m.awayTeam?.name ?? '',
                        time: new Date(m.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    });
                    return acc;
                }, {} as MatchesByLeague);

                setMatchesByLeague(grouped);
            } catch (err) {
                console.error('⚠️ Error fetching matches:', err);
                setMatchesByLeague({});
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    return { matchesByLeague, loading };
}
