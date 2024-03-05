import AsyncStorage from '@react-native-async-storage/async-storage';

const Authentication = 
{
  SetAuthToken : async (token) =>
{
  
    try {/*
        let userAuth = {
            token: token
        } */
        console.log(token);
        //const jsonValue = JSON.stringify(userAuth);
        await AsyncStorage.setItem('auth', token);
      } catch (e) {
        console.error("Error saving auth token");
        console.error(e);
      }
},
removeAuthToken : async () =>
{
      try{
        
        await AsyncStorage.removeItem('auth');
      } catch (e) {
        console.error("Error saving auth token");
        console.error(e);
      }
},

GetAuthToken : async () =>
{
    //let userAuth = null;

    try {      
      console.log('begin retrieve token in the async storage');  
        const userAuth = await AsyncStorage.getItem('auth');
        console.log('after retrieving token in the async storage');
        console.log(userAuth);
        return userAuth;
      } catch (e) {
        console.error("Error getting Auth Token");
        console.error(e);
        return null;
      }      

      
}
}

export default Authentication;