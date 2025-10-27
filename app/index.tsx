import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from './(tabs)/home'
import Settings from './(tabs)/settings'
import Results from './(tabs)/results'
import Favorites from './(tabs)/favorites';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({  // Navigator can be customized using screenOptions
            tabBarIcon: ({ focused, color, size }) => {
                // Function tabBarIcon is given the focused state,
                // color and size params
                let iconName: keyof typeof Ionicons.glyphMap = 'home';

                if (route.name === 'Home') {
                    iconName = 'home';
                } else if (route.name === 'Settings') {
                    iconName = 'settings';
                } else if (route.name === 'Favorites') {
                    iconName = 'heart'
                } else if (route.name === 'Results') {
                    iconName = 'trophy'
                }

                return <Ionicons name={iconName} size={size} color={color} />;   //it returns an icon component
            },
        })}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Results" component={Results} />
            <Tab.Screen name="Favorites" component={Favorites} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
}