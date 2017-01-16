# Logtrust tests

## Exercise 1
Classify a  list of numbers -> perfects, abundants or deficients

### Requirements
[python](https://www.python.org/downloads/).

### Compatible
Python 2.7
Python 3.5

### Run
Execute the ejercicio1.py script and pass any integer positive argument to see the number and its type.

```bash
$ python Ejercicio1/ejercicio1.py 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 28 30 150 1000 -8 0 x
```

or

```bash
$ python3 Ejercicio1/ejercicio1.py 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 28 30 150 1000 -8 0 x
```

In both cases, the output will be:

```
- The number 1 is deficient
- The number 2 is deficient
- The number 3 is deficient
- The number 4 is deficient
- The number 5 is deficient
- The number 6 is perfect
- The number 7 is deficient
- The number 8 is deficient
- The number 9 is deficient
- The number 10 is deficient
- The number 11 is deficient
- The number 12 is abundant
- The number 13 is deficient
- The number 14 is deficient
- The number 15 is deficient
- The number 16 is deficient
- The number 17 is deficient
- The number 18 is abundant
- The number 19 is deficient
- The number 20 is abundant
- The number 28 is perfect
- The number 30 is abundant
- The number 150 is abundant
- The number 1000 is abundant
Error: -8 is not a positive number greater than 0
Error: 0 is not a positive number greater than 0
Error: invalid literal for int() with base 10: 'x'
```

## Exercise 2

Draw 2 charts, thanks to [Highcharts](http://www.highcharts.com/), given 3 data sources in a simple web page.

### Requirements
[npm](https://www.npmjs.com/).

### Up & Running
Enter in `Ejercicio2/` directory and execute:

```bash
$ npm install && bower install
$ npm start
```

Open your browser and enter http://localhost:8000/

Now, You should be seeing the two charts.
