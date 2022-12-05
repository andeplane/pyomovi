// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Add any needed widget imports here (or from controls)
// import {} from '@jupyter-widgets/base';

import { createTestModel } from './utils';

import { VisualizerModel } from '..';

describe('Visualizer', () => {
  describe('VisualizerModel', () => {
    it('should be createable', () => {
      const model = createTestModel(VisualizerModel);
      expect(model).toBeInstanceOf(VisualizerModel);
      expect(model.get('value')).toEqual('Hello World');
    });

    it('should be createable with a value', () => {
      const state = { value: 'Foo Bar!' };
      const model = createTestModel(VisualizerModel, state);
      expect(model).toBeInstanceOf(VisualizerModel);
      expect(model.get('value')).toEqual('Foo Bar!');
    });
  });
});
