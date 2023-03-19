import Sequelize, { Model } from 'sequelize';

export default class Produto extends Model {
  static init(sequelize) {
    super.init(
      {
        descricao: {
          type: Sequelize.STRING,
          defaultValue: '',
          unique: 'UNIQUE',
          validate: {
            len: {
              args: [3, 255],
              msg: 'A descrição do produto deve ter entre 3 e 255 caracteres',
            },
          },
        },
        unidade: {
          type: Sequelize.STRING,
          defaultValue: '',
          unique: 'UNIQUE',
          validate: {
            len: {
              args: [3, 255],
              msg: 'A descrição da unidade de medida deve ter entre 3 e 255 caracteres',
            },
          },
        },

      },
      {
        indicesType: 'UNIQUE',
        where: { unique: 'UNIQUE' },
        sequelize,
        tableName: 'produtos',
      },
    );
  }
}
