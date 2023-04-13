// 资源汇集的板块
import React from 'react';
import { Space } from '@arco-design/web-react';
import Section from '../../components/Section';
import ResourceCard from './components/Card';
import LogoFigmaBlue from '../../assets/logo_Figma_blue.svg';
import LogoSketchBlue from '../../assets/logo_Sketch_blue.svg';
import LogoIconBoxBlue from '../../assets/logo_IconBox_blue.svg';
import LogoArcoProBlue from '../../assets/logo_ArcoPro_blue.svg';
import LogoGitHubWhite from '../../assets/logo_Github_white.svg';
import LogoArcoCliWhite from '../../assets/logo_ArcoCli_white.svg';
import LogoArcoWebpackPluginWhite from '../../assets/logo_ArcoWebpackPlugin_white.svg';
import LogoReact from '../../assets/logo_react.svg';
import LogoMobile from '../../assets/logo_mobile.svg';
import LogoVue from '../../assets/logo_vue.svg';
import LogoJiShiBlue from '../../assets/logo_JiShi_blue.svg';
import {
  linkDocsArcoComponent,
  linkDocsComponentUsage,
  linkDesignerDocs,
  linkDocsDesignPrinciples,
  linkFigmaArcoComponent,
  linkFigmaArcoPro,
  linkMobileComponent,
  linkFigmaArcoIcons,
  linkDocksArcoVueComponent,
  linkGithubCodeRepository,
  linkGithubRepositoryArcoWebpackPlugin,
  linkGithubRepositoryArcoCli,
  linkDocsDesignStyleGuideline,
  linkSketchResource,
  linkJiShiResource,
  linkArcoMobile,
} from '../../constant/links';
import DesignValues from './components/DesignValues';
import useLocale from '../../hooks/useLocale';
import useIsMobile from '../../utils/useIsMobile';

export default function SectionResource() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  return (
    <Section
      headerProps={{
        title: '快速上手',
        subTitle:  '完善的开发资源',
      }}
      addTracker
    >
      <Space size={20} direction={isMobile ? 'vertical' : 'horizontal'}>
        <ResourceCard
          title='设计资源'
          description={'使用 Arco 设计资源，帮助你创造优秀的产品设计'}
          href={linkDesignerDocs}
          bodyResourceList={[
            {
              name: '中后台最佳实践',
              logo: <LogoArcoProBlue />,
              href: linkFigmaArcoPro,
            },
            {
              name: '即时设计',
              logo: <LogoJiShiBlue />,
              href: linkJiShiResource,
            },
            {
              name: 'sketch',
              logo: <LogoSketchBlue />,
              href: linkSketchResource,
            },
            {
              name: 'iconBox',
              logo: <LogoIconBoxBlue />,
              href: linkFigmaArcoIcons,
            },
            {
              name: 'arco 组件',
              logo: <LogoFigmaBlue />,
              href: linkFigmaArcoComponent,
            },
            {
              name: '移动组件',
              logo: <LogoFigmaBlue />,
              href: linkMobileComponent,
            },
          ]}
          footerResourceList={[
            {
              name: '设计原则',
              href: linkDocsDesignPrinciples,
            },
            {
              name: '样式指南',
              href: linkDocsDesignStyleGuideline,
            },
            {
              name: '组件用法',
              href: linkDocsComponentUsage,
            },
          ]}
        />
        <ResourceCard
          type="dark"
          title='开发资源'
          description='组件用于更快速、更简便的 Web 开发'
          href={linkDocsArcoComponent}
          bodyStyle={{ marginTop: 58 }}
          bodyResourceList={[
            {
              name: 'arcoCli',
              logo: <LogoArcoCliWhite />,
              href: linkGithubRepositoryArcoCli,
            },
            {
              name: 'Arco Webpack Plugin',
              logo: <LogoArcoWebpackPluginWhite />,
              href: linkGithubRepositoryArcoWebpackPlugin,
            },
            {
              name: 'github',
              logo: <LogoGitHubWhite />,
              href: linkGithubCodeRepository,
            },
          ]}
          footerResourceList={[
            {
              name: 'Web React',
              logo: <LogoReact />,
              href: linkDocsArcoComponent,
            },
            {
              name: 'Web Vue',
              logo: <LogoVue />,
              href: linkDocksArcoVueComponent,
            },
            {
              name: 'Mobile React',
              logo: <LogoMobile />,
              href: linkArcoMobile,
            },
          ]}
        />
      </Space>
      <DesignValues style={{ marginTop: 20 }} />
    </Section>
  );
}
