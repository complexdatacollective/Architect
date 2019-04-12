import {
  Name,
  Form,
  IntroductionPanel,
} from '../../sections';

const template = {
  subject: { entity: 'ego' },
};

const EgoForm = {
  sections: [
    Name,
    Form,
    IntroductionPanel,
  ],
  template,
};

export default EgoForm;
