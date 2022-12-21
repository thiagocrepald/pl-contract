import React from 'react';
import { Col, Row } from "reactstrap";
import Select from 'react-select';
import Label from "reactstrap/es/Label";
import './PreferencesMedic.scss'

import PreferencesMedicUtilsService from "../../../../services/preferencesMedicUtils.service";
import AddressService from "../../../../services/address.service";

class PreferencesMedic extends React.Component {
  optionsSetor = [];
  optionsLocality = [];
  optionsPeriodo = [];
  optionsWeekday = [];
  defaultPreferencesWeekday = {};
  defaultPreferencesPeriodo = {};
  defaultPreferencesSetor = {};
  defaultPreferencesLocality = {};

  constructor(props) {
    super(props);

    this.defaultPreferencesWeekday = {
      id: '',
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    };

    this.defaultPreferencesPeriodo = {
      id: '',
      manha: false,
      tarde: false,
      noite: false,
      cinderela: false
    };

    this.defaultPreferencesSetor = {
      id: '',
      consultorio: false,
      observacao: false,
      emergencia: false,
      pediatria: false
    };

    this.defaultPreferencesLocality = {
      id: '',
      state: {
        id: '',
        name: '',
        acronym: ''
      },
      capital: false,
      countryside: false,
      coastal: false
    };

    this.state = {
      selectedPeriodo: [],
      selectedLocality: [],
      selectedWeekday: [],
      selectedSetor: [],
      preferencesMedic: {
        id: '',
        preferencesWeekday: {},
        preferencesPeriodo: {},
        preferencesSetor: {},
        preferencesLocalities: [{}]
      }
    }

  }

  componentDidMount = () => {
    this.loadOptionsWeekday();
    this.loadOptionsPeriodo();
    this.loadOptionsSetor();
    this.loadOptionsLocality();

    this.loadStates();
  }

  loadStates = () => {
    AddressService.states().subscribe(
      ({ objeto }) => {
        this.setState({
          states: objeto
        });
      },
      error => {
      }
    )
  }

  getStateByAcronym = (acronym) => {
    return this.state.states.find(it => it.acronym === acronym);
  }

  loadOptionsWeekday = () => {
    PreferencesMedicUtilsService.weekdays().subscribe(
      ({ objeto }) => {
        this.optionsWeekday = objeto;
      },
      error => {
      }
    );
  }

  loadOptionsPeriodo = () => {
    PreferencesMedicUtilsService.periodo().subscribe(
      ({ objeto }) => {
        objeto.forEach(item => {
          item.label = item.label.replace(/^./, item.label[0].toUpperCase())
        });
        this.optionsPeriodo = objeto;
      },
      error => {
      }
    );
  }

  loadOptionsSetor = () => {
    PreferencesMedicUtilsService.setor().subscribe(
      ({ objeto }) => {
        this.optionsSetor = objeto;
      },
      error => {
      }
    );
  }

  loadOptionsLocality = () => {
    PreferencesMedicUtilsService.locality().subscribe(
      ({ objeto }) => {
        this.optionsLocality = objeto;
      },
      error => {
      }
    );
  }

  componentWillReceiveProps = (newProps) => {

    if (newProps.value !== this.props.value) {
      this.setState({
        preferencesMedic: newProps.value
      },
      () => {
        this.startSelectedWeekday();
        this.startSelectedPeriodo();
        this.startSelectedSetor();
        this.startSelectedLocality();
      });
    }

  }

  startSelectedWeekday = () => {
    const { preferencesWeekday } = this.state.preferencesMedic;
    if (preferencesWeekday == null) return;

    const selectedWeekday = [];
    
    Object.getOwnPropertyNames(preferencesWeekday).forEach(item => {

      if (item !== 'id' && preferencesWeekday[item] === true) {
      
        const weekdayItem = this.optionsWeekday.find(it => it.value === item)
      
        selectedWeekday.push(weekdayItem);
      }
    });

    this.setState({ selectedWeekday });
  }

  startSelectedPeriodo = () => {
    const { preferencesPeriodo } = this.state.preferencesMedic;
    if (preferencesPeriodo == null) return;

    const selectedPeriodo = [];

    Object.getOwnPropertyNames(preferencesPeriodo).forEach(item => {

      if (item !== 'id' && preferencesPeriodo[item] === true) {
      
        const periodoItem = this.optionsPeriodo.find(it => it.value === item)
      
        selectedPeriodo.push(periodoItem);
      }
    });

    this.setState({ selectedPeriodo });
  }

  startSelectedSetor = () => {
    const { preferencesSetor } = this.state.preferencesMedic;
    if (preferencesSetor == null) return;

    const selectedSetor = []

    Object.getOwnPropertyNames(preferencesSetor).forEach(item => {

      if (item !== 'id' && preferencesSetor[item] === true) {
      
        const setorItem = this.optionsSetor.find(it => it.value === item)
      
        selectedSetor.push(setorItem);
      }
    });

    this.setState({ selectedSetor });
  }

  startSelectedLocality = () => {
    const { preferencesLocalities } = this.state.preferencesMedic;
    
    if (preferencesLocalities == null) return;

    const selectedLocality = []

    preferencesLocalities.forEach(item => {

      if (item.coastal === true) {
        const value = `${item.state.acronym}-coastal`;
        const localityItem = this.optionsLocality.find(it => it.value === value);
        selectedLocality.push(localityItem);
      }

      if (item.capital === true) {
        const value = `${item.state.acronym}-capital`;
        const localityItem = this.optionsLocality.find(it => it.value === value);
        selectedLocality.push(localityItem);
      }

      if (item.countryside === true) {
        const value = `${item.state.acronym}-countryside`;
        const localityItem = this.optionsLocality.find(it => it.value === value);
        selectedLocality.push(localityItem);
      }
      
    });

    this.setState({ selectedLocality });
  }

  handlePeriodo = selectedPeriodo => {

    if (selectedPeriodo == null) {
      selectedPeriodo = []
    }

    const newPreferences = { ...this.defaultPreferencesPeriodo};
    const { preferencesMedic } = this.state;

    newPreferences.id = preferencesMedic.preferencesPeriodo.id;

    selectedPeriodo.forEach(item => {
      const periodo = item.value;
      newPreferences[periodo] = true;
    });
    
    preferencesMedic.preferencesPeriodo = newPreferences;

    this.setState({
      selectedPeriodo,
      preferencesMedic
    },
    () => {
      this.props.onChange(this.state.preferencesMedic)
    });
  }
  
  handleLocality = selectedLocality => {

    if (selectedLocality == null) {
      selectedLocality = []
    }

    selectedLocality.sort((a, b) => a.label.localeCompare(b.label));

    const groupLocality = selectedLocality.reduce((group, current) => {
      const [ acronym, locality ] = current.value.split('-');
      if (!group[acronym]) {
        group[acronym] = []
      }
      group[acronym].push(locality);
      return group;
    }, {});

    const newPreferencesLocalities = [];
    const { preferencesMedic } = this.state;

    Object.getOwnPropertyNames(groupLocality).forEach(acronym => {
      const newLocality = { ...this.defaultPreferencesLocality }
      newLocality.state = this.getStateByAcronym(acronym);
      groupLocality[acronym].forEach(locality => {
        newLocality[locality] = true;
      })
      newPreferencesLocalities.push(newLocality);
    })

    preferencesMedic.preferencesLocalities = newPreferencesLocalities;

    this.setState({
      selectedLocality,
      preferencesMedic
    },
    () => {
      this.props.onChange(this.state.preferencesMedic)
    });
  }

  handleWeekday = selectedWeekday => {
    if (selectedWeekday == null) {
      selectedWeekday = []
    }

    const newPreferencesWeekday = { ...this.defaultPreferencesWeekday};
    const { preferencesMedic } = this.state;

    newPreferencesWeekday.id = preferencesMedic.preferencesWeekday.id;

    selectedWeekday.forEach(item => {
      const weekday = item.value;
      newPreferencesWeekday[weekday] = true;
    });
    
    preferencesMedic.preferencesWeekday = newPreferencesWeekday;

    this.setState({
      selectedWeekday,
      preferencesMedic
    },
    () => {
      this.props.onChange(this.state.preferencesMedic)
    });

  }

  handleSetor = selectedSetor => {
    
    if (selectedSetor == null) {
      selectedSetor = []
    }

    const newPreferences = { ...this.defaultPreferencesSetor};
    const { preferencesMedic } = this.state;

    newPreferences.id = preferencesMedic.preferencesSetor.id;

    selectedSetor.forEach(item => {
      const setor = item.value;
      newPreferences[setor] = true;
    });
    
    preferencesMedic.preferencesSetor = newPreferences;

    this.setState({
      selectedSetor,
      preferencesMedic
    },
    () => {
      this.props.onChange(this.state.preferencesMedic)
    });
  }

  render() {
    return (
      <div id="preferences-medic">
        <Row>
          <Col md="6">
            <Label><h2 className="card-title text-center">Preferências de plantão</h2></Label>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Label><h2 className="card-title text-center">Dia da semana</h2></Label>
            <Select 
              isMulti
              placeholder="Dias da semana"
              value={this.state.selectedWeekday}
              onChange={this.handleWeekday}
              options={this.optionsWeekday}
              className="basic-multi-select"
              classNamePrefix="select"
              isClearable={false}
            />
          </Col>

          <Col md="6">
            <Label><h2 className="card-title text-center card-title-mobile">Turno</h2></Label>
            <Select 
              isMulti
              placeholder="Turnos"
              value={this.state.selectedPeriodo}
              onChange={this.handlePeriodo}
              options={this.optionsPeriodo}
              className="basic-multi-select"
              classNamePrefix="select"
              isClearable={false}
            />
          </Col>
        </Row>

        <Row className="p-t-35">
          <Col md="6">
            <Label><h2 className="card-title text-center">Setor</h2></Label>
            <Select 
              isMulti
              placeholder="Setores"
              value={this.state.selectedSetor}
              onChange={this.handleSetor}
              options={this.optionsSetor}
              className="basic-multi-select"
              classNamePrefix="select"
              isClearable={false}
            />
          </Col>
          <Col md="6">
            <Label><h2 className="card-title text-center card-title-mobile">Localidade</h2></Label>
            <Select 
              isMulti
              placeholder="Localidades"
              value={this.state.selectedLocality}
              onChange={this.handleLocality}
              options={this.optionsLocality}
              className="basic-multi-select"
              classNamePrefix="select"
              isClearable={false}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default PreferencesMedic;
