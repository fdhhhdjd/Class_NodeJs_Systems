# How to use new Map?

## 1. Syntax

```javascript
    // 1. Initialize new Map
    const myMap = new Map();

    // 2. Set key and value into new Map
    myMap.set(key, value);

    // 3. Get value for key in new Map
    const value = myMap.get(key);

    // 4. Check if key exists in new Map
    const exists = myMap.has(key);

    // 5. Delete one key-value pair in new Map
    myMap.delete(key);

    // 6. Get count of key-value pairs in new Map
    const size = myMap.size;

    // 7. Iterate over each key-value pair in new Map
    myMap.forEach((value, key) => {
        // Do something with each key-value pair
    });

    // 8. Delete all keys in new Map
    myMap.clear();

    // 9. Get all keys in new Map
    const keys = Array.from(myMap.keys());

    // 10. Get all values in new Map
    const values = Array.from(myMap.values());

    // 11. Get all entries (key-value pairs) in new Map
    const entries = Array.from(myMap.entries());

    // 12. Use [Symbol.iterator]() to iterate over Map using for...of
    for (const [key, value] of myMap) {
        // Do something with each key-value pair
    }

    // 13. Add multiple key-value pairs to new Map
    const multipleKeyValuePairs = [
        [key1, value1],
        [key2, value2],
        [key3, value3]
        // and so on
    ];

    for (const [key, value] of multipleKeyValuePairs) {
        myMap.set(key, value);
    }
```

## 2. Examples

```javascript
       // Create a new Map
    const yourself = new Map();

    // Add key-value pairs to the Map
    yourself.set('fullname', 'Nguyen Tien Tai').set('age', 24).set('job', 'developer and teacher');

    // Get the value for a key from the Map
    const valueForKeyAge = yourself.get('age');
    console.log('Value for age:', valueForKeyAge); 

    // Check if a key exists in the Map
    const existsKeyFullname = yourself.has('fullname');
    console.log('fullname exists:', existsKeyFullname); 

    // Delete a key-value pair from the Map
    yourself.delete('job');

    // Get the size of the Map
    const sizeOfMap = yourself.size;
    console.log('Size of map:', sizeOfMap); 

    // Iterate over all key-value pairs in the Map
    yourself.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${value}`);
    });

    // Clear all keys in the Map
    yourself.clear();

    // Create a new Map and add multiple key-value pairs to it
    const anotherMap = new Map([
        ['apple', 5],
        ['banana', 10],
        ['orange', 8]
    ]);

    // Get all keys in the Map
    const keys = Array.from(anotherMap.keys());
    console.log('Keys:', keys); 
    // Output: Keys: [ 'apple', 'banana', 'orange' ]

    // Get all values in the Map
    const values = Array.from(anotherMap.values());
    console.log('Values:', values); // Output: Values: [ 5, 10, 8 ]

    // Get all entries (key-value pairs) in the Map
    const entries = Array.from(anotherMap.entries());
    console.log('Entries:', entries);
    // Output:
    // Entries: [ [ 'apple', 5 ], [ 'banana', 10 ], [ 'orange', 8 ] ]

    // Use [Symbol.iterator]() to iterate over Map using for...of
    for (const [key, value] of anotherMap) {
        console.log(`Key: ${key}, Value: ${value}`);
    }
    // Output:
    // Key: apple, Value: 5
    // Key: banana, Value: 10
    // Key: orange, Value: 8

```
