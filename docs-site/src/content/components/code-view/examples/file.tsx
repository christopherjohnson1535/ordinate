// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CodeView from '@ordinate/components/code-view';

const deployment = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: north-annex
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: registry.example.com/north-annex/web:2026.11.02
          ports:
            - containerPort: 8080
`;

export default function File() {
  return <CodeView content={deployment} language="yaml" ariaLabel="deployment.yaml" />;
}
