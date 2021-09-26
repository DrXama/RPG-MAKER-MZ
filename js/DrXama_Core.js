/*:
 *
 * @target MZ
 * @plugindesc v1.0.0 - Core script for plugins of Dr.Xamã
 * @author Dr.Xamã
 * @url https://github.com/DrXama/RPG-MAKER-MZ
 *
 * @help
 * ================================================================================
 *    DONATE
 * ================================================================================
 * https://guilhermesantos001.itch.io/
 * ================================================================================
 *    UPDATES
 * ================================================================================
 * More updates:
 * https://github.com/DrXama/RPG-MAKER-MZ
 * ================================================================================
 *    CHANGELOG
 * ================================================================================
 * v1.0.0 - Added support for DrXama_GameJolt
 * ================================================================================
 */

var DX = DX || {
  'site': function () { return require('nw.gui').Shell.openExternal('https://github.com/DrXama/RPG-MAKER-MZ'); },
  'terms': function () { return require('nw.gui').Shell.openExternal('https://github.com/DrXama/RPG-MAKER-MZ/blob/main/README.md'); },
  'compatibility': function () {
    const compatibility = true;

    if (Utils.RPGMAKER_NAME === 'MV') {
      if (Utils.RPGMAKER_VERSION == '1.4.1' ||
        Utils.RPGMAKER_VERSION == '1.4.0' ||
        Utils.RPGMAKER_VERSION == '1.3.5' ||
        Utils.RPGMAKER_VERSION == '1.3.4' ||
        Utils.RPGMAKER_VERSION == '1.3.3' ||
        Utils.RPGMAKER_VERSION == '1.3.2' ||
        Utils.RPGMAKER_VERSION == '1.3.1' ||
        Utils.RPGMAKER_VERSION == '1.3.0' ||
        Utils.RPGMAKER_VERSION == '1.2.0' ||
        Utils.RPGMAKER_VERSION == '1.1.0' ||
        Utils.RPGMAKER_VERSION == '1.0.1'
      )
        compatibility = false;
    } else if (Utils.RPGMAKER_NAME === 'MZ') {
    }

    if (!compatibility)
      return Graphics.printError('Dr.Xamã', `Atualmente seu RPG MAKER ${Utils.RPGMAKER_NAME} não suporta o seguinte plugin: DrXama_gameJolt`), SceneManager.stop();

    return console.warn(`DrXama_gameJolt está compatível com a versão atual do seu RPG MAKER ${Utils.RPGMAKER_NAME}`);
  }
};

window.DX = window.DX || DX;

((_) => {
  _.PluginManagerParameters = (name) => PluginManager.parameters(name);
  _.Game_Temp = Game_Temp.prototype;
  _.SceneUpdateCallbacks = [];

  const sceneUpdate = SceneManager.update;
  SceneManager.update = function (deltaTime) {
    sceneUpdate.call(this, deltaTime);
    if (_.SceneUpdateCallbacks.length > 0) {
      _.SceneUpdateCallbacks.forEach(callback => callback[0].call(callback[1]));
    }
  };
})(window.DX);