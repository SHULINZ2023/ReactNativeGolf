import axios from 'axios';

export const jsonFetch2 = async (url, body) => {

try{
  let bodyString = JSON.stringify(body);
  let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  console.log(headers);
  console.log(bodyString);
  console.log(url);
  const response = await axios.post(url, bodyString, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
 
    console.log('Response:', response.data);
    Alert.alert('Success', 'POST request successful');
    return response.data;
  
}
catch(error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Failed to make POST request');
  };
  console.log("api call completed");
};

export const jsonFetch = async (url, body) => {

    let bodyString = JSON.stringify(body);

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept'
      };
    console.log(headers);
    console.log(bodyString);
    console.log(url);
    try {
      const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: bodyString,
          });

      console.log("api complete");    
      console.log(response);

      return response;

    } catch (error) {
      console.error(error);
    }
  };
