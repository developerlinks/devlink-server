import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@arco-design/web-react';
import ProjectCard, { ProjectProps } from './blocks/project';
import MaterialCard from '@/pages/material/components/NewsSplace/components/MaterialCard';

function MyProject() {
  const [data, setData] = useState<ProjectProps[]>(new Array(6).fill({}));
  const [loading, setLoading] = useState(true);

  const { Row, Col } = Grid;

  const getData = async () => {
    setLoading(true);
    const { data } = await axios.get('/api/user/projectList').finally(() => {
      setLoading(false);
    });
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const list = [
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
  ];

  return (
    <div>
      {list.map((item) => (
        <MaterialCard info={item} key={item.name} />
      ))}
    </div>
  );
}

export default MyProject;
