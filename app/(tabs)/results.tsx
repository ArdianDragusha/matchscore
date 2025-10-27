import { StyleSheet, Text, View } from 'react-native';

export default function Results() {
    return (
        <View style={styles.container}>
            <Text>This is results page</Text>
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