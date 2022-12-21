import React from "react";
import { Table } from "reactstrap";
import RcIf, { RcElse } from "rc-if";
import moment from "moment/moment";
import { capitalizaString } from "../../../util/Util";

export const THeaderWeek = (props) => {
  const { semana, indexSemana } = props;
  return (
    <thead className="thead-light">
      <tr key={indexSemana}>
        <th scope="col" colSpan="8" className="row-semana">
          {"SEMANA " + semana.numSemana}
        </th>
      </tr>

      <tr>
        {semana.dias.map((dia, indexDia) => (
          <th scope="col" key={indexDia}>
            {dia.str}
            <br />
            {indexDia !== 0 ? moment(dia.data).format("DD/MM") : null}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableMonth = (props) => {
  const { SEMANAS, toggleModal, getPlantaoItem } = props;

  function renderDuties(duties) {
    if (!duties) {
      return null;
    }
    return duties.map((plantao, indexPlantao) => (
      <RcIf if={plantao.bloqueado}>
        <div key={indexPlantao} onClick={() => toggleModal("cadastrarMedicoModal", plantao)} className="bloqueado div-plantao">
          <span>
            {moment(plantao.horaInicio).format("HH:mm")}/{moment(plantao.horaFim).format("HH:mm")}
            <br />
            <strong>{plantao.especialidades}</strong>
          </span>
        </div>
        <RcElse>
          <div key={indexPlantao} onClick={() => toggleModal("cadastrarMedicoModal", plantao)} className="div-plantao">
            {getPlantaoItem(plantao, indexPlantao)}
          </div>
        </RcElse>
      </RcIf>
    ));
  }

  return (
    <Table bordered hover>
      {SEMANAS.map((semana, indexSemana) => [
        <THeaderWeek semana={semana} indexSemana={indexSemana} />,
        <tbody>
          {semana.turnos.map((turno, indexTurno) => {
            return [
              <tr>
                <th scope="col" colSpan="8" key={indexTurno} className="row-turno">
                  {capitalizaString(turno.desc)}
                </th>
              </tr>,
              turno.setores.map((setor, indexSetor) => {
                if (setor.plantoes == null || setor.plantoes.length === 0) {
                  return <div />;
                }
                return (
                  <tr key={indexSetor}>
                    <th scope="col" colSpan="1" className="thead-setor">{setor.desc}</th>
                    <td>{renderDuties(setor.plantoes?.segunda)}</td>
                    <td>{renderDuties(setor.plantoes?.terca)}</td>
                    <td>{renderDuties(setor.plantoes?.quarta)}</td>
                    <td>{renderDuties(setor.plantoes?.quinta)}</td>
                    <td>{renderDuties(setor.plantoes?.sexta)}</td>
                    <td>{renderDuties(setor.plantoes?.sabado)}</td>
                    <td>{renderDuties(setor.plantoes?.domingo)}</td>
                  </tr>
                );
              }),
            ];
          })}
        </tbody>,
      ])}
    </Table>
  );
};

export default TableMonth;
