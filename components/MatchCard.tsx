import { View, Text } from 'react-native';

interface MatchProps {
    match: {
        homeTeam: string;
        awayTeam: string;
        homeScore: number | null;
        awayScore: number | null;
        minute: number | null;
    };
}

export default function LiveMatchCard({ match }: MatchProps) {
    return (
        <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>
                {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
            </Text>
            <Text style={{ color: 'red' }}>
                {match.minute ? `${match.minute}'` : '—'}
            </Text>
        </View>
    );
}
