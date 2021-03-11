const stopPropagationFromHandler = (f) => (e, ...rest) => {
  e.stopPropagation();
  f(e, ...rest);
};

export default stopPropagationFromHandler;
