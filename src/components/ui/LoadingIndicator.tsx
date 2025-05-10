import { twMerge } from 'tailwind-merge';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizeMap = {
  sm: 'h-2 w-2',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
};

export const LoadingIndicator = ({
  size = 'md',
  color = 'bg-gray-400',
}: Props) => {
  const sizeClass = sizeMap[size];

  return (
    <div className="flex flex-col h-full w-full items-center justify-center grow">
      <div className={twMerge(sizeClass, 'rounded-full animate-ping', color)} />
    </div>
  );
};
