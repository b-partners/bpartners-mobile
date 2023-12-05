export const convertPlainTextToHTML = (plainText: string) => {
  const withParagraphTags = `<p>${plainText}</p>`;
  return withParagraphTags.replace(/\n/g, '<br/>');
};
