import React,{ useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet,Stack,TouchableOpacity } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import {useNavigation,useRoute} from '@react-navigation/native';
import {apiCommon} from '../../api/apiCommon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



const GameScoreCard = () =>
{   console.log("here in GameScoreCard");
    const route = useRoute();
    const navigation = useNavigation();
    const [gameScoreCard, setGameScoreCard] = useState(null);
    const params = route.params;
    const removestorage=0;
    
    console.log(params.game.game_id);
    const game_id =  params.game.game_id.toString();
    let holefactor = 0;
    
    if(gameScoreCard !== null && gameScoreCard.game.start_half_id == 1) holefactor = 9;

    //determine current active hole
    let currentHole = holefactor; // default

    if(gameScoreCard !== null) 
    {
        currentHole = gameScoreCard.gameScoreCard.course_hole_id + holefactor;
    }


    const initGameScoreCard = async() =>
    {
    console.log('here in initGameScoreCard');
    if(removestorage) 
        await AsyncStorage.removeItem(game_id);
    const storedScoreCard = await AsyncStorage.getItem(game_id);
    //console.log(storedScoreCard);
  
    if(storedScoreCard) 
        {
            const xScoreCard = JSON.parse(storedScoreCard);
            setGameScoreCard(xScoreCard);
        }
        else    
            {
            const userAuth = await AsyncStorage.getItem('auth');
            console.log('after Async');
            console.log(userAuth);
            let url = apiCommon.baseUrl + 'GameManagement/InitGameScoreCard';
            let body = { Email:'',
                game_id: params.game.game_id}
            let bodyString = JSON.stringify(body);
            console.log(url);
            await axios.post(url, bodyString,{
                headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAuth}`
                }},
                { timeout: 5000 }
                )
            .then(response => {
                console.log('After Axios Request');
                if (response.data.value == null)
                    {
                        console.log("user not logged in");
                        return;
                    }
           
                setGameScoreCard(response.data.value); 
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
            //alert(`Server Error: ${error.response.data}`);
            } else if (error.request) {
            // The request was made but no response was received
            console.error('Request made but no response received:', error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
            }
            });
        }  
       } 
    /*
       useEffect(
    
        initGameScoreCard()

       ,[]); */
       
       useFocusEffect(
        React.useCallback(() => {
            
                initGameScoreCard();
          
        }, [])
       );
        
      
     // The empty dependency array ensures that this effect runs only once on mount  
      const submitGameScoreCard=async()=>{

        //serialize the gamescorecard
        console.log("in submitGameScoreCard");
    
        const userAuth = await AsyncStorage.getItem('auth');
        console.log('after Async');
        console.log(userAuth);
        let url = apiCommon.baseUrl + 'GameManagement/SubmitGameScoreCard';
        console.log("gameScoreCard before serialized");
        console.log(gameScoreCard);
        let serializedScoreCard = JSON.stringify(gameScoreCard);
        console.log("after serialized");
        console.log(serializedScoreCard);
        await axios.post(url, serializedScoreCard,{
            headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userAuth}`
            }},
            { timeout: 5000 }
            )
        .then(response => {
            console.log('After Axios Request');
            if (response.data.value == null)
                {
                    console.log("user not logged in");
                    return;
                }
            console.log("line 51 ");    
            console.log(response.data.value);
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
        //alert(`Server Error: ${error.response.data}`);
        } else if (error.request) {
        // The request was made but no response was received
        console.error('Request made but no response received:', error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        }
        });
        
      }
      const handlePress= async(holeNumber)=>{
        if(currentHole == holeNumber)
        {
            console.log(holeNumber);
            //determine hole_roadmap_id 
            //roadmap_code
            //PKteebox
            //PKfairway
            //PKgreen
            //PKinhole
            const serializedScoreCard = JSON.stringify(gameScoreCard);
            console.log("handlePress" + game_id);
            if(gameScoreCard.gameScoreCard.status=="complete") return;
            try{
                await AsyncStorage.setItem(game_id, serializedScoreCard);

                const roadmap_code = gameScoreCard.gameHoleRoadmaps.find(e=>e.sequence == gameScoreCard.gameScoreCard.roadmap_sequence).roadmap_code;
                switch(roadmap_code)
                {
                    case "PKteebox":
                        console.log("tab teebox");
                        navigation.navigate('gameScoreCardTeebox',{game:gameScoreCard.game});
                        break;
                    case "PKfairway":
                        console.log("stroke in fairway");
                        navigation.navigate('gameScoreCard2Green',{game:gameScoreCard.game});
                        break;  
                    case "PKgreen":
                        console.log("stroke in green");
                        navigation.navigate('gameScoreCard2Putter',{game:gameScoreCard.game});
                        break;  
                    case "PKInPutter":
                        navigation.navigate('gameScoreCard2Hole',{game:gameScoreCard.game});
                        break;
                    case "PKinhole":
                        console.log("stroke in hole");
                        break; 
                    default:
                        console.log("invalid sequence");  
                        break;                       
                }
            } catch(e)
            {
                console.error(e);
            }

        }
            

      }
      
    return (
    <View style={[containerStyle]}>
       
    {gameScoreCard !== null ? 
        (
            <View style={[containerStyle, { flex: 0.1,flexDirection:"row" }]}>
                <Text style={fancyTextStyle}> {`${gameScoreCard.gameUser.firstName}:  ${Math.floor(gameScoreCard.gameScoreCard.score*100)}` + '%'}</Text>
                { (gameScoreCard.game.game_type_id > 1)&&
                    <Text style={fancyTextStyle}> {gameScoreCard.opponent.firstName} </Text>}
            </View>      
        ):
        (
            <View style={[containerStyle, { flex: 0.1,flexDirection:"row" }]}>    
                <Text style={fancyTextStyle}> Metal75%</Text>
                <Text style={fancyTextStyle}> Metal75%</Text>
            </View>    
        )    
    }           

        <View style={[containerStyle, { flex: 0.7 }]}>
                <View style={{flex: 0.33,flexDirection:"row",justifyContent:"space_around"}}>
                    <TouchableOpacity onPress={() => handlePress(1 + holefactor)}
                    style={((1 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {1 + holefactor} </Text>
                    </TouchableOpacity>    
                    <TouchableOpacity onPress={() => handlePress(2 + holefactor)}
                    style={((2 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {2 + holefactor} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress(3 + holefactor)}
                    style={((3 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {3 + holefactor} </Text>
                    </TouchableOpacity>    
                </View> 
                <View style={{flex: 0.33,flexDirection:"row",justifyContent:"space_around"}}>
                <TouchableOpacity onPress={() => handlePress(4 + holefactor)}
                    style={((4 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {4 + holefactor} </Text>
                    </TouchableOpacity>    
                    <TouchableOpacity onPress={() => handlePress(5 + holefactor)}
                    style={((5 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {5 + holefactor} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress(6 + holefactor)}
                    style={((6 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {6 + holefactor} </Text>
                    </TouchableOpacity>  
                </View> 
                <View style={{flex: 0.33,flexDirection:"row",justifyContent:"space_around"}}>
                <TouchableOpacity onPress={() => handlePress(7 + holefactor)}
                    style={((7 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {7 + holefactor} </Text>
                    </TouchableOpacity>    
                    <TouchableOpacity onPress={() => handlePress(8 + holefactor)}
                    style={((8 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {8 + holefactor} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress(9 + holefactor)}
                    style={((9 + holefactor)==currentHole||gameScoreCard?.gameScoreCard.status=="complete")?squareCurrentButton:squareButton}>  
                        <Text style={buttonText}> {9 + holefactor} </Text>
                    </TouchableOpacity>  
                </View> 
            
        </View>       
        <View style={[containerStyle, { flex: 0.2,flexDirection:"row" }]}>
            <Button disabled={gameScoreCard==null?true:(!gameScoreCard.gameScoreCard.status==="complete")} style={longButton} title='Submit Game' size="lg" onPress={()=>{submitGameScoreCard()}}></Button>
            <Button style={longButton} title='back to gamelist' size="lg"></Button>
        </View>
    </View>
    )
    
}

const containerStyle = [GlobalStyle.container];
const buttonStyle = [GlobalStyle.button];
const longButton = [GlobalStyle.longButton];
const squareButton=[GlobalStyle.squareButton];
const fancyTextStyle = [GlobalStyle.fancyText];
const buttonText = [GlobalStyle.buttonText];
const squareCurrentButton=[GlobalStyle.squareCurrentButton];


export default GameScoreCard