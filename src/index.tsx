import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
// import axios from 'axios'
import Amplify from 'aws-amplify'

import App from './App'
import { cognitoConfig } from 'configs/cognito.config'
import { BrowserRouter } from 'react-router-dom'

// TODO add the default base url
// axios.defaults.baseURL = process.env.REACT_APP_API

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: cognitoConfig.REGION,
    userPoolId: cognitoConfig.USER_POOL_ID,
    userPoolWebClientId: cognitoConfig.APP_CLIENT_ID,
  },
})

ReactDOM.render(
  <main>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </main>,
  document.getElementById('root'),
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
