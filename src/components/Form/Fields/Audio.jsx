import { Audio } from '../../Assets';
import File from './File';

const AudioInput = (props) => (
  <File type="audio" {...props}>
    {(id) => (
      <div className="form-fields-audio">
        <Audio id={id} controls />
      </div>
    )}
  </File>
);

export default AudioInput;
