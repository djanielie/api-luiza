const { Sequence } = require('../modele');

async function nextCode(prefix, transaction) {
  const year = new Date().getFullYear();
  const [row] = await Sequence.findOrCreate({
    where: { prefix, year },
    defaults: { prefix, year, lastNumber: 0 },
    transaction,
  });
  await row.increment('lastNumber', { by: 1, transaction });
  await row.reload({ transaction });
  return `${prefix}-${year}-${String(row.lastNumber).padStart(4, '0')}`;
}

module.exports = { nextCode };
