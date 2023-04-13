import React, { CSSProperties } from 'react';
import { Space } from '@arco-design/web-react';
import styles from './index.module.less';
import IconArcoA from '../../../../assets/arco_a.svg';
import IconArcoR from '../../../../assets/arco_r.svg';
import IconArcoC from '../../../../assets/arco_c.svg';
import IconArcoO from '../../../../assets/arco_o.svg';
import useLocale from '../../../../hooks/useLocale';
import useIsMobile from '../../../../utils/useIsMobile';

interface DesignValuesProps {
  style?: CSSProperties;
}

export default function DesignValues({ style }: DesignValuesProps) {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const designValueList = [
    {
      icon: <IconArcoA />,
      title: 'agreement 一致',
      description: '一致的规则保证整体的协调',
    },
    {
      icon: <IconArcoR />,
      title: 'rhythm 韵律',
      description: '跳动的韵律构建字节的美感',
    },
    {
      icon: <IconArcoC />,
      title: 'clear 清晰',
      description: '清晰的指向亦是效率的提升',
    },
    {
      icon: <IconArcoO />,
      title: 'open 开放',
      description: '开放包容是解决问题的思路',
    },
  ];
  return (
    <div className={styles.wrapper} style={style}>
      <Space
        size={20}
        style={{ display: 'flex', justifyContent: 'space-between' }}
        direction={isMobile ? 'vertical' : 'horizontal'}
      >
        {designValueList.map(({ icon, title, description }) => (
          <Space size={20} key={title}>
            <div>{icon}</div>
            <div>
              <div className={styles.title}>{title}</div>
              <div className={styles.desc}>{description}</div>
            </div>
          </Space>
        ))}
      </Space>
    </div>
  );
}
