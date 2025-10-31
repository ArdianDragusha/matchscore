import { View, Text } from 'react-native';

interface MatchProps {
    match: {
        homeTeam: string;
        awayTeam: string;
        time: string;
    }
}

export default function MatchCard({ match }: MatchProps) {
    return (
        <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{match.homeTeam} vs {match.awayTeam}</Text>
            <Text>{match.time}</Text>
        </View>
    );
}