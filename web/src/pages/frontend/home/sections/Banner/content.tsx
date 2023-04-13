import React from 'react';
import { Button } from '@arco-design/web-react';
import { teaLog } from '@arco-materials/site-utils';
import styles from './style/content.module.less';
import useLocale from '../../hooks/useLocale';
import { linkShowCase } from '../../constant/links';
import cs from '../../utils/classNames';
import IconMessage from '../../assets/banner/ic_message.svg';
import StartBtn from '../../components/StartBtn';
import { EventMap } from '../../utils/eventMap';

export default function BannerContent() {
  const locale = useLocale();

  const reportTea = (params) => {
    teaLog(EventMap.clickBannerBtn, params);
  };
  return (
    <>
      <div className={styles.slogan}>
        <div className={styles['slogan-color-line']}>
        智能设计体系
        </div>
        <div>连接轻盈体验</div>
      </div>

      <div className={styles.description}>
        <div className={styles['description-prefix']}>
          <IconMessage className={styles['description-prefix-icon']} />#
        </div>
        <div className={styles['description-content']}>
        企业级物料系统
        </div>
      </div>

      <div className={styles.operations}>
        <StartBtn className={styles['operations-item']} reportTea={reportTea} />
        <Button
          className={cs(styles['operations-item'], 'home-btn')}
          href={linkShowCase}
          onClick={() => {
            reportTea({
              name: locale['banner.showcase'],
              link: linkShowCase,
              target: '_self',
            });
          }}
        >
         使用案例
        </Button>
      </div>
    </>
  );
}
