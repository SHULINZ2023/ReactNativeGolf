import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import {useNavigation} from '@react-navigation/native';


const Home = () =>
{

    const navigation = useNavigation();

    return (
    <View style={containerStyle}>
        <Button onPress={() => {navigation.navigate('signIn');}} style={buttonStyle} title='Sign In' />
        <Button onPress={() => {navigation.navigate('Register');}}  style={buttonStyle} title='Register' />
        <Button onPress={() => {navigation.navigate('aboutTheGame');}}  style={buttonStyle} title='About The Game' />
    </View>
    )
    
}

const containerStyle = [GlobalStyle.container];
const buttonStyle = [GlobalStyle.button];


export default Home