import React,{useState,useEffect} from 'react'
import { View,  Modal,Text,TextInput,StyleSheet,FlatList, TouchableOpacity, Pressable, Platform } from 'react-native'
import GlobalStyle  from '../../styles';
import { Button } from '@rneui/base';
import { Input } from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Authentication from '../../storage/Authentication';
import {apiCommon} from '../../api/apiCommon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AsyncStorageService from '../../storage/AsyncStorageService';

const CreateGame = ({route}) =>
{
    const navigation = useNavigation();
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDateModal, setShowDateModal] = useState(false);
    const [area,setArea] = useState(null);
    const [golfCourse,setGolfCourse] = useState(null);
    const [isCourseFocus, setIsCourseFocus] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [areas,setAreas] = useState([]);
    const [golfcourses,setGolfcourses] = useState([]);
    const [golfcoursesAll,setGolfcoursesAll] = useState([]);
    const [golfers,setGolfers] = useState([]);
    const [golfer0,setGolfer0] = useState(null);
    const [golfer1,setGolfer1] = useState(null);
    const [golfer2,setGolfer2] = useState(null);
    const [golfer3,setGolfer3] = useState(null);
    const [golfer4,setGolfer4] = useState(null);
    const [golfer5,setGolfer5] = useState(null);
    const [golfer6,setGolfer6] = useState(null);
    const [golfer7,setGolfer7] = useState(null);

    const [half_course,setHalf_course] = useState(0);
  
    console.log(golfer0);

    const { game_type_id, game_type_name} = route.params;
    const half_course_options=[{half_course_id:0,half_course_code:"Front 9"},{half_course_id:1,half_course_code:"Back 9"}]
    const onAreaChange = (item) => {

         setArea(item);
         const temp = golfcoursesAll.filter(
            e => e.area_id === item.area_id 
          );
          setGolfcourses(temp);
       };
    const onGolferChange = (item,itemType)=>
    {
      switch(itemType)
      {
        case "handle0":
          setGolfer0(item);
          break;
        case "handle1":
          setGolfer1(item);
          break;
        case "handle2":
          setGolfer2(item);
          break;
        case "handle3":  
          setGolfer3(item);
          break;

      }
        
    }   
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
 
    const newGamecreation = () => {
            // Handle the selected date and time
        console.log("in newGamecreation");
             
        const newGameProfile={golfcourse_id:golfCourse.golf_course_id,
                                        golfcourse_name:golfCourse.golf_course_name,
                                        game_date:chosenDate,
                                        half_course_id:half_course.half_course_id,
                                        game_type_id:game_type_id,
                                        golfhandle0: golfer0==null ? 'not defined':golfer0.email,
                                        golfhandle1: golfer1==null ? 'not defined':golfer1.email,
                                        golfhandle2: golfer2==null ? 'not defined':golfer2.email,
                                        golfhandle3: golfer3==null ? 'not defined':golfer3.email,
                                        golfhandle4: golfer4==null ? 'not defined':golfer4.email,
                                        golfhandle5: golfer5==null ? 'not defined':golfer5.email,
                                        golfhandle6: golfer6==null ? 'not defined':golfer6.email,
                                        golfhandle7: golfer7==null ? 'not defined':golfer7.email,
                                        };
        let bodyString = JSON.stringify(newGameProfile);                    
                        // You can perform any other actions here
                    const Creategame = async(newGameProfile) =>
                        {
                            console.log('Before Axios Request');
                            const userAuth = await AsyncStorage.getItem('auth');
                            let url = apiCommon.baseUrl + 'GameManagement/CreateNewGame';
                            
                            await axios.post(url,newGameProfile,{
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
        Creategame(bodyString);                    


        };        
        useEffect(() => {
          const retrieveUser = async()=>{
            console.log("in retrieveUser()");
            
            
          }
            const fetchCourses = async() =>
                {
                    console.log('Before Axios Request');
                    const userAuth = await AsyncStorage.getItem('auth');
                    let url = apiCommon.baseUrl + 'GameManagement/GetNewGameParam';
                    let golfersParam=[];
                    await axios.get(url,{
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
                      //  console.log(response.data.value);
                        const newGameparam = response.data.value;
                       // console.log(newGameparam);
                        //extract area_id and area_name
                        /*
                        const areasx = Array.from(new Set(courselist.map(({ area_id, area_name }) => 
                        `${area_id}-${area_name}`))).map(uniqueKey => {const [area_id, area_name] = uniqueKey.split('-');
                        return { area_id: parseInt(area_id), area_name:area_name };});
                        console.log(areasx);
                        */
                       
                        setAreas(newGameparam.areas);
                        setGolfcoursesAll(newGameparam.golfCourses);
                        setGolfers(newGameparam.golfers);
                        golfersParam = newGameparam.golfers;
                        console.log(golfersParam);
                        //setGames(response.data.value);    
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
                    const user = await AsyncStorageService.RetrieveData('user');
                    console.log("user :" + user);
                    console.log(golfersParam);
                    const golfer=golfersParam.find(e=>e.email.toLowerCase() === user.toLowerCase());
                    console.log(golfer);
                    setGolfer0(golfer);
                    
            }
            // Call the fetchData function when the component mounts
            fetchCourses();
            //retrieveUser();
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

        {game_type_id === 2 && (<View style={[containerStyle, { flex: 0.1 }]}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={golfers}
          search
          maxHeight={300}
          labelField="email"
          valueField="userSystemId"
          placeholder={!isFocus ? 'Select a handle' : '...'}
          searchPlaceholder="Search handle's email"
          value={(golfer1===null)?null:golfer1.userSystemId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item)=>onGolferChange(item,"handle1")}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
        </View>   )}   
        {(game_type_id === 3 || game_type_id === 4)&& (<View style={[containerStyle, { flex: 0.3 }]}>
          
          <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={golfers}
          search
          maxHeight={300}
          labelField="email"
          valueField="userSystemId"
          placeholder={!isFocus ? 'Select a handle' : '...'}
          searchPlaceholder="Search handle's email"
          value={(golfer0===null)?null:golfer0.userSystemId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item)=>onGolferChange(item,"handle0")}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />  
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={golfers}
          search
          maxHeight={300}
          labelField="email"
          valueField="userSystemId"
          placeholder={!isFocus ? 'Select a handle' : '...'}
          searchPlaceholder="Search handle's email"
          value={(golfer1===null)?null:golfer1.userSystemId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item)=>onGolferChange(item,"handle1")}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={golfers}
          search
          maxHeight={300}
          labelField="email"
          valueField="userSystemId"
          placeholder={!isFocus ? 'Select a handle' : '...'}
          searchPlaceholder="Search handle's email"
          value={(golfer2===null)?null:golfer2.userSystemId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item)=>onGolferChange(item,"handle2")}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
          <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={golfers}
          search
          maxHeight={300}
          labelField="email"
          valueField="userSystemId"
          placeholder={!isFocus ? 'Select a handle' : '...'}
          searchPlaceholder="Search handle's email"
          value={(golfer3===null)?null:golfer3.userSystemId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item)=>onGolferChange(item,"handle3")}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
        </View>   )}   

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
            <Picker.Item label="Front 9" value="0" />
            <Picker.Item label="Back 9" value="1" />
          </Picker>
        </View>
        <View style={[containerStyle, { flex: 0.1 }]}>
     
        </View>
        <View style={[containerStyle, { flex: 0.1 }]}>
        <Button onPress={newGamecreation} title="Submit" />
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
export default CreateGame