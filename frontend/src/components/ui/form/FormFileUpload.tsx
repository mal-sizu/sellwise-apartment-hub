import { useState } from "react";
import { 
  useFormContext, 
  Controller, 
  FieldValues, 
  FieldPath,
  RegisterOptions
} from "react-hook-form";
import { useDropzone } from 'react-dropzone';

type FormFileUploadProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // In MB
  errorMessage?: string;
  onFileSelect?: (files: File | File[] | null) => void;
};

const FormFileUpload = <T extends FieldValues>({
  name,
  label,
  rules,
  disabled,
  accept = "image/jpeg, image/png",
  multiple = false,
  maxFiles = 1,
  maxSize = 2,
  errorMessage: externalErrorMessage,
  onFileSelect
}: FormFileUploadProps<T>) => {
  const { control, formState: { errors } } = useFormContext();
  const [previews, setPreviews] = useState<string[]>([]);
  
  const errorMessage = externalErrorMessage || (errors[name]?.message as string | undefined);
  const maxSizeBytes = maxSize * 1024 * 1024;

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file${maxFiles !== 1 ? 's' : ''} allowed`);
      return { valid: validFiles, errors };
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type;
      
      if (!accept.includes(fileType)) {
        errors.push(`File "${file.name}" has an unsupported format`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        errors.push(`File "${file.name}" exceeds the ${maxSize}MB size limit`);
        continue;
      }

      validFiles.push(file);
    }

    return { valid: validFiles, errors };
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          // Define the dropzone inside the Controller render prop
          // so it has access to the field value
          const {
            getRootProps,
            getInputProps,
            isDragActive
          } = useDropzone({
            onDrop: (acceptedFiles: File[]) => {
              const { valid, errors: fileErrors } = validateFiles(acceptedFiles);
                    
              if (fileErrors.length) {
                console.error(fileErrors);
                return;
              }
                    
              const newPreviews = valid.map(file => URL.createObjectURL(file));
                    
              setPreviews(prevPreviews => {
                // Revoke old preview URLs to prevent memory leaks
                prevPreviews.forEach(url => URL.revokeObjectURL(url));
                return newPreviews;
              });
                    
              const filesValue = multiple ? valid : valid[0] || null;
              field.onChange(filesValue);
                    
              if (onFileSelect) {
                onFileSelect(filesValue);
              }
            },
            accept: accept.split(',').reduce((acc, type) => ({
              ...acc,
              [type.trim()]: []
            }), {}),
            multiple,
            maxFiles,
            maxSize: maxSizeBytes,
            disabled
          });

          const removeFile = (index: number) => {
            if (multiple) {
              const newFiles = Array.isArray(field.value) 
                ? field.value.filter((_, i: number) => i !== index) 
                : [];
              field.onChange(newFiles);
              
              if (onFileSelect) {
                onFileSelect(newFiles);
              }
              
              setPreviews(prev => {
                const newPreviews = [...prev];
                URL.revokeObjectURL(newPreviews[index]);
                newPreviews.splice(index, 1);
                return newPreviews;
              });
            } else {
              field.onChange(null);
              
              if (onFileSelect) {
                onFileSelect(null);
              }
              
              setPreviews([]);
            }
          };

          return (
            <div className="space-y-2">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                  isDragActive
                    ? "border-villain-500 bg-villain-50"
                    : "border-gray-300 hover:border-villain-500"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <input {...getInputProps()} />
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <span className={`font-medium ${
                      disabled ? "text-gray-400" : "text-villain-500 hover:text-villain-600"
                    }`}>
                      Upload {multiple ? "files" : "a file"}
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {accept.split(",").map(type => type.split("/")[1]).join(", ")} up to {maxSize}MB
                  </p>
                  {multiple && (
                    <p className="text-xs text-gray-500">
                      Maximum {maxFiles} file{maxFiles !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {field.value && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                  <ul className="text-sm text-gray-500">
                    {multiple ? (
                      Array.isArray(field.value) && field.value.map((file: File, index: number) => (
                        <li key={index}>{file.name}</li>
                      ))
                    ) : (
                      <li>{(field.value as File).name}</li>
                    )}
                  </ul>
                </div>
              )}

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((previewUrl, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-24">
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
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

export default FormFileUpload;