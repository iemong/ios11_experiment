import qs from 'querystring';
const locationParams = qs.parse((location.search || '').replace(/^\?/, ''));
export default locationParams;
