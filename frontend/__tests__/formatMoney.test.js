import formatMoney from '../lib/formatMoney';

describe('format Money function', () => {
  it('invalid number', () => {
    expect(formatMoney(null)).toEqual('$0');
    expect(formatMoney(undefined)).toEqual('$0');
    expect(formatMoney('abc')).toEqual('$0');
    expect(formatMoney('abc123')).toEqual('$0');
    expect(formatMoney(NaN)).toEqual('$0');
  });

  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(101)).toEqual('$1.01');
    expect(formatMoney(140)).toEqual('$1.40');
    expect(formatMoney('1')).toEqual('$0.01');
    expect(formatMoney('10')).toEqual('$0.10');
    expect(formatMoney('101')).toEqual('$1.01');
  });

  it('leaves off cent when whole dollars', () => {
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(5000)).toEqual('$50');
    for (let amount = 1; amount < 100; amount += 1) {
      expect(formatMoney(amount * 100)).toEqual(`$${amount}`);
    }
    expect(formatMoney(500000)).toEqual('$5,000');
    expect(formatMoney('100')).toEqual('$1');
    expect(formatMoney('500000')).toEqual('$5,000');
  });

  it('works with full and fractional dollars', () => {
    expect(formatMoney(10001)).toEqual('$100.01');
    expect(formatMoney(123456)).toEqual('$1,234.56');
    expect(formatMoney('10001')).toEqual('$100.01');
    expect(formatMoney('123456')).toEqual('$1,234.56');
  });
});
