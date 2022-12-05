// Copyright (c) Anders Hafreager
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
  IWidgetManager,
} from '@jupyter-widgets/base';

import * as OMOVI from 'omovi'

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

const deserialize_numpy_array = (data: any, manager?: IWidgetManager) => {
  if(data == null) {
    return null
  }
  var ar = new Float32Array(data.data.buffer)
  return {data:ar, shape:data.shape, nested:data.nested}
}

function serialize_numpy_array(data: any, model?: DOMWidgetModel) {
  return data;//[0,9]
}

export class ExampleModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ExampleModel.model_name,
      _model_module: ExampleModel.model_module,
      _model_module_version: ExampleModel.model_module_version,
      _view_name: ExampleModel.view_name,
      _view_module: ExampleModel.view_module,
      _view_module_version: ExampleModel.view_module_version,
      value: 'Hello World',
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
    particle_positions: {
      deserialize: deserialize_numpy_array,
      serialize: serialize_numpy_array
    }
  };

  static model_name = 'ExampleModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ExampleView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class ExampleView extends DOMWidgetView {
  visualizer: OMOVI.Visualizer
  particles: OMOVI.Particles
  
  render() {
    this.el.classList.add('custom-widget');
    var z = document.createElement('p'); // is a node
    z.innerHTML = 'fuck ass'
    this.el.appendChild(z)

    setTimeout(() => {
      this.visualizer = new OMOVI.Visualizer({domElement: this.el})
      const N = 1e6
      this.particles = new OMOVI.Particles(N)
      for (let i = 0; i < N; i++) {
        this.particles.indices[i] = i
        this.particles.types[i] = 1
      }
      // @ts-ignore
      window.particles = this.particles
      this.visualizer.add(this.particles)
    }, 500)


    this.value_changed();
    this.model.on('change:value', this.value_changed, this);
    this.model.on('change:particle_positions', this.particle_positions_changed, this);
  }

  value_changed() {
    this.el.textContent = this.model.get('value');
  }

  particle_positions_changed() {
    const particlePositionsData = this.model.get('particle_positions');
    const particlePositions = particlePositionsData.data
    this.particles.positions.set(particlePositions)
    this.particles.count = particlePositions.length / 3
    this.particles.markNeedsUpdate()
  }
}
