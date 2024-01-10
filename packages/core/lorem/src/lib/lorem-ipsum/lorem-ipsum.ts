import _content from '../../content';
import { generateText } from '../generate-text/generate-text';
import { logger } from '../logger';

import type { LoremIpsumOptions, LoremIpsumParameters } from '../type';

const requireParameters = (
  _options: LoremIpsumParameters,
): LoremIpsumOptions => {
  return {
    lang: 'en',
    size: 1,
    sizeType: 'paragraph',

    ..._options,
  };
};

export const lorem = (_options: LoremIpsumParameters): string => {
  const options = requireParameters(_options);
  const content = _content.loremIpsum[options.lang];

  logger.methodArgs?.('loremIpsumGenerator', _options);

  switch (options.sizeType) {
    case 'paragraph':
      return content.repeat(options.size);
    case 'sentence':
      return generateText(content.split(/[.،,]{1}/g), options.size);
    case 'word':
      return generateText(content.split(' '), options.size);
  }
};
