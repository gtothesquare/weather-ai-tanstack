import { HStack } from '~/components/ui/HStack';
import { Sparkles } from 'lucide-react';
import { LoadingIndicator } from '~/components/ui/LoadingIndicator';

interface AiMessageProps {
  content: string;
  isLoading?: boolean;
}

export const AiMessage = ({ content, isLoading }: AiMessageProps) => {
  return (
    <div className="border border-gray-300 rounded-3xl bg-white px-4 py-3">
      <HStack align="start" spacing={'md'}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <div className="border border-gray-500 rounded-full p-2 text-gray-800">
            <Sparkles size={16} />
          </div>
        )}
        <div className="leading-tight pt-1">{content}</div>
      </HStack>
    </div>
  );
};
