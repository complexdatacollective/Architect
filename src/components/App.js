import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import { Button } from '@codaco/ui';
import { isMacOS } from '../utils/platform';
import { AppErrorBoundary } from './Errors';
import DialogManager from './DialogManager';
import { actionCreators as dialogsActions } from '../ducks/modules/dialogs';
import { actionCreators as uiActions } from '../ducks/modules/ui';
import { openExternalLink } from './ExternalLink';

const App = ({ children, openDialog, updateInfoShown, setUpdateInfoShown }) => {
  const appClasses = cx(
    'app',
    {
      'app--macos': isMacOS(),
    },
  );

  if (!updateInfoShown) {
    setUpdateInfoShown(true);
    openDialog({
      type: 'Notice',
      title: 'Please upgrade to continue receiving support',
      canCancel: false,
      message: (
        <React.Fragment>
          <p>
            Our initial development period has come to an end, and we are pleased to announce
            the release of the first stable versions of Network Canvas, Architect,
            and Server. Since stable versions are now available, the version of the software
            that you are currently using is no longer supported. Please visit our
            documentation website for information about how to update to the new versions.
          </p>
          <p>
            <Button
              color="sea-serpent"
              onClick={() => openExternalLink('https://documentation.networkcanvas.com/docs/technical-documentation/updating-from-beta/')}
            >
              Visit documentation website
            </Button>
          </p>
          <p>
            In the meantime, you can continue to use this version of the software
            in order to export data, or conclude any in-progress work. The stable releases include
            many new fixes and features collected from feedback you have provided, and we strongly
            encourage you to update to them as soon as possible.
          </p>
        </React.Fragment>
      ),
    });
  }

  return (
    <div className={appClasses}>
      {isMacOS() &&
        <div className="app__electron-titlebar" />
      }
      <div className="app__window">
        <AppErrorBoundary>
          { children }
        </AppErrorBoundary>
      </div>
      <div id="page-wrap" />

      <DialogManager />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  openDialog: PropTypes.func.isRequired,
  updateInfoShown: PropTypes.bool,
  setUpdateInfoShown: PropTypes.func.isRequired,
};

App.defaultProps = {
  children: null,
  updateInfoShown: false,
  setUpdateInfoShown: () => {},
  openDialog: () => {},
};


const mapDispatchToProps = {
  openDialog: dialogsActions.openDialog,
  setUpdateInfoShown: shown => uiActions.update({ updateInfoShown: shown }),
};

function mapStateToProps(state) {
  return {
    updateInfoShown: state.ui.uiReducer.updateInfoShown,
  };
}

export { App };

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
