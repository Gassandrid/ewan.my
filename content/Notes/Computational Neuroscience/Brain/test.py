class Solution:
    def romanToInt(self, s: str) -> int:
    # define roman symbols
        symbols = {
            "I": 1,
            "V": 5,
            "X": 10,
            "L": 50,
            "C": 100,
            "D": 500,
            "M": 1000
            }
        
        final = 0
        for i in range(len(s)):
            if i + 1 < len(s) and symbols[s[i]] < symbols[s[i + 1]]:
                final -= symbols[s[i]]
            else:
                final += symbols[s[i]]
        
