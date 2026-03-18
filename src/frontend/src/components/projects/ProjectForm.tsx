import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import FormGroup from '../ui/form/FormGroup';
import FormLabel from '../ui/form/FormLabel';
import FormError from '../ui/form/FormError';
import { ProjectInput, ProjectUpdateInput } from '../../types/project';
import { Loader2 } from 'lucide-react';
import { uiTexts } from '../../config/texts';
import { validationMessages } from '../../config/validation';

interface ProjectFormProps {
  initialData?: Partial<ProjectInput>;
  isEditing?: boolean;
  onSubmit: (data: ProjectInput | ProjectUpdateInput) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ProjectForm({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  isSubmitting = false
}: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = validationMessages.projectName.required;
    } else if (name.length < 3) {
      newErrors.name = validationMessages.projectName.tooShort;
    } else if (name.length > 100) {
      newErrors.name = validationMessages.projectName.tooLong;
    }

    if (!description.trim()) {
      newErrors.description = validationMessages.projectDescription.required;
    } else if (description.length < 10) {
      newErrors.description = validationMessages.projectDescription.tooShort;
    } else if (description.length > 1000) {
      newErrors.description = validationMessages.projectDescription.tooLong;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data: ProjectInput = {
      name: name.trim(),
      description: description.trim()
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormGroup>
        <FormLabel htmlFor="name">{uiTexts.projectForm.nameLabel} *</FormLabel>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder={uiTexts.projectForm.namePlaceholder}
          error={errors.name || undefined}
          disabled={isSubmitting}
        />
        {errors.name && <FormError>{errors.name}</FormError>}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="description">{uiTexts.projectForm.descriptionLabel} *</FormLabel>
        <Textarea
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder={uiTexts.projectForm.descriptionPlaceholder}
          rows={6}
          error={errors.description || undefined}
          disabled={isSubmitting}
        />
        {errors.description && <FormError>{errors.description}</FormError>}
        <p className="text-xs text-gray-500 mt-1">
          {validationMessages.characterCount(description.length, 1000)}
        </p>
      </FormGroup>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {uiTexts.buttons.cancel}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? uiTexts.actions.updating : uiTexts.actions.creating}
            </>
          ) : (
            isEditing ? uiTexts.projectForm.updateProject : uiTexts.projectForm.createProject
          )}
        </Button>
      </div>
    </form>
  );
}
