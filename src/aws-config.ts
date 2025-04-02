import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
        region: 'ap-southeast-2',
        userPoolId: 'ap-southeast-2_G81cxiFK0',
        userPoolWebClientId: '7p3l7cdkqo3jokeohr7i0pu39d',
        oauth: {
          domain: 'ap-southeast-2g81cxifk0.auth.ap-southeast-2.amazoncognito.com',
          scope: ['email', 'profile', 'openid'],
          redirectSignIn: 'http://localhost:5173/',
          redirectSignOut: 'http://localhost:5173/',
          responseType: 'code',
        },
      },
      },
});