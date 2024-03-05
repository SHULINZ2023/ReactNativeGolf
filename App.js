import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {SignIn, Register, Home, Main, Games, Leaders, Profile, CreateGame, MyGamesList, GameScoreCard, GameScoreCardTeebox, GameScoreCard2Green,GameScoreCard2Putter,GameScoreCard2Hole} from './App/pages';
import { AuthInterceptor } from './App/api/authInterceptor';

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="home">
          <Stack.Screen name="home" component={Home} title="Home"/>
          <Stack.Screen name="signIn" component={SignIn} title="Sign In"/>  
          <Stack.Screen name="Register" component={Register} title="Sign Up"/>  
          <Stack.Screen name="main" component={Main} title="Main"/>  
          <Stack.Screen name="games" component={Games} title="Games"/>  
          <Stack.Screen name="leaders" component={Leaders} title="Leaders"/>  
          <Stack.Screen name="profile" component={Profile} title="Profile"/>  
          <Stack.Screen name="createGame" component={CreateGame} title="Create Game"/>  
          <Stack.Screen name="myGameList" component={MyGamesList} title="My Games"/>  
          <Stack.Screen name="gameScoreCard" component={GameScoreCard} title="Score Card"/>  
          <Stack.Screen name="gameScoreCardTeebox" component={GameScoreCardTeebox} title="Tee box"/>
          <Stack.Screen name="gameScoreCard2Green" component={GameScoreCard2Green} title="To Green"/>
          <Stack.Screen name="gameScoreCard2Putter" component={GameScoreCard2Putter} title="To Putter"/>
          <Stack.Screen name="gameScoreCard2Hole" component={GameScoreCard2Hole} title="To Hole"/>
        </Stack.Navigator> 
      </NavigationContainer>
    </SafeAreaProvider>
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
