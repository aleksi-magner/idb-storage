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
import { initDatabase } from 'purejs-idb';

await initDatabase('any@database.name', 'any-store-name', 42);

// или

initDatabase('any@database.name', 'any-store-name', 42).then(() => {
  app.mount('#app');
});
```

### Закрытие базы и удаление инстанса

```javascript
import { deleteDatabase } from 'purejs-idb';

deleteDatabase();
```

### Получение одного или нескольких значений по ключам

```javascript
import { idb } from 'purejs-idb';

const token = await idb.get('token'); // value
const anyValues = await idb.get(['token', 'user', 'phone']); // [value1, value2, value3]
```

### Добавление одного или нескольких значений по ключам

```javascript
import { idb } from 'purejs-idb';

await idb.set({
  token: '<new Token>',
  user: { id: 42 },
  phone: 79991234567,
});
```

### Обновление значения по ключу

```javascript
import { idb } from 'purejs-idb';

const callback = value => (value || 0) + 1;

await idb.update('number', callback);
```

### Удаление одного или нескольких ключей

```javascript
import { idb } from 'purejs-idb';

await idb.delete('token');
await idb.delete(['token', 'user', 'phone']);
```

### Очистка всех значений

```javascript
import { idb } from 'purejs-idb';

await idb.clear();
```

### Получение списка всех ключей

```javascript
import { idb } from 'purejs-idb';

const allKeys = await idb.keys(); // [key1, key2, key3]
```

### Получение списка всех значений

```javascript
import { idb } from 'purejs-idb';

const allValues = await idb.values(); // [value1, value2, value3]
```

### Получение объекта со всеми ключами и значениями

```javascript
import { idb } from 'purejs-idb';

const entries = await idb.entries();

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
