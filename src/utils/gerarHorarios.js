const { eachDayOfInterval, format } = require("date-fns");
const stringToDate = (date) => {
  const parts = date.split("/");
  const convertDate = new Date(parts[2], parts[1] - 1, parts[0]);
  return convertDate;
};

const diff = (t1, t2, intervalo) => {
  const horaT1 = t1.substr(0, 2) * 1;
  const minutoT1 = t1.substr(3, 2) * 1;
  const horaT2 = t2.substr(0, 2) * 1;
  const minutoT2 = t2.substr(3, 2) * 1;

  const endTime = () => {
    let temp = 0;
    let novaHora = 0;
    temp = minutoT2 - intervalo;

    while (temp < 0) {
      novaHora -= 1;
      temp = temp + 60;
    }
    const novoMinuto = temp;
    const hora = horaT2 + novaHora;
    return hora * 60 + novoMinuto;
  };
  const minutoHora1 = horaT1 * 60 + minutoT1;
  const minutoHora2 = endTime();
  return minutoHora2 - minutoHora1;
};
module.exports = (props) => {
  const { start, end, t1, t2, intervalo, daysWeek } = props;

  const dateStart = stringToDate(start);
  const endStart = stringToDate(end);
  const diferencaMinutos = diff(t1, t2, intervalo);

  const numDays = eachDayOfInterval({
    start: dateStart,
    end: endStart,
  });

  let horasAgenda = [];
  var ID = function () {
    return "_" + Math.random().toString(36).substr(2, 9);
  };
  numDays.forEach((day) => {
    if (daysWeek.includes(day.getDay())) {
      let horaStart = t1.substr(0, 2) * 1;
      let minutosStart = t1.substr(3, 2) * 1;
      let x = 0;
      while (x <= diferencaMinutos) {
        if (minutosStart >= 60) {
          horaStart += 1;
          minutosStart = minutosStart - 60;
        }
        if (minutosStart < 10) {
          horasAgenda.push({
            id: ID(),
            data: format(day, "dd/MM/yyyy"),
            diaSemana: day.getDay(),
            timeInterval: intervalo,
            horaInicio: horaStart.toString().substr(-2) + ":0" + minutosStart,
            ocupado: false,
            ativo: true,
          });
        } else {
          horasAgenda.push({
            id: ID(),
            data: format(day, "dd/MM/yyyy"),
            diaSemana: day.getDay(),
            timeInterval: intervalo,
            horaInicio: horaStart.toString() + ":" + minutosStart,
            ocupado: false,
            ativo: true,
          });
        }

        minutosStart += intervalo;
        x += intervalo;
      }
    }
  });
  return horasAgenda;
};
