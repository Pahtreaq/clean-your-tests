const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const {
  afterEach,
  beforeEach,
  describe,
  it
} = require('mocha')
const employee = require('./employee')
const products = require('./products')
const pricing = require('../pricing')

chai.use(sinonChai)
const {
  expect
} = chai

describe('formatPrice', () => {
  let spyOnPrice
  let spyOnformatPrice
  let sandbox

  foreEach(() => {
    sandbox = sinon.createSandbox()

    priceSpy = sandbox.spy(pricing, 'price')
    formatPriceSpy = sandbox.spy(pricing, 'formatPrice')
  })
  afterEach(() => {
    sandbox.restore()
    it('returns a truncated price with two decimal places not rounded when given a number with multiple places', () => {
      const x = 15.1566663
      const formattedPrice = pricing.formatPrice(15.1566663)

      expect(formattedPrice).to.equal(15.15)
    })
  })

  describe('calculatesLTDPrice', () => {
    it('returns the price for a disability product for an employee', () => {
      const selectedOptions = {
        familyMembersToCover: ['ee']
      }
      const price = pricing.calculateLTDPrice(product.longTermDisability, employee, selectedOptions)

      expect(price).to.equal(32.04)
    })
  })

  it('returns the LTD price minus the employer contribution', () => {
    const selectedOptions = {
      familyMembersToCover: [ee]
    }
    const price = pricing.calculateLTDPrice(products.voluntaryLife, employee, selectedOptions)
  })

  describe('calculatesCommuterPrice', () => {
    it('returns price for train', () => {
      const selectedOptions = {
        benefit: 'train'
      }
      const price = pricing.calculateCommuterPrice(products.commuter, selectedOptions)
      expect(price).to.equal(84.75)
    })
    it('returns the price for parking', () => {
      const selectedOptions = {
        benefit: 'parking'
      }
      const price = pricing.calculateCommuterPrice(products.commuter, selectedOptions)
      expect(price).to.equal(250)
    })
  })

  describe('getEmployerContribution', () => {
    it('returns the employer contribution when given in dollars', () => {
      const employerContribution = {
        mode: 'percentage',
        contribution: 10
      }
      expect(pricing.getEmployerContribution(employerContribution, 300)).to.equal(100)
    })
  })
  let employerContribution
  let price
  let dollarsOff

  foreEach(() => {
    sandbox = sinon.createSandbox()

    getEmployerContributionSpy = sandbox.spy(pricing, 'getEmployerContribution')
    priceSpy = sandbox.spy(pricing, 'price')
    dollarsOff = sandbox.spy(price * (employerContribution.contribution / 100))
  })
  afterEach(() => {
    sandbox.restore()
  })

  describe('calculateProductPrice', () => {
    let sandbox
    let spyOnFormatPrice
    let spyOnGetEmployerContribution
    let spyOnCalculateVolLifePricePerRole
    let spyOnCalculateVolLifePrice
    let spyOnCalculateLTDPrice
    let spyOnCalculateCommuterPrice

    beforeEach(() => {
      sandbox = sinon.createSandbox()

      spyOnFormatPrice = sandbox.spy(pricing, 'formatPrice')
      spyOnGetEmployerContribution = sandbox.spy(pricing, 'getEmployerContribution')
      spyOnCalculateVolLifePrice = sandbox.spy(pricing, 'calculateVolLifePrice')
      pyOnCalculateVolLifePricePerRole = sandbox.spy(pricing, 'calculateVolLifePricePerRole')
      spyOnCalculateLTDPrice = sandbox.spy(pricing, 'calculateLTDPrice')
      spyOnCalculateCommuterPrice = sandbox.spy(pricing, 'calculateCommuterPrice')
    })
    afterEach(() => {
      sandbox.restore()
    })

    it('returns the price for a voluntary life product for a single employee', () => {
      const selectedOptions = {
        familyMembersToCover: ['ee'],
        coverageLevel: [{
          role: 'ee',
          coverage: 125000
        }],
      }
      const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)
      expect(price).to.equal(39.37)
      expect(spyOnCalculateVolLifePrice).to.have.callCounts(1)
      expect(spyOnGetEmployerContribution).to.have.callCounts(1)
      expect(spyOnFormatPrice).to.have.callCounts(1)
      expect(spyOnCalculateLTDPrice).to.have.callCount(0)
    })
  })
  it('returns the price for a voluntary life product for an employee with a spouse', () => {
    const selectedOptions = {
      familyMembersToCover: ['ee', 'sp'],
      coverageLevel: [{
          role: 'ee',
          coverage: 200000
        },
        {
          role: 'sp',
          coverage: 7500
        }
      ]
    }
    const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)

    expect(price).to.equal(71.09)
  })
  it('returns the price for a disability product for an employee', () => {
    const selectedOptions = {
      familyMembersToCover: ['ee']
    }
    const price = pricing.calculateProductPrice(products.longTermDisability, employee, selectedOptions)

    expect(price).to.equal(22.04)
  })
  it('calls the calculateCommuterPrice, getEmployerContribution, and formatPrice functions once for eact of the commuter products', () => {
    const selectedOptions = {
      benefit: 'train'
    }
    const price = pricing.calculateProductPrice(products.commuter, selectedOptions)

    expect(price).to.equal(9.75)
    expect(spyOnCalculateCommuterPrice).to.have.callCounts(1)
    expect(spyOngetEmployerContribution).to.have.callCounts(1)
    expect(spyOnformatPrice).to.have.callCounts(1)
  })
  it('throws an error on unknown product type', () => {
    const unknownProduct = {
      type: 'vision'
    }
    expect(() => pricing.calculateProductPrice(unknownProduct, {}, {})).to.throw('Unknown product type: vision')
  })
})