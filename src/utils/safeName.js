const safeName = (name) => name.replace(/[.$[\]{}]+/g, '');

export default safeName;
