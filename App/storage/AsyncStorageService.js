import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageService = 
{
  SaveData : async (key, data) =>
{
  
    try {
        console.log("async storage service");
        await AsyncStorage.setItem(key, data);
      } catch (e) {
        console.error("Error saving data");
        console.error(e);
      }
},
removeKey : async (key) =>
{
      try{
        
        await AsyncStorage.removeItem(key);
      } catch (e) {
        console.error("Error removing key");
        console.error(e);
      }
},

RetrieveData : async (key) =>
{
    try {      
      console.log('retrieve data from async storage');  
        const data = await AsyncStorage.getItem(key);
        return data;
      } catch (e) {
        console.error("Error getting data");
        console.error(e);
        return null;
      }      

      
}
}

export default AsyncStorageService;