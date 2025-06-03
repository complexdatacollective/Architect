const scrollbarWidth = () => {
  // thanks too https://davidwalsh.name/detect-scrollbar-width
  const scrollDiv = document.createElement('div');
  scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;');
  document.body.appendChild(scrollDiv);
  const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return width;
};

export default scrollbarWidth;
