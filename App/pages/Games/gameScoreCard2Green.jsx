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


const GameScoreCard2Green=()=>
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
          
          const strScoreCard = JSON.stringify(gameScoreCard);
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
          //console.log(storedData);
          const xScoreCard = JSON.parse(storedData);
          // Update state with retrieved data
          console.log("after");
          //console.log(xScoreCard);
          setGameScoreCard(xScoreCard);
        } catch (error) {
          // Handle error if AsyncStorage operation fails
          console.error('Error retrieving data:', error);
        }
      };
      const getCurrentLocation = async () => {
      try {
          const location = await getCurrentPositionAsync({ accuracy: 6 });
          return location.coords;
        } catch (error) {
          console.error('Error getting location:', error);
          setErrorMsg('Error getting location');
          return null;
        }
      };
      useEffect(() => {
        // Fetch data from AsyncStorage when component mounts
        console.log("in useEffect");
        retrieveScoreCard();
        //getCurrentLocation();
            // Request permission to access the device's location
        (async () => {
          const { status } = await requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }


          // Get the device's current location
          const currentLocation = await getCurrentLocation();
          console.log(currentLocation);
          setCurrentLocation(currentLocation);
          console.log("ending");
        })();
      }, []);
      
    const handleCurrentLocationPress=()=>{
      console.log("in press function");
      const distance1 = calculateDistance(holeLocation.latitude,holeLocation.longitude,defaultCurrentLocation.latitude,defaultCurrentLocation.longitude) * 1093.6133;

      const distance2 = calculateDistance(laststrokelocation.latitude,laststrokelocation.longitude,defaultCurrentLocation.latitude,defaultCurrentLocation.longitude) * 1093.6133;
      
      const coordinates1 =[holeLocation,defaultCurrentLocation];
      const coordinates2 = [defaultCurrentLocation,laststrokelocation];
      console.log(coordinates1);
      
      setCoordinatesA(coordinates1);
      setCoordinatesB(coordinates2);
      setDistanceA(Math.round(distance1*100)/100);
      setDistanceB(Math.round(distance2*100)/100);
      setCurrentLocation(defaultCurrentLocation);
    }  
    
    const handleLocationPress=(location)=>{
        //add a Teebox record into gamestroke array
        //move roadmap to next one in scorecard list
        console.log(location);
        const currentDate = new Date();
        const currentCourseHoleid = gameScoreCard.courseHoles.find(e=>e.course_hole_no==gameScoreCard.gameScoreCard.course_hole_id).course_hole_id;
        const roadmap = gameScoreCard.gameHoleRoadmaps.find(e=>e.sequence==gameScoreCard.gameScoreCard.roadmap_sequence);
        const roadmap_id = roadmap.game_hole_roadmap_id
        //locate the last stroke record if not first stroke
        const laststroke = gameScoreCard.gameStrokes.filter(e=>e.golf_course_hole_id==currentCourseHoleid
          && e.game_hole_roadmap_id == roadmap_id);
        //locate the hole's tee   
        const teeStroke = gameScoreCard.gameStrokes.filter(e=>e.golf_course_hole_id=currentCourseHoleid);  
        let stroke_sequence = 0;
          if(laststroke && laststroke.length > 0)   
          {
            stroke_sequence = laststroke[laststroke.length-1].stroke_seqno;
          }
        let scorepoint=0;
        let strokeDistance=0;
        let stroketotal = 1;
        let isInhole = 0;
        /*
        const strokepoints = gameScoreCard.gameStrokes.filter(e=>e.scorepoint != 0);
        if(strokepoints) stroketotal = strokepoints.length;
        */
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
          case "Green": 
            
            scorepoint = 1;
            if(roadmap.end_indc == 1) 
            {
              gameScoreCard.gameScoreCard.roadmap_sequence = 0;
              gameScoreCard.gameScoreCard.course_hole_id += 1;
            }
            else
              gameScoreCard.gameScoreCard.roadmap_sequence += 1;
            break;
          case "Fairway":
            if(stroke_sequence==0)
               strokeDistance = teeStroke[0].distance - distanceA;
            else strokeDistance = distanceB;
            
            if (Math.abs(strokeDistance) >= gameScoreCard.userLevel.level_limit)
              scorepoint = 1;
            else
              scorepoint = -1;

            break;
          case "Others":
            scorepoint=-1;
            break;

          case "Inhole":
            scorepoint=3;
            isInhole =1
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
        stroketotal = scorepoint >= 1 ? (stroketotal + scorepoint):(stroketotal +1)
        const strokescore = totalPositives / stroketotal ;
        console.log("scoresum: " + totalPositives);
        console.log("stroketotal: " + stroketotal);
        gameScoreCard.gameScoreCard.score = strokescore; 
        var gamestroke = {game_match_stroke_id: 0,
                          game_match_score_card_id: gameScoreCard.gameScoreCard.game_match_score_card_id,
                          golf_course_hole_id: currentCourseHoleid,
                          game_hole_roadmap_id: roadmap_id,
                          stroke_seqno: stroke_sequence + 1,
                          latitude: currentLocation.latitude,
                          longitude: currentLocation.longitude,
                          stoke_time: currentDate,
                          course_tee_id: 0,
                          distance: Math.abs(strokeDistance),
                          location: location,
                          isin_putter_length: 0,
                          isin_hole: 0,
                          status: 'Approved',
                          create_time: currentDate,
                          last_upt_time: currentDate,
                          scorepoint: scorepoint
                           };
             console.log(gamestroke);              
             gameScoreCard.gameStrokes.push(gamestroke);
                    
            
            //serialize the gameScoreCard
            //const serializedScoreCard = JSON.stringify(gameScoreCard); 
            saveScoreCard();
            //console.log(serializedScoreCard);               
            navigation.navigate('gameScoreCard',{ game: gameScoreCard.game });
      }

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
      }
      
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }
      
      
    return (
    <View style={[containerStyle]}>
        <View style={[containerStyle, { flex: 0.6 }]}>
            <View style={[containerStyle, { flex: 0.15 }]}>
                <TouchableOpacity
                style={radioButtonText}
                onPress={handleCurrentLocationPress}
                >
                <Text>Set Current Location</Text>
                </TouchableOpacity>
            </View >
            <View style={[containerStyle, { flex: 0.8 }]}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                    latitude: holeLocation.latitude,
                    longitude: holeLocation.longitude,
                    latitudeDelta: 0.01334,
                    longitudeDelta: 0.00734,
                    }}
                        provider={PROVIDER_GOOGLE} // Use Google Maps provider
                        customMapStyle={[]} // Optional: add custom map styles
                        showsUserLocation={true} // Show user's location
                        showsMyLocationButton={true} // Show my location button
                        zoomEnabled={true} // Enable zooming
                        rotateEnabled={true} // Enable rotating
                        scrollEnabled={true} // Enable scrolling
                        mapType="standard" // Map type (standard, satellite, hybrid, terrain)
                        loadingEnabled={true} // Show loading indicator while loading
                        loadingIndicatorColor={'#606060'} // Loading indicator color
                        loadingBackgroundColor={'#f2f2f2'} // Loading background color
                        moveOnMarkerPress={true} // Move map to marker on press
                        toolbarEnabled={true} // Show toolbar
                        showsBuildings={true} // Show buildings
                        showsIndoors={true} // Show indoors
                        showsIndoorLevelPicker={true} // Show indoor level picker
                        showsPointsOfInterest={true} // Show points of interest
                        apiKey={GOOGLE_MAPS_API_KEY} // Google Maps API key
                    >
                          <Marker
                            key={1}
                            coordinate={holeLocation} // Marker coordinate
                            title="green" // Marker title
                            description="Marker Description" // Marker description 
                            />
                            {laststrokelocation && (
                              <Marker
                                key={2}
                                coordinate={laststrokelocation}
                                title="last Location"
                                description="You are here"
                                pinColor="blue"
                              />
                            )}
                            {currentLocation && (
                              <Marker
                                key={3}
                                coordinate={currentLocation}
                                title="Current Location"
                                description="You are here"
                                pinColor="blue"
                              />
                            )}
                            {
                              coordinatesA && (
                                <Polyline
                                  coordinates={coordinatesA}
                                  strokeColor="#000" // Line color
                                  strokeWidth={2} // Line width
                                />
                              )
                            }
                            {
                              coordinatesB && (
                                <Polyline
                                  coordinates={coordinatesB}
                                  strokeColor="#000" // Line color
                                  strokeWidth={2} // Line width
                                />
                              )
                            }
               </MapView>     
            </View>
        </View>
     
        <View style={[containerStyle, { flex: 0.1,flexDirection:"row" }]}>
            <Button style={longButton} title={'To Green  ' + distanceA} size="lg" ></Button>
            <Button style={longButton} title={'To Last   ' + distanceB} size="lg"></Button>
        </View>
        <View style={[containerStyle, { flex: 0.3,flexDirection:"col" }]}>
            <TouchableOpacity
                    style={radioButtonText}
                    onPress={() => handleLocationPress('Green')}
                    >
                    <Text>Green                      {arrow}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={radioButtonText}
                    onPress={() => handleLocationPress('Fairway')}
                    >
                    <Text>Fairway                    {arrow}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={radioButtonText}
                    onPress={() =>handleLocationPress('Others')}
                    >
                    <Text>Others                     {arrow}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={radioButtonText}
                    onPress={() =>handleLocationPress('Inhole')}
                    >
                    <Text>In Hole                    {arrow}</Text>
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


export default GameScoreCard2Green