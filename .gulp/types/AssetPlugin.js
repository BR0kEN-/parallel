'use strict';

import TypedPlugin from './TypedPlugin';
import yaml from 'js-yaml';
import fs from 'fs';

export default class AssetPlugin extends TypedPlugin {
  /**
   * @constructor
   *
   * @param {String} assetModule
   *   Name of module for processing source code.
   * @param {String} lintModule
   *   Name of module for validating source code.
   * @param {String} src
   *   Path pattern for searching source code.
   * @param {String} dest
   *   Destination directory where source code will be compiled.
   */
  constructor(assetModule, lintModule, src, dest) {
    super(assetModule);

    this.src = src;
    this.dest = dest;
    this.lint = new TypedPlugin(lintModule);
    this.options = this.getConfig('./.' + this.__proto__.constructor.name.toLowerCase() + '-config.yml');
  }

  getConfig(filename) {
    return fs.existsSync(filename) ? yaml.safeLoad(fs.readFileSync(filename, 'utf-8')) : {};
  }

  taskPipes() {
    return [];
  }

  lintPipes() {
    return [];
  }
}
