/**
 * Служба для управления локальным хранилищем IndexedDB.
 * @author Aleksey Magner
 * @license MIT
 */

/** @type string */
let objectStoreName;

/** @type IDBDatabase */
let DB;

/**
 * @param {IDBOpenDBRequest|IDBTransaction} request
 * @return {Promise}
 */
const objectStoreRequest = request =>
  new Promise((resolve, reject) => {
    request.oncomplete = () => resolve(request.result);
    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(`[IndexedDB]. ${request.error}`);
  });

/**
 * Инициализация сервиса. Открытие базы данных
 * @function initDatabase
 * @param {string} dbName - Имя базы данных
 * @param {string} storeName - Имя хранилища
 * @param {number} [version=1] - Номер версии базы данных
 * @return {Promise}
 */
exports.initDatabase = (dbName, storeName, version = 1) => {
  if (!dbName || !storeName) {
    throw new Error('[IndexedDB]. The service has not been initialized. Set name');
  }

  objectStoreName = storeName;

  const DBOpenRequest = window.indexedDB.open(dbName, version);

  DBOpenRequest.onupgradeneeded = () => {
    DBOpenRequest.result.createObjectStore(objectStoreName);
  };

  return objectStoreRequest(DBOpenRequest)
    .then(db => {
      DB = db;
    })
    .catch(error => {
      throw new Error(error);
    });
};

/**
 * Закрытие и удаление базы данных
 * @function deleteDatabase
 */
exports.deleteDatabase = () => {
  const { name } = DB;

  DB.close();

  window.indexedDB.deleteDatabase(name);
};

/**
 * Рекурсивное (глубокое) копирование объекта (массива)
 * @param {Object} sourceObject
 * @return {Object}
 */
const deepClone = sourceObject => {
  if (!sourceObject || typeof sourceObject !== 'object') {
    return sourceObject;
  } else if (sourceObject instanceof Date) {
    return new Date(sourceObject);
  }

  const clone = Array.isArray(sourceObject)
    ? [].concat(sourceObject)
    : Object.assign({}, sourceObject);

  Object.keys(clone).forEach(key => {
    const value = sourceObject[key];

    clone[key] = typeof value === 'object' ? deepClone(value) : value;
  });

  return clone;
};

/**
 * Служба для управления локальным хранилищем IndexedDB.
 */
exports.idb = {
  /**
   * Проверка инициализации базы данных
   * @function
   */
  checkDB() {
    if (!DB) {
      throw new Error(
        '[IndexedDB]. The service has not been initialized. Run initDatabase(<DBName>, <StoreName>)',
      );
    }
  },
  /**
   * Получение одного или нескольких значений по ключам из хранилища IndexedDB.
   * @method
   * @param {string|string[]} keys
   * @return {Promise<*>}
   */
  get(keys) {
    const invalid = [!Array.isArray(keys) && typeof keys !== 'string'].every(Boolean);

    if (invalid) {
      throw new Error('[IndexedDB]. GET. Wrong params type');
    }

    this.checkDB();

    const store = DB.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);

    if (Array.isArray(keys)) {
      return Promise.all(keys.map(key => objectStoreRequest(store.get(key))));
    }

    return objectStoreRequest(store.get(keys));
  },
  /**
   * Добавление одного или нескольких значений по ключам в хранилище IndexedDB.
   * @method
   * @param {Object.<string, *>} pairs
   * @return {Promise}
   */
  set(pairs) {
    const invalid = [!pairs, typeof pairs !== 'object', pairs?.constructor?.name !== 'Object'].some(
      Boolean,
    );

    if (invalid) {
      throw new Error('[IndexedDB]. SET. Wrong params type');
    }

    this.checkDB();

    const store = DB.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName);

    const entries = Object.entries(pairs);

    entries.forEach(([key, value]) => {
      let storeValue = value;

      if (typeof value === 'object') {
        storeValue = deepClone(value);
      }

      store.put(storeValue, key);
    });

    return objectStoreRequest(store.transaction);
  },
  /**
   * Обновление значения по ключу в хранилище IndexedDB.
   * @method
   * @async
   * @param {string} key
   * @param {Function} callback - Функция обратного вызова, которая принимает старое значение и возвращает новое значение
   * @return {Promise}
   */
  async update(key, callback) {
    const invalid = [
      !key,
      typeof key !== 'string',
      !callback,
      callback?.constructor?.name !== 'Function',
    ].some(Boolean);

    if (invalid) {
      throw new Error('[IndexedDB]. UPDATE. Wrong params type');
    }

    this.checkDB();

    const store = DB.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName);

    const storeValue = await objectStoreRequest(store.get(key));

    let updatedValue = callback(storeValue);

    if (typeof updatedValue === 'object') {
      updatedValue = deepClone(updatedValue);
    }

    store.put(updatedValue, key);

    return objectStoreRequest(store.transaction);
  },
  /**
   * Удаление одного или нескольких ключей в хранилище IndexedDB.
   * @method
   * @param {string|string[]} keys
   * @return {Promise}
   */
  delete(keys) {
    const invalid = [!Array.isArray(keys) && typeof keys !== 'string'].every(Boolean);

    if (invalid) {
      throw new Error('[IndexedDB]. DELETE. Wrong params type');
    }

    this.checkDB();

    const store = DB.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName);

    if (Array.isArray(keys)) {
      keys.forEach(key => store.delete(key));
    } else {
      store.delete(keys);
    }

    return objectStoreRequest(store.transaction);
  },
  /**
   * Очистка всех значений в хранилище IndexedDB.
   * @method
   * @return {Promise}
   */
  clear() {
    this.checkDB();

    const store = DB.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName);

    store.clear();

    return objectStoreRequest(store.transaction);
  },
  /**
   * Получение списка всех ключей из хранилища IndexedDB.
   * @method
   * @return {Promise<string[]>}
   */
  keys() {
    this.checkDB();

    const store = DB.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);

    return objectStoreRequest(store.getAllKeys());
  },
  /**
   * Получение списка всех значений из хранилища IndexedDB.
   * @method
   * @return {Promise<*[]>}
   */
  values() {
    this.checkDB();

    const store = DB.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);

    return objectStoreRequest(store.getAll());
  },
  /**
   * Получение объекта со всеми ключами и значениями из хранилища IndexedDB.
   * @method
   * @async
   * @return {Object.<string, *>}
   */
  async entries() {
    this.checkDB();

    const store = DB.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);

    const entries = {};

    const keys = await objectStoreRequest(store.getAllKeys());
    const values = await objectStoreRequest(store.getAll());

    keys.forEach((key, index) => {
      entries[key] = values[index];
    });

    return entries;
  },
};
