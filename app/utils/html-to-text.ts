export const convertHTMLToPlainText = htmlString => {
  return htmlString.replace(/(<br\s*\/?>\s*)+/g, '\n\n').replace(/<[^>]*>/g, '');
};
