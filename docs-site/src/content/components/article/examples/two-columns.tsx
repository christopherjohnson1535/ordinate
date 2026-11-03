// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Article from '@ordinate/components/article';
import Box from '@ordinate/components/box';
import StyleScope from '@ordinate/components/style-scope';

export default function TwoColumns() {
  return (
    <StyleScope styleName="editorial">
      <Box padding={{ vertical: 'xl', horizontal: 's' }}>
        <Article
          lead="The allotment committee met on Tuesday. Here is what was decided, and what was not."
          byline="By Dana Ruiz · 28 October 2026"
          dropCap={true}
          columns={2}
          measure="narrow"
        >
          <p>
            Water will be off from the first of December, as every year. The standpipes on the north side are to be
            lagged this time, after last winter's burst, and Plot 9 has offered the straw.
          </p>
          <p>
            The waiting list is now forty-one names long. The committee agreed to split three of the largest plots when
            their holders give them up, rather than offer them whole.
          </p>
          <h4>Not decided</h4>
          <p>
            Whether to allow hens. The vote was tied, and the chair asked for a site visit to the allotments at Inch
            before the next meeting.
          </p>
          <p>
            The next meeting is on the second Tuesday of January, in the shed if it is dry and the church hall if it is
            not.
          </p>
        </Article>
      </Box>
    </StyleScope>
  );
}
