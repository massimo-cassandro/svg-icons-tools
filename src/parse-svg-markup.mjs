import { optimize } from 'svgo';
import { configManager } from './config-manager.mjs';
import * as fs from 'fs';

// https://svgo.dev/docs/introduction/
export function parseSvgMarkup(filepath, type_class = null) {
  const cfg = configManager.getCfg();

  let svgString = fs.readFileSync(filepath, 'utf8');


  // remove pallets
  cfg.pallets.forEach(pallet => {
    svgString = svgString.replace(pallet, '');
  });

  const optimized = optimize(svgString, cfg.svgo_config);

  // extracting viewbox
  const viewbox = optimized.data.match(/viewBox=(?:"|')(\d+ \d+ \d+ \d+)(?:"|')/mi)[1];

  // duotone classes
  optimized.data = optimized.data.replace(/(?:fill-)?opacity=(?:'|")0?\.(\d+)(?:'|")/g, (match, p1) => {
    const opacity_value = Math.round(+((p1 + '000').slice(0, 3)) / 100);

    var opacity_key = Object.keys(cfg.opacity_classes).reduce((prev, curr) => {
      curr = +curr;
      return (Math.abs(curr - opacity_value) < Math.abs(prev - opacity_value) ? curr : prev);
    });
    return `class='${cfg.opacity_classes[opacity_key]}'`;
  });

  // non-square icons
  let aspect_ratio_class = null;
  if(cfg.non_square_icons_classes.length ) {

    const round = (w, h) => Math.round(w / h * 100) / 100
      ,[,,width, height] = viewbox.split(' ')
    ;

    if(width !== height) {
      const aspect_ratio = round(+width, +height);

      const aspect_ratio_class_idx = cfg.non_square_icons_classes.map(i => round(i[0])).reduce((prev, curr, idx) => {
        curr = idx;
        const prev_value = prev !== null? cfg.non_square_icons_classes[prev][0] : 0;
        return Math.abs(cfg.non_square_icons_classes[curr][0] - aspect_ratio) < Math.abs(prev_value - aspect_ratio) ? curr : prev;
      }, null);

      aspect_ratio_class = cfg.non_square_icons_classes[aspect_ratio_class_idx][1];

    }
  }

  // aspect ratio class and extra_class are immediately assigned to the optimized svg markup
  if(aspect_ratio_class || type_class) {
    const classes = [
      ...(aspect_ratio_class? [aspect_ratio_class] : []),
      ...(type_class? [type_class] : []),
    ];
    optimized.data = optimized.data.replace(/<svg/, `<svg class="${classes.join(' ')}"`);
  }

  // get svg content
  const content = optimized.data.match(/<svg(?:.*?)>(.*?)<\/svg>/mi)[1];

  return {svg: optimized.data, viewbox: viewbox, content: content, aspect_ratio_class: aspect_ratio_class, type_class: type_class};
}
