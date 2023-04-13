import './style/global.less';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import rootReducer from './store';
import PageLayout from './layout';
import { GlobalContext } from './context';
import Login from './pages/auth/login';
import checkLogin from './utils/checkLogin';
import changeTheme from './utils/changeTheme';
import useStorage from './utils/useStorage';
import './mock';
import Register from './pages/auth/register';
import Home from './pages/home';
import Material from './pages/material';
import MaterialInfo from './pages/material/MaterialInfo';
import userSettingPage from './pages/user/userSettingPage';
import userInfoPage from './pages/user/userInfoPage';

const store = createStore(rootReducer);
export function fetchUserInfo() {
  store.dispatch({
    type: 'update-userInfo',
    payload: { userLoading: true },
  });
  axios.get('/api/user/userInfo').then((res) => {
    store.dispatch({
      type: 'update-userInfo',
      payload: { userInfo: res.data, userLoading: false },
    });
  });
}

function Index() {
  const [lang, setLang] = useStorage('arco-lang', 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', 'light');

  function getArcoLocale() {
    switch (lang) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  }

  // TODO: WHITELIST
  const whiteList = ['register', 'login','home'];
  const pathname = window.location.pathname.replace(/\//g, '');
  useEffect(() => {
    // if (checkLogin()) {
    //   fetchUserInfo();
    // } else if (whiteList.findIndex((item) => item === pathname) === -1) {
    //   window.location.pathname = '/login';
    // }
  }, []);

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  return (
    <BrowserRouter>
      <ConfigProvider
        locale={getArcoLocale()}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Switch>
              {/* <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path='/home' component={Home} />
              <Route path='/material' component={Material} />
              <Route path='/materialinfo' component={MaterialInfo}/>
              <Route path='/userinfo' component={userInfoPage}/>
              <Route path='/usersetting' component={userSettingPage}/> */}
              <Route path="/" component={PageLayout} />
            </Switch>
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
