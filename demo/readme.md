# Demo

To run the demo, clone this repository and install all dependencies, then call the `demo run` script:

```bash
# clone the repository
git clone https://github.com/massimo-cassandro/svg-icons-tools.git

# install all dependencies
cd path/to/install/folder
npm install

## run the script
npm run 'demo run'
```

All the the generated files will be saved in the `demo/demo-output` directory.

**About demo files**

Some icons comes from [Phosphor Icons](https://phosphoricons.com/), [Remix Icon](https://remixicon.com/) and [heroicons](https://heroicons.com/).

File prefixes (heroicons, phosphoricons, etc.) are used to identify their origin and are removed during processing.

The `-w-pallet` suffix means that the file has a “pallet” (see config file) to be removed.
Likewise, duotone icons are indicated by the suffix `-duotone`.
