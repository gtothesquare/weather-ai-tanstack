import { HStack } from '~/components/ui/HStack';
import { Sparkles } from 'lucide-react';
import { LoadingIndicator } from '~/components/ui/LoadingIndicator';

interface ContentProps {
  content: string;
}

const Content = ({ content }: ContentProps) => {
  return (
    <HStack align="start" spacing={'md'}>
      <div className="border border-gray-500 rounded-full p-2 text-gray-800">
        <Sparkles size={16} />
      </div>
      <div className="leading-tight pt-1">{content}</div>
    </HStack>
  );
};

interface AiMessageProps {
  content: string;
  isLoading?: boolean;
}

export const AiMessage = ({ content, isLoading }: AiMessageProps) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }
  return <Content content={content} />;
};
