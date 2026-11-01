// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { FileUploadProps } from './interfaces';
import { InternalFileUpload } from './internal';

export type { FileUploadProps };

const FileUpload = React.forwardRef(
  (
    {
      value,
      onChange,
      multiple = false,
      accept,
      showFileSize = false,
      showFileLastModified = false,
      showFileThumbnail = false,
      tokenLimit,
      fileErrors,
      fileWarnings,
      constraintText,
      errorText,
      warningText,
      ariaLabel,
      ariaRequired,
      i18nStrings,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...props
    }: FileUploadProps,
    ref: React.Ref<FileUploadProps.Ref>
  ) => (
    <InternalFileUpload
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      multiple={multiple}
      accept={accept}
      showFileSize={showFileSize}
      showFileLastModified={showFileLastModified}
      showFileThumbnail={showFileThumbnail}
      tokenLimit={tokenLimit}
      fileErrors={fileErrors}
      fileWarnings={fileWarnings}
      constraintText={constraintText}
      errorText={errorText}
      warningText={warningText}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      i18nStrings={i18nStrings}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
      warning={warning}
    />
  )
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
