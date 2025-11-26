import { EXPO_PUBLIC_FOOTBALL_DATA_API_KEY } from "@env";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";

const API_URL = "https://api.football-data.org/v4/matches?status=IN_PLAY";

export default function Live() {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatches = async () => {
        try {
            const res = await fetch(API_URL, {
                headers: { "X-Auth-Token": EXPO_PUBLIC_FOOTBALL_DATA_API_KEY },
            });

            const data = await res.json();
            console.log("LIVE:", data);

            if (data.matches && data.matches.length > 0) {
                setMatches(data.matches);
            } else {
                setError("No live matches right now.");
            }
        } catch (e) {
            console.error(e);
            setError("Failed to fetch live match data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();

        const interval = setInterval(fetchMatches, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    const renderItem = ({ item }: any) => {
        const home = item.homeTeam;
        const away = item.awayTeam;

        const scoreHome = item.score.fullTime.home ?? item.score.halfTime.home ?? item.score.regularTime?.home ?? "-";
        const scoreAway = item.score.fullTime.away ?? item.score.halfTime.away ?? item.score.regularTime?.away ?? "-";

        const minuteText = item.minute
            ? `${item.minute}'${item.injuryTime ? "+" + item.injuryTime : ""}`
            : "LIVE";

        return (
            <View style={styles.card}>
                <Text style={styles.competition}>{item.competition.name}</Text>

                <View style={styles.row}>
                    <View style={styles.team}>
                        <Image source={{ uri: home.crest }} style={styles.logo} />
                        <Text style={styles.teamName}>{home.shortName}</Text>
                    </View>

                    <View style={styles.scoreBox}>
                        <Text style={styles.score}>{scoreHome} - {scoreAway}</Text>
                        <Text style={styles.minute}>{minuteText}</Text>
                    </View>

                    <View style={styles.team}>
                        <Image source={{ uri: away.crest }} style={styles.logo} />
                        <Text style={styles.teamName}>{away.shortName}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Live Matches</Text>
            <FlatList
                data={matches}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f8fa",
        paddingTop: 50,
    },
    loader: { marginTop: 100 },
    error: {
        textAlign: "center",
        marginTop: 40,
        color: "#e74c3c",
        fontSize: 16,
        fontWeight: "500",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 18,
        color: "#22223b",
        letterSpacing: 0.5,
    },
    list: { paddingHorizontal: 10, paddingBottom: 40 },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginVertical: 10,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    competition: {
        textAlign: "center",
        color: "#6c757d",
        marginBottom: 8,
        fontWeight: "500",
        fontSize: 14,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    team: { flex: 1, alignItems: "center" },
    teamName: { fontSize: 15, marginTop: 6, fontWeight: "600" },
    logo: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#e0e7ef",
    },
    scoreBox: { alignItems: "center", paddingHorizontal: 14 },
    score: { fontSize: 24, fontWeight: "bold", color: "#007AFF" },
    minute: { marginTop: 4, fontSize: 15, fontWeight: "700", color: "#e74c3c" },
});
