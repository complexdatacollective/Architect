/* eslint-disable import/prefer-default-export */
import { remote } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

/**
 * Generates a path in the application /tmp/ to be used
 * as a working copy for editing protocols.
 *
 * @returns The destination path in /tmp/.
 */
const getLocalDirectoryFromArchivePath = () => path.join(remote.app.getPath('temp'), 'protocols', uuidv4());

export default getLocalDirectoryFromArchivePath;
