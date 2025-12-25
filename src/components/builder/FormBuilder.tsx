'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Mail,
  Phone,
  Hash,
  Calendar,
  List,
  CheckSquare,
  ToggleLeft,
  FileText,
  Upload,
  Star,
  MapPin,
  Link,
  Eye,
  Settings,
  Copy,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Select, Switch, Textarea, Modal } from '@/components/ui';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  width: 'full' | 'half' | 'third';
}

type FormFieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'toggle'
  | 'file'
  | 'rating'
  | 'url';

const fieldTypeIcons: Record<FormFieldType, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  textarea: <FileText className="w-4 h-4" />,
  select: <List className="w-4 h-4" />,
  checkbox: <CheckSquare className="w-4 h-4" />,
  radio: <CheckSquare className="w-4 h-4" />,
  toggle: <ToggleLeft className="w-4 h-4" />,
  file: <Upload className="w-4 h-4" />,
  rating: <Star className="w-4 h-4" />,
  url: <Link className="w-4 h-4" />,
};

const fieldTypeLabels: Record<FormFieldType, string> = {
  text: 'Text',
  email: 'Email',
  phone: 'Phone',
  number: 'Number',
  date: 'Date',
  textarea: 'Long Text',
  select: 'Dropdown',
  checkbox: 'Checkboxes',
  radio: 'Radio Buttons',
  toggle: 'Toggle',
  file: 'File Upload',
  rating: 'Rating',
  url: 'URL',
};

interface FormBuilderProps {
  onSave?: (fields: FormField[], settings: FormSettings) => void;
}

interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  emailNotification?: string;
  captcha: boolean;
}

const defaultFields: FormField[] = [
  {
    id: '1',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
    width: 'full',
  },
  {
    id: '2',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
    width: 'half',
  },
  {
    id: '3',
    type: 'phone',
    label: 'Phone',
    placeholder: 'Enter your phone',
    required: false,
    width: 'half',
  },
  {
    id: '4',
    type: 'textarea',
    label: 'Message',
    placeholder: 'Your message here...',
    required: true,
    width: 'full',
  },
];

