from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

class Hash():
    def hash(password):
        return password_hash.hash(password)
    
    def verify_password(plain_password,hashed_pasword):
        return password_hash.verify(plain_password,hashed_pasword)
