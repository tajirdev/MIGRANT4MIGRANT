from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

class Hash():
    def hash(password):
        return password_hash.hash(password)
    

