import { ReactNode } from 'react';
import { FormProvider as Form, UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
  className?: string;
};

const FormProvider = ({ children, onSubmit, methods, className }: Props) => {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className={twMerge('h-full w-full', className)}>
        {children}
      </form>
    </Form>
  );
};
export default FormProvider;
