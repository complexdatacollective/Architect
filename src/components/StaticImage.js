import React from 'react';
import PropTypes from 'prop-types';

const placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAAD6BAMAAAAb/zJlAAAAG1BMVEXMzMyWlpbFxcWqqqqcnJyxsbG3t7e+vr6jo6OVuynYAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVR4nO3Yz1PaQBTA8SUQ8OhC0ByhdrRH6TjTHontWI/S6a+jaae1R1E7vZoe7L/d9zYbCBHtoSW5fD+HBMJj9rG7ebvBGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/7OXRM/lFFo1lVfBUfRifeiX5PRMzzMNjR4N3RiXp2TRXuQ7l/P5utBnmuWlvJgU+T4Yujmptj00ZqvIt6fnnXWhiX7SlxeZz/fh0M1Joqv9xI5MJ/4mpPc69vdBFo3uR4Z2ePXDxvqdOwm9eCR0c7r2Vts9M62in9JIO/vsfmjLXuoMkEMxBx4M3Zy2tt+TpMe7/komLwI3kSvS2MWfyaeXfwndnI41eZvzvr9itzWT/v3QmY6A/rSeTJ/HQzen5cqSJJFu5xd69rDIzZixjnyoU8bkvelCu3ZNaE26F77h2TS/ELrJOR/4N1NNOh/+vCPlShitCa3TljQ8uf0U3Rk/oc04dh8EiVS6iU/o5a3J+7cdh9npeSW0RgeZNJm9llp6rLlrEi3fhakdBbY8QbsyFFuRVGIpY6uhtZHV6pdfDFwSo1ISHXu4WrCeSo4dt7QcV0LrzFc2ENa+PZho57kkOotbqj8v5xNkkRbi4ZNrO6iE1pmv9KuOelcOefOLJLJBVr7/bzSspXnKTKmE1kb6dWre61zMhtVOG9vyeiCbIwkLPxq3rjXUvzrqvg/ncXVStm2xmBmdDfbN8ju3Dc1fMfMlS9qu3PSBLZWrGxuPFm/stKH6YFy/OjK2laLatcv9V9eWS0Wy3UT9fXeix2X5qi5anVKOc617C8l2E+tbOtTjOO5+cOfIbWhKm4JZtFwuEp/Z13Pj9kiV0FrkvTMf5PeOvlvZdAV2Nyv6r+22N8WHuudoYn/m8sx28rHVWruyqZUci+3O8sZyPap7jgb2v7r/ljnb7+mwh3pYeWgY21HbbydNWgz8XH/jTA4NPF/07OBqP5M2k+hzb6Jtu4eyYkcukyEoivNk56fS/cPJ6FqfUVdCa+KezeP80dzV2vJDr+v1mZ8H7qlYlzsXob3exPOxe44/dMXV5jdUuvxToaNXxn7EkyJfFzGohNbme5L/R7Pnz+U/bVId7NBXNLvINziyry4roQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+yR+w3IYCa3QpTwAAAABJRU5ErkJggg==';

const StaticImage = ({ src, alt, ...rest }) => (
  <img
    alt={alt}
    src={`${process.env.PUBLIC_URL}/${src}`}
    {...rest}
    onError={(e) => { e.target.src = placeholder; }}
  />
);

StaticImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

StaticImage.defaultProps = {
  alt: '',
};

export default StaticImage;
