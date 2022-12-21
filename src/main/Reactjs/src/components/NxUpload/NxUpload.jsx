import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Col } from 'reactstrap';

class NxUpload extends Component {
    idInput = `inputFile${new Date().getTime()}`;
    file: File;

    constructor(props) {
        super(props);

        const time = this.randomIntFromInterval(0, 100);
        setTimeout(() => {
            this.idInput = `inputFile${new Date().getTime()}`;
        }, time);

        this.state = {
            objeto: this.props.objeto,
            nomePropriedadeNomeArquivo: this.props.nomePropriedadeNomeArquivo,
            nomePropriedadeSizeArquivo: this.props.nomePropriedadeSizeArquivo,
            nomePropriedadeArquivoB64: this.props.nomePropriedadeArquivoB64,
            disabled: !!this.props.disabled,
            exibirImagem: this.props.exibirImagem === undefined ? true : this.props.exibirImagem,
            mostrarImagem:
                this.props.objeto &&
                this.props.nomePropriedadeArquivoB64 &&
                this.props.objeto[this.props.nomePropriedadeArquivoB64] &&
                this.props.objeto[this.props.nomePropriedadeArquivoB64].indexOf('image') > -1,
            changeEvent: this.props.changeEvent,
            file: this.file,
        };
    }

    componentDidUpdate(prevState) {
        if (
            this.props.nomePropriedadeNomeArquivo !== prevState.nomePropriedadeNomeArquivo ||
            this.props.nomePropriedadeSizeArquivo !== prevState.nomePropriedadeSizeArquivo ||
            this.props.nomePropriedadeArquivoB64 !== prevState.nomePropriedadeArquivoB64 ||
            (this.props.objeto &&
                prevState.objeto &&
                this.props.objeto[this.props.nomePropriedadeArquivoB64] !== prevState.objeto[this.props.nomePropriedadeArquivoB64]) ||
            this.props.disabled !== prevState.disabled ||
            this.props.changeEvent !== prevState.changeEvent
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                objeto: this.props.objeto,
                nomePropriedadeNomeArquivo: this.props.nomePropriedadeNomeArquivo,
                nomePropriedadeSizeArquivo: this.props.nomePropriedadeSizeArquivo,
                nomePropriedadeArquivoB64: this.props.nomePropriedadeArquivoB64,
                disabled: !!this.props.disabled,
                exibirImagem: this.props.exibirImagem === undefined ? true : this.props.exibirImagem,
                mostrarImagem:
                    this.props.objeto &&
                    this.props.nomePropriedadeArquivoB64 &&
                    this.props.objeto[this.props.nomePropriedadeArquivoB64] &&
                    this.props.objeto[this.props.nomePropriedadeArquivoB64].indexOf('image') > -1,
                changeEvent: this.props.changeEvent,
                file: this.file,
            });
        }
    }

    /**
     * min and max included
     * @param min
     * @param max
     */
    randomIntFromInterval = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    change() {
        if (this.state.changeEvent) {
            this.state.changeEvent(this.state.objeto);
        }
    }

    removerArquivo() {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const objeto = {...this.state.objeto};
        if (this.state.objeto && this.state.nomePropriedadeNomeArquivo) {
            objeto[this.state.nomePropriedadeNomeArquivo] = null;
        }
        if (this.state.objeto && this.state.nomePropriedadeArquivoB64) {
            objeto[this.state.nomePropriedadeArquivoB64] = null;
        }
        this.setState({objeto, mostrarImagem: false}, () => this.change());
    }

    onChangeFileInput(event) {
        const {target} = event;
        const {files} = target;
        this.setState({file: files[0]}, () => {
            const reader: FileReader = new FileReader();
            reader.onload = () => {
                // eslint-disable-next-line react/no-access-state-in-setstate
                const objeto = {...this.state.objeto};
                if (objeto && this.state.nomePropriedadeNomeArquivo) {
                    objeto[this.state.nomePropriedadeNomeArquivo] = this.state.file.name;
                }
                if (objeto && this.state.nomePropriedadeArquivoB64) {
                    objeto[this.state.nomePropriedadeArquivoB64] = reader.result.toString();
                }
                if (objeto && this.state.nomePropriedadeSizeArquivo) {
                    objeto[this.state.nomePropriedadeSizeArquivo] = this.state.file.size / 1024 / 1024;
                }
                this.setState({objeto, mostrarImagem: true}, () => {
                    this.change();

                    // Limpa input
                    if (this.idInput) {
                        const element = document.getElementsByName(this.idInput);
                        if (element && element.length > 0) {
                            element[0].setAttribute('value', '');
                        }
                    }
                });
            };
            reader.readAsDataURL(this.state.file);
        });

        target.value = null;
        target.files = null;
    }

    existeArquivo() {
        return this.state.objeto && this.state.nomePropriedadeArquivoB64 && this.state.objeto[this.state.nomePropriedadeArquivoB64];
    }

    existeArquivoTipo(tipo: string) {
        if (!(this.state.objeto && this.state.nomePropriedadeArquivoB64 && this.state.objeto[this.state.nomePropriedadeArquivoB64])) {
            return false;
        }

        return tipo === 'imagem' && this.state.objeto[this.state.nomePropriedadeArquivoB64].indexOf('image') > -1;
    }

    selecionarArquivo() {
        document.getElementsByName(this.idInput)[0].click();
    }

    render() {
        return (
            <div style={{paddingRight: '15px'}}>
                <div>
                    <input type="file" disabled={this.state.disabled} name={this.idInput} onChange={e => this.onChangeFileInput(e)} accept={this.props.accept} hidden />
                    <Button
                        type="button"
                        disabled={this.state.disabled}
                        onClick={() => this.selecionarArquivo()}
                        style={{display: !this.existeArquivo() ? 'block' : 'none', marginBottom: '5px'}}
                        color="primary">
                        Escolher Arquivo
                    </Button>

                    <Button
                        type="button"
                        onClick={() => this.removerArquivo()}
                        style={{display: this.existeArquivo() ? 'block' : 'none', marginBottom: '5px'}}
                        color="secondary">
                        Remover Arquivo
                    </Button>
                </div>
                <Col
                    md={12}
                    style={{
                        display: this.state.mostrarImagem && this.state.exibirImagem ? 'block' : 'none',
                        maxWidth: this.props.maxWidthImage || '150px',
                        maxHeight: '150px',
                        padding: '0',
                    }}>
                    <img
                        src={this.state.objeto[this.state.nomePropriedadeArquivoB64]}
                        alt={this.state.nomePropriedadeArquivoB64}
                        style={{maxWidth: '100%', maxHeight: '100%'}}
                    />
                </Col>
            </div>
        );
    }
}

NxUpload.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    objeto: PropTypes.any.isRequired,
    nomePropriedadeNomeArquivo: PropTypes.string.isRequired,
    nomePropriedadeSizeArquivo: PropTypes.string,
    nomePropriedadeArquivoB64: PropTypes.string.isRequired,
    accept: PropTypes.string,
    maxWidthImage: PropTypes.string,
    disabled: PropTypes.bool,
    exibirImagem: PropTypes.bool,
    changeEvent: PropTypes.func,
};
export default NxUpload;
