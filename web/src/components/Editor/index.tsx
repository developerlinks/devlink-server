import React, { useState } from 'react';
import './index.css';
import { Editor, Viewer } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import { Button } from '@arco-design/web-react';
import 'bytemd/dist/index.css';
import '@arco-design/web-react/dist/css/arco.css';
import DiffViewer from './DiffViewer';

function App() {
  const [markdown1, setMarkdown1] = useState('');
  const [markdown2, setMarkdown2] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const computeDiffs = () => {

    setModalVisible(true);
  };

  return (
    <div className="App">
      <div className="markdown-inputs">
        <div className="editor-wrapper">
          <Editor
            value={markdown1}
            onChange={(val) => setMarkdown1(val)}
            plugins={[gfm()]}
          />
        </div>
        <div className="editor-wrapper">
          <Editor
            value={markdown2}
            onChange={(val) => setMarkdown2(val)}
            plugins={[gfm()]}
          />
        </div>
      </div>
      <Button type="primary" onClick={computeDiffs}>
        Compute Diffs
      </Button>

      <DiffViewer
        oldMarkdown={markdown1}
        newMarkdown={markdown2}
        visible={modalVisible}
        onOk={()=>{console.info('ok~~~')}}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}

export default App;
