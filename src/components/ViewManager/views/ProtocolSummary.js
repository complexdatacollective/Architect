import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import ProtocolSummary from '@app/lib/ProtocolSummary/ProtocolSummary';

const ProtocolSummaryView = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add('print');

    return () => {
      document.documentElement.classList.remove('print');
    };
  });

  useEffect(() => {
    ipcRenderer.once('SUMMARY_DATA', (event, _data) => {
      setData(_data);
    });
  }, []);

  return (
    <div>
      <ProtocolSummary data={data} />
    </div>
  );
};

export default ProtocolSummaryView;
