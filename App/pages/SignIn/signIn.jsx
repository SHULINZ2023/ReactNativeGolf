import React from 'react'
import { View, Text } from 'react-native'
import { Button } from '@rneui/base';
import { Input } from '@rneui/themed';
import Authorization  from '../../api/authorization';
import onInputChanged from '../../events/onInputChanged'
import Authentication from '../../storage/Authentication';
import GlobalStyle from '../../styles';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {apiCommon} from '../../api/apiCommon';
import AsyncStorageService from '../../storage/AsyncStorageService';


const SignIn = () =>
{
    const navigation = useNavigation();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const SignInEvent = async() =>
    {
        console.log("email:" + email);
        console.log("password" + password);

        console.log('Before Axios Request');
        let url = apiCommon.baseUrl + 'Authorization/SignIn';
        let body = {
            Email: email,
            Password: password
        }
        let bodyString = JSON.stringify(body);
        let token = "";
        await axios.post(url, bodyString,{
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
                    return;
                }
            token = response.data.value;
        })
        .catch(error => {
            console.error('Error:', error);
        });
        await Authentication.SetAuthToken(token);
        console.log("after SetAuthToken");
        await AsyncStorageService.SaveData('user',email);
        navigation.navigate('main');
    }
    return (
    <View style={containerStyle}>
        <Input style={inputStyle} value={email} onChangeText={(val) => setEmail(val)} placeholder="Email"></Input>
        <Input style={inputStyle} value={password} onChangeText={(val) => setPassword(val)} secureTextEntry={true} placeholder="Password" ></Input>
        <Button style={buttonStyle} onPress={() => SignInEvent()}>Sign In</Button>
    </View>
    )

}

    const containerStyle = [GlobalStyle.container];
    const buttonStyle = [GlobalStyle.button];
    const inputStyle = [GlobalStyle.input];

export default SignIn