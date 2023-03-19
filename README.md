# Служба для управления локальным хранилищем IndexedDB.

## Установка

```shell
npm i purejs-idb
```

или

```shell
yarn add purejs-idb
```

## Использование

### Инициализация. Задаём имя хранилища и при необходимости версию

```javascript
// '@/services/storage.js'
import { initDatabase, idb } from 'purejs-idb';

await initDatabase('any@database.name', 'any-store-name', 42);

// или

initDatabase('any@database.name', 'any-store-name', 42).then(() => {
  console.log('Init OK');
});

export default idb;
```

### Закрытие базы и удаление инстанса

```javascript
import { deleteDatabase } from 'purejs-idb';

deleteDatabase();
```

### Получение одного или нескольких значений по ключам

```javascript
import StorageService from '@/services/storage';

const token = await StorageService.get('token'); // value
const anyValues = await StorageService.get(['token', 'user', 'phone']); // [value1, value2, value3]
```

### Добавление одного или нескольких значений по ключам

```javascript
import StorageService from '@/services/storage';

await StorageService.set({ 'token': '<new Token>' });

await StorageService.set({
  token: '<new Token>',
  user: { id: 42 },
  phone: 79991234567,
});
```

### Обновление значения по ключу

```javascript
import StorageService from '@/services/storage';

const callback = value => (value || 0) + 1;

await StorageService.update('number', callback);
```

### Удаление одного или нескольких ключей

```javascript
import StorageService from '@/services/storage';

await StorageService.delete('token');
await StorageService.delete(['token', 'user', 'phone']);
```

### Очистка всех значений

```javascript
import StorageService from '@/services/storage';

await StorageService.clear();
```

### Получение списка всех ключей

```javascript
import StorageService from '@/services/storage';

const allKeys = await StorageService.keys(); // [key1, key2, key3]
```

### Получение списка всех значений

```javascript
import StorageService from '@/services/storage';

const allValues = await StorageService.values(); // [value1, value2, value3]
```

### Получение объекта со всеми ключами и значениями

```javascript
import StorageService from '@/services/storage';

const entries = await StorageService.entries();

// {
//   key1: 'value1',
//   key2: 'value2',
//   key3: 'value3',
// }
```

### Good Boy License

We’ve released the plugin for simple work with IndexedDB either under MIT or the Good Boy License. We invented it. Please do _whatever your mom would approve of:_

* Download
* Change
* Fork
