import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { EXPO_PUBLIC_FOOTBALL_DATA_API_KEY } from "@env";

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

        // 🔄 Auto-update joka 30 sekuntia
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
    container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
    loader: { marginTop: 100 },
    error: { textAlign: "center", marginTop: 40, color: "red" },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    list: { paddingHorizontal: 10, paddingBottom: 40 },
    card: {
        backgroundColor: "#f8f8f8",
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        elevation: 3,
    },
    competition: { textAlign: "center", color: "#666", marginBottom: 8 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    team: { flex: 1, alignItems: "center" },
    teamName: { fontSize: 14, marginTop: 4 },
    logo: { width: 40, height: 40 },
    scoreBox: { alignItems: "center", paddingHorizontal: 10 },
    score: { fontSize: 22, fontWeight: "bold" },
    minute: { marginTop: 4, fontSize: 14, fontWeight: "600", color: "red" },
});
