import { Routes, Route, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ReactFlowProvider } from 'react-flow-renderer'
import axios from 'axios'

import './App.scss'
import { Main } from 'pages/Main'
import PrivateRoute from 'components/Auth/PrivateRoute/PrivateRoute'
import { RootStore, StoreProvider } from './store'
import { SignIn } from 'components/Auth/SignIn/SignIn'
import { ResetPass } from 'components/Auth/ResetPass/ResetPass'
import { AuthListener } from 'components/Auth/AuthListener/AuthListener'
import { UtilService } from 'services/Utils'

const store = new RootStore()

const App = observer((): JSX.Element => {
  const { userStore } = store
  const { username } = userStore

  axios.interceptors.request.use(
    async (config) => {
      const token = await UtilService.getAuthTokenId()
      if (token) {
        config.headers['Authorization'] = token
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  return (
    <StoreProvider store={store}>
      <AuthListener />
      <div className='App'>
        <ReactFlowProvider>
          <Routes>
            <Route path='/signin'>
              {username ? (
                <Route path='/signin' element={<Navigate to='/home' />} />
              ) : (
                <Route path='/signin' element={<SignIn />}></Route>
              )}
            </Route>
            <Route path='/reset'>
              {username ? (
                <Route path='/reset' element={<Navigate to='/home' />} />
              ) : (
                <Route path='/reset' element={<ResetPass />} />
              )}
            </Route>

            <Route path='*' element={<PrivateRoute component={Main} />}></Route>
          </Routes>
        </ReactFlowProvider>
      </div>
    </StoreProvider>
  )
})

export default App
