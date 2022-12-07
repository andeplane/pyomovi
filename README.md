
# pyomovi

[![Build Status](https://travis-ci.org/andeplane/pyomovi.svg?branch=master)](https://travis-ci.org/andeplane/pyomovi)
[![codecov](https://codecov.io/gh/andeplane/pyomovi/branch/master/graph/badge.svg)](https://codecov.io/gh/andeplane/pyomovi)


A Custom Jupyter Widget Library

## Installation

You can install using `pip`:

```bash
pip install pyomovi
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] pyomovi
```

To create a visualizer window use the following code
```python
import pyomovi
visualizer = pyomovi.Visualizer()
visualizer
```
Then in another cell (there is a bug, so the above must be executed 500ms before the next code) run e.g.
```
import numpy as np
positions = 100 * np.random.rand(1000000, 3)
visualizer.particle_positions = positions
```
to visualize 1 million atoms at random positions. If you want custom coloring and radii, you can
```
import numpy as np
visualizer.particle_positions = np.asarray([[0, 0, 0], [0,2,0], [0,2,2]])
visualizer.particle_colors = np.asarray([[255, 0, 0], [255, 255, 0], [255,255,255]]) # RGB
visualizer.particle_radii = np.asarray([1.0, 2.0, 3.0])
```

You can also set colors and radii using short names of atoms
```
import numpy as np
visualizer.particle_positions = np.asarray([[0, 0, 0], [0,2,0], [0,2,2]])
visualizer.set_atom_types(['O', 'H', 'H'])
```

## Development Installation

Create a dev environment:
```bash
conda create -n pyomovi-dev -c conda-forge nodejs yarn python jupyterlab
conda activate pyomovi-dev
```

Install the python. This will also build the TS package.
```bash
pip install -e ".[test, examples]"
```

When developing your extensions, you need to manually enable your extensions with the
notebook / lab frontend. For lab, this is done by the command:

```
jupyter labextension develop --overwrite .
yarn run build
```

For classic notebook, you need to run:

```
jupyter nbextension install --sys-prefix --symlink --overwrite --py pyomovi
jupyter nbextension enable --sys-prefix --py pyomovi
```

Note that the `--symlink` flag doesn't work on Windows, so you will here have to run
the `install` command every time that you rebuild your extension. For certain installations
you might also need another flag instead of `--sys-prefix`, but we won't cover the meaning
of those flags here.

### How to see your changes
#### Typescript:
If you use JupyterLab to develop then you can watch the source directory and run JupyterLab at the same time in different
terminals to watch for changes in the extension's source and automatically rebuild the widget.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
yarn run watch
# Run JupyterLab in another terminal
jupyter lab
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.

#### Python:
If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.

## Updating the version

To update the version, install tbump and use it to bump the version.
By default it will also create a tag.

```bash
pip install tbump
tbump <new-version>
```

