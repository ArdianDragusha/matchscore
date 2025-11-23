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
    container: { flex: 1, paddingTop: 50, backgroundColor: "#fff" },
    loader: { marginTop: 100 },
    error: { textAlign: "center", color: "red", marginTop: 40 },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    card: {
        padding: 15,
        margin: 10,
        backgroundColor: "#f3f3f3",
        borderRadius: 10,
        position: "relative",
    },
    starButton: { position: "absolute", right: 10, top: 10 },
    comp: { textAlign: "center", color: "#777", marginBottom: 5 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    team: { alignItems: "center", flex: 1 },
    logo: { width: 40, height: 40, marginBottom: 5 },
    score: { fontSize: 20, fontWeight: "bold" },
    time: { textAlign: "center", marginTop: 8, color: "#007AFF" },
});
