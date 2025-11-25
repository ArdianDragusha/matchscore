import { EXPO_PUBLIC_FOOTBALL_DATA_API_KEY } from "@env";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API_URL = "https://api.football-data.org/v4/matches?status=FINISHED";

export default function Results() {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favourites, setFavourites] = useState<any[]>([]);

    const loadFavourites = async () => {
        const stored = await AsyncStorage.getItem("favourites");
        setFavourites(stored ? JSON.parse(stored) : []);
    };

    useEffect(() => {
        loadFavourites();
    }, []);

    const toggleFavourite = async (match: any) => {
        const exists = favourites.some((m: any) => m.id === match.id);

        let updated;
        if (exists) {
            updated = favourites.filter((m: any) => m.id !== match.id);
        } else {
            updated = [...favourites, match];
        }

        setFavourites(updated);
        await AsyncStorage.setItem("favourites", JSON.stringify(updated));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(API_URL, {
                    headers: { "X-Auth-Token": EXPO_PUBLIC_FOOTBALL_DATA_API_KEY },
                });

                const data = await res.json();

                if (Array.isArray(data.matches)) {
                    setMatches(data.matches);
                } else {
                    setError("No results available.");
                }
            } catch (e) {
                setError("Failed to fetch results.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    const getScore = (s: any) =>
        s.fullTime?.home !== null && s.fullTime?.away !== null
            ? `${s.fullTime.home} - ${s.fullTime.away}`
            : "N/A";

    const renderItem = ({ item }: any) => {
        const time = new Date(item.utcDate).toLocaleDateString();

        const isFav = favourites.some((m: any) => m.id === item.id);


        return (
            <View style={styles.card}>
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

                <Text style={styles.comp}>{item.competition.name}</Text>

                <View style={styles.row}>
                    <View style={styles.team}>
                        <Image source={{ uri: item.homeTeam.crest }} style={styles.logo} />
                        <Text>{item.homeTeam.shortName}</Text>
                    </View>

                    <Text style={styles.score}>{getScore(item.score)}</Text>

                    <View style={styles.team}>
                        <Image source={{ uri: item.awayTeam.crest }} style={styles.logo} />
                        <Text>{item.awayTeam.shortName}</Text>
                    </View>
                </View>

                <Text style={styles.time}>{time}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recent Results</Text>

            <FlatList
                data={matches}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#f6f8fa",
    },
    loader: { marginTop: 100 },
    error: {
        textAlign: "center",
        color: "#e74c3c",
        marginTop: 40,
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
    card: {
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        position: "relative",
    },
    starButton: { position: "absolute", right: 16, top: 16, zIndex: 10 },
    comp: {
        textAlign: "center",
        color: "#6c757d",
        marginBottom: 5,
        fontWeight: "500",
        fontSize: 14,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    team: { alignItems: "center", flex: 1 },
    logo: {
        width: 48,
        height: 48,
        marginBottom: 6,
        borderRadius: 24,
        backgroundColor: "#e0e7ef",
    },
    score: { fontSize: 22, fontWeight: "bold", color: "#007AFF" },
    time: {
        textAlign: "center",
        marginTop: 8,
        color: "#007AFF",
        fontWeight: "600",
        fontSize: 15,
    },
});
