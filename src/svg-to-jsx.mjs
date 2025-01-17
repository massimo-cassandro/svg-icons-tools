import * as path from 'path';
import * as fs from 'fs';
import { configManager } from './config-manager.mjs';
import { parseSvgFiles } from './parse-svg-files.mjs';
import { printLine } from './print-result.mjs';
import { homedir_path_to_tilde } from './homedir-path-to-tilde.mjs';


export function svg_to_jsx() {

  const cfg = configManager.getCfg(),
    cfg_obj = cfg.jsx;
  let dest_folder = '', fileCount = 0, component_list = [];

  const source_folders_length = Object.keys(cfg_obj.source_folders)
    .reduce((acc, key) => acc + cfg_obj.source_folders[key].length, 0);

  if (source_folders_length && cfg_obj.dest_folder && cfg_obj.icon_builder && typeof cfg_obj.icon_builder === 'function') {

    dest_folder = path.resolve(cfg.work_dir, cfg_obj.dest_folder);

    // checking output dir for optimized svg files
    if (!fs.existsSync(dest_folder)) {
      fs.mkdirSync(dest_folder, {recursive: true});
    }

    // parsing and saving JSX files
    fileCount = parseSvgFiles('jsx',
      (parsedSvg) => {
        const result = cfg_obj.icon_builder(parsedSvg),
          dest_file_path = path.resolve(dest_folder, `${result.component_name}.jsx`);
        fs.writeFileSync(dest_file_path, result.jsx_content);
        component_list.push({name: result.component_name, path: dest_file_path});
      }
    );

    // creating index file
    let index_file_path = '';
    if (component_list.length && cfg_obj.index_file) {

      index_file_path = path.resolve(cfg.work_dir, cfg_obj.index_file);
      const index_file_folder = path.dirname(index_file_path);

      if (!fs.existsSync(index_file_folder)) {
        fs.mkdirSync(index_file_folder, {recursive: true});
      }

      const index_file_content = component_list.reduce((acc, component_obj) => {
        const relative_path = path.relative(path.dirname(index_file_path), component_obj.path);
        return acc + `export { ${component_obj.name} } from '${relative_path}';\n`;
      }, '');

      fs.writeFileSync(index_file_path, index_file_content);
    }

    if(fileCount) {
      printLine(`\nSVG to JSX: ${fileCount} SVG files processed`);
      printLine(`JSX files saved to ${homedir_path_to_tilde(dest_folder)}`, true);

      if(index_file_path) {
        printLine(`Index file saved to ${homedir_path_to_tilde(index_file_path)}`, true);

      } else {
        printLine('Index file has not been created', true);
      }

    } else {
      printLine('\nSVG to JSX: no files processed', true);
    }

  } else {
    printLine('\nSVG to JSX: no files processed', true);
  }
}
