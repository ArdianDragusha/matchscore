import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { EXPO_PUBLIC_FOOTBALL_DATA_API_KEY } from "@env";

const API_URL = "https://api.football-data.org/v4/matches";

export default function Home() {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favourites, setFavourites] = useState<any[]>([]);

    // Load saved favourites
    const loadFavourites = async () => {
        const stored = await AsyncStorage.getItem("favourites");
        setFavourites(stored ? JSON.parse(stored) : []);
    };

    useEffect(() => {
        loadFavourites();
    }, []);

    // Add or remove a favourite
    const toggleFavourite = async (match: any) => {
        const exists = favourites.some((m: any) => m.id === match.id);

        const updated = exists
            ? favourites.filter((m: any) => m.id !== match.id)
            : [...favourites, match];

        setFavourites(updated);
        await AsyncStorage.setItem("favourites", JSON.stringify(updated));
    };

    // Fetch matches
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                console.log("Fetching matches from API:", API_URL);

                const res = await fetch(API_URL, {
                    headers: { "X-Auth-Token": EXPO_PUBLIC_FOOTBALL_DATA_API_KEY },
                });

                const data = await res.json();
                console.log("ALL MATCHES RECEIVED:", data.matches?.length);

                if (Array.isArray(data.matches)) {
                    // Filter only upcoming matches
                    const upcoming = data.matches.filter(
                        (m: any) =>
                            m.status === "SCHEDULED" ||
                            m.status === "TIMED"
                    );

                    console.log("UPCOMING FILTERED:", upcoming.length);

                    setMatches(upcoming);
                } else {
                    setError("No upcoming matches available.");
                }
            } catch (err) {
                console.error("ERROR FETCHING MATCHES:", err);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    // Render each match
    const renderItem = ({ item }: any) => {
        const home = item.homeTeam;
        const away = item.awayTeam;

        const time = new Date(item.utcDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const isFav = favourites.some((m: any) => m.id === item.id);

        return (
            <View style={styles.card}>
                {/* Favourite Button */}
                <TouchableOpacity
                    style={styles.starButton}
                    onPress={() => toggleFavourite(item)}
                >
                    <Ionicons
                        name={isFav ? "star" : "star-outline"}
                        size={26}
                        color={isFav ? "gold" : "#ccc"}
                    />
                </TouchableOpacity>

                <View style={styles.row}>
                    <View style={styles.team}>
                        <Image source={{ uri: home.crest }} style={styles.logo} />
                        <Text>{home.shortName}</Text>
                    </View>

                    <Text style={styles.vs}>vs</Text>

                    <View style={styles.team}>
                        <Image source={{ uri: away.crest }} style={styles.logo} />
                        <Text>{away.shortName}</Text>
                    </View>
                </View>

                <Text style={styles.time}>{time}</Text>
                <Text style={styles.competition}>{item.competition.name}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upcoming Matches</Text>

            <FlatList
                data={matches}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
    loader: { marginTop: 100 },
    error: { textAlign: "center", color: "red", marginTop: 40 },
    title: { fontSize: 24, textAlign: "center", marginBottom: 10, fontWeight: "bold" },
    card: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        margin: 10,
        borderRadius: 10,
        elevation: 3,
        position: "relative",
    },
    starButton: { position: "absolute", right: 10, top: 10, zIndex: 10 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    team: { flex: 1, alignItems: "center" },
    logo: { width: 40, height: 40, marginBottom: 5 },
    vs: { fontSize: 18, fontWeight: "bold" },
    time: { textAlign: "center", marginTop: 10, color: "#007AFF" },
    competition: { textAlign: "center", color: "#777", marginTop: 5 },
});
