// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Icon from '@ordinate/components/icon';
import List from '@ordinate/components/list';
import SpaceBetween from '@ordinate/components/space-between';

interface Member {
  id: string;
  name: string;
  role: string;
}

const team: Member[] = [
  { id: 'dana', name: 'Dana Ruiz', role: 'Owner, joined March 2024' },
  { id: 'sam', name: 'Sam Okafor', role: 'Deployer, joined June 2025' },
  { id: 'lee', name: 'Lee Park', role: 'Viewer, joined last week' },
];

export default function Basic() {
  const [members, setMembers] = useState(team);

  return (
    <SpaceBetween size="s">
      <List
        ariaLabel="Members of north-annex"
        items={members}
        renderItem={member => ({
          id: member.id,
          content: member.name,
          secondaryContent: member.role,
          icon: <Icon name="person" />,
          actions: (
            <Button
              variant="icon"
              iconName="remove"
              ariaLabel={`Remove ${member.name}`}
              onClick={() => setMembers(current => current.filter(other => other.id !== member.id))}
            />
          ),
        })}
      />
      {members.length < team.length && (
        <Box>
          <Button variant="link" onClick={() => setMembers(team)}>
            Put everyone back
          </Button>
        </Box>
      )}
    </SpaceBetween>
  );
}
