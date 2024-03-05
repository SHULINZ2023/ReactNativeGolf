import fetchIntercept from 'fetch-intercept';
import Authentication from '../storage/Authentication';

export const AuthInterceptor = () => {
  
  fetchIntercept.register({
    
    request: async function (url, config) {     
        
        let token = JSON.parse(await Authentication.GetAuthToken());

        if (token != null && token.token != null)
        {
            config.headers.Authorization =  `Bearer ${token.token}`;
        }

      return [url, config];
    },

    requestError: function (error) {
      // Called when an error occured during another 'request' interceptor call
      return Promise.reject(error);
    },

    response: function (response) {
      // Modify the reponse object
      return response;
    },

    responseError: function (error) {
      // Handle an fetch error
      return Promise.reject(error);
    },
  });
};

AuthInterceptor();