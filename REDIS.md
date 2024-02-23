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
    # Embstring ( <= 44bytes) 
    set name 0123456789012345678901234567890123456789abc

    # Raw ( > 44 bytes )
    set name1 0123456789012345678901234567890123456789abcsdsdsdsdsdsdsdasdasdasdsd

    # Int 
    set name2 10

    # TTL and handle key exit
    set lock_key_unique unique_value NX PX 10000
    ttl lock_key_unique
```