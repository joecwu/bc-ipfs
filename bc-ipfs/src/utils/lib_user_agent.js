const isMobile = {
  Android: function() {
    return /Android/i.test(navigator.userAgent);
  },
  BlackBerry: function() {
    return /BlackBerry/i.test(navigator.userAgent);
  },
  iOS: function() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },
  Opera: function() {
    return /Opera Mini/i.test(navigator.userAgent);
  },
  Windows: function() {
    return /IEMobile/i.test(navigator.userAgent);
  },
  any: function() {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
  },
};
export default isMobile;
