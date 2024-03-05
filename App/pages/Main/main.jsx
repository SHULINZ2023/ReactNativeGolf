import React,{ useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '@rneui/base';
import {useNavigation} from '@react-navigation/native';
import GlobalStyle  from '../../styles';
import AsyncStorageService from '../../storage/AsyncStorageService';
const Main = () =>
{
    const navigation = useNavigation();
    const [userEmail, setUserEmail] = React.useState('');
  
    const retrieveUser = async()=>{
      const user = await AsyncStorageService.RetrieveData('user');
        setUserEmail(user);
        console.log(user);
    }
    
    useEffect( () => {
        
      retrieveUser();
   
      },[]);
    
    return (
   <View style={containerStyle}>

   
      <View style={[containerStyle,{flex:0.9}]}>
          <Button onPress={() => {navigation.navigate('games');}} style={buttonStyle} title='Games' />
          <Button onPress={() => {navigation.navigate('leaders');}}  style={buttonStyle} title='Leaders' />
          <Button onPress={() => {navigation.navigate('profile');}}  style={buttonStyle} title='Profile' />
      </View>
      <View style={[containerStyle,{flex:0.1}]}>
      <Text>User: {userEmail}</Text>
       </View>
    </View> 
    )

}


const containerStyle = [GlobalStyle.container];
const buttonStyle = [GlobalStyle.button];


export default Main