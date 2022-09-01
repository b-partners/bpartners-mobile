export default function (uri: string): any {
  const queryString = {};
  uri.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), (...args) => {
    queryString[args[1]] = args[3];
    return '';
  });
  return queryString;
}
