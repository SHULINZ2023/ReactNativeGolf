import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageService4ScoreCard = 
{
  SaveScoreCard : async (scoreCard) =>
{
  
    try {
        console.log("StorageService4ScoreCard");
        await AsyncStorage.setItem(scoreCard.game.game_id, scoreCard);
      } catch (e) {
        console.error("Error saving score card");
        console.error(e);
      }
},
removeScoreCard : async (game_id) =>
{
      try{
        
        await AsyncStorage.removeItem(game_id);
      } catch (e) {
        console.error("Error removing scorecard");
        console.error(e);
      }
},

RetrieveScoreCard : async (game_id) =>
{
    try {      
      console.log('begin retrieve scorecard in the async storage');  
        const scoreCard = await AsyncStorage.getItem(game_id);
        console.log('after retrieving token in the async storage');
        console.log(scoreCard);
        return scoreCard;
      } catch (e) {
        console.error("Error getting scoreCard");
        console.error(e);
        return null;
      }      

      
}
}

export default StorageService4ScoreCard;