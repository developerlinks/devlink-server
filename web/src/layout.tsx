import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Spin } from '@arco-design/web-react';
import cs from 'classnames';
import {
  IconDashboard,
  IconList,
  IconSettings,
  IconFile,
  IconApps,
  IconCheckCircle,
  IconExclamationCircle,
  IconUser,
  IconMenuFold,
  IconMenuUnfold,
} from '@arco-design/web-react/icon';
import { useSelector } from 'react-redux';
import qs from 'query-string';
import NProgress from 'nprogress';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import useRoute, { IRoute, adminKeys } from '@/routes';
import { isArray } from './utils/is';
import useLocale from './utils/useLocale';
import getUrlParams from './utils/getUrlParams';
import lazyload from './utils/lazyload';
import { GlobalState } from './store';
import styles from './style/layout.module.less';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const Sider = Layout.Sider;
const Content = Layout.Content;

function getIconFromKey(key) {
  switch (key) {
    case 'dashboard':
      return <IconDashboard className={styles.icon} />;
    case 'list':
      return <IconList className={styles.icon} />;
    case 'form':
      return <IconSettings className={styles.icon} />;
    case 'profile':
      return <IconFile className={styles.icon} />;
    case 'visualization':
      return <IconApps className={styles.icon} />;
    case 'result':
      return <IconCheckCircle className={styles.icon} />;
    case 'exception':
      return <IconExclamationCircle className={styles.icon} />;
    case 'user':
      return <IconUser className={styles.icon} />;
    default:
      return <div className={styles['icon-empty']} />;
  }
}

function getFlattenRoutes(routes: IRoute[]) {
  const res = [];
  function travel(_routes, tips = 'admin') {
    _routes.forEach((route) => {
      if (route.name === 'admin' || route.name === 'frontend') {
        tips = route.name;
      }
      const mod =
        tips === 'admin'
          ? import.meta.glob('./pages/admin/**/[a-z[]*.tsx')
          : import.meta.glob('./pages/frontend/**/[a-z[]*.tsx');
      const visibleChildren = (route.children || []).filter(
        (child) => !child.ignore
      );
      if (route.key && (!route.children || !visibleChildren.length)) {
        try {
          route.component = lazyload(
            mod[`./pages/${tips}/${route.key}/index.tsx`]
          );
          res.push(route);
        } catch (e) {
          // console.log(route.key);
          console.error(e);
        }
      }

      if (isArray(route.children) && route.children.length) {
        travel(route.children, tips);
      }
    });
  }
  travel(routes);
  return res;
}

