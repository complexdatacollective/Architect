import React, { useState, useEffect } from 'react';
import { getAppVersion, getCodename } from '../utils/appVersion';

const Version = () => {
  const [version, setVersion] = useState('');
  const [codename, setCodename] = useState('');

  useEffect(() => {
    const loadVersion = async () => {
      const [v, c] = await Promise.all([getAppVersion(), getCodename()]);
      setVersion(v);
      setCodename(c);
    };
    loadVersion();
  }, []);

  return (
    <div className="version">
      <h4>
        {version}
        {' '}
        {codename && (
          <span>
            -
            {codename}
          </span>
        )}
      </h4>
    </div>
  );
};

export default Version;
