import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Favourites() {
    const [favourites, setFavourites] = useState<any[]>([]);

    const loadFavourites = async () => {
        try {
            const favs = await AsyncStorage.getItem("favourites");
            setFavourites(favs ? JSON.parse(favs) : []);
        } catch (err) {
            console.error("Failed to load favourites:", err);
        }
    };

    // Refresh list every time screen is focused
    useFocusEffect(
        useCallback(() => {
            loadFavourites();
        }, [])
    );

    const removeFavourite = async (id: number) => {
        try {
            const updated = favourites.filter((f: any) => f.id !== id);
            setFavourites(updated);
            await AsyncStorage.setItem("favourites", JSON.stringify(updated));
        } catch (err) {
            console.error("Failed to remove favourite:", err);
        }
    };

    const getScore = (score: any) => {
        if (!score) return "N/A";

        const home =
            score.fullTime?.home ??
            score.regularTime?.home ??
            score.extraTime?.home ??
            score.penalties?.home ??
            null;

        const away =
            score.fullTime?.away ??
            score.regularTime?.away ??
            score.extraTime?.away ??
            score.penalties?.away ??
            null;

        return home !== null && away !== null ? `${home} - ${away}` : "N/A";
    };

    const formatDate = (utc: string) => {
        const d = new Date(utc);
        return d.toLocaleString([], {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
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

            <Text style={styles.date}>{formatDate(item.utcDate)}</Text>

            <TouchableOpacity onPress={() => removeFavourite(item.id)} style={styles.star}>
                <Text style={{ fontSize: 28 }}>⭐</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favourites</Text>

            <FlatList
                data={favourites}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={styles.empty}>No favourites yet.</Text>
                }
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
    title: {
        fontSize: 28,
        textAlign: "center",
        marginBottom: 18,
        fontWeight: "bold",
        color: "#22223b",
        letterSpacing: 0.5,
    },
    empty: {
        textAlign: "center",
        marginTop: 20,
        color: "#777",
        fontSize: 16,
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
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    team: { flex: 1, alignItems: "center" },
    logo: {
        width: 48,
        height: 48,
        marginBottom: 6,
        borderRadius: 24,
        backgroundColor: "#e0e7ef",
    },
    score: { fontSize: 22, fontWeight: "bold", color: "#007AFF" },
    star: { alignSelf: "center", marginTop: 10 },
    date: {
        textAlign: "center",
        marginTop: 8,
        color: "#007AFF",
        fontWeight: "600",
        fontSize: 15,
    },
    comp: {
        textAlign: "center",
        color: "#6c757d",
        marginBottom: 5,
        fontWeight: "500",
        fontSize: 14,
    },
});
