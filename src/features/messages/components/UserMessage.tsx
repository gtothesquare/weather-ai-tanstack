interface Props {
  content: string;
}

export const UserMessage = ({ content }: Props) => {
  return (
    <div className="border border-green-300 rounded-3xl bg-green-50 px-4 py-3">
      {'You: '}
      {content}
    </div>
  );
};
