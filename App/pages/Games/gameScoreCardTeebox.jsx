import React,{ useEffect, useState, } from 'react'
import { View, Text, StyleSheet,Stack,TouchableOpacity } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import {useNavigation,useRoute} from '@react-navigation/native';
import {apiCommon} from '../../api/apiCommon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const GameScoreCardTeebox=()=>
{   
    
    const route = useRoute();
    const [gameScoreCard, setGameScoreCard] = useState(null);
    //console.log(gameScoreCard);
    const [selectedTee, setSelectedTee] = useState(0);
    const navigation = useNavigation();
    const params = route.params;
    console.log(params.game.game_id);
    const game_id = '' + params.game.game_id;
    console.log("here in GameScoreCardTeebox");
    let holeTees = null;
    if(gameScoreCard)
        holeTees= gameScoreCard.courseHoleTees.filter(e=>e.course_hole_no==gameScoreCard.gameScoreCard.course_hole_id);

    if(gameScoreCard && (holeTees == null || holeTees.length == 0))
      holeTees=gameScoreCard.courseHoleTees.filter(e=>e.course_hole_no==0);

  
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
          console.log("before");
         // console.log(storedData);
          const xScoreCard = JSON.parse(storedData);
          // Update state with retrieved data
          console.log("after");
         // console.log(xScoreCard);
          setGameScoreCard(xScoreCard);
        } catch (error) {
          // Handle error if AsyncStorage operation fails
          console.error('Error retrieving data:', error);
        }
      };

      useEffect(() => {
        // Fetch data from AsyncStorage when component mounts
        retrieveScoreCard();
      }, []);


    const handleTeePress=(holeTee)=>{
        //add a Teebox record into gamestroke array
        //move roadmap to next one in scorecard list
        const currentDate = new Date();
        console.log("in handleteePress:" + gameScoreCard.gameScoreCard.course_hole_id);
        const currentCourseHoleid = gameScoreCard.courseHoles.find(e=>e.course_hole_no==gameScoreCard.gameScoreCard.course_hole_id).course_hole_id;
        const roadmap_id = gameScoreCard.gameHoleRoadmaps.find(e=>e.sequence==gameScoreCard.gameScoreCard.roadmap_sequence).game_hole_roadmap_id;
        var gamestroke = {game_match_stroke_id: 0,
                          game_match_score_card_id: gameScoreCard.gameScoreCard.game_match_score_card_id,
                          golf_course_hole_id: currentCourseHoleid,
                          game_hole_roadmap_id: roadmap_id,
                          stroke_seqno: 1,
                          latitude: 0,
                          longitude: 0,
                          stoke_time: currentDate,
                          course_tee_id: holeTee.course_tee_id,
                          distance: holeTee.teedistance,
                          location: '',
                          isin_putter_length: 0,
                          isin_hole: 0,
                          status: 'Approved',
                          create_time: currentDate,
                          last_upt_time: currentDate,
                          scorepoint: 0
                           };
            if(gameScoreCard.gameStrokes == null) gameScoreCard.gameStrokes = [gamestroke];
            else gameScoreCard.gameStrokes.push(gamestroke)

            gameScoreCard.gameScoreCard.roadmap_sequence += 1;
            //serialize the gameScoreCard
            saveScoreCard();
            //const serializedScoreCard = JSON.stringify(gameScoreCard); 
            //console.log(serializedScoreCard);               
            navigation.navigate('gameScoreCard',{ game: gameScoreCard.game });
      }
      
    return (
    <View style={[containerStyle]}>
        <View style={[containerStyle, { flex: 0.3 }]}>
            {holeTees && holeTees.map((holeTee) => (
                <TouchableOpacity
                key={holeTee.course_tee_id}
                onPress={() => handleTeePress(holeTee)}
                style={selectedTee==holeTee.course_tee_id?radioSelectedButtonText:radioButtonText}
                >
                <Text >{holeTee.course_teename +"                         " + holeTee.teedistance + " yards >"}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <View style={[containerStyle, { flex: 0.5 }]}>

        <Text >Map</Text>


        </View>     

     
        <View style={[containerStyle, { flex: 0.2,flexDirection:"row" }]}>
            <Button style={longButton} title='view map' size="lg" ></Button>
            <Button style={longButton} title='back to scorecard' size="lg"></Button>
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


export default GameScoreCardTeebox