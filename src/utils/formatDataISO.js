import moment from 'moment';

function formatarDataISO(data) {
  const dataFormatada = moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');
  return dataFormatada;
}

export default formatarDataISO;
