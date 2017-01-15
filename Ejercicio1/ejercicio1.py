#!/usr/bin/env python

"""
    Classify a list of positive integer numbers
"""
import itertools


try:
    range = xrange
except NameError:
    range = range


def factors(n):
    """Calculate the factors of a number. Function based on the following stackoverflow questions:

    http://stackoverflow.com/questions/26753839/efficiently-getting-all-divisors-of-a-given-number
    http://stackoverflow.com/questions/6800193/what-is-the-most-efficient-way-of-finding-all-the-factors-of-a-number-in-python

    Factors are paired. For example, n=24, then the factors are 1 and 24, 2 and 12, 3 and 8, 4 and 6.
    So, this algorithm uses the square root of n instead of all the way to num, and then calculate
    the paired factors using num/i

    :param n: integer number positive greater than zero
    :return: set of factors
    """
    chain_pairs = itertools.chain.from_iterable
    return set(chain_pairs((i, n//i) for i in range(1, int(n**0.5) + 1) if n % i == 0))


def get_numbers_classified(*numbers):
    """Classify any number into perfect, abundant or deficient one

    :param numbers: list of integer numbers
    :return: generator of tuples -> ('number type', int(number))
    """
    if not numbers:
        print("You should enter any number to classify it")
        return

    for num in numbers:
        try:
            n = int(num)
        except ValueError as e:
            print("Error: {}".format(str(e)))
            continue

        if n < 1:
            print("Error: {} is not a positive number greater than 0".format(n))
            continue

        factors_sum = sum(factors(n)) - n  # the own number is always a factor
        if factors_sum == n:
            yield 'perfect', n
        elif factors_sum > n:
            yield 'abundant', n
        else:
            yield 'deficient', n


def print_numbers_classes(*numbers):
    nums_classified = get_numbers_classified(*numbers)

    if nums_classified is None:
        return

    for num_class, num in nums_classified:
        print("- The number {n} is {num_class}".format(n=num, num_class=num_class))


if __name__ == '__main__':
    import sys

    print_numbers_classes(*sys.argv[1:])
