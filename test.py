import sympy as sp
from latex2sympy2 import latex2sympy, latex2latex

a, b = sp.symbols('a b')
eq1 = sp.Eq(-48.5 * b, sp.sqrt(a) - 2)
eq2 = sp.Eq(-1.5 * b, sp.sqrt(97 * a) - 2)
sol = sp.solve((eq1, eq2), (1/a, 1/b))
print(sol)

expr1 = latex2sympy('-48.5 b = \\sqrt{a} - 2')

print(latex2latex('-48.5 b = \\sqrt{a} - 2'))
expr2 = latex2sympy('-1.5 b = \\sqrt{97 a} - 2')
# expr = latex2sympy(r'2 * x - y - 3')
print(expr1)
# x, y = sp.symbols('x y')
sol = sp.solve([expr1[0], expr2[1]], (1/a, 1/b))

print(sol)

# # a, b = sp.symbols('a b')


# a, b = sp.symbols('a b')
# eq1_str = '-48.5 (1/b) = \\sqrt{(1/a)} - 2'
# eq2_str = '-1.5 (1/b) = \\sqrt{97(1/a)} - 2'
# c = latex2sympy(eq1_str)
# d = latex2sympy(eq2_str)

# # c = latex2latex(eq1_str)


# print(c[0])
# print(d[0])


# # eq1 = sp.Eq(c[0], c[1])
# # eq2 = sp.Eq(d[0], d[1])
# sol = sp.solve((c[0], d[0]), (a, b))
# print(sol)