function PageLayout() {
  const urlParams = getUrlParams();
  const history = useHistory();
  const pathname = history.location.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const locale = useLocale();
  const { settings, userLoading, userInfo } = useSelector(
    (state: GlobalState) => state
  );

  const [routes, defaultRoute] = useRoute(userInfo?.permissions);
  const defaultSelectedKeys = [currentComponent || defaultRoute];
  const paths = (currentComponent || defaultRoute).split('/');
  const defaultOpenKeys = paths.slice(0, paths.length - 1);

  const [breadcrumb, setBreadCrumb] = useState([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  const routeMap = useRef<Map<string, React.ReactNode[]>>(new Map());
  const menuMap = useRef<
    Map<string, { menuItem?: boolean; subMenu?: boolean }>
  >(new Map());

  const navbarHeight = 60;
  const menuWidth = collapsed ? 48 : settings.menuWidth;

  const showFooter = settings.footer && urlParams.footer !== false;

  const flattenRoutes = useMemo(() => getFlattenRoutes(routes) || [], [routes]);
  const currentPathName = window.location.pathname.substring(1);
  const showMenu = adminKeys.find((item) => item === currentPathName);

  function onClickMenuItem(key) {
    const currentRoute = flattenRoutes.find((r) => r.key === key);
    const component = currentRoute.component;
    const preload = component.preload();
    NProgress.start();
    preload.then(() => {
      history.push(currentRoute.path ? currentRoute.path : `/${key}`);
      NProgress.done();
    });
  }

  function toggleCollapse() {
    setCollapsed((collapsed) => !collapsed);
  }

  const paddingLeft = showMenu ? { paddingLeft: menuWidth } : {};
  const paddingTop = { paddingTop: navbarHeight };
  const paddingStyle = { ...paddingLeft, ...paddingTop };

  function renderRoutes(locale) {
    routeMap.current.clear();
    return function travel(_routes: IRoute[], level, parentNode = []) {
      return _routes.map((route) => {
        const { breadcrumb, ignore, name } = route;
        if (name === 'admin') {
          // 去除 admin 的一级菜单
          return travel(route.children, 1);
        }
        const iconDom = getIconFromKey(route.key);
        const titleDom = (
          <>
            {iconDom} {locale[route.name] || route.name}
          </>
        );

        routeMap.current.set(
          `/${route.key}`,
          breadcrumb ? [...parentNode, route.name] : []
        );

        const visibleChildren = (route.children || []).filter((child) => {
          const { ignore, breadcrumb } = child;
          if (ignore || route.ignore) {
            routeMap.current.set(
              `/${child.key}`,
              breadcrumb ? [...parentNode, route.name, child.name] : []
            );
          }

          return !ignore;
        });

        if (ignore) {
          return '';
        }
        if (visibleChildren.length) {
          menuMap.current.set(route.key, { subMenu: true });
          return (
            <SubMenu key={route.key} title={titleDom}>
              {travel(visibleChildren, level + 1, [...parentNode, route.name])}
            </SubMenu>
          );
        }
        menuMap.current.set(route.key, { menuItem: true });
        return <MenuItem key={route.key}>{titleDom}</MenuItem>;
      });
    };
  }

  function updateMenuStatus() {
    const pathKeys = pathname.split('/');
    const newSelectedKeys: string[] = [];
    const newOpenKeys: string[] = [...openKeys];
    while (pathKeys.length > 0) {
      const currentRouteKey = pathKeys.join('/');
      const menuKey = currentRouteKey.replace(/^\//, '');
      const menuType = menuMap.current.get(menuKey);
      if (menuType && menuType.menuItem) {
        newSelectedKeys.push(menuKey);
      }
      if (menuType && menuType.subMenu && !openKeys.includes(menuKey)) {
        newOpenKeys.push(menuKey);
      }
      pathKeys.pop();
    }
    setSelectedKeys(newSelectedKeys);
    setOpenKeys(newOpenKeys);
  }

  useEffect(() => {
    const routeConfig = routeMap.current.get(pathname);
    setBreadCrumb(routeConfig || []);
    updateMenuStatus();
  }, [pathname]);
  {
    console.info(
      'renderRoutes(locale)(routes, 1)',
      renderRoutes(locale)(routes, 1)
    );
  }

  return (
    <Layout className={styles.layout}>
      <div
        className={cs(styles['layout-navbar'])}
      >
        <Navbar show={true} />
      </div>
      {userLoading ? (
        <Spin className={styles['spin']} />
      ) : (
        <Layout>
          {showMenu && (
            <Sider
              className={styles['layout-sider']}
              width={menuWidth}
              collapsed={collapsed}
              onCollapse={setCollapsed}
              trigger={null}
              collapsible
              breakpoint="xl"
              style={paddingTop}
            >
              <div className={styles['menu-wrapper']}>
                <Menu
                  collapse={collapsed}
                  onClickMenuItem={onClickMenuItem}
                  selectedKeys={selectedKeys}
                  openKeys={openKeys}
                  onClickSubMenu={(_, openKeys) => {
                    setOpenKeys(openKeys);
                  }}
                >
                  {renderRoutes(locale)(routes, 1)}
                </Menu>
              </div>
              <div className={styles['collapse-btn']} onClick={toggleCollapse}>
                {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              </div>
            </Sider>
          )}
          <Layout className={styles['layout-content']} style={paddingStyle}>
            <div className={styles['layout-content-wrapper']}>
              {!!breadcrumb.length && (
                <div className={styles['layout-breadcrumb']}>
                  <Breadcrumb>
                    {breadcrumb.map((node, index) => (
                      <Breadcrumb.Item key={index}>
                        {typeof node === 'string' ? locale[node] || node : node}
                      </Breadcrumb.Item>
                    ))}
                  </Breadcrumb>
                </div>
              )}
              <Content>
                <Switch>
                  {flattenRoutes.map((route, index) => {
                    return (
                      <Route
                        key={index}
                        path={`/${route.key}`}
                        component={route.component}
                      />
                    );
                  })}
                  <Route exact path="/">
                    <Redirect to={`/${defaultRoute}`} />
                  </Route>
                  <Route
                    path="*"
                    component={lazyload(() => import('./pages/exception/403'))}
                  />
                </Switch>
              </Content>
            </div>
            {showFooter && <Footer />}
          </Layout>
        </Layout>
      )}
    </Layout>
  );
}

export default PageLayout;
