import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Radio } from '@arco-design/web-react';
import { IconArrowLeft, IconArrowRight } from '@arco-design/web-react/icon';
import { diffLines } from 'diff';
import { Viewer, Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';

import './DiffViewer.css';

type DiffViewerProps = {
  oldMarkdown: string;
  newMarkdown: string;
  visible: boolean;
  onOk: () => void;
  onClose: () => void;
};

export default function DiffViewer(props: DiffViewerProps) {
  const { oldMarkdown, newMarkdown, onClose, visible } = props;

  const [diffs, setDiffs] = useState([]);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(-1);
  const [diffChoice, setDiffChoice] = useState('');

  const computeDiffs = () => {
    const diffResult = diffLines(oldMarkdown, newMarkdown);
    console.info('diffResult', diffResult);
    setDiffs(diffResult);
    setCurrentDiffIndex(-1); // reset current diff selection
  };

  const handleArrowClick = (index) => {
    setCurrentDiffIndex(index);
    setDiffChoice('old');
  };

  useEffect(() => {
    if (visible) {
      computeDiffs();
    }
  }, [visible, oldMarkdown, newMarkdown]);

  const handleModalOk = () => {
    const newDiffs = [...diffs];
    const selectedDiff = diffs[currentDiffIndex];

    if (diffChoice === 'new') {
      newDiffs.splice(currentDiffIndex, 1, {
        ...selectedDiff,
        removed: false,
        added: false,
      });
      computeDiffs();
    }

    setDiffs(newDiffs);
    onClose(); // close the modal
  };

  const handleModalCancel = () => {
    onClose(); // close the modal
  };

  return (
    <Modal
      visible={visible}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      title="Diff Viewer"
      style={{ width: '90%' }}
    >
      <div className="diff-container">
        <div className="diff-column">
          <Viewer value={oldMarkdown} plugins={[gfm()]} />
        </div>
        <div className="diff-column">
          <Viewer value={newMarkdown} plugins={[gfm()]} />
        </div>
      </div>
      <div className="diff-container">
        <div className="diff-column">
          {diffs.map((diff, index) => {
            if (diff.removed) {
              return (
                <div key={index} className="diff-row">
                  <IconArrowLeft
                    className="arrow-icon"
                    onClick={() => handleArrowClick(index)}
                  />
                  <Editor value={diff.value} plugins={[gfm()]} />
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="diff-column">
          {diffs.map((diff, index) => {
            if (diff.added) {
              return (
                <div key={index} className="diff-row">
                  <IconArrowRight
                    className="arrow-icon"
                    onClick={() => handleArrowClick(index)}
                  />
                  <Editor value={diff.value} plugins={[gfm()]} />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
      {currentDiffIndex >= 0 && (
        <div className="choose-version">
          <h3>Choose the version</h3>
          <Radio.Group
            value={diffChoice}
            onChange={(e) => setDiffChoice(e.target.value)}
          >
            <Radio value="old">Old</Radio>
            <Radio value="new">New</Radio>
          </Radio.Group>
        </div>
      )}
    </Modal>
  );
}
