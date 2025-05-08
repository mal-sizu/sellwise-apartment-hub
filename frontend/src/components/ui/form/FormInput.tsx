
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
};

const FormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  rules,
  disabled,
  info
}: FormInputProps<T>) => {
  const { control, formState: { errors } } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  // Get the error message for this field if it exists
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <div className="relative">
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
              }}
              className={`form-input ${
                errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
            />
            
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
};

export default FormInput;
