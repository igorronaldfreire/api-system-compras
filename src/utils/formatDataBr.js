import moment from 'moment';

function formatarDataISOBr(data) {
  const dataFormatada = moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');
  return dataFormatada;
}

export default formatarDataISOBr;
