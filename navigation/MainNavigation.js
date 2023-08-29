import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Routes} from './Routes';
import Home from '../screens/Home/Home';
import Uploader from '../screens/Uploader/Uploader';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFileVideo as regularFileVideo} from '@fortawesome/free-regular-svg-icons';
import {faFileVideo as solidFileVideo} from '@fortawesome/free-solid-svg-icons';
import {faCirclePlay as regularCirclePlay} from '@fortawesome/free-regular-svg-icons';
import {faCirclePlay as solidCirclePlay} from '@fortawesome/free-solid-svg-icons';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const renderTabIcons = ({focused, color, size}, route) => {
  let icon;
  switch (route.name) {
    case Routes.HOME:
      icon = focused ? solidCirclePlay : regularCirclePlay;
      break;
    case Routes.UPLOADER:
      icon = focused ? solidFileVideo : regularFileVideo;
      break;
    default:
      icon = regularCirclePlay;
  }
  return <FontAwesomeIcon icon={icon} color={color} size={size} />;
};

const TabNavigation = () => (
  <Tabs.Navigator
    screenOptions={({route}) => ({
      tabBarStyle: {
        position: 'absolute',
        margin: 20,
        marginBottom: 35,
        paddingBottom: 10,
        borderRadius: 30,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabBarIcon: props => renderTabIcons(props, route),
    })}>
    <Tabs.Screen
      name={Routes.HOME}
      component={Home}
      options={{headerShown: false}}
    />
    <Tabs.Screen
      name={Routes.UPLOADER}
      component={Uploader}
      options={{headerTitle: 'Upload New Video'}}
    />
  </Tabs.Navigator>
);

const MainNavigation = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={'BottomTabs'} component={TabNavigation} />
  </Stack.Navigator>
);

export default MainNavigation;