export const FormBuilder: React.FC<FormBuilderProps> = ({ onSave }) => {
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState<FormSettings>({
    submitButtonText: 'Submit',
    successMessage: 'Thank you! Your form has been submitted.',
    captcha: false,
  });

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addField = (type: FormFieldType) => {
    const newField: FormField = {
      id: generateId(),
      type,
      label: fieldTypeLabels[type],
      placeholder: `Enter ${fieldTypeLabels[type].toLowerCase()}`,
      required: false,
      width: 'full',
      options: type === 'select' || type === 'checkbox' || type === 'radio'
        ? ['Option 1', 'Option 2', 'Option 3']
        : undefined,
    };
    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selectedField === id) setSelectedField(null);
  };

  const duplicateField = (id: string) => {
    const field = fields.find((f) => f.id === id);
    if (field) {
      const newField = { ...field, id: generateId(), label: `${field.label} (copy)` };
      const index = fields.findIndex((f) => f.id === id);
      const newFields = [...fields];
      newFields.splice(index + 1, 0, newField);
      setFields(newFields);
    }
  };

  const selectedFieldData = fields.find((f) => f.id === selectedField);

  const handleSave = () => {
    onSave?.(fields, settings);
  };

  // Preview Component
  const FormPreview = () => (
    <div className="max-w-lg mx-auto p-6">
      <div className="space-y-4">
        {fields.map((field) => (
          <div
            key={field.id}
            className={cn(
              'w-full',
              field.width === 'half' && 'w-1/2 inline-block pr-2',
              field.width === 'third' && 'w-1/3 inline-block pr-2'
            )}
          >
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {field.type === 'email' && (
              <input
                type="email"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {field.type === 'phone' && (
              <input
                type="tel"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {field.type === 'number' && (
              <input
                type="number"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {field.type === 'date' && (
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {field.type === 'url' && (
              <input
                type="url"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {field.type === 'textarea' && (
              <textarea
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg resize-none"
              />
            )}
            {field.type === 'select' && (
              <select className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select...</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {field.type === 'checkbox' && (
              <div className="space-y-2">
                {field.options?.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {field.type === 'radio' && (
              <div className="space-y-2">
                {field.options?.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input type="radio" name={field.id} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {field.type === 'toggle' && (
              <Switch checked={false} onCheckedChange={() => {}} />
            )}
            {field.type === 'file' && (
              <input
                type="file"
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {field.type === 'rating' && (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400" />
                ))}
              </div>
            )}
          </div>
        ))}

        <Button className="w-full mt-4">{settings.submitButtonText}</Button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex">
      {/* Field Library */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4 overflow-y-auto">
        <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
          Add Field
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(fieldTypeIcons) as FormFieldType[]).map((type) => (
            <button
              key={type}
              onClick={() => addField(type)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                'border-gray-200 dark:border-gray-700 hover:border-primary-500',
                'bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              )}
            >
              {fieldTypeIcons[type]}
              <span className="text-xs">{fieldTypeLabels[type]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Canvas */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Form Fields</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <Reorder.Group
          axis="y"
          values={fields}
          onReorder={setFields}
          className="space-y-2"
        >
          {fields.map((field) => (
            <Reorder.Item
              key={field.id}
              value={field}
              className={cn(
                'flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-gray-800 border cursor-pointer transition-all',
                selectedField === field.id
                  ? 'border-primary-500 shadow-md'
                  : 'border-gray-200 dark:border-gray-700'
              )}
              onClick={() => setSelectedField(field.id)}
            >
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
              <div className="flex items-center gap-2 flex-1">
                {fieldTypeIcons[field.type]}
                <span className="text-sm font-medium">{field.label}</span>
                {field.required && (
                  <span className="text-xs text-red-500">Required</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateField(field.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteField(field.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {fields.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No fields yet. Add fields from the left panel.</p>
          </div>
        )}
      </div>

      {/* Field Settings */}
      <div className="w-72 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        {selectedFieldData ? (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Field Settings
            </h3>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Label</label>
              <Input
                value={selectedFieldData.label}
                onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Placeholder</label>
              <Input
                value={selectedFieldData.placeholder || ''}
                onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Width</label>
              <Select
                value={selectedFieldData.width}
                onValueChange={(val) => updateField(selectedFieldData.id, { width: val as 'full' | 'half' | 'third' })}
                options={[
                  { value: 'full', label: 'Full Width' },
                  { value: 'half', label: 'Half Width' },
                  { value: 'third', label: 'Third Width' },
                ]}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Required</span>
              <Switch
                checked={selectedFieldData.required}
                onCheckedChange={(checked) => updateField(selectedFieldData.id, { required: checked })}
              />
            </div>

            {/* Options for select/checkbox/radio */}
            {(selectedFieldData.type === 'select' ||
              selectedFieldData.type === 'checkbox' ||
              selectedFieldData.type === 'radio') && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Options</label>
                <div className="space-y-2">
                  {selectedFieldData.options?.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...(selectedFieldData.options || [])];
                          newOptions[i] = e.target.value;
                          updateField(selectedFieldData.id, { options: newOptions });
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newOptions = selectedFieldData.options?.filter((_, idx) => idx !== i);
                          updateField(selectedFieldData.id, { options: newOptions });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newOptions = [...(selectedFieldData.options || []), `Option ${(selectedFieldData.options?.length || 0) + 1}`];
                      updateField(selectedFieldData.id, { options: newOptions });
                    }}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Form Settings
            </h3>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Submit Button Text</label>
              <Input
                value={settings.submitButtonText}
                onChange={(e) => setSettings({ ...settings, submitButtonText: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Success Message</label>
              <Textarea
                value={settings.successMessage}
                onChange={(e) => setSettings({ ...settings, successMessage: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Redirect URL (optional)</label>
              <Input
                value={settings.redirectUrl || ''}
                onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email Notification</label>
              <Input
                value={settings.emailNotification || ''}
                onChange={(e) => setSettings({ ...settings, emailNotification: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Enable CAPTCHA</span>
              <Switch
                checked={settings.captcha}
                onCheckedChange={(checked) => setSettings({ ...settings, captcha: checked })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal
        open={showPreview}
        onOpenChange={setShowPreview}
        title="Form Preview"
      >
        <FormPreview />
      </Modal>
    </div>
  );
};
