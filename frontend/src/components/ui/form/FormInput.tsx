import { useState } from "react";
import { 
  useFormContext, 
  Controller, 
  FieldValues, 
  FieldPath,
  RegisterOptions
} from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  info?: string;
  errorMessage?: string;
  description?: string;
  multiline?: boolean;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

const FormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  rules,
  disabled,
  info,
  errorMessage: externalErrorMessage,
  description,
  multiline = false,
  rows = 3,
  value: externalValue,
  onChange: externalOnChange,
  onBlur: externalOnBlur
}: FormInputProps<T>) => {
  // Try to use form context, but don't throw if it's not available
  const formContext = useFormContext<T>();
  const [isFocused, setIsFocused] = useState(false);
  
  // For standalone mode (outside FormProvider)
  const [standaloneValue, setStandaloneValue] = useState(externalValue || "");

  // Check if we're in a form context
  const isInFormContext = !!formContext;
  
  // Get error message - either from external prop or from form context
  const errorMessage = externalErrorMessage || 
    (isInFormContext ? formContext.formState.errors[name]?.message as string | undefined : undefined);

  // If not in form context, render a standalone input
  if (!isInFormContext) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setStandaloneValue(e.target.value);
      if (externalOnChange) {
        externalOnChange(e.target.value);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (externalOnBlur) {
        externalOnBlur();
      }
    };

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
        
        {description && (
          <p className="mb-1 text-xs text-gray-500">{description}</p>
        )}
        
        <div className="relative">
          {multiline ? (
            <textarea
              id={name}
              name={name}
              value={externalValue !== undefined ? externalValue : standaloneValue}
              disabled={disabled}
              placeholder={placeholder}
              rows={rows}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`form-input ${
                errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
            />
          ) : (
            <input
              type={type}
              id={name}
              name={name}
              value={externalValue !== undefined ? externalValue : standaloneValue}
              disabled={disabled}
              placeholder={placeholder}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`form-input ${
                errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
            />
          )}
          
          {info && !isFocused && !errorMessage && (
            <span className="mt-1 block text-xs text-gray-500">{info}</span>
          )}
          
          {errorMessage && (
            <p className="mt-1 text-xs text-red-500 animate-fade-in">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  // If in form context, use Controller as before
  const { control } = formContext;
  
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {description && (
        <p className="mb-1 text-xs text-gray-500">{description}</p>
      )}
      
      <Controller<T>
        name={name}
        control={control}
        rules={rules as RegisterOptions<T, FieldPath<T>>}
        render={({ field }) => (
          <div className="relative">
            {multiline ? (
              <textarea
                {...field}
                id={name}
                value={field.value || ""}
                disabled={disabled}
                placeholder={placeholder}
                rows={rows}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  field.onBlur();
                  if (externalOnBlur) externalOnBlur();
                }}
                onChange={(e) => {
                  field.onChange(e);
                  if (externalOnChange) externalOnChange(e.target.value);
                }}
                className={`form-input ${
                  errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
            ) : (
              <input
                {...field}
                type={type}
                id={name}
                value={field.value || ""}
                disabled={disabled}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  field.onBlur();
                  if (externalOnBlur) externalOnBlur();
                }}
                onChange={(e) => {
                  field.onChange(e);
                  if (externalOnChange) externalOnChange(e.target.value);
                }}
                className={`form-input ${
                  errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
            )}
            
            {info && !isFocused && !errorMessage && (
              <span className="mt-1 block text-xs text-gray-500">{info}</span>
            )}
            
            {errorMessage && (
              <p className="mt-1 text-xs text-red-500 animate-fade-in">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};export default FormInput;
