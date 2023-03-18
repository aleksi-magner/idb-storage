// https://github.com/jakearchibald/idb#readme
import { openDB } from 'idb';
import { deepClone } from 'purejs-helpers';

/** @type boolean */
let initOK = false;

/** @type string */
let storeName = '';

/** @type Object */
let storeKeys = {};

/**
 * Служба для управления локальным хранилищем IndexedDB.
 * @author Aleksey Magner
 * @license MIT
 */

/**
 * Инициализация сервиса.
 * @function
 * @param {string} name - Имя хранилища
 * @param {Object} keys={} - список ключей для присвоения / получения данных
 */
exports.init = (name, keys = {}) => {
  storeName = name;
  storeKeys = keys;

  if (name && Object.keys(keys).length) {
    initOK = true;
  }
};

/**
 * Служба для управления локальным хранилищем IndexedDB.
 * @function
 * @param {string} key
 * @return {Object}
 */
exports.idb = key => ({
  /**
   * Инициализация хранилища IndexedDB.
   * @method
   * @async
   */
  async getDB() {
    if (!initOK) {
      throw new Error('[IndexedDB]. The service has not been initialized. Run init()');
    }

    const storeKey = storeKeys[key];

    if (!storeKey) {
      console.error('[IndexedDB]. Invalid key');

      return {
        get: () => Promise.resolve(),
        set: () => Promise.resolve(),
        remove: () => Promise.resolve(),
      };
    }

    const database = await openDB(`${storeName}-store`, 1, {
      upgrade(database) {
        database.createObjectStore(storeName);
      },
    });

    return {
      get: () => database.get(storeName, storeKey),
      set: value => database.put(storeName, value, storeKey),
      remove: () => database.delete(storeName, storeKey),
    };
  },
  /**
   * Получение из хранилища IndexedDB значения по ключу.
   * @method
   * @async
   * @return {*}
   */
  async get() {
    const database = await this.getDB();

    return await database.get();
  },
  /**
   * Добавление в хранилище IndexedDB значения по ключу.
   * @method
   * @async
   * @param {*} value - Данные для записи в хранилище
   */
  async set(value) {
    const database = await this.getDB();

    let storeValue = value;

    if (typeof value === 'object') {
      storeValue = deepClone(value);
    }

    await database.set(storeValue);
  },
  /**
   * Удаление ключа в хранилище IndexedDB.
   * @method
   * @async
   */
  async remove() {
    const database = await this.getDB();

    await database.remove();
  },
});
