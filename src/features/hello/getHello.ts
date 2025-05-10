import { createServerFn } from '@tanstack/react-start';

interface Fullname {
  firstName: string;
  lastName: string;
}

export const getHello = createServerFn()
  .validator((data: Fullname) => {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
    };
  })
  .handler(({ data: { firstName, lastName } }) => {
    return `hello, ${firstName} ${lastName}`;
  });
