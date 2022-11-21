export default function (uri: string): any {
  if (!uri) {
    return {};
  }
  const queryString = {};
  uri.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), (...args) => {
    queryString[args[1]] = args[3];
    return '';
  });
  return queryString;
}
