// UA
const userAgent = navigator.userAgent;
const isSP = userAgent.indexOf('iPhone') >= 0 || userAgent.indexOf('iPad') >= 0 || userAgent.indexOf('Android') >= 0;
export default isSP;