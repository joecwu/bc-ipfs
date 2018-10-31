/*jshint esversion: 6*/
function bcutils() {
  this.genRandomKey = function() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let min = 128;
    let max = 1024;
    let keylen = Math.floor(Math.random() * (max - min + 1) + min);
    for (var i = 0; i < keylen; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  this.shuffleString = function(str) {
    let tmp, current, top = str.length;
    let newstr = new Array(str);
    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = newstr[current];
        newstr[current] = newstr[top];
        newstr[top] = tmp;
    }
    return newstr.join('');
  };
}

module.exports = bcutils;