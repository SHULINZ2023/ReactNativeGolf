import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import {useNavigation} from '@react-navigation/native';


const Profile = () =>
{
    const navigation = useNavigation();

    return (
    <View style={containerStyle}>
        <Button style={buttonStyle} title='Profile' />
    </View>
    )
        
}

const containerStyle = [GlobalStyle.container];
const buttonStyle = [GlobalStyle.button];

export default Profile