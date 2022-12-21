import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import moment from 'moment';
import React from 'react';
import ReactDatetime from 'react-datetime';
import FileBase64 from 'react-file-base64';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Modal,
    Row
} from 'reactstrap';
import Label from 'reactstrap/es/Label';
import ImageEditorModal from '../../components/ImageEditor/image-editor';
import AddressService from '../../services/address.service';
import EventoService from '../../services/evento.service';
import { ERRO_INTERNO, MSG_DATA_FIM_MAIOR_DATA_INICIO } from '../../util/Constantes';
import UsuarioFactory from '../Usuario/Usuario.factory';
import './Evento.cadastro.scss';

class EventoCadastro extends React.Component {
    constructor(props) {
        super(props);

        this.emptyAddress = {
            street: '',
            number: '',
            zipcode: '',
            complement: '',
            city: {
                name: '',
                state: {
                    id: null,
                    name: ''
                }
            }
        };

        this.emptyAttachement = {
            id: null,
            name: '',
            file: null,
            fileName: '',
            url: null
        };

        this.emptyTemporaryAttachment = {
            imageBase64: null,
            imageFileName: null,
            validMimeType: true
        };

        this.emptyInvalidFormData = {
            title: false,
            address: {
                street: false,
                number: false,
                city: {
                    id: false,
                    state: {
                        id: false
                    }
                }
            },
            startDate: false,
            endDate: false,
            startTime: false,
            endTime: false,
            link: false
        };

        this.state = {
            formData: {
                id: null,
                attachment: this.emptyAttachement,
                imageBase64: null,
                title: '',
                description: '',
                address: this.emptyAddress,
                startDate: moment()
                    .add(1, 'd')
                    .hour(0)
                    .minutes(0)
                    .second(0),
                endDate: null,
                endTime: null,
                startTime: null,
                link: '',
                active: true
            },
            invalidFormData: this.emptyInvalidFormData,
            listStates: [],
            listCities: [],
            formImageModal: {
                showModal: false,
                anexo: null,
                height: null,
                width: null
            },
            modalAttachImage: false,
            temporaryImageAttachment: this.emptyTemporaryAttachment
        };
    }

    componentDidMount = async () => {
        const {
            match: { params }
        } = this.props;

        const usuarioLogado = UsuarioFactory.getUsuarioLogado();
        if (!usuarioLogado) {
            this.props.history.push('/auth/login');
        } else {
            if (!!params && !!params.id) {
                EventoService.get(params.id, null, null).subscribe(
                    (data) => {
                        if (!!data) {
                            if (data.erro) {
                                toast.error(data.mensagem);
                            } else {
                                let formData = data.objeto[0];
                                formData.startTime = moment(formData.startTime, 'HH:mm:ss');
                                formData.endTime = moment(formData.endTime, 'HH:mm:ss');
                                this.setState({ formData });
                            }
                        }
                    },
                    (error) => {
                        console.log(error);
                        toast.error('Erro ao buscar os eventos');
                    }
                );
            }
        }

        await this.loadListStates();

        this.loadListCities(this.state.formData.address.city != null ? (this.state.formData.address.city.state != null ? this.state.formData.address.city.state.id : null) : null);
    };

    loadListStates = async () => {
        AddressService.states().subscribe(
            ({ objeto }) => {
                this.setState({ listStates: objeto });
            },
            (error) => { }
        );
    };

    loadListCities = async (stateId) => {
        await AddressService.cities({ stateId }).subscribe(
            ({ objeto }) => {
                this.setState({ listCities: objeto });
            },
            (error) => { }
        );
    };

    handleChange = (e, itemName) => {
        let formData = { ...this.state.formData };

        let value = e.target.value;

        switch (itemName) {
            case 'title':
                formData.title = value;
                break;
            case 'description':
                formData.description = value;
                break;
            case 'link':
                formData.link = value;
                break;
            case 'address':
                formData.address.street = value;
                break;
            default:
                break;
        }

        this.setState({ formData });
    };

    handleAddressNumberChange = (e) => {
        let value = e.target.value;
        let formData = { ...this.state.formData };

        if (value === '') {
            formData.address.number = '';
        } else if (!Number(value)) {
            return;
        }

        formData.address.number = value;
        this.setState({ formData });
    };

    handleDateChange = (data, itemName) => {
        let formData = { ...this.state.formData };
        let invalidFormData = { ...this.state.invalidFormData };

        switch (itemName) {
            case 'startTime':
                if (this.state.formData.endTime != null && moment(this.state.formData.endTime).isSameOrBefore(data)) {
                    formData.startTime = data;
                    formData.endTime = data.add(1, 'h');
                } else {
                    formData.startTime = data;
                }
                break;
            case 'endTime':
                if (this.state.formData.startTime == null) {
                    formData.endTime = data;
                    invalidFormData.endTime = false;
                } else {
                    if (typeof data == 'string') {
                        invalidFormData.endTime = true;
                        return;
                    }
                    formData.endTime = data;
                }
                break;
            case 'startDate':
                let today = moment()
                    .hour(0)
                    .minutes(0)
                    .second(0);

                if (moment(today).isSameOrAfter(data)) {
                    toast.warn('Data de início inválida');
                    formData.startDate = null;
                } else if (this.state.formData.endDate != null && moment(this.state.formData.endDate).isSameOrBefore(data)) {
                    formData.startDate = data;
                    formData.endDate = data;
                } else {
                    formData.startDate = data;
                }
                break;
            case 'endDate':
                if (this.state.formData.startDate != null) {
                    if (moment(this.state.formData.startDate).isAfter(data, 'day')) {
                        toast.warn(MSG_DATA_FIM_MAIOR_DATA_INICIO);
                        formData.endDate = null;
                    } else {
                        formData.endDate = data;
                        invalidFormData.endDate = false;
                    }
                } else {
                    formData.endDate = data;
                }
                break;

            default:
                break;
        }

        this.setState({ formData, invalidFormData });
    };

    handleAddressStateChange = (e) => {
        let formData = { ...this.state.formData };
        const state = this.state.listStates.find((it) => it.id === e.target.value);

        if (formData.address.city == null) {
            formData.address.city = {
                state: {
                    id: state ? state.id : state
                }
            };
        } else {
            formData.address.city.state.id = state ? state.id : state;
        }

        formData.address.city.state.name = state.name;
        formData.address.city.state.acronym = state.acronym;

        this.loadListCities(state.id);
        formData.address.city.id = '';
        formData.address.city.name = '';

        this.setState({ formData });
    };

    handleAddressCityChange = (e) => {
        let formData = { ...this.state.formData };
        const city = this.state.listCities.find((it) => it.id === e.target.value);

        formData.address.city.id = city.id;
        formData.address.city.name = city.name;
        formData.address.city.state = city.state;

        this.setState({ formData });
    };

    onClickCheck = () => {
        let formData = { ...this.state.formData };
        formData.active = !formData.active;
        this.setState({ formData });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true });

        if (this.areMandatoryFieldsValid()) {
            EventoService.save(this.state.formData).subscribe(
                (data) => {
                    this.setState({ loading: false });
                    if (!!data) {
                        if (data.erro) {
                            toast.error(ERRO_INTERNO);
                        } else {
                            toast.success('Evento salvo!');
                            this.props.history.goBack();
                        }
                    }
                },
                (error) => {
                    this.setState({ loading: false });
                    console.error(error);
                    toast.error(ERRO_INTERNO);
                }
            );
        } else {
            this.setState({ loading: false });
        }
    };

    areMandatoryFieldsValid = () => {
        let valid = true;

        let invalidFormData = { ...this.emptyInvalidFormData };

        if (!this.state.formData.title || this.state.formData.title.length === 0) {
            invalidFormData.title = true;
            valid = false;
        } else {
            invalidFormData.title = false;
        }

        if (!this.state.formData.description || this.state.formData.description.length === 0) {
            invalidFormData.description = true;
            valid = false;
        } else {
            invalidFormData.description = false;
        }

        if (!this.state.formData.startDate) {
            invalidFormData.startDate = true;
            valid = false;
        } else {
            invalidFormData.startDate = false;
        }

        if (!this.state.formData.endDate) {
            invalidFormData.endDate = true;
            valid = false;
        } else {
            invalidFormData.endDate = false;
        }

        if (!this.state.formData.startTime) {
            invalidFormData.startTime = true;
            valid = false;
        } else {
            invalidFormData.startTime = false;
        }

        if (!this.state.formData.endTime || invalidFormData.endTime) {
            invalidFormData.endTime = true;
            valid = false;
        } else if (valid) {
            //valid arealdy contains the validations for startDate, endDate, startTime

            if (moment(this.state.formData.startDate).isSame(this.state.formData.endDate, 'day')) {
                if (moment(this.state.formData.startTime).isSameOrAfter(this.state.formData.endTime)) {
                    toast.warn('A hora de fim deve ser maior que a hora de início');
                    invalidFormData.endTime = true;
                    valid = false;
                } else {
                    invalidFormData.endTime = false;
                }
            } else {
                invalidFormData.endTime = false;
            }
        }

        if (!this.state.formData.link || this.state.formData.link.length === 0 || !this.validURL(this.state.formData.link)) {
            invalidFormData.link = true;
            valid = false;
        } else {
            invalidFormData.link = false;
        }

        if (!this.state.formData.address || !this.state.formData.address.street || this.state.formData.address.street.length === 0) {
            invalidFormData.address.street = true;
            valid = false;
        } else {
            invalidFormData.address.street = false;
        }

        if (!this.state.formData.address || !this.state.formData.address.number || this.state.formData.address.number.length === 0) {
            invalidFormData.address.number = true;
            valid = false;
        } else {
            invalidFormData.address.number = false;
        }
        if (!this.state.formData.address || !this.state.formData.address.city.state || !this.state.formData.address.city.state.id) {
            invalidFormData.address.city.state.id = true;
        } else {
            invalidFormData.address.city.state.id = false;
        }
        if (!this.state.formData.address || !this.state.formData.address.city || !this.state.formData.address.city.id) {
            invalidFormData.address.city.id = true;
        } else {
            invalidFormData.address.city.id = false;
        }

        this.setState({ invalidFormData });

        return valid;
    };

    validURL = (str) => {
        let pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
            '^(http?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
            'i'
        ); // fragment locator
        return !!pattern.test(str);
    };

    handleEditarImagem = (base64) => {
        let i = new Image();
        i.src = base64;
        i.onload = () => {
            this.setState({
                formImageModal: {
                    anexo: base64,
                    showModal: true,
                    height: i.height,
                    width: i.width
                }
            });
        };
    };

    toggleEditarImagemModal = () => {
        this.setState({
            formImageModal: {
                anexo: null,
                showModal: false,
                height: null,
                width: null
            }
        });
    };

    onFinishEditingImagemModal = (image) => {
        const { formData } = this.state;
        formData.imageBase64 = image.split('base64,')[1];

        this.setState({
            formImageModal: {
                anexo: null,
                showModal: false,
                height: null,
                width: null
            },

            formData
        });
    };

    toggleModal = () => {
        this.setState({ modalAttachImage: !this.state.modalAttachImage });
    };

    handleAttachment = (file) => {
        let temporaryImageAttachment = { ...this.state.temporaryImageAttachment };

        if (!file.type.includes('image/')) {
            temporaryImageAttachment.validMimeType = false;
        } else {
            temporaryImageAttachment.imageBase64 = file.base64;
            temporaryImageAttachment.imageFileName = file.name;
            temporaryImageAttachment.validMimeType = true;
        }

        this.setState({ temporaryImageAttachment });
    };

    setTemporaryAttachmentAsCurrent = () => {
        let formData = { ...this.state.formData };
        formData.imageBase64 = this.state.temporaryImageAttachment.imageBase64;

        let attachment = { ...this.state.formData.attachment };
        attachment.name = this.state.temporaryImageAttachment.imageFileName;
        attachment.fileName = this.state.temporaryImageAttachment.imageFileName;

        formData.attachment = attachment;

        this.setState({ formData });
        this.toggleModal();
        this.handleEditarImagem(formData.imageBase64);
    };

    returnImageUrl = () => {
        const { formData } = this.state;

        if (formData.imageBase64 != null) {
            return `data:image/png;base64,${this.state.formData.imageBase64}`;
        } else if (this.state.formData.attachment != null) {
            if (this.state.formData.attachment.url != null) {
                return this.state.formData.attachment.url;
            } else if (this.state.formData.attachment.file != null) {
                return `data:image/png;base64,${this.state.formData.attachment.file}`;
            }
        }
        return null;
    };

    render() {
        return (
            <>
                <br />
                <br />
                {/*marvelous third time*/}
                <div id='evento-cadastro'>
                    <Card className='pt-lg-1 b-r-1 w-95'>
                        <CardHeader className='bg-transparent pb-5'>
                            <div className='text-muted text-center mt-2 mb-4'>
                                <h1 className='card-title'>{this.state.formData.id === null ? 'Novo Evento' : 'Evento: ' + this.state.formData.title}</h1>
                            </div>
                        </CardHeader>

                        <CardBody className='px-lg-5 py-lg-5'>
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    {/* title */}
                                    <Col md='12'>
                                        <Label>
                                            <h2 className='card-title text-center'>Título</h2>
                                        </Label>
                                        {!this.state.invalidFormData.title ? (
                                            <FormGroup>
                                                <Input id='eventTitle' placeholder='Título evento' maxLength={100} value={this.state.formData.title} onChange={(it) => this.handleChange(it, 'title')} />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='eventTitle' placeholder='Título evento' maxLength={100} value={this.state.formData.title} onChange={(it) => this.handleChange(it, 'title')} />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    {/* description */}
                                    <Col md='12'>
                                        <Label>
                                            <h2 className='card-title text-center'>Descrição</h2>
                                        </Label>
                                        {!this.state.invalidFormData.description ? (
                                            <FormGroup>
                                                <textarea
                                                    className='text-area'
                                                    id='eventDescription'
                                                    value={this.state.formData.description}
                                                    onChange={(it) => this.handleChange(it, 'description')}
                                                    style={{
                                                        width: '100%',
                                                        height: 200,
                                                        textAlign: 'top',
                                                        color: '#8898aa',
                                                        paddingLeft: 10,
                                                        paddingTop: 10
                                                    }}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <textarea
                                                    className='text-area'
                                                    id='eventDescription'
                                                    value={this.state.formData.description}
                                                    onChange={(it) => this.handleChange(it, 'description')}
                                                    style={{
                                                        width: '100%',
                                                        height: 200,
                                                        textAlign: 'top',
                                                        color: '#8898aa',
                                                        paddingLeft: 10,
                                                        paddingTop: 10
                                                    }}
                                                />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    {/* start date*/}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Data de início</h2>
                                        </Label>
                                        {!this.state.invalidFormData.startDate ? (
                                            <FormGroup>
                                                <InputGroup className='input-group-alternative'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <i className='ni ni-calendar-grid-58' />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(it) => this.handleDateChange(it, 'startDate')}
                                                        className='picker'
                                                        value={this.state.formData.startDate}
                                                        inputProps={{
                                                            placeholder: 'Data de início'
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={false}
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <InputGroup className='input-group-alternative'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <i className='ni ni-calendar-grid-58' />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(it) => this.handleDateChange(it, 'startDate')}
                                                        className='picker'
                                                        value={this.state.formData.startDate}
                                                        inputProps={{
                                                            placeholder: 'Data de início'
                                                        }}
                                                        timeFormat='HH:mm'
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={false}
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/* end date*/}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Data fim</h2>
                                        </Label>
                                        {!this.state.invalidFormData.endDate ? (
                                            <FormGroup>
                                                <InputGroup className='input-group-alternative'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <i className='ni ni-calendar-grid-58' />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(it) => this.handleDateChange(it, 'endDate')}
                                                        className='picker'
                                                        value={this.state.formData.endDate}
                                                        inputProps={{
                                                            placeholder: 'Data de término'
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={false}
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <InputGroup className='input-group-alternative'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <i className='ni ni-calendar-grid-58' />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(it) => this.handleDateChange(it, 'endDate')}
                                                        className='picker'
                                                        value={this.state.formData.endDate}
                                                        inputProps={{
                                                            placeholder: 'Data de término'
                                                        }}
                                                        timeFormat={false}
                                                        dateFormat='DD/MM/YYYY'
                                                        locale='pt-br'
                                                        closeOnSelect={false}
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    {/* start time*/}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Horário de início</h2>
                                        </Label>
                                        {!this.state.invalidFormData.startTime ? (
                                            <FormGroup>
                                                <InputGroup className='input-group-alternative'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <i className='ni ni-calendar-grid-58' />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(it) => this.handleDateChange(it, 'startTime')}
                                                        className='picker'
                                                        value={this.state.formData.startTime}
                                                        inputProps={{
                                                            placeholder: 'Horário de início'
                                                        }}
                                                        dateFormat={false}
                                                        timeFormat='HH:mm'
                                                        locale='pt-br'
                                                        closeOnSelect={false}
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <InputGroup className='input-group-alternative'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <i className='ni ni-calendar-grid-58' />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(it) => this.handleDateChange(it, 'startTime')}
                                                        className='picker'
                                                        value={this.state.formData.startTime}
                                                        inputProps={{
                                                            placeholder: 'Horário de início'
                                                        }}
                                                        locale='pt-br'
                                                        closeOnSelect={false}
                                                        dateFormat={false}
                                                        timeFormat='HH:mm'
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        )}
                                    </Col>

                                    {/* end time*/}
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Horário de término</h2>
                                        </Label>
                                        {!this.state.invalidFormData.endTime ? (
                                            <FormGroup>
                                                <InputGroup className='input-group-alternative'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <i className='ni ni-calendar-grid-58' />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(it) => this.handleDateChange(it, 'endTime')}
                                                        className='picker'
                                                        value={this.state.formData.endTime}
                                                        inputProps={{
                                                            placeholder: 'Horario de término'
                                                        }}
                                                        dateFormat={false}
                                                        timeFormat='HH:mm'
                                                        locale='pt-br'
                                                        closeOnSelect={false}
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        ) : (
                                            <div>
                                                <FormGroup className='campo-invalido'>
                                                    <InputGroup className='input-group-alternative'>
                                                        <InputGroupAddon addonType='prepend'>
                                                            <InputGroupText>
                                                                <i className='ni ni-calendar-grid-58' />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            onChange={(it) => this.handleDateChange(it, 'endTime')}
                                                            className='picker'
                                                            value={this.state.formData.endTime}
                                                            inputProps={{
                                                                placeholder: 'Horário de término'
                                                            }}
                                                            timeFormat='HH:mm'
                                                            locale='pt-br'
                                                            closeOnSelect={false}
                                                            dateFormat={false}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <label style={{ fontSize: 12, color: '#d93025' }}>A hora de fim deve ser maior que a hora de início</label>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    {/* link */}
                                    <Col md='12'>
                                        <Label>
                                            <h2 className='card-title text-center'>Link</h2>
                                        </Label>
                                        {!this.state.invalidFormData.link ? (
                                            <FormGroup>
                                                <Input id='eventLink' placeholder='Link do evento' value={this.state.formData.link} onChange={(it) => this.handleChange(it, 'link')} />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='eventLink' placeholder='Link do evento' value={this.state.formData.link} onChange={(it) => this.handleChange(it, 'link')} />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    {/* address */}
                                    <Col md='10'>
                                        <Label>
                                            <h2 className='card-title text-center'>Endereço</h2>
                                        </Label>
                                        {!this.state.invalidFormData.address.street ? (
                                            <FormGroup>
                                                <Input id='eventAddress' placeholder='Endereço' maxLength={255} value={this.state.formData.address.street} onChange={(it) => this.handleChange(it, 'address')} />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='eventAddress' placeholder='Endereço' value={this.state.formData.address.street} onChange={(it) => this.handleChange(it, 'address')} />
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md='2'>
                                        <Label>
                                            <h2 className='card-title text-center'>Nº</h2>
                                        </Label>
                                        {!this.state.invalidFormData.address.number ? (
                                            <FormGroup>
                                                <Input id='eventAddress' placeholder='Nº' type='text' pattern='[0-9]*' value={this.state.formData.address.number} onChange={(it) => this.handleAddressNumberChange(it)} />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input id='eventAddress' placeholder='Nº' type='text' pattern='[0-9]*' value={this.state.formData.address.number} onChange={(it) => this.handleAddressNumberChange(it)} />
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                {/*state & city*/}
                                <Row>
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Estado</h2>
                                        </Label>
                                        {!this.state.invalidFormData.address.city || !this.state.invalidFormData.address.city.state || !this.state.invalidFormData.address.city.state.id ? (
                                            <FormGroup>
                                                <Input
                                                    type='select'
                                                    name='select'
                                                    onChange={this.handleAddressStateChange}
                                                    value={this.state.formData.address.city != null ? (this.state.formData.address.city.state != null ? this.state.formData.address.city.state.id : 'default') : 'default'}>
                                                    <option name='default' value='default'>
                                                        Selecionar
                                                    </option>
                                                    {this.state.listStates.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input
                                                    type='select'
                                                    name='select'
                                                    onChange={this.handleAddressStateChange}
                                                    value={this.state.formData.address.city != null ? (this.state.formData.address.city.state != null ? this.state.formData.address.city.state.id : 'default') : 'default'}>
                                                    <option name='default' value='default'>
                                                        Selecionar
                                                    </option>
                                                    {this.state.listStates.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        )}
                                    </Col>
                                    <Col md='6'>
                                        <Label>
                                            <h2 className='card-title text-center'>Cidade</h2>
                                        </Label>

                                        {!this.state.invalidFormData.address.city || !this.state.invalidFormData.address.city.id ? (
                                            <FormGroup>
                                                <Input type='select' name='select' onChange={this.handleAddressCityChange} value={this.state.formData.address.city != null ? this.state.formData.address.city.id : 'default'}>
                                                    <option name='default' value='default'>
                                                        Selecionar
                                                    </option>
                                                    {this.state.listCities.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup className='campo-invalido'>
                                                <Input type='select' name='select' onChange={this.handleAddressCityChange} value={this.state.formData.address.city.id}>
                                                    <option name='default' value='default'>
                                                        Selecionar
                                                    </option>
                                                    {this.state.listCities.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>

                                <Row style={{ alignContent: 'center' }}>
                                    {/*active*/}
                                    <Col md='1'>
                                        <Label>
                                            <h2 className='card-title text-center'>Ativo</h2>
                                        </Label>
                                        <Checkbox checked={this.state.formData.active} onChange={(_) => this.onClickCheck()} />
                                    </Col>
                                </Row>

                                {/* image */}
                                <Row>
                                    <Col md='12'>
                                        <Label>
                                            <h2 className='card-title text-center'>Imagem</h2>
                                        </Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='4'>
                                        <img style={{ objectFit: 'contain', width: '200px' }} className='image' src={this.returnImageUrl()} alt='' />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='4'>
                                        <span
                                            onClick={() => {
                                                this.handleEditarImagem(this.state.formData.imageBase64);
                                            }}>
                                            {' '}
                                            {this.state.formData.attachment != null ? this.state.formData.attachment.fileName : ''}
                                        </span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col md='12'>
                                        <Button color='primary' type='button' onClick={() => this.toggleModal()}>
                                            Anexar
                                        </Button>
                                    </Col>
                                </Row>

                                {this.state.formImageModal.showModal && (
                                    <ImageEditorModal
                                        showModal={this.state.formImageModal.showModal}
                                        image={this.state.formImageModal.anexo}
                                        zoomRate={0.1}
                                        rotationRate={90}
                                        height={this.state.formImageModal.height}
                                        width={this.state.formImageModal.width}
                                        toggleModal={this.toggleEditarImagemModal}
                                        cancelAction={this.toggleEditarImagemModal}
                                        primaryButtonAction={this.onFinishEditingImagemModal}
                                    />
                                )}
                                <Modal className='modal-dialog-centered' isOpen={this.state.modalAttachImage} toggle={() => this.toggleModal()}>
                                    <div className='modal-header'>
                                        <h3 className='modal-title' id='modalAttachImage'>
                                            Anexar Imagem do Evento
                                        </h3>
                                        <button aria-label='Close' className='close' data-dismiss='modal' type='button' onClick={() => this.toggleModal()}>
                                            <span aria-hidden={true}>×</span>
                                        </button>
                                    </div>

                                    <div className='modal-body'>
                                        <Container>
                                            <Row>
                                                <h3>Anexar</h3>
                                                <FileBase64 multiple={false} onDone={(file) => this.handleAttachment(file)} />
                                            </Row>
                                            <Row>
                                                <span hidden={this.state.temporaryImageAttachment.validMimeType} style={{ color: '#FF0000' }}>
                                                    Anexo não é uma imagem
                                                </span>
                                            </Row>
                                        </Container>
                                    </div>
                                    <div className='modal-footer'>
                                        <Container>
                                            <Row>
                                                <Col md={12}>
                                                    <Button className='btn-primary' data-dismiss='modal' type='button' onClick={() => this.toggleModal()}>
                                                        Cancelar
                                                    </Button>
                                                    <Button className='btn-primary' type='button' onClick={() => this.setTemporaryAttachmentAsCurrent()} disabled={!this.state.temporaryImageAttachment.validMimeType}>
                                                        Confirmar
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                </Modal>

                                {/*Footer*/}
                                <hr />
                                <Row className='p-t-40' style={{ marginTop: 30 }}>
                                    <Col md='3'>
                                        <Link className='btn-primary' to='/admin/evento'>
                                            Cancelar
                                        </Link>
                                    </Col>
                                    <Col md='3'>
                                        <Button disabled={this.state.loading} className='btn-primary' type='submit'>
                                            Salvar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </div>
            </>
        );
    }
}

export default EventoCadastro;
