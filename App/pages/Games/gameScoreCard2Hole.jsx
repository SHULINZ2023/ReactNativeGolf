import React,{ useEffect, useState, } from 'react'
import { View, Text, StyleSheet,Stack,TouchableOpacity } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import {useNavigation,useRoute} from '@react-navigation/native';
import {apiCommon} from '../../api/apiCommon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MapView, { PROVIDER_GOOGLE,Marker, Polyline } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

import { GOOGLE_MAPS_API_KEY } from '../../util/MapConfig'; 


const GameScoreCard2Hole=()=>
{   
    const route = useRoute();
    const [gameScoreCard, setGameScoreCard] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [distanceA,setDistanceA] = useState(0);
    const [distanceB,setDistanceB] = useState(0);
    const [coordinatesA,setCoordinatesA] = useState([]);
    const [coordinatesB,setCoordinatesB] = useState([]);
    const navigation = useNavigation();
    const laststrokelocation={ latitude: 50.886706,longitude: -114.045769 };
    const defaultCurrentLocation={latitude: 50.887677, longitude: -114.042549};
    const holeLocation={ latitude: 50.886150,longitude: -114.036450 };
    console.log("here in GameScoreCard2Green");
    const game_id = route.params.game.game_id.toString();
    console.log(game_id);
    const arrow='                         >';
    const saveScoreCard = async () => {
        try {
          // Store data in AsyncStorage
          console.log("in saveScoreCard");
          console.log("???????????????????????");
         // console.log(gameScoreCard.gameStrokes);
          const strScoreCard = JSON.stringify(gameScoreCard);
         // console.log(strScoreCard);
          await AsyncStorage.setItem(game_id, strScoreCard);
          // Update state to reflect stored data
        } catch (error) {
          // Handle error if AsyncStorage operation fails
          console.error('Error storing data:', error);
        }
      };
    const retrieveScoreCard = async () => {
        try {
          // Retrieve data from AsyncStorage
          console.log("in retrieveingScoreCard");
          const storedData = await AsyncStorage.getItem(game_id);
         // console.log(storedData);
          const xScoreCard = JSON.parse(storedData);
          // Update state with retrieved data
          console.log("after");
         //  console.log(xScoreCard);
          setGameScoreCard(xScoreCard);
        } catch (error) {
          // Handle error if AsyncStorage operation fails
          console.error('Error retrieving data:', error);
        }
      };
 
      useEffect(() => {
        // Fetch data from AsyncStorage when component mounts
        console.log("in useEffect");
        retrieveScoreCard();
        //getCurrentLocation();
            // Request permission to access the device's location
       
      
      }, []);
      
  
    
    const handleLocationPress=(location)=>{
        //add a Teebox record into gamestroke array
        //move roadmap to next one in scorecard list
        console.log(location);
        const currentDate = new Date();
        const currentCourseHoleid = gameScoreCard.courseHoles.find(e=>e.course_hole_no==gameScoreCard.gameScoreCard.course_hole_id).course_hole_id;
        const roadmap = gameScoreCard.gameHoleRoadmaps.find(e=>e.sequence==gameScoreCard.gameScoreCard.roadmap_sequence);
        const roadmap_id = roadmap.game_hole_roadmap_id
        //locate the last stroke record if not first stroke
        const laststroke = gameScoreCard.gameStrokes.filter(e=>e.golf_course_hole_id==gameScoreCard.gameScoreCard.course_hole_id
          && e.game_hole_roadmap_id == roadmap_id);
        //console.log("laststroke"); 
        //console.log(laststroke); 
        //locate the hole's tee   
     
        let stroke_sequence = 0;
          if(laststroke && laststroke.length > 0)   
          {
            stroke_sequence = laststroke[laststroke.length-1].stroke_seqno;
          }
        let scorepoint=0;
        let strokeDistance=0;
        let stroketotal = 1;
        let isInhole = 0;
        //const strokepoints = gameScoreCard.gameStrokes.filter(e=>e.scorepoint != 0);
        //if(strokepoints) stroketotal = strokepoints.length;
        stroketotal = gameScoreCard.gameStrokes.reduce((total, gameStroke) => {
          return total + Math.abs(gameStroke.scorepoint);
        }, 0);
        //sum all positive scorepoints
        const scoresum = gameScoreCard.gameStrokes.reduce((total, gameStroke) => {
          if (gameStroke.scorepoint > 0) {
            return total + gameStroke.scorepoint;
          }
          return total;
        }, 0);
        switch (location)
        {
          case "NotInhole":
            scorepoint = -1;
            break;

          case "Inhole":
            scorepoint=1;
            isInhole = 1;
            if(gameScoreCard.gameScoreCard.course_hole_id == 9 || gameScoreCard.gameScoreCard.course_hole_id == 18)
              gameScoreCard.gameScoreCard.status="complete";
            else
            {
              gameScoreCard.gameScoreCard.roadmap_sequence = 0;
              gameScoreCard.gameScoreCard.course_hole_id += 1;
            }
            break;
        };

        const totalPositives = scorepoint >= 1 ? scoresum + scorepoint:scoresum
        const strokescore = totalPositives / (stroketotal + 1) ;
        console.log("totalPositives: " + totalPositives);
        console.log("stroketotal: " + (stroketotal+1));
        gameScoreCard.gameScoreCard.score = strokescore; 
        var gamestroke = {game_match_stroke_id: 0,
                          game_match_score_card_id: gameScoreCard.gameScoreCard.game_match_score_card_id,
                          golf_course_hole_id: currentCourseHoleid,
                          game_hole_roadmap_id: roadmap_id,
                          stroke_seqno: stroke_sequence + 1,
                          latitude: 0,
                          longitude: 0,
                          stoke_time: currentDate,
                          course_tee_id: 0,
                          distance: 0,
                          location: location,
                          isin_putter_length: 0,
                          isin_hole: isInhole,
                          status: 'Approved',
                          create_time: currentDate,
                          last_upt_time: currentDate,
                          scorepoint: scorepoint
                           };
            // console.log(gamestroke);              
             gameScoreCard.gameStrokes.push(gamestroke);
                    
            
            //serialize the gameScoreCard
            //const serializedScoreCard = JSON.stringify(gameScoreCard); 
            saveScoreCard();
            //console.log(serializedScoreCard);               
            navigation.navigate('gameScoreCard',{ game: gameScoreCard.game });
      }

   

      
      
    return (
    <View style={[containerStyle]}>
       
        <View style={[containerStyle, { flex: 0.3,flexDirection:"col" }]}>
            <TouchableOpacity
                    style={radioButtonText}
                    onPress={() => handleLocationPress('Inhole')}
                    >
                    <Text>In Hole                      {arrow}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={radioButtonText}
                    onPress={() => handleLocationPress('NotInhole')}
                    >
                    <Text>Not In Hole                  {arrow}</Text>
            </TouchableOpacity>
         
        </View>
    </View>
    )
}

const containerStyle = [GlobalStyle.container];
const buttonStyle = [GlobalStyle.button];
const longButton = [GlobalStyle.longButton];
const squareButton=[GlobalStyle.squareButton];
const fancyTextStyle = [GlobalStyle.fancyText];
const fancySelectedText = [GlobalStyle.fancySelectedText];
const buttonText = [GlobalStyle.buttonText];
const squareCurrentButton=[GlobalStyle.squareCurrentButton];
const radioButtonText = [GlobalStyle.radioButtonText];
const radioSelectedButtonText = [GlobalStyle.radioSelectedButtonText];


export default GameScoreCard2Hole