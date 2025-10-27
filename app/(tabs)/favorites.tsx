import { StyleSheet, Text, View } from 'react-native';

export default function Favorites() {
    return (
        <View style={styles.container}>
            <Text>This is favorites page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});