import { jest, describe, test, expect } from '@jest/globals';

import { init, idb } from './idb';

describe('idb.js', () => {
  test('check', async () => {
    const { error } = console;

    console.error = jest.fn();

    const database = idb('key');

    try {
      await database.get();
    } catch (err) {
      expect(err).toEqual(
        new Error('[IndexedDB]. The service has not been initialized. Run init()'),
      );
    }

    try {
      init('any-store');

      await database.get();
    } catch (err) {
      expect(err).toEqual(
        new Error('[IndexedDB]. The service has not been initialized. Run init()'),
      );
    }

    try {
      init('any-store', {});

      await database.get();
    } catch (err) {
      expect(err).toEqual(
        new Error('[IndexedDB]. The service has not been initialized. Run init()'),
      );
    }

    init('any-store', { any: 'key' });

    expect(console.error).not.toBeCalled();

    const invalid = await idb('key').get();

    expect(invalid).toBeUndefined();

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith('[IndexedDB]. Invalid key');

    await idb('key').set('any');

    expect(console.error).toBeCalledTimes(2);
    expect(console.error).toBeCalledWith('[IndexedDB]. Invalid key');

    await idb('key').remove();

    expect(console.error).toBeCalledTimes(3);
    expect(console.error).toBeCalledWith('[IndexedDB]. Invalid key');

    const valid = await idb('any').get();

    expect(valid).toBeUndefined();

    await idb('any').set('new value');

    const value = await idb('any').get();

    expect(value).toBe('new value');

    const object = {
      a: {
        b: {
          c: 42,
        },
        d: [1, 2, 3],
      },
    };

    await idb('any').set(object);

    object.a.b.c = 13;
    object.a.d[1] = 42;

    expect(object).toEqual({
      a: {
        b: {
          c: 13,
        },
        d: [1, 42, 3],
      },
    });

    const storeObject = await idb('any').get();

    expect(storeObject).toEqual({
      a: {
        b: {
          c: 42,
        },
        d: [1, 2, 3],
      },
    });

    await idb('any').remove();

    const clearedValue = await idb('any').get();

    expect(clearedValue).toBeUndefined();

    expect(console.error).toBeCalledTimes(3);

    console.error = error;
  });
});
