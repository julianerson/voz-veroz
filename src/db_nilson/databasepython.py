import mysql.connector

conexao = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="usuario_app",
    password="SenhaForte123!",
    database="locales",
)

cursor = conexao.cursor()

# Inserir registro na tabela Locais (escrita exige commit)
sql_insert = """
    INSERT INTO Locais (nome, email, comentario, latitude, longitude, raio)
    VALUES (%s, %s, %s, %s, %s, %s)
"""
valores = ("Ana", "ana@exemplo.com", "Ótimo lugar!", -19.91668130, -43.93449310, 500)

cursor.execute(sql_insert, valores)
conexao.commit()

# Consultar registros da tabela Locais
cursor.execute(
    "SELECT id, nome, email, comentario, latitude, longitude, raio FROM Locais"
)
for linha in cursor.fetchall():
    print(linha)

cursor.close()
conexao.close()
