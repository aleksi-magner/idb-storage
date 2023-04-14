/**
 * Служба для управления локальным хранилищем IndexedDB.
 * @author Aleksey Magner
 * @license MIT
 */

let objectStoreName: string;
let DB: IDBDatabase;

const objectStoreRequest = (request: IDBRequest | IDBOpenDBRequest): Promise<any> =>
  new Promise((resolve, reject): void => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(`[IndexedDB]. ${request.error}`);
  });

const transactionRequest = (request: IDBTransaction) =>
  new Promise(resolve => {
    request.oncomplete = () => resolve(request as IDBTransaction);
  });

/** Инициализация сервиса. Открытие базы данных */
export const initDatabase = (
  dbName: string,
  storeName: string,
  version: number = 1,
): Promise<void> => {
  if (!dbName || !storeName) {
    throw new Error('[IndexedDB]. The service has not been initialized. Set name');
  }

  objectStoreName = storeName;

  const DBOpenRequest: IDBOpenDBRequest = window.indexedDB.open(dbName, version);

  DBOpenRequest.onupgradeneeded = (): void => {
    DBOpenRequest.result.createObjectStore(objectStoreName);
  };

  return objectStoreRequest(DBOpenRequest)
    .then((db: IDBDatabase): void => {
      DB = db;
    })
    .catch(error => {
      throw new Error(error);
    });
};

/** Закрытие и удаление базы данных */
export const deleteDatabase = (): void => {
  const { name } = DB;

  DB.close();

  window.indexedDB.deleteDatabase(name);
};

export const idb = Object.freeze({
  /** Проверка инициализации базы данных */
  checkDB(): void {
    if (!DB) {
      throw new Error(
        '[IndexedDB]. The service has not been initialized. Run initDatabase(<DBName>, <StoreName>)',
      );
    }
  },
  /** Получение одного или нескольких значений по ключам из хранилища IndexedDB. */
  get(keys: IDBValidKey | IDBValidKey[]) {
    idb.checkDB();

    const store: IDBObjectStore = DB.transaction(objectStoreName, 'readonly').objectStore(
      objectStoreName,
    );

    if (Array.isArray(keys)) {
      return Promise.all(keys.map((key: IDBValidKey) => objectStoreRequest(store.get(key))));
    }

    return objectStoreRequest(store.get(keys));
  },
  /** Добавление одного или нескольких значений по ключам в хранилище IndexedDB */
  set(pairs: Record<string, any>) {
    const invalid: boolean = [
      !pairs,
      typeof pairs !== 'object',
      pairs?.constructor?.name !== 'Object',
    ].some(Boolean);

    if (invalid) {
      throw new Error('[IndexedDB]. SET. Wrong params type');
    }

    idb.checkDB();

    const store: IDBObjectStore = DB.transaction(objectStoreName, 'readwrite').objectStore(
      objectStoreName,
    );

    const entries: [IDBValidKey, any][] = Object.entries(pairs);

    entries.forEach(([key, value]): void => {
      let storeValue = value;

      if (typeof value === 'object') {
        storeValue = window.structuredClone(value);
      }

      store.put(storeValue, key);
    });

    return transactionRequest(store.transaction);
  },
  /** Обновление значения по ключу в хранилище IndexedDB */
  async update(key: IDBValidKey, callback: (value: any) => any) {
    idb.checkDB();

    const store: IDBObjectStore = DB.transaction(objectStoreName, 'readwrite').objectStore(
      objectStoreName,
    );

    const storeValue = await objectStoreRequest(store.get(key));

    let updatedValue = callback(storeValue);

    if (typeof updatedValue === 'object') {
      updatedValue = window.structuredClone(updatedValue);
    }

    store.put(updatedValue, key);

    return transactionRequest(store.transaction);
  },
  /** Удаление одного или нескольких ключей в хранилище IndexedDB */
  delete(keys: IDBValidKey | IDBValidKey[]) {
    idb.checkDB();

    const store: IDBObjectStore = DB.transaction(objectStoreName, 'readwrite').objectStore(
      objectStoreName,
    );

    if (Array.isArray(keys)) {
      keys.forEach((key: IDBValidKey) => store.delete(key));
    } else {
      store.delete(keys);
    }

    return transactionRequest(store.transaction);
  },
  /** Очистка всех значений в хранилище IndexedDB */
  clear() {
    idb.checkDB();

    const store: IDBObjectStore = DB.transaction(objectStoreName, 'readwrite').objectStore(
      objectStoreName,
    );

    store.clear();

    return transactionRequest(store.transaction);
  },
  /** Получение списка всех ключей из хранилища IndexedDB */
  keys(): Promise<IDBValidKey[]> {
    idb.checkDB();

    const store: IDBObjectStore = DB.transaction(objectStoreName, 'readonly').objectStore(
      objectStoreName,
    );

    return objectStoreRequest(store.getAllKeys());
  },
  /** Получение списка всех значений из хранилища IndexedDB */
  values(): Promise<any[]> {
    idb.checkDB();

    const store: IDBObjectStore = DB.transaction(objectStoreName, 'readonly').objectStore(
      objectStoreName,
    );

    return objectStoreRequest(store.getAll());
  },
  /** Получение объекта со всеми ключами и значениями из хранилища IndexedDB */
  async entries(): Promise<{}> {
    idb.checkDB();

    const store: IDBObjectStore = DB.transaction(objectStoreName, 'readonly').objectStore(
      objectStoreName,
    );

    const entries: Record<string, any> = {};

    const keys: string[] = await objectStoreRequest(store.getAllKeys());
    const values: any[] = await objectStoreRequest(store.getAll());

    keys.forEach((key: string, index: number): void => {
      entries[key] = values.at(index);
    });

    return entries;
  },
});
