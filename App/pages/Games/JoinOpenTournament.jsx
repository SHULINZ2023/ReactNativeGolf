import React,{useState,useEffect} from 'react'
import { View,  Modal,Text,TextInput,StyleSheet,FlatList, TouchableOpacity, Pressable, Platform } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import { Input } from '@rneui/themed';
import {useNavigation,useRoute} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Authentication from '../../storage/Authentication';
import {apiCommon} from '../../api/apiCommon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AsyncStorageService from '../../storage/AsyncStorageService';

const JoinOpenTournament = () =>
{
    console.log("in JoinOpenTournament");
    const navigation = useNavigation();
    const route = useRoute();
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDateModal, setShowDateModal] = useState(false);
    const [area,setArea] = useState(null);
    const [golfCourse,setGolfCourse] = useState(null);
    const [isCourseFocus, setIsCourseFocus] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [areas,setAreas] = useState([]);
    const [golfcourses,setGolfcourses] = useState([]);
    const [golfcoursesAll,setGolfcoursesAll] = useState([]);
    const [half_course,setHalf_course] = useState(0);
    const [joinOpenTournament,setJoinOpenTournament] = useState(null);
  

    const { game_type_id, game_type_name, game_id} = route.params;

    console.log(game_type_id, game_type_name, game_id);

     const half_course_options=[{half_course_id:0,half_course_code:"Front 9"},{half_course_id:1,half_course_code:"Back 9"}]
    const onAreaChange = (item) => {

         setArea(item);
         const temp = golfcoursesAll.filter(
            e => e.area_id === item.area_id 
          );
          setGolfcourses(temp);
       };
    
    const onHalfCourseChange = (item) => {
        setHalf_course(item);

      };

    const toggleDatePicker=()=>{
        setShowDateModal(!showDateModal);
    };

    const onDateChange = ({type}, selectedDate) => {
       if(type=='set'){
        const currentDate=selectedDate;
        setChosenDate(currentDate);
        if(Platform.OS === "android")
        {
            toggleDatePicker();
            //setBirthDate();
        }
       }
       else
       {
        toggleDatePicker();
       }
      };
      
      const confirmIOSDate=()=>{
        //setBirthOfDate()
        toggleDatePicker();
      }
      const confirmIOSTime=()=>{
        //setBirthOfDate()
        toggleTimePicker();
      }

   
    
      const handleShowDateModal = () => {
        setShowDateModal(true);
      };
  
    
      const handleDateOkPress = () => {
        setShowDateModal(false);
        // Additional actions can be performed here if needed
      }; 
      const handleDateCancelPress = () => {
        setShowDateModal(false);
        // Additional actions can be performed here if needed
      };
 
    const subJoinOpenTournament = () => {
            // Handle the selected date and time
        console.log("in subJoinOpenTournament");
        
        joinOpenTournament.golf_course_id = golfCourse.golf_course_id;
        joinOpenTournament.game_date = new Date(chosenDate);
        joinOpenTournament.start_half_id = half_course;
        joinOpenTournament.status = "active";
        
        let bodyString = JSON.stringify(joinOpenTournament);                    
                        // You can perform any other actions here
                    const subJoinTournament = async(restBody) =>
                        {
                            console.log('Before Axios Request');
                            const userAuth = await AsyncStorage.getItem('auth');
                            let url = apiCommon.baseUrl + 'GameManagement/JoinGameSubmission';
                            
                            await axios.post(url,restBody,{
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
                                navigation.navigate('myGameList',{ game_type_id: game_type_id, game_type_name: game_type_name });
                            })
                            .catch(error => {
                                // Check if the error has a response from the server
                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx
                                console.error('Server responded with status code:', error.response.status);
                                console.error('Response data:', error.response.data);
                        
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
        // Call the fetchData function when the component mounts
        subJoinTournament(bodyString);



        };        
        useEffect(() => {

            const fetchJoinOpenTournament = async() =>
                {
                    console.log('Before Axios Request');
                    const userAuth = await AsyncStorage.getItem('auth');
                    const user_email = await AsyncStorageService.RetrieveData('user');
                    let url = apiCommon.baseUrl + 'GameManagement/GetJoinGameParam';
                    let golfersParam=[];
                    let body = { Email:user_email,
                    game_id:game_id}
                    let bodyString = JSON.stringify(body);
                    await axios.post(url,bodyString,{
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
                        const JoinTournamentParam = response.data.value;
                     
                       
                        setAreas(JoinTournamentParam.areas);
                        setGolfcoursesAll(JoinTournamentParam.golfCourses);
                        setJoinOpenTournament(JoinTournamentParam.joinGame);
                        var temp = JoinTournamentParam.golfCourses.find(e=>e.golf_course_id === JoinTournamentParam.joinGame.golf_course_id );
                        setArea(JoinTournamentParam.areas.find(e=>e.area_id === temp.area_id ));
                        setGolfCourse(temp)

                        setGolfcourses(JoinTournamentParam.golfCourses.filter(e=>e.area_id === temp.area_id ));
                  
                        setChosenDate(new Date(JoinTournamentParam.joinGame.game_date));
                        setHalf_course(JoinTournamentParam.joinGame.start_half_id);
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
            // Call the fetchData function when the component mounts
            fetchJoinOpenTournament();
        
            }, []); // The empty dependency array ensures that this effect runs only once on mount  
    

    return (
    <View style={containerStyle}>
        <View style={[containerStyle, { flex: 0.1 }]}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={areas}
          search
          maxHeight={300}
          labelField="area_name"
          valueField="area_id"
          placeholder={!isFocus ? 'Select an Area' : '...'}
          searchPlaceholder="Search Area Name"
          value={(area===null)?null:area.area_id}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={onAreaChange}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
        </View>
        <View style={[containerStyle, { flex: 0.1 }]}>
            <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={golfcourses}
            search
            maxHeight={300}
            labelField="golf_course_name"
            valueField="golf_course_id"
            placeholder={!isCourseFocus ? (golfCourse===null?'Select golf course':golfCourse.golf_course_name) : '...'}
            searchPlaceholder="Search golf course"
            value={(golfCourse===null)?null:golfCourse.golf_course_id}
            onFocus={() => setIsCourseFocus(true)}
            onBlur={() => setIsCourseFocus(false)}
            onChange={item => {
                setGolfCourse(item);
                setIsCourseFocus(false);
            }}
            renderLeftIcon={() => (
                <AntDesign
                style={styles.icon}
                color={isFocus ? 'blue' : 'black'}
                name="Safety"
                size={20}
                />
            )}
            />
        </View>


        <View style={[containerStyle, { flex: 0.1 }]}>
            <View style={[containerStyle, { flex: 0.4 }]}>
            <Text > Choose Sport Date</Text>
            </View>
           <View style={[containerStyle, { flex: 0.6 }]}> 
                <Pressable onPress={toggleDatePicker}>  
                    <TextInput 
                        style={styles.input}
                        placeholder='choose a date'
                        value={chosenDate.toLocaleString()}
                        onChangeText={setChosenDate}
                        placeholderTextColor="#11182744"
                        editable={false}
                        onPressIn={toggleDatePicker}
                        />
                </Pressable>
            </View>
            <View >
            <Modal
            visible={showDateModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDateModal(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <DateTimePicker
                testID="dateTimePicker"
                value={chosenDate}
                mode="datetime"
                is24Hour={true}
                display="spinner"
                onChange={onDateChange}
                style={{ width: '100%', backgroundColor: 'white' }}
                />
                {showDateModal&&Platform.OS==="ios" &&
                (<View style={{flexDirection:"row",justifyContent:"space_around"}}>
                    <TouchableOpacity style={[styles.button,
                                              styles.pickerButton,
                                              {backgroundColor:"#11182711"}
                            ]}
                            onPress={toggleDatePicker}
                            >
                        <Text style={[styles.buttonText,{color:"#075985"}]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,
                                              styles.pickerButton,
                                               
                            ]}
                            onPress={confirmIOSDate}
                            >
                        <Text style={[styles.buttonText,]}>Confirm</Text>
                    </TouchableOpacity>
                </View>)}
                </View>
            </Modal>      
            </View>
                         
         </View>
         <View  style={{ flexDirection: 'row', alignItems: 'center',flex: 0.2 }}>   
          <Text style={{ marginRight: 10 }}> Choose which half course to play </Text>
          <Picker
            selectedValue={half_course}
            onValueChange={(itemValue, itemIndex) => setHalf_course(itemValue)}
            style={{ width: 150}}
          >
            <Picker.Item label="Front 9" value={0}/>
            <Picker.Item label="Back 9" value={1}/>
          </Picker>
        </View>
        <View style={[containerStyle, { flex: 0.1 }]}>
     
        </View>
        <View style={[containerStyle, { flex: 0.1 }]}>
        <Button onPress={subJoinOpenTournament} title="Submit" />
        </View>
       
    </View>
    )
    
}

const containerStyle = [GlobalStyle.container];
const buttonStyle = [GlobalStyle.button];
const inputStyle = [GlobalStyle.input];
const textStyle = [GlobalStyle.text];
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      fontWeight: 'bold',
      backgroundColor: 'gray',
      color: 'red', // Customize the color as needed
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      datePicker:{
        height:120,
        marginTop:-10
      },
      pickerButton:{
        paddingHorizontal:20,
      },
      buttonText:
      {
        frontSize:14,
        frontWeight:"500",
        color:"#ffff",
      },
      button:{
        height:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:50,
        marginTop:10,
        marginBottom:15,
        backgroundColor:"#075985"
      }
  });
export default JoinOpenTournament