interface MetaPrams {
  title?: string;
  description?: string;
}

export const getHeadMeta = (params?: MetaPrams) => {
  const title = params?.title ?? 'YAI Weather chat';
  const description = params?.description ?? 'Yet another weather chat';
  return [
    {
      title,
    },
    {
      description,
    },
    {
      name: 'apple-mobile-web-app-title',
      content: title,
    },
  ];
};
