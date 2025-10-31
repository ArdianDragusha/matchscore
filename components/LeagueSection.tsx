import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MatchCard from './MatchCard';

interface LeagueSectionProps {
    league: string;
    matches: Array<any>;
}

export default function LeagueSection({ league, matches }: LeagueSectionProps) {
    const [expanded, setExpanded] = useState(true);

    return (
        <View style={{ marginBottom: 12 }}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{league}</Text>
            </TouchableOpacity>
            {expanded &&
                matches.map((match, index) => <MatchCard key={index} match={match} />)}
        </View>
    );
}