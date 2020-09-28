# truecoach-export

Exports [SF Iron](https://www.sf-iron.com/)'s programs from [Truecoach](https://truecoach.co/) to CSV.

## Install packages
```
yarn
```

## Compile
```
tsc --watch
```

## Test
```
yarn test
```

## Run
```
TRUECOACH_GYM=sf-iron TRUECOACH_USERNAME='<your email>' TRUECOACH_PASSWORD='<your password>' node dest/src/index.js > output.csv
```
