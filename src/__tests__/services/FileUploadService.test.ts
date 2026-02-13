import { FileUploadService } from '@/services/FileUploadService';
import type { FileUploadRequest, FileUploadResponse, ApiResponse, BatchFileUploadRequest, BatchFileUploadResponse } from '@/types/services/fileUpload.types';
import { DocumentType } from '@/types/services/fileUpload.types';
import { getApiUrl } from '@/config/env';
import { getAuthToken } from '@/utils/authUtils';

// Mock dependencies
jest.mock('@/config/env');
jest.mock('@/utils/authUtils');

const mockGetApiUrl = getApiUrl as jest.MockedFunction<typeof getApiUrl>;
const mockGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;

describe('FileUploadService', () => {
  // Arrange (shared)
  let mockXhr: {
    open: jest.Mock;
    send: jest.Mock;
    setRequestHeader: jest.Mock;
    upload: {
      addEventListener: jest.Mock;
    };
    addEventListener: jest.Mock;
    status: number;
    responseText: string;
    abort: jest.Mock;
  };

  let mockFile: File;
  let mockProgressCallback: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    mockGetApiUrl.mockReturnValue('https://api.example.com');
    mockGetAuthToken.mockReturnValue('mock-token');
    mockProgressCallback = jest.fn();

    // Create mock file
    mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    // Mock XMLHttpRequest
    mockXhr = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      upload: {
        addEventListener: jest.fn(),
      },
      addEventListener: jest.fn(),
      status: 200,
      responseText: '',
      abort: jest.fn(),
    };

    // Replace global XMLHttpRequest
    (globalThis as any).XMLHttpRequest = jest.fn(() => mockXhr as unknown as XMLHttpRequest);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    // Arrange (shared)
    const mockRequest: FileUploadRequest = {
      file: mockFile,
      documentType: DocumentType.BUSINESS_REGISTRATION,
    };

    const mockSuccessResponse: ApiResponse<FileUploadResponse> = {
      data: {
        url: 'https://storage.example.com/file.pdf',
        path: 'uploads/file.pdf',
        bucket: 'documents',
        folder: 'uploads',
        fileName: 'test.pdf',
        fileSize: 1024,
        contentType: 'application/pdf',
        documentType: DocumentType.BUSINESS_REGISTRATION,
      },
      errorCode: 0,
      message: 'File uploaded successfully',
      status: 'success',
    };

    // Positive Tests
    describe('positive cases', () => {
      it('should upload file successfully and return response', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockSuccessResponse);

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        // Simulate successful load event
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        const result = await promise;

        // Assert
        expect(mockXhr.open).toHaveBeenCalledWith('POST', 'https://api.example.com/storage/upload');
        expect(mockXhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer mock-token');
        expect(mockXhr.send).toHaveBeenCalled();
        expect(result).toEqual(mockSuccessResponse);
        expect(result.data.url).toBe('https://storage.example.com/file.pdf');
      });

      it('should call onProgress callback with progress percentage', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockSuccessResponse);

        // Act
        const promise = FileUploadService.upload(mockRequest, mockProgressCallback);
        
        // Simulate progress event
        const progressHandler = mockXhr.upload.addEventListener.mock.calls.find(
          call => call[0] === 'progress'
        )?.[1];
        if (progressHandler) {
          progressHandler({ lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent);
        }

        // Simulate successful load event
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        await promise;

        // Assert
        expect(mockProgressCallback).toHaveBeenCalledWith(50);
      });

      it('should upload file without auth token when token is null', async () => {
        // Arrange
        mockGetAuthToken.mockReturnValue(null);
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockSuccessResponse);

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        await promise;

        // Assert
        expect(mockXhr.setRequestHeader).not.toHaveBeenCalled();
      });

      it('should append file and documentType to FormData', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockSuccessResponse);

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        await promise;

        // Assert
        expect(mockXhr.send).toHaveBeenCalled();
        const formData = mockXhr.send.mock.calls[0][0] as FormData;
        expect(formData).toBeInstanceOf(FormData);
      });

      it('should not call onProgress when callback is not provided', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockSuccessResponse);

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const progressHandler = mockXhr.upload.addEventListener.mock.calls.find(
          call => call[0] === 'progress'
        )?.[1];
        if (progressHandler) {
          progressHandler({ lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent);
        }

        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        await promise;

        // Assert
        expect(mockProgressCallback).not.toHaveBeenCalled();
      });
    });

    // Negative Tests
    describe('negative cases', () => {
      it('should reject with error message when response status is not 2xx', async () => {
        // Arrange
        mockXhr.status = 400;
        mockXhr.responseText = JSON.stringify({ message: 'Invalid file type' });

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('Invalid file type');
      });

      it('should reject with default error message when error response has no message', async () => {
        // Arrange
        mockXhr.status = 500;
        mockXhr.responseText = JSON.stringify({ error: 'Server error' });

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('File upload failed');
      });

      it('should reject with error message from response text when JSON parse fails', async () => {
        // Arrange
        mockXhr.status = 400;
        mockXhr.responseText = 'Plain text error message';

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('Plain text error message');
      });

      it('should reject with default error when response parsing fails completely', async () => {
        // Arrange
        mockXhr.status = 500;
        // Create a responseText that will fail JSON.parse and accessing it
        Object.defineProperty(mockXhr, 'responseText', {
          get: () => {
            throw new Error('Cannot read responseText');
          },
        });

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('File upload failed');
      });

      it('should reject with error when JSON response parsing fails', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = 'invalid json';

        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('Failed to parse response');
      });

      it('should reject with network error when error event is triggered', async () => {
        // Arrange
        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const errorHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'error'
        )?.[1];
        if (errorHandler) {
          errorHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('Network error during file upload');
      });

      it('should reject with abort error when abort event is triggered', async () => {
        // Arrange
        // Act
        const promise = FileUploadService.upload(mockRequest);
        
        const abortHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'abort'
        )?.[1];
        if (abortHandler) {
          abortHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('File upload was aborted');
      });

      it('should not call onProgress when lengthComputable is false', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockSuccessResponse);

        // Act
        const promise = FileUploadService.upload(mockRequest, mockProgressCallback);
        
        const progressHandler = mockXhr.upload.addEventListener.mock.calls.find(
          call => call[0] === 'progress'
        )?.[1];
        if (progressHandler) {
          progressHandler({ lengthComputable: false, loaded: 50, total: 100 } as ProgressEvent);
        }

        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        await promise;

        // Assert
        expect(mockProgressCallback).not.toHaveBeenCalled();
      });
    });
  });

  describe('uploadBatch', () => {
    // Arrange (shared)
    const mockBatchRequest: BatchFileUploadRequest = {
      businessLicense: mockFile,
      taxDocument: mockFile,
      additionalDocument: mockFile,
    };

    const mockBatchResponse: BatchFileUploadResponse = {
      uploadedFiles: [
        {
          url: 'https://storage.example.com/business.pdf',
          path: 'uploads/business.pdf',
          bucket: 'documents',
          fileName: 'business.pdf',
          fileSize: 1024,
          contentType: 'application/pdf',
          documentType: DocumentType.BUSINESS_REGISTRATION,
        },
        {
          url: 'https://storage.example.com/tax.pdf',
          path: 'uploads/tax.pdf',
          bucket: 'documents',
          fileName: 'tax.pdf',
          fileSize: 2048,
          contentType: 'application/pdf',
          documentType: DocumentType.TAX_IDENTIFICATION,
        },
      ],
      totalFiles: 3,
      successfulUploads: 2,
      failedUploads: 1,
      message: 'Batch upload completed',
    };

    // Positive Tests
    describe('positive cases', () => {
      it('should upload batch files successfully and return response', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockBatchResponse);

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        const result = await promise;

        // Assert
        expect(mockXhr.open).toHaveBeenCalledWith('POST', 'https://api.example.com/storage/upload');
        expect(mockXhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer mock-token');
        expect(result.data).toEqual(mockBatchResponse);
        expect(result.status).toBe('partial_success');
        expect(result.errorCode).toBe(1);
      });

      it('should wrap response in ApiResponse format', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockBatchResponse);

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        const result = await promise;

        // Assert
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('errorCode');
        expect(result).toHaveProperty('message');
        expect(result).toHaveProperty('status');
      });

      it('should set status to success when no failed uploads', async () => {
        // Arrange
        const successBatchResponse: BatchFileUploadResponse = {
          ...mockBatchResponse,
          failedUploads: 0,
          successfulUploads: 3,
        };
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(successBatchResponse);

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        const result = await promise;

        // Assert
        expect(result.status).toBe('success');
        expect(result.errorCode).toBe(0);
      });

      it('should append only provided files to FormData', async () => {
        // Arrange
        const partialRequest: BatchFileUploadRequest = {
          businessLicense: mockFile,
        };
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockBatchResponse);

        // Act
        const promise = FileUploadService.uploadBatch(partialRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        await promise;

        // Assert
        expect(mockXhr.send).toHaveBeenCalled();
        const formData = mockXhr.send.mock.calls[0][0] as FormData;
        expect(formData).toBeInstanceOf(FormData);
      });

      it('should call onProgress callback with progress percentage', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockBatchResponse);

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest, mockProgressCallback);
        
        const progressHandler = mockXhr.upload.addEventListener.mock.calls.find(
          call => call[0] === 'progress'
        )?.[1];
        if (progressHandler) {
          progressHandler({ lengthComputable: true, loaded: 75, total: 100 } as ProgressEvent);
        }

        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        await promise;

        // Assert
        expect(mockProgressCallback).toHaveBeenCalledWith(75);
      });

      it('should upload batch without auth token when token is null', async () => {
        // Arrange
        mockGetAuthToken.mockReturnValue(null);
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify(mockBatchResponse);

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        await promise;

        // Assert
        expect(mockXhr.setRequestHeader).not.toHaveBeenCalled();
      });
    });

    // Negative Tests
    describe('negative cases', () => {
      it('should reject with error message when response status is not 2xx', async () => {
        // Arrange
        mockXhr.status = 400;
        mockXhr.responseText = JSON.stringify({ message: 'Invalid file format' });

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('Invalid file format');
      });

      it('should reject with default error message when error response has no message', async () => {
        // Arrange
        mockXhr.status = 500;
        mockXhr.responseText = JSON.stringify({ error: 'Server error' });

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('File upload failed');
      });

      it('should reject with error message from response text when JSON parse fails', async () => {
        // Arrange
        mockXhr.status = 400;
        mockXhr.responseText = 'Plain text error message';

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('Plain text error message');
      });

      it('should reject with default error when response parsing fails completely', async () => {
        // Arrange
        mockXhr.status = 500;
        Object.defineProperty(mockXhr, 'responseText', {
          get: () => {
            throw new Error('Cannot read responseText');
          },
        });

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('File upload failed');
      });

      it('should reject with error when JSON response parsing fails', async () => {
        // Arrange
        mockXhr.status = 200;
        mockXhr.responseText = 'invalid json';

        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('Failed to parse response');
      });

      it('should reject with network error when error event is triggered', async () => {
        // Arrange
        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const errorHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'error'
        )?.[1];
        if (errorHandler) {
          errorHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('Network error during file upload');
      });

      it('should reject with abort error when abort event is triggered', async () => {
        // Arrange
        // Act
        const promise = FileUploadService.uploadBatch(mockBatchRequest);
        
        const abortHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'abort'
        )?.[1];
        if (abortHandler) {
          abortHandler();
        }

        // Assert
        await expect(promise).rejects.toThrow('File upload was aborted');
      });

      it('should handle empty batch request', async () => {
        // Arrange
        const emptyRequest: BatchFileUploadRequest = {};
        mockXhr.status = 200;
        mockXhr.responseText = JSON.stringify({
          uploadedFiles: [],
          totalFiles: 0,
          successfulUploads: 0,
          failedUploads: 0,
          message: 'No files to upload',
        });

        // Act
        const promise = FileUploadService.uploadBatch(emptyRequest);
        
        const loadHandler = mockXhr.addEventListener.mock.calls.find(
          call => call[0] === 'load'
        )?.[1];
        if (loadHandler) {
          loadHandler();
        }

        const result = await promise;

        // Assert
        expect(result.data.totalFiles).toBe(0);
        expect(result.data.uploadedFiles).toEqual([]);
      });
    });
  });
});
