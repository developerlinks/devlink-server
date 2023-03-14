import React from 'react';
import { teaLog } from '@arco-materials/site-utils';
import cs from '../../utils/classNames';
import CodeCopy from '../../components/CodeCopy';
import LogoWrapper from '../../components/LogoWrapper';
import styles from './style/index.module.less';
import IconDesign from '../../assets/ic_design.svg';
import IconDarkDesign from '../../assets/ic_dark_design.svg';
import IconCode from '../../assets/ic_code.svg';
import IconDarkCode from '../../assets/ic_dark_code.svg';
import LogoFigma from '../../assets/logo_Figma.svg';
import LogoFigmaW from '../../assets/logo_Figma_w.svg';
import useTheme from '../../hooks/useTheme';
import useLocale from '../../hooks/useLocale';
import { linkFigmaArcoComponent } from '../../constant/links';
import Section from '../../components/Section';
import { EventMap } from '../../utils/eventMap';

export default function QuickStart() {
  const { realTheme } = useTheme();
  const locale = useLocale();

  const renderDesignContent = () => {
    return (
      <a
        href={linkFigmaArcoComponent}
        className={styles['design-terminal']}
        onClick={() => {
          teaLog(EventMap.clickQuickStartBtn, {
            link: linkFigmaArcoComponent,
            name: `Figma `,
            target: '_blank',
          });
        }}
      >
        <div className={styles['design-figma-logo']}>
          {realTheme === 'dark' ? <LogoFigmaW /> : <LogoFigma />}
          <span className={styles['design-figma-logo-text']}>Figma</span>
        </div>
        <span className={styles['design-terminal-content']}>

        </span>
      </a>
    );
  };

  const renderCodeContent = () => {
    return (
      <CodeCopy
        code={'npm install -g <span class="token-package">@devlink/cli</span>'}
        copyText="npm i @devlink/cli"
      />
    );
  };

  const data = [
    {
      title: '我是设计师',
      description: '了解 DevLink 的设计思想，这里有包括全局色、文字、图标和布局的指南',
      icon: realTheme === 'dark' ? <IconDarkDesign /> : <IconDesign />,
      content: renderDesignContent(),
    },
    {
      title: "我是工程师",
      description: '组件用于更快速、更简便的 web 开发。你也可以建立你自己的设计系统，或者从 Arco Design 开始',
      icon: realTheme === 'dark' ? <IconDarkCode /> : <IconCode />,
      content: renderCodeContent(),
      isCardDark: true,
    },
  ];

  return (
    <Section
      headerProps={{
        title: '即刻开启你的体验旅程',
        subTitle: 'Arco Design',
      }}
      addTracker
    >
      <div className={styles.wrapper} data-aos="scale-fade-in">
        {data.map(({ title, description, icon, content, isCardDark }) => (
          <div
            className={cs(styles.card, {
              [styles['card-dark']]: isCardDark,
            })}
            key={title}
          >
            <LogoWrapper
              className={styles['card-icon']}
              icon={icon}
              size="medium"
              theme
            />
            <div className={styles['card-title']}>{title}</div>
            <div className={styles['card-desc']}>{description}</div>
            <div className={styles['card-content']}>{content}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
