/**
 * Служба для управления локальным хранилищем IndexedDB.
 * @author Aleksey Magner
 * @license MIT
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let objectStoreName;
let DB;
const objectStoreRequest = (request) => new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(`[IndexedDB]. ${request.error}`);
});
const transactionRequest = (request) => new Promise(resolve => {
    request.oncomplete = () => resolve(request);
});
/** Инициализация сервиса. Открытие базы данных */
export const initDatabase = (dbName, storeName, version = 1) => {
    if (!dbName || !storeName) {
        throw new Error('[IndexedDB]. The service has not been initialized. Set name');
    }
    objectStoreName = storeName;
    const DBOpenRequest = window.indexedDB.open(dbName, version);
    DBOpenRequest.onupgradeneeded = () => {
        DBOpenRequest.result.createObjectStore(objectStoreName);
    };
    return objectStoreRequest(DBOpenRequest)
        .then((db) => {
        DB = db;
    })
        .catch(error => {
        throw new Error(error);
    });
};
/** Закрытие и удаление базы данных */
export const deleteDatabase = () => {
    const { name } = DB;
    DB.close();
    window.indexedDB.deleteDatabase(name);
};
export const idb = Object.freeze({
    /** Проверка инициализации базы данных */
    checkDB() {
        if (!DB) {
            throw new Error('[IndexedDB]. The service has not been initialized. Run initDatabase(<DBName>, <StoreName>)');
        }
    },
    /** Получение одного или нескольких значений по ключам из хранилища IndexedDB. */
    get(keys) {
        idb.checkDB();
        const store = DB.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
        if (Array.isArray(keys)) {
            return Promise.all(keys.map((key) => objectStoreRequest(store.get(key))));
        }
        return objectStoreRequest(store.get(keys));
    },
    /** Добавление одного или нескольких значений по ключам в хранилище IndexedDB */
    set(pairs) {
        var _a;
        const invalid = [
            !pairs,
            typeof pairs !== 'object',
            ((_a = pairs === null || pairs === void 0 ? void 0 : pairs.constructor) === null || _a === void 0 ? void 0 : _a.name) !== 'Object',
        ].some(Boolean);
        if (invalid) {
            throw new Error('[IndexedDB]. SET. Wrong params type');
        }
        idb.checkDB();
        const store = DB.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName);
        const entries = Object.entries(pairs);
        entries.forEach(([key, value]) => {
            let storeValue = value;
            if (typeof value === 'object') {
                storeValue = window.structuredClone(value);
            }
            store.put(storeValue, key);
        });
        return transactionRequest(store.transaction);
    },
    /** Обновление значения по ключу в хранилище IndexedDB */
    update(key, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            idb.checkDB();
            const store = DB.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName);
            const storeValue = yield objectStoreRequest(store.get(key));
            let updatedValue = callback(storeValue);
            if (typeof updatedValue === 'object') {
                updatedValue = window.structuredClone(updatedValue);
            }
            store.put(updatedValue, key);
            return transactionRequest(store.transaction);
        });
    },
    /** Удаление одного или нескольких ключей в хранилище IndexedDB */
    delete(keys) {
        idb.checkDB();
        const store = DB.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName);
        if (Array.isArray(keys)) {
            keys.forEach((key) => store.delete(key));
        }
        else {
            store.delete(keys);
        }
        return transactionRequest(store.transaction);
    },
    /** Очистка всех значений в хранилище IndexedDB */
    clear() {
        idb.checkDB();
        const store = DB.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName);
        store.clear();
        return transactionRequest(store.transaction);
    },
    /** Получение списка всех ключей из хранилища IndexedDB */
    keys() {
        idb.checkDB();
        const store = DB.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
        return objectStoreRequest(store.getAllKeys());
    },
    /** Получение списка всех значений из хранилища IndexedDB */
    values() {
        idb.checkDB();
        const store = DB.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
        return objectStoreRequest(store.getAll());
    },
    /** Получение объекта со всеми ключами и значениями из хранилища IndexedDB */
    entries() {
        return __awaiter(this, void 0, void 0, function* () {
            idb.checkDB();
            const store = DB.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
            const entries = {};
            const keys = yield objectStoreRequest(store.getAllKeys());
            const values = yield objectStoreRequest(store.getAll());
            keys.forEach((key, index) => {
                entries[key] = values.at(index);
            });
            return entries;
        });
    },
});
