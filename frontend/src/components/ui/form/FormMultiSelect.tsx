import { useState } from "react";
import { 
  useFormContext, 
  Controller, 
  FieldValues, 
  FieldPath,
  RegisterOptions
} from "react-hook-form";

type OptionType = {
  value: string;
  label: string;
};

type FormMultiSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  options: OptionType[];
  rules?: Omit<RegisterOptions<T, FieldPath<T>>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs">;
  disabled?: boolean;
  errorMessage?: string;
  onChange?: (value: string[]) => void;
  value?: string[];
};

const FormMultiSelect = <T extends FieldValues>({
  name,
  label,
  options,
  rules,
  disabled,
  errorMessage: externalErrorMessage,
  onChange: externalOnChange,
  value: externalValue
}: FormMultiSelectProps<T>) => {
  // Try to use form context, but don't throw if it's not available
  const formContext = useFormContext<T>();
  const [isOpen, setIsOpen] = useState(false);
  
  // For standalone mode (outside FormProvider)
  const [standaloneValues, setStandaloneValues] = useState<string[]>(externalValue || []);
  
  // Check if we're in a form context
  const isInFormContext = !!formContext;
  
  // Get error message - either from external prop or from form context
  const errorMessage = externalErrorMessage || 
    (isInFormContext ? formContext.formState.errors[name]?.message as string | undefined : undefined);

  // If not in form context, render a standalone multi-select
  if (!isInFormContext) {
    const selectedValues = externalValue !== undefined ? externalValue : standaloneValues;
    
    const selectedLabels = selectedValues
      .map(value => options.find(opt => opt.value === value)?.label)
      .filter(Boolean)
      .join(", ");
    
    const toggleOption = (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(value => value !== optionValue)
        : [...selectedValues, optionValue];
      
      setStandaloneValues(newValues);
      
      if (externalOnChange) {
        externalOnChange(newValues);
      }
    };

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
        
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={`form-input text-left flex justify-between items-center ${
              errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
            }`}
          >
            <span className={selectedLabels ? "" : "text-gray-400"}>
              {selectedLabels || "Select options"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg animate-fade-in">
              <ul className="py-1 max-h-60 overflow-auto">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className="px-4 py-2 hover:bg-villain-50 cursor-pointer flex items-center"
                    onClick={() => toggleOption(option.value)}
                  >
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-villain-500 focus:ring-villain-500/20"
                      checked={selectedValues.includes(option.value)}
                      readOnly
                    />
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
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
      
      <Controller<T>
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          // Ensure field.value is always an array
          const selectedValues = Array.isArray(field.value) ? field.value : [];
          
          const selectedLabels = selectedValues
            .map(value => options.find(opt => opt.value === value)?.label)
            .filter(Boolean)
            .join(", ");
          
          const toggleOption = (optionValue: string) => {
            const newValues = selectedValues.includes(optionValue)
              ? selectedValues.filter(value => value !== optionValue)
              : [...selectedValues, optionValue];
            
            field.onChange(newValues);
            
            // Call the onChange callback if provided
            if (externalOnChange) {
              externalOnChange(newValues);
            }
          };

          return (
            <div className="relative">
              <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`form-input text-left flex justify-between items-center ${
                  errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              >
                <span className={selectedLabels ? "" : "text-gray-400"}>
                  {selectedLabels || "Select options"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              
              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg animate-fade-in">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {options.map((option) => (
                      <li
                        key={option.value}
                        className="px-4 py-2 hover:bg-villain-50 cursor-pointer flex items-center"
                        onClick={() => toggleOption(option.value)}
                      >
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-villain-500 focus:ring-villain-500/20"
                          checked={selectedValues.includes(option.value)}
                          readOnly
                        />
                        {option.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {errorMessage && (
                <p className="mt-1 text-xs text-red-500 animate-fade-in">
                  {errorMessage}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default FormMultiSelect;
