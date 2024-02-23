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

## 5 SET
```bash
    # Add
    SADD favorite_products:user-001 product1 product2 product3
    SADD favorite_products:user-002  product1 product5
    SADD favorite_products:user-003  product10 product5
    
    # Get all
    SMEMBERS favorite_products:user-001  

    # Get all count 
    SRANDMEMBER favorite_products:user-001 2

    # counter 
    SCARD favorite_products:user-001  

    # The common ground
    SINTER favorite_products:user-001 favorite_products:user-002 favorite_products:user-003

    # The common ground and create key 
    SUNIONSTORE all_favorite_products favorite_products:user-001 favorite_products:user-002 favorite_products:user-003 

    # Not duplicate between all key 
    SUNION favorite_products:user-001 favorite_products:user-002 favorite_products:user-003   
    SUNION favorite_products:user-001 favorite_products:user-002 favorite_products:user-003 ... favorite_products:user-n 

    # Show data page
    SSCAN favorite_products:user-001 0 COUNT 10

    # Del key 
    SREM favorite_products:user-001 product2

    # Get and delete Random
    SPOP favorite_products:user-001

```