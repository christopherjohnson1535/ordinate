// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import FormField from '~components/form-field';
import Input from '~components/input';
import Journey, { JourneyProps } from '~components/journey';
import SpaceBetween from '~components/space-between';
import Textarea from '~components/textarea';
import Tiles from '~components/tiles';

import styles from './styles.module.scss';

interface Answers {
  room: string | null;
  start: string | null;
  budget: string | null;
  notes: string;
  name: string;
  email: string;
}

const emptyAnswers: Answers = { room: null, start: null, budget: null, notes: '', name: '', email: '' };

function validate(index: number, answers: Answers): Partial<Record<keyof Answers, string>> {
  switch (index) {
    case 0:
      return answers.room ? {} : { room: 'Choose the room you have in mind.' };
    case 1:
      return answers.start ? {} : { start: 'Choose when you would like to start.' };
    case 2:
      return answers.budget ? {} : { budget: 'Choose a budget. A rough idea is fine.' };
    case 4: {
      const errors: Partial<Record<keyof Answers, string>> = {};
      if (!answers.name.trim()) {
        errors.name = 'Tell us your name.';
      }
      if (!/^\S+@\S+\.\S+$/.test(answers.email)) {
        errors.email = 'Enter an email address, such as sam@example.com.';
      }
      return errors;
    }
    default:
      return {};
  }
}

// A five-question enquiry for a small design studio: three choices, an optional note and contact details.
export default function JourneyPlanYourProject() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (changes: Partial<Answers>) => setAnswers(current => ({ ...current, ...changes }));

  const onNavigate: JourneyProps['onNavigate'] = ({ detail }) => {
    const found = detail.reason === 'next' ? validate(activeStepIndex, answers) : {};
    setErrors(found);
    if (Object.keys(found).length === 0) {
      setActiveStepIndex(detail.requestedStepIndex);
    }
  };

  const onFinish = () => {
    const found = validate(4, answers);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  const choiceError = (key: keyof Answers) => errors[key];

  const steps: JourneyProps.Step[] = [
    {
      id: 'room',
      question: 'What would you like to change?',
      description: 'Pick the closest. We can talk through the details later.',
      errorText: choiceError('room'),
      content: (
        <Tiles
          value={answers.room}
          onChange={event => update({ room: event.detail.value })}
          items={[
            { value: 'kitchen', label: 'A kitchen', description: 'Layout, cabinets, worktops.' },
            { value: 'bathroom', label: 'A bathroom', description: 'Tiling, fittings, light.' },
            { value: 'home', label: 'The whole home', description: 'Rooms, flow and storage.' },
          ]}
        />
      ),
    },
    {
      id: 'start',
      question: 'When would you like to start?',
      errorText: choiceError('start'),
      content: (
        <Tiles
          value={answers.start}
          onChange={event => update({ start: event.detail.value })}
          items={[
            { value: 'soon', label: 'This season', description: 'Within three months.' },
            { value: 'later', label: 'Later this year', description: 'Three to nine months.' },
            { value: 'exploring', label: 'Just exploring', description: 'No date in mind yet.' },
          ]}
        />
      ),
    },
    {
      id: 'budget',
      question: 'Roughly what would you like to spend?',
      description: 'It helps us suggest materials. It is not a quote.',
      errorText: choiceError('budget'),
      content: (
        <Tiles
          value={answers.budget}
          onChange={event => update({ budget: event.detail.value })}
          items={[
            { value: 'small', label: 'Under 15,000' },
            { value: 'medium', label: '15,000 to 40,000' },
            { value: 'large', label: 'Over 40,000' },
          ]}
        />
      ),
    },
    {
      id: 'notes',
      question: 'Anything we should know?',
      description: 'Pets, stairs, a deadline, a photo you love. Leave it blank if not.',
      isOptional: true,
      content: (
        <FormField label="Notes" stretch={true}>
          <Textarea value={answers.notes} rows={4} onChange={event => update({ notes: event.detail.value })} />
        </FormField>
      ),
    },
    {
      id: 'contact',
      question: 'Where can we reach you?',
      description: 'We reply within two working days.',
      errorText: errors.name || errors.email ? 'Check your name and email.' : undefined,
      content: (
        <div className={styles.fields}>
          <FormField label="Your name" errorText={errors.name}>
            <Input value={answers.name} autoComplete="name" onChange={event => update({ name: event.detail.value })} />
          </FormField>
          <FormField label="Email" errorText={errors.email}>
            <Input
              type="email"
              value={answers.email}
              autoComplete="email"
              onChange={event => update({ email: event.detail.value })}
            />
          </FormField>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      {sent ? (
        <SpaceBetween size="m">
          <Box variant="h2">Thank you, {answers.name}.</Box>
          <Box>We will write to {answers.email} within two working days.</Box>
          <div>
            <Button
              onClick={() => {
                setAnswers(emptyAnswers);
                setActiveStepIndex(0);
                setSent(false);
              }}
            >
              Start again
            </Button>
          </div>
        </SpaceBetween>
      ) : (
        <Journey
          steps={steps}
          activeStepIndex={activeStepIndex}
          isLoading={sending}
          finishButtonText="Send my request"
          onNavigate={onNavigate}
          onFinish={onFinish}
        />
      )}
    </div>
  );
}
