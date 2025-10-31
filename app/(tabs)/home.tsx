import { ScrollView, Text, View } from 'react-native';
import useMatches from '../../hooks/useMatches';
import LeagueSection from '../../components/LeagueSection';

export default function Home() {
    const { matchesByLeague, loading } = useMatches();

    if (loading) return <Text>Loading...</Text>;

    console.log('Fetched matches:', matchesByLeague);

    if (Object.keys(matchesByLeague).length === 0) {
        return <Text>No matches today 😢</Text>;
    }

    return (
        <ScrollView>
            {Object.entries(matchesByLeague).map(([league, matches]) => (
                <LeagueSection key={league} league={league} matches={matches as any[]} />
            ))}
        </ScrollView>
    );
}