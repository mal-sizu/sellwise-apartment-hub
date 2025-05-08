import { useState } from "react";
import { 
  useFormContext, 
  Controller, 
  FieldValues, 
  FieldPath,
  RegisterOptions
} from "react-hook-form";

type FormFileUploadProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // In MB
};

const FormFileUpload = <T extends FieldValues>({
  name,
  label,
  rules,
  disabled,
  accept = "image/jpeg, image/png",
  multiple = false,
  maxFiles = 1,
  maxSize = 2 // 2MB default
}: FormFileUploadProps<T>) => {
  const { control, formState: { errors } } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const errorMessage = errors[name]?.message as string | undefined;

  // Convert MB to bytes
  const maxSizeBytes = maxSize * 1024 * 1024;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check if too many files were selected
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file${maxFiles !== 1 ? 's' : ''} allowed`);
      return { valid: validFiles, errors };
    }

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file type
      const fileType = file.type;
      if (!accept.includes(fileType)) {
        errors.push(`File "${file.name}" has an unsupported format`);
        continue;
      }

      // Check file size
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
          // Keep track of selected files and their preview URLs
          const [previews, setPreviews] = useState<string[]>([]);
          
          const handleFilesSelected = (fileList: FileList | null) => {
            if (!fileList) return;
            
            const filesArray = Array.from(fileList);
            const { valid, errors: fileErrors } = validateFiles(filesArray);
            
            if (fileErrors.length) {
              // In a real app, you'd display these errors to the user
              console.error(fileErrors);
              return;
            }
            
            // Create preview URLs for valid files
            const newPreviews = valid.map(file => URL.createObjectURL(file));
            
            // Update previews
            setPreviews(prevPreviews => {
              // Revoke old preview URLs to prevent memory leaks
              prevPreviews.forEach(url => URL.revokeObjectURL(url));
              return newPreviews;
            });
            
            // Update form value
            field.onChange(multiple ? valid : valid[0] || null);
          };
          
          const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            
            if (disabled) return;
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFilesSelected(e.dataTransfer.files);
            }
          };

          const removeFile = (index: number) => {
            if (multiple) {
              const newFiles = Array.isArray(field.value) 
                ? field.value.filter((_, i: number) => i !== index) 
                : [];
              field.onChange(newFiles);
              
              // Update previews
              setPreviews(prev => {
                const newPreviews = [...prev];
                URL.revokeObjectURL(newPreviews[index]);
                newPreviews.splice(index, 1);
                return newPreviews;
              });
            } else {
              field.onChange(null);
              setPreviews([]);
            }
          };

          return (
            <div className="space-y-2">
              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                  isDragging
                    ? "border-villain-500 bg-villain-50"
                    : "border-gray-300 hover:border-villain-500"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
              >
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
                    <label
                      htmlFor={`file-upload-${name}`}
                      className={`relative cursor-pointer rounded-md font-medium ${
                        disabled ? "text-gray-400" : "text-villain-500 hover:text-villain-600"
                      }`}
                    >
                      <span>Upload {multiple ? "files" : "a file"}</span>
                      <input
                        id={`file-upload-${name}`}
                        name={`file-upload-${name}`}
                        type="file"
                        className="sr-only"
                        accept={accept}
                        multiple={multiple}
                        disabled={disabled}
                        onChange={(e) => handleFilesSelected(e.target.files)}
                      />
                    </label>
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

              {/* Preview Area */}
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
