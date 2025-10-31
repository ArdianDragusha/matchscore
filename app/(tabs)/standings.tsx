import { StyleSheet, Text, View } from 'react-native';

export default function Standings() {
    return (
        <View style={styles.container}>
            <Text>Manage your privacy settings here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontSize: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
