import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface LeadFormData {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

interface Props {
  defaultValues?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const LeadForm: React.FC<Props> = ({ defaultValues, onSubmit, isLoading, submitLabel = 'Save' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormData>({
    defaultValues: defaultValues || { status: 'New', source: 'Website' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        label="Full Name"
        placeholder="e.g. Arjun Sharma"
        {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
        error={errors.name?.message}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="e.g. arjun@company.com"
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
        })}
        error={errors.email?.message}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Select
          label="Status"
          options={[
            { value: 'New', label: '🔵 New' },
            { value: 'Contacted', label: '🟡 Contacted' },
            { value: 'Qualified', label: '🟢 Qualified' },
            { value: 'Lost', label: '🔴 Lost' },
          ]}
          {...register('status', { required: true })}
          error={errors.status?.message}
        />
        <Select
          label="Source"
          options={[
            { value: 'Website', label: '🌐 Website' },
            { value: 'Instagram', label: '📸 Instagram' },
            { value: 'Referral', label: '🤝 Referral' },
          ]}
          {...register('source', { required: true })}
          error={errors.source?.message}
        />
      </div>
      <Button type="submit" loading={isLoading} size="lg" style={{ marginTop: 8 }}>
        {submitLabel}
      </Button>
    </form>
  );
};

export default LeadForm;