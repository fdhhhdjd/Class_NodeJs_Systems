# Learn Redis

## 1.CONNECT REDIS
```bash
    redis-cli -h <host> -p <port>  -a  <password>
```

## 2. GLOBAL

```bash 
    # Search key
    keys 't*' 
```

## 3. STRING
```bash
    # Length 
    STRLEN name

    # Embstring ( <= 44bytes) 
    SET name 0123456789012345678901234567890123456789abc

    # Raw ( > 44 bytes )
    SET name1 0123456789012345678901234567890123456789abcsdsdsdsdsdsdsdasdasdasdsd

    # Int 
    SET name2 10

    # TTL and handle key exit
    set lock_key_unique unique_value NX PX 10000
    TTL lock_key_unique

    # Count
    INCR like:product-001
    INCRBY like:product-001 5 
    DECR like:product-001
    DECRBY  like:product-001 5

    # Check exits
    EXISTS  block_user_id

    # Del
    DEL like:product-001
```

## 4. HASH

```bash
    # Add single and add multiple
    HSET cart:1 product1 2
    HSET cart:1 product2 1  product3 3  product4 1

    # Length count
    HLEN cart:1

    # Check exits
    HEXISTS cart:1 product3

    # Get only key
    HKEYS cart:1

    # Get all key and value 
    HGETALL cart:1 

    # Get detail key and value
    HGET cart:1 product2

    # DEL key 
    HDEL cart:1 product2

    # DEL ALL
    DEL cart:1
```

## 5 LIST
```bash
    # Add
    LPUSH order_history:user-001 "order_id_4"

    # Get all
    LRANGE order_history:user-001 0 -1

    # Get Detail flower index
    LINDEX order_history:user-001 0

    # Length 
    LLEN order_history:user-001

    # Exits
    EXISTS order_history:user-001

    # Del 
    LREM order_history:user-001 0 "order_id_1"

```