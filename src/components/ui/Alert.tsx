import { twMerge } from 'tailwind-merge';
import { ReactNode } from 'react';

export type AlertType = 'info' | 'warning' | 'error';

interface Props {
  title?: string;
  type?: AlertType;
  children?: ReactNode;
}

function getAlertStyles(type?: AlertType) {
  if (type === 'warning') {
    return 'bg-orange-100 border-orange-500 text-orange-700';
  }
  if (type === 'error') {
    return 'bg-red-100 border-red-500 text-red-700';
  }

  if (type === 'info') {
    return 'bg-sky-100 border-sky-500 text-sky-700';
  }
}

export const Alert = ({ type = 'info', title, children }: Props) => {
  console.log(type)
  return (
    <div
      className={twMerge(
        'border-l-4 p-2 not-prose space-y-2',
        getAlertStyles(type)
      )}
      role="alert"
    >
      {title && <p className="font-bold">{title}</p>}
      {children && <p>{children}</p>}
    </div>
  );
};
