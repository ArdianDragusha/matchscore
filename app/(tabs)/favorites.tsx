import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
    container: { flex: 1, paddingTop: 50, backgroundColor: "#fff" },
    title: { fontSize: 24, textAlign: "center", marginBottom: 10, fontWeight: "bold" },
    empty: { textAlign: "center", marginTop: 20, color: "#777" },
    card: {
        padding: 15,
        margin: 10,
        backgroundColor: "#f3f3f3",
        borderRadius: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    team: { flex: 1, alignItems: "center" },
    logo: { width: 40, height: 40, marginBottom: 5 },
    score: { fontSize: 20, fontWeight: "bold" },
    star: { alignSelf: "center", marginTop: 10 },
    date: {
        textAlign: "center",
        marginTop: 8,
        color: "#007AFF",
        fontWeight: "500",
    },
    comp: { textAlign: "center", color: "#777", marginBottom: 5 },
});
