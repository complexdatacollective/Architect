/* eslint-env jest */

const preview = jest.fn();

const close = jest.fn();

const driver = {
  preview,
  close,
};

export default driver;
