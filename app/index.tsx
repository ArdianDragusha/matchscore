import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from './(tabs)/home';
import Results from './(tabs)/results';
import Favorites from './(tabs)/favorites';
import Standings from './(tabs)/standings';
import Live from './(tabs)/live';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Live') iconName = 'radio';
                    else if (route.name === 'Results') iconName = 'trophy';
                    else if (route.name === 'Standings') iconName = 'list';
                    else if (route.name === 'Favorites') iconName = 'heart';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Live" component={Live} />
            <Tab.Screen name="Results" component={Results} />
            <Tab.Screen name="Standings" component={Standings} />
            <Tab.Screen name="Favorites" component={Favorites} />
        </Tab.Navigator>
    );
}
