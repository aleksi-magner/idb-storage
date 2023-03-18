# Служба для управления локальным хранилищем IndexedDB.

## Установка

```shell
npm i indexeddb-storage
```

или

```shell
yarn add indexeddb-storage
```

## Использование

### Инициализация. Задаём имя хранилища и словарь с ключами

```javascript
// '@/services/storage.js'
import { init, idb } from 'indexeddb-storage';

init('any-store-name', {
  token: 'TOKEN',
  key2: 'user',
});

/**
 * @function storageService
 * @summary Работа с IndexedDB.
 * @see idb
 */
export default idb;
```

### Получение из хранилища IndexedDB значения по ключу.

```javascript
import StorageService from '@/services/storage';

const token = await StorageService('token').get();
```

### Добавление в хранилище IndexedDB значения по ключу.

```javascript
import StorageService from '@/services/storage';

await StorageService('token').set('<new Token>');
```

### Удаление ключа в хранилище IndexedDB.

```javascript
import StorageService from '@/services/storage';

await StorageService('token').remove();
```

### Good Boy License

We’ve released the plugin for simple work with IndexedDB either under MIT or the Good Boy License. We invented it. Please do _whatever your mom would approve of:_

* Download
* Change
* Fork
