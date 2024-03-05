import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '@rneui/base';
import { Input } from '@rneui/themed';
import Authorization  from '../../api/authorization';
import onInputChanged from '../../events/onInputChanged'
import Authentication from '../../storage/Authentication';
import GlobalStyle from '../../styles';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {apiCommon} from '../../api/apiCommon';
import {StringUtil} from '../../util/StringUtil';


const Register = () =>
{
    const navigation = useNavigation();

    const [email, setEmail] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [conPassword, setConPassword] = React.useState('');
    const [paragraph,setParagraph] = React.useState('');
    const SignUpEvent = () =>
    {
        console.log("email:" + email);
        console.log("password" + password);
        console.log('Before Axios Request');

        //verify if all fields are populated with non blank value.
        if(StringUtil.isNullOrEmptyTrimLength(email) || email.indexOf('@') < 0 )
        {
            //Alert.alert('Warning', 'Please enter a valid email');
            setParagraph("Please enter a valid email");
            setEmail("");
            return;
        }
        if(StringUtil.isNullOrEmptyTrimLength(lastName))
        {
            //Alert.alert('Warning', 'Please enter a valid last name');
            setParagraph("Please enter a valid last name");
            setLastName("");
            return;
        }
        if(StringUtil.isNullOrEmptyTrimLength(firstName))
        {
            //Alert.alert('Warning', 'Please enter a valid first name');
            setParagraph("Please enter a valid first name");
            setFirstName("");
            return;
        }
        /*
        if(StringUtil.isNullOrEmptyTrimLength(phone))
        {
            Alert.alert('Warning', 'Please enter a valid phone');
            setPhone("");
            return;
        }
        else
        {
            const cleanedPhoneNumber = phone.replace(/\D/g, '');

            // Check if the cleaned number has 10 digits (typical for U.S. numbers)
            if (/^\d{10}$/.test(cleanedPhoneNumber)) {
                 ;
            } else {
                Alert.alert('Warning', 'Please enter a valid phone');
                return;
            }
        }
        */
        //verify password and confirm password
        if(StringUtil.isNullOrEmptyTrimLength(password) || StringUtil.isNullOrEmptyTrimLength(conPassword))
        {
            //Alert.alert('Warning', 'Please enter a valid password');
            setParagraph("Please enter a valid password");
            return;
        }
        else
        {
            if(password.lastIndexOf < 8 || password !== conPassword) 
            {
                //Alert.alert('Warning', 'Please enter a valid password');
                setParagraph("Please enter a valid password");
                return;
            }
        }

        let signUpBody=
        {
            lastname:lastName,
            firstname:firstName,
            email:email,
            password:password
        }

        let url = apiCommon.baseUrl + 'Authorization/SignUp';
       
        let bodyString = JSON.stringify(signUpBody);
        axios.post(url, bodyString,{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }},
            { timeout: 5000 }
            )
        .then(response => {
            console.log('After Axios Request');
            if (response.data.value == null)
                {
                    console.log("user not logged in");
                    console.log(response);
                    console.log(response.data.errorMessages);
                    setParagraph(JSON.stringify(response.data.errorMessages));
                      
                    return;
                }
            Authentication.SetAuthToken(response.data.value);
            navigation.navigate('main');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    return (
    <View style={containerStyle}>   
        <View style={subContainerStyle1}>
            <Input style={inputStyle} value={lastName} onChangeText={(val) => setLastName(val)} placeholder="Last Name"></Input>
            <Input style={inputStyle} value={firstName} onChangeText={(val) => setFirstName(val)} placeholder="First Name"></Input>
            <Input style={inputStyle} value={email} onChangeText={(val) => setEmail(val)} placeholder="Email"></Input>
            <Input style={inputStyle} value={password} onChangeText={(val) => setPassword(val)} secureTextEntry={true} placeholder="Password" ></Input>
            <Input style={inputStyle} value={conPassword} onChangeText={(val) => setConPassword(val)} secureTextEntry={true} placeholder="Confirm Password" ></Input>
            <Button style={buttonStyle} onPress={() => SignUpEvent()}>Sign Up</Button>
            
        </View>
        <View style={subContainerStyle2}>
        <Text style={textStyle}>{paragraph}</Text>
      </View>

    </View> 
    
    )

}

    const containerStyle = [GlobalStyle.container];
    const subContainerStyle1 = [GlobalStyle.subcontainer1];
    const subContainerStyle2 = [GlobalStyle.subcontainer2];
    const buttonStyle = [GlobalStyle.button];
    const inputStyle = [GlobalStyle.input];
    const textStyle = [GlobalStyle.text];

export default Register