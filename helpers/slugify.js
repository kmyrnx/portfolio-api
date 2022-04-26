module.exports = (name) => name.toLowerCase().replace(/\s/g, '-').match(/\w*\d*-*/g).join('');
