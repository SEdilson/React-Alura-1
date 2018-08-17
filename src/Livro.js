import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import ButtonCustomizado from './componentes/ButtonCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {
    constructor() {
        super();
        this.state = {titulo: '', preco: '', autorId: ''};
        this.enviaFormLivro = this.enviaFormLivro.bind(this);
    }

    enviaFormLivro(evento) {
        evento.preventDefault();
        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
            success: novaListaLivros => {
                PubSub.publish('atualiza-lista-livros', novaListaLivros);
                this.setState({titulo: '', preco: '', autorId: ''})
            },
            error: resposta => {
                if(resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: () => PubSub.publish('limpa-erros', {})
        });
    }

    salvarAlteracao(nomeInput, evento) {
        var campoSendoAlterado = {};
        campoSendoAlterado[nomeInput] = evento.target.value;
        this.setState(campoSendoAlterado);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaFormLivro} method='post'>
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.salvarAlteracao.bind(this, 'titulo')} label="Titulo"/>
                    <InputCustomizado id="preco" type="number" name="preco" value={this.state.preco} onChange={this.salvarAlteracao.bind(this, 'preco')} label="Preço"/>
                    <div className="pure-control-group">
                        <label htmlFor={this.props.id}>{this.props.label}</label>
                            <select value={ this.state.autorId } name="autorId" onChange={ this.salvarAlteracao.bind(this, 'autorId') }>
                                <option value="">Selecione</option>
                                    { 
                                        this.props.autores.map(autor => {
                                            return <option value={ autor.id }>
                                                    { autor.nome }
                                                </option>;
                                        })
                                    }
                            </select>
                    </div>
                    
                    <ButtonCustomizado button="Gravar"></ButtonCustomizado>
                </form>
            </div>
        )
    }
}

class TabelaLivros extends Component {
    render() {
        return (
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Preço</th>
                      <th>Autor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.lista.map(livro => {
                        return (
                          <tr key={livro.id}>
                            <td>{livro.titulo}</td>                
                            <td>{livro.preco}</td>
                            <td>{livro.autor.nome}</td>                
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table> 
            </div>
        )
    }
}

export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = {lista: [], autores: []};
    }

    componentWillMount() {
        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/livros",
            dataType: 'json',
            success: resposta => this.setState({lista:resposta})
        });
    }

    componentDidMount() {
        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success: resposta => this.setState({autores:resposta})
        });

        PubSub.subscribe('atualiza-lista-autores', (topico, novaListagemAutores) => 
            this.setState({lista:novaListagemAutores})
        );
    }

    render() {
        return (
            <div>        
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        )
    }
}