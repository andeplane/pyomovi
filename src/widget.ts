// Copyright (c) Anders Hafreager
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
  IWidgetManager,
} from '@jupyter-widgets/base';

import * as OMOVI from 'omovi';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

const deserialize_numpy_array = (data: any, manager?: IWidgetManager) => {
  if (data === null) {
    return null;
  }
  const ar = new Float32Array(data.data.buffer);
  return { data: ar, shape: data.shape, nested: data.nested };
};

function serialize_numpy_array(data: any, model?: DOMWidgetModel) {
  return data; //[0,9]
}

export class VisualizerModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: VisualizerModel.model_name,
      _model_module: VisualizerModel.model_module,
      _model_module_version: VisualizerModel.model_module_version,
      _view_name: VisualizerModel.view_name,
      _view_module: VisualizerModel.view_module,
      _view_module_version: VisualizerModel.view_module_version,
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
    particle_positions: {
      deserialize: deserialize_numpy_array,
      serialize: serialize_numpy_array,
    },
    particle_colors: {
      deserialize: deserialize_numpy_array,
      serialize: serialize_numpy_array,
    },
    particle_radii: {
      deserialize: deserialize_numpy_array,
      serialize: serialize_numpy_array,
    },
  };

  static model_name = 'OMOVIModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'OMOVIView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class VisualizerView extends DOMWidgetView {
  visualizer: OMOVI.Visualizer;
  particles: OMOVI.Particles;
  
  render() {
    // Need to add something like this. Not sure why.
    const z = document.createElement('p');
    z.innerHTML = '';
    this.el.appendChild(z);

    // Seems like we have issues with this if it happens exactly at render call.
    // Running 500 ms later works. Must find out why.
    this.visualizer = new OMOVI.Visualizer({ domElement: this.el });
    const capcity = 1e6;
    this.particles = new OMOVI.Particles(capcity);
    // set default types and indices
    for (let i = 0; i < capcity; i++) {
      this.particles.indices[i] = i;
      this.particles.types[i] = 1;
    }

    this.visualizer.add(this.particles);
    
    this.model.on(
      'change:particle_positions',
      this.particle_positions_changed,
      this
    );

    this.model.on('change:particle_colors', this.particle_colors_changed, this);

    this.model.on('change:particle_radii', this.particle_radii_changed, this);
  }

  particle_positions_changed() {
    const particlePositionsData = this.model.get('particle_positions');
    const particlePositions = particlePositionsData.data;
    this.particles.positions.set(particlePositions);
    this.particles.count = particlePositions.length / 3;
    this.particles.markNeedsUpdate();
  }

  particle_colors_changed() {
    const particleColorsData = this.model.get('particle_colors');
    const particleColors = particleColorsData.data;
    for (let i = 0; i < particleColors.length / 3; i++) {
      const r = particleColors[3 * i + 0];
      const g = particleColors[3 * i + 1];
      const b = particleColors[3 * i + 2];
      this.visualizer.setColor(i, { r, g, b });
    }
  }

  particle_radii_changed() {
    const particleRadiiData = this.model.get('particle_radii');
    const particleRadii = particleRadiiData.data;
    for (let i = 0; i < particleRadii.length; i++) {
      const radius = particleRadii[i] / 3;
      this.visualizer.setRadius(i, radius);
    }
  }
}
