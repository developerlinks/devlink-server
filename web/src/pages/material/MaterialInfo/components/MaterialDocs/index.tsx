import { Button } from '@arco-design/web-react';
import React, { useState } from 'react';
import { IconThumbUp } from '@arco-design/web-react/icon';
import ConfettiButton from '@/components/ConfettiButton';

import styles from './styles/index.module.less'

export default function MaterialDocs() {
  const [awesome, setAwesome] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div className={styles.materialDocs}>
      <div>基本用法...</div>
      <p></p>
      <div className={styles.thumbUpButton}>
        <ConfettiButton disabled={awesome}>
          <Button
            type={!awesome ? 'outline' : 'primary'}
            shape="circle"
            size="large"
            loading={loading}
            icon={<IconThumbUp style={{ fontSize: 18, verticalAlign: -4 }} />}
            onClick={() => {
              if (!awesome) {
                setLoading(true);
                return new Promise((resolve) => {
                  setTimeout(() => {
                    setLoading(false);
                    setAwesome(true);
                    resolve(null);
                  }, 500);
                });
              }
              setAwesome(false);
            }}
          />
        </ConfettiButton>
      </div>
    </div>
  );
}
