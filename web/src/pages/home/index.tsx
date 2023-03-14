import React from 'react';
import Banner from './sections/Banner';
import QuickStart from './sections/QuickStart';
import './style/index.less'; // 全局样式
import useHomeContext from './hooks/useHomeContext';
import SectionResource from './sections/Resource';
import cs from './utils/classNames';
import Navbar from '@/components/NavBar';

export default function Home() {
  const { lang } = useHomeContext();

  return (
    <div
      id="home"
      className={cs({
        'home-arco-lang': lang === 'en-US',
      })}
    >
      <Navbar show={true} />
      <Banner />
      <SectionResource />
      <QuickStart />
    </div>
  );
}
