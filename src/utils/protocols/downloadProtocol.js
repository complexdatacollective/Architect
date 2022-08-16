import inEnvironment from '../Environment';
import environments from '../environments';
import friendlyErrorMessage from '../friendlyErrorMessage';
import { writeFile } from "../fileSystem";
import path from 'path';
import electron from 'electron'
import fs from 'fs'
import { actionCreators as userActions } from '../../ducks/modules/userActions/userActions';

const networkError = friendlyErrorMessage("We weren't able to fetch your protocol. Your device may not have an active network connection, or you may have mistyped the URL. Ensure you are connected to a network, double check your URL, and try again.");
const fileError = friendlyErrorMessage('The protocol could not be saved to your device. You might not have enough storage available. ');

const getURL = uri =>
  new Promise((resolve, reject) => {
    try {
      resolve(new URL(uri));
    } catch (error) {
      reject(error);
    }
  });

/**
 * Download a protocol from a remote server.
 *
 * If the URL points to an instance of a Network Canvas Server, then the caller must ensure
 * that the SSL certificate has been trusted. See {@link ApiClient#addTrustedCert}.
 *
 * @param {string} uri
 * @return {string} output filepath
 */
export const downloadProtocolFromURI = inEnvironment((environment)=> dispatch => {
    if (environment === environments.ELECTRON) {
      const request = require('request-promise-native');
      const { dialog } = electron.remote
      const tempPath = (electron.app || electron.remote.app).getPath('temp');
      const from = path.join(tempPath, 'SampleProtocol') + '.netcanvas';

      const selectPath = new Promise(function(resolve, reject){
        dialog.showOpenDialog(null, {
          properties: ['openDirectory']
        })
        .then((result) => {
          if (result.filePaths.toString() !== ''){
            const destination = path.join(result.filePaths.toString(), 'SampleProtocol') + '.netcanvas';
            resolve(destination);
          }
        })
      })
      
    return (uri) => {
      selectPath
        .then((destination) => {
          let promisedResponse;
          promisedResponse = getURL(uri)
            .catch(err => {
                throw err;
            })
            .then(url => request({ method: 'GET', encoding: null, uri: url.href }))

          return promisedResponse
            .catch(networkError)
            .then(data => writeFile(from, data))
            .catch(fileError)
            .then(() => {
              fs.rename(from, destination, function(err){
                if (err){
                  throw error;
                }
                else {
                  console.log("Successfully moved the file")
                }
              })
            })
            .then(() => {
              userActions.openNetcanvas(destination)
            })
        })
    };
  }

  return () => Promise.reject(new Error('downloadProtocolFromURI() not available on platform'));
});