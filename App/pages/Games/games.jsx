import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import {useNavigation} from '@react-navigation/native';


const Games = () =>
{

    const navigation = useNavigation();
    
    return (
    <View style={containerStyle}>
       <Button onPress={() => {navigation.navigate('myGameList',{ game_type_id: 1, game_type_name: 'The Perfect Game' });}} style={buttonStyle} title='The Perfect Game'></Button>
       <Button onPress={() => {navigation.navigate('myGameList',{ game_type_id: 2, game_type_name: 'Game Star' });}} style={buttonStyle} title='Golf Star'></Button>
       <Button onPress={() => {navigation.navigate('myGameList',{ game_type_id: 3, game_type_name: 'Invitational Tournament' });}} style={buttonStyle} title='Invitational Tournament'></Button>
       <Button onPress={() => {navigation.navigate('myGameList',{ game_type_id: 4, game_type_name: 'Open Tournament' });}} style={buttonStyle} title='Open Tournament'></Button>
    </View>
    )
    
}

const containerStyle = [GlobalStyle.container];
const buttonStyle = [GlobalStyle.button];


export default Games