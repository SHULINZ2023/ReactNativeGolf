import {jsonFetch} from './request';
import {apiCommon} from './apiCommon';
import Authentication from '../storage/Authentication';

const authorization =  
{
    signIn : async (userName, password) =>
    {
        let url = apiCommon.baseUrl + 'Authorization/SignIn';
        
        let body = {
            UserName: userName,
            Password: password
        }
        jsonFetch(url,body).then((response)=>
        {
             response.json().then(value=>
                {
                    Authentication.SetAuthToken(value.Value);
                    
                });
        });
    }
}

export default authorization;