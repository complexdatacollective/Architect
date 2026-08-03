import PropTypes from 'prop-types';

import AssetBadge from '../AssetBadge';
import MiniTable from '../MiniTable';

// TODO: add filter

const Panels = ({ panels }) => {
  if (!panels || panels.length === 0) {
    return null;
  }

  return (
    <div className="protocol-summary-stage__panels">
      <div className="protocol-summary-stage__panels-content">
        <h2 className="section-heading">Panels</h2>
        <ol>
          {panels.map((panel) => (
            <li className="protocol-summary-stage__panels-panel" key={panel.id}>
              <MiniTable
                rotated
                rows={[
                  ['Title', panel.title],
                  [
                    'Data Source',
                    panel.dataSource === 'existing' ? (
                      <p key="existing">
                        <em>Existing network</em>
                      </p>
                    ) : (
                      <AssetBadge
                        key={panel.dataSource}
                        id={panel.dataSource}
                        link
                      />
                    ),
                  ],
                ]}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

Panels.propTypes = {
  panels: PropTypes.array,
};

Panels.defaultProps = {
  panels: null,
};

export default Panels;
