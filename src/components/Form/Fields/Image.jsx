import { BackgroundImage } from '../../Assets';
import File from './File';

const ImageInput = (props) => (
  <File type="image" {...props}>
    {(id) => (
      <div className="form-fields-image">
        <BackgroundImage id={id} className="form-fields-image__image" />
      </div>
    )}
  </File>
);

export default ImageInput;
