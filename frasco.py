import json
from datetime import datetime
from flask import Flask, render_template, jsonify, request
import os

app = Flask(
    __name__,
    template_folder='.',
    static_folder='src',
    static_url_path='/src'
)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/reclame_aqui.html')
def reclame_aqui():
    return render_template('reclame_aqui.html')


@app.route('/api/reclamacao', methods=['POST'])
def receber_reclamacao():
    dados = request.get_json()
    
    # Adiciona data e hora do registro (opcional, mas útil)
    dados["data_hora"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    # Opção A: Salva cada JSON como uma nova linha em 'reclamacoes.txt'
    with open("reclamacoes.txt", "a", encoding="utf-8") as arquivo:
        arquivo.write(json.dumps(dados, ensure_ascii=False) + "\n")

    return jsonify({
        "status": "sucesso",
        "mensagem": "Reclamação salva no arquivo de texto!"
    }), 201
@app.route('/api/reclamacoes', methods=['GET'])
def listar_reclamacoes():
    lista = []
    if os.path.exists("reclamacoes.txt"):
        with open("reclamacoes.txt", "r", encoding="utf-8") as arquivo:
            for linha in arquivo:
                if linha.strip():  # Ignora linhas em branco
                    lista.append(json.loads(linha))
    return jsonify(lista)
if __name__ == "__main__":
    app.run(debug=True)
