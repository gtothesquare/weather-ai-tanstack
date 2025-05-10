import { InputHTMLAttributes, ReactNode, useId } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: 'text' | 'email' | 'search' | 'tel' | 'password';
  id?: string;
  name?: string;
  placeholder?: string;
  icon?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  value?: string;
}

export const TextInput = ({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  icon,
  required,
  disabled,
  value = '',
  ...rest
}: Props) => {
  const _id = useId();
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id ?? _id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          type={type}
          id={id}
          placeholder={placeholder}
          className={twMerge(
            'mt-1 w-full border rounded-md border-gray-300 shadow-sm sm:text-sm disabled:cursor disabled:opacity-75 disabled:cursor-not-allowed',
            icon && 'pe-10'
          )}
          required={required}
          disabled={disabled}
          value={value}
          {...rest}
        />

        {icon && (
          <span className="pointer-events-none absolute inset-y-0 right-0 grid w-10 place-content-center text-gray-500">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};
