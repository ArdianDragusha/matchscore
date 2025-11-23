import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { EXPO_PUBLIC_FOOTBALL_DATA_API_KEY } from "@env";

const LEAGUES = [
    { id: "PL", name: "Premier League" },
    { id: "PD", name: "La Liga" },
    { id: "SA", name: "Serie A" },
    { id: "BL1", name: "Bundesliga" },
    { id: "FL1", name: "Ligue 1" },
    { id: "CL", name: "Champions League" },
];

export default function Standings() {
    const [standings, setStandings] = useState<any>({});
    const [expandedLeague, setExpandedLeague] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const all = await Promise.all(
                    LEAGUES.map(async (league) => {
                        const res = await fetch(
                            `https://api.football-data.org/v4/competitions/${league.id}/standings`,
                            { headers: { "X-Auth-Token": EXPO_PUBLIC_FOOTBALL_DATA_API_KEY } }
                        );

                        if (!res.ok) {
                            console.warn(`Failed to fetch standings for ${league.name}`);
                            return { league: league.name, table: [] };
                        }

                        const data = await res.json();
                        const table = data.standings?.[0]?.table || [];
                        return { league: league.name, table };
                    })
                );

                const grouped = all.reduce((acc, curr) => {
                    acc[curr.league] = curr.table;
                    return acc;
                }, {} as Record<string, any[]>);

                setStandings(grouped);
            } catch (err) {
                console.error("Error fetching standings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, []);

    const toggleLeague = (leagueName: string) => {
        setExpandedLeague(expandedLeague === leagueName ? null : leagueName);
    };

    if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />;

    return (
        <FlatList
            data={LEAGUES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                const leagueStandings = standings[item.name] || [];
                const expanded = expandedLeague === item.name;

                return (
                    <View style={styles.leagueCard}>
                        <TouchableOpacity onPress={() => toggleLeague(item.name)}>
                            <Text style={styles.leagueTitle}>
                                {item.name} {expanded ? "▲" : "▼"}
                            </Text>
                        </TouchableOpacity>

                        {expanded && (
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.cell, styles.rank]}>#</Text>
                                    <Text style={[styles.cell, styles.team]}>Team</Text>
                                    <Text style={styles.cell}>P</Text>
                                    <Text style={styles.cell}>W</Text>
                                    <Text style={styles.cell}>D</Text>
                                    <Text style={styles.cell}>L</Text>
                                    <Text style={styles.cell}>Pts</Text>
                                </View>

                                {leagueStandings.map((team: any) => (
                                    <View key={team.team.id} style={styles.row}>
                                        <Text style={[styles.cell, styles.rank]}>{team.position}</Text>
                                        <Text style={[styles.cell, styles.team]} numberOfLines={1}>
                                            {team.team.shortName || team.team.name}
                                        </Text>
                                        <Text style={styles.cell}>{team.playedGames}</Text>
                                        <Text style={styles.cell}>{team.won}</Text>
                                        <Text style={styles.cell}>{team.draw}</Text>
                                        <Text style={styles.cell}>{team.lost}</Text>
                                        <Text style={[styles.cell, styles.bold]}>{team.points}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                );
            }}
            contentContainerStyle={styles.list}
        />
    );
}

const styles = StyleSheet.create({
    loader: {
        marginTop: 100,
    },
    list: {
        padding: 10,
        backgroundColor: "#fff",
        paddingBottom: 40,
    },
    leagueCard: {
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 3,
    },
    leagueTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "#007AFF",
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 4,
        marginBottom: 4,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
        paddingVertical: 3,
    },
    cell: {
        flex: 1,
        fontSize: 13,
        textAlign: "center",
    },
    team: {
        flex: 3,
        textAlign: "left",
    },
    rank: {
        flex: 0.5,
    },
    bold: {
        fontWeight: "bold",
    },
});
