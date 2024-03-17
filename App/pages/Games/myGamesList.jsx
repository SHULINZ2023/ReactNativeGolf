import React,{ useEffect, useState, } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet,FlatList, TouchableOpacity } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import {useNavigation} from '@react-navigation/native';
import Authentication from '../../storage/Authentication';
import {apiCommon} from '../../api/apiCommon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const MyGamesList = ({route}) =>
{
    const [games, setGames] = useState([]);
    console.log("in myGameList page");
    const { game_type_id, game_type_name } = route.params;
    const navigation = useNavigation();
    const suffix_play = "    ->play";
    const suffix_join = "    ->join";



    const fetchGames = async() =>
      {
          console.log('Before Axios Request');
          const userAuth = await AsyncStorage.getItem('auth');
          let url = apiCommon.baseUrl + 'GameManagement/GetGameList';
          let body = { Email:'',
              game_type_id:game_type_id}
          let bodyString = JSON.stringify(body);
          await axios.post(url, bodyString,{
              headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAuth}`
              }},
              { timeout: 5000 }
              )
          .then(response => {
              //console.log(response.data);
              console.log('After Axios Request');
              if (response.data.value == null)
                  {
                      console.log("user not logged in");
                      return;
                  }
              console.log(response.data.value);
              setGames(response.data.value);    
              //Authentication.SetAuthToken(response.data.value);
              //navigation.navigate('main');
          })
          .catch(error => {
               // Check if the error has a response from the server
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server responded with status code:', error.response.status);
            console.error('Response data:', error.response.data);

            // Access specific error properties if needed
            // const status = error.response.status;
            // const data = error.response.data;

            // Display the full error message
            alert(`Server Error: ${error.response.data}`);
            } else if (error.request) {
            // The request was made but no response was received
            console.error('Request made but no response received:', error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
            }
          });
  
         }
        useFocusEffect(
            React.useCallback(() => {
                fetchGames();
            }, [])
        );
  
    
      const onGamePress = (selectedGame) => {
        //Alert.alert('Game Selected', `You clicked on ${selectedGame.game_name}`);
        // Add logic to start the selected game
        if(selectedGame.status == "init") 
          navigation.navigate('JoinOpenTournament',{ game_type_id: game_type_id,game_type_name:game_type_name, game_id: selectedGame.game_id });
        else
          navigation.navigate('gameScoreCard',{ game: selectedGame });
      };
      const Item = ({ game_id, game_name}) => (
        <View>
          <Text style={textStyles}>{game_name}</Text>
         // {SampleImageList()}
        </View>
       );
    return (
    <View style={containerStyle}>
       
       <View style={[containerStyle, { flex: 0.8 }]}>
        <FlatList
          data={games}
          keyExtractor={(item) => item.game_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onGamePress(item)}>
              <Text style={textStyle}>{item.game_name +' ' + item.game_date + (item.status=="init"?suffix_join:suffix_play) }</Text>
            </TouchableOpacity>
          )}
        />
   </View>
   <View style={[containerStyle, { flex: 0.2 }]}>
        <Button onPress={() => {navigation.navigate('createGame',{ game_type_id: game_type_id, game_type_name: game_type_name });}} style={buttonStyle} title='Create Game'></Button>
    </View>
    </View>
    )
    
}

const containerStyle = [GlobalStyle.container];
const buttonStyle = [GlobalStyle.button];
const textStyle = [GlobalStyle.text];


export default MyGamesList